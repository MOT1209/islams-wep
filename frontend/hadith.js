const API_URL = window.API_BASE_URL || 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // تحميل الأحاديث للتصنيف الافتراضي الأول
    loadHadiths('الإيمان والنوايا', document.querySelector('.cat-btn'));
});

async function loadHadiths(category, btnElement) {
    // تحديث الأزرار (إزالة الكلاس نشط وتطبيقه على الزر الحالي)
    if (btnElement) {
        document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    const container = document.getElementById('hadiths-container');
    const loader = document.getElementById('loader');

    container.innerHTML = '';
    loader.style.display = 'block';

    try {
        const response = await fetch(`${API_URL}/hadiths/category/${encodeURIComponent(category)}`);

        if (!response.ok) {
            throw new Error('Data not found');
        }

        const hadiths = await response.json();
        loader.style.display = 'none';

        if (hadiths.length === 0) {
            container.innerHTML = '<div class="glass-panel" style="padding:30px; text-align:center;">لا توجد أحاديث مسجلة في هذا التصنيف حالياً.</div>';
            return;
        }

        hadiths.forEach(h => {
            const card = document.createElement('div');
            card.className = 'glass-panel hadith-card';
            card.innerHTML = `
                <div class="hadith-text">« ${h.hadith_text} »</div>
                <div class="hadith-meta">
                    <div><i class="fa-solid fa-user"></i> الراوي: <strong>${h.narrator}</strong></div>
                    <div><i class="fa-solid fa-book"></i> المصدر: <strong>${h.book_name}</strong></div>
                    <div class="grade">${h.grade}</div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching hadiths:', error);
        loader.style.display = 'none';
        container.innerHTML = '<div class="glass-panel" style="padding:30px; text-align:center; color:red;">حدث خطأ في الاتصال بالواجهة الخلفية. تأكد من تشغيل السيرفر.</div>';
    }
}
