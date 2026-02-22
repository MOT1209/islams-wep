const API_URL = window.API_BASE_URL || 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // جلب تصنيفات الأذكار الديناميكية
    fetchCategories();
});

async function fetchCategories() {
    try {
        const response = await fetch(`${API_URL}/azkar/categories`);
        if (response.ok) {
            const categories = await response.json();
            const container = document.getElementById('categories-container');
            container.innerHTML = '';

            categories.forEach((cat, index) => {
                const btn = document.createElement('button');
                btn.className = `cat-btn ${index === 0 ? 'active' : ''}`;
                btn.innerText = cat;
                btn.onclick = () => loadAzkar(cat, btn);
                container.appendChild(btn);
            });

            if (categories.length > 0) {
                loadAzkar(categories[0], container.firstChild);
            }
        }
    } catch (err) {
        console.error('Error fetching azkar categories:', err);
    }
}

async function loadAzkar(category, btnElement) {
    if (btnElement) {
        document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    const container = document.getElementById('azkar-container');
    const loader = document.getElementById('loader');

    container.innerHTML = '';
    loader.style.display = 'block';

    try {
        const response = await fetch(`${API_URL}/azkar/${encodeURIComponent(category)}`);
        if (!response.ok) throw new Error('Data not found');

        const azkar = await response.json();
        loader.style.display = 'none';

        if (azkar.length === 0) {
            container.innerHTML = '<div class="glass-panel" style="padding:30px; text-align:center;">لا توجد أذكار في هذا التصنيف.</div>';
            return;
        }

        azkar.forEach((z, index) => {
            const card = document.createElement('div');
            card.className = 'glass-panel zekr-card';

            const fadlText = z.fadl ? `<div><i class="fa-solid fa-star"></i> הפضل: <strong>${z.fadl}</strong></div>` : '';

            card.innerHTML = `
                <div class="zekr-text">${z.zekr_text}</div>
                <div class="zekr-meta">
                    ${fadlText}
                    <div class="zekr-count" onclick="decreaseCount(this, ${z.count})">العدد: <span>${z.count}</span></div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching azkar:', error);
        loader.style.display = 'none';
        container.innerHTML = '<div class="glass-panel" style="padding:30px; text-align:center; color:red;">تعذر الاتصال بقاعدة البيانات!</div>';
    }
}

// دالة لإنقاص العدد عند النقر كالمسبحة الإلكترونية
function decreaseCount(element, maxCount) {
    const span = element.querySelector('span');
    let current = parseInt(span.innerText);
    if (current > 0) {
        current--;
        span.innerText = current;
    }

    if (current === 0) {
        element.style.backgroundColor = '#64748b'; // لون رمادي للدلالة على الانتهاء
        element.style.cursor = 'default';
        element.innerHTML = '<i class="fa-solid fa-check"></i> تم';
    }
}
