// ملف quran.js: إدارة جلب بيانات القرآن وعرضها

// إذا لم يتم استرجاع رابط الـ API بشكل صحيح من app.js، نضع مساراً افتراضياً
const API_URL = window.API_BASE_URL || 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    loadSurahs();
});

// جلب قائمة السور من الـ API الذى صممناه
async function loadSurahs() {
    const grid = document.getElementById('surah-grid');
    const loader = document.getElementById('loader');

    try {
        // إذا كنا نريد استخدام الـ API المحلي:
        const response = await fetch(`${API_URL}/quran/surahs`);

        // إذا كان السيرفر المحلي غير جاهز، يمكننا استخدام API بديل (مثل alquran.cloud) فورياً
        // ولكني سأستخدم السيرفر المحلي الذي أنشأناه للتو

        if (!response.ok) throw new Error('Network response was not ok');
        const surahs = await response.json();

        loader.style.display = 'none';

        surahs.forEach(surah => {
            const card = document.createElement('div');
            card.className = 'service-card glass-panel surah-card';
            card.innerHTML = `
                <div class="surah-number-badge">${surah.surah_number}</div>
                <div>سورة ${surah.surah_name}</div>
            `;
            card.onclick = () => loadSurahContent(surah.surah_number, surah.surah_name);
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching surahs:', error);
        loader.innerHTML = '<p style="color:red;">حدث خطأ أثناء تحميل البيانات. المرجو التأكد من تشغيل السيرفر (Backend).</p>';
    }
}

// جلب آيات السورة المحددة وعرضها
async function loadSurahContent(surahNumber, surahName) {
    document.getElementById('surahs-list-view').style.display = 'none';
    document.getElementById('surah-content-view').style.display = 'block';

    document.getElementById('current-surah-title').innerText = `سورة ${surahName}`;
    const ayahsContainer = document.getElementById('ayahs-container');
    ayahsContainer.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحميل...';

    try {
        const response = await fetch(`${API_URL}/quran/surahs/${surahNumber}`);
        if (!response.ok) throw new Error('Data not found');
        const ayahs = await response.json();

        // تجميع النص
        let contentHTML = '';

        // البسملة لغير سورة الفاتحة أو التوبة
        if (surahNumber !== 1 && surahNumber !== 9) {
            contentHTML += `<div style="text-align:center; font-size:2rem; margin-bottom:20px;">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
        }

        ayahs.forEach(ayah => {
            contentHTML += `<span class="ayah">${ayah.ayah_text}</span><span class="ayah-number">${ayah.ayah_number}</span> `;
        });

        ayahsContainer.innerHTML = contentHTML;

    } catch (error) {
        console.error('Error fetching ayahs:', error);
        ayahsContainer.innerHTML = '<p style="color:red;">لم يتم العثور على آيات لهذه السورة في قاعدة البيانات حالياً.</p>';
    }
}

function backToSurahs() {
    document.getElementById('surah-content-view').style.display = 'none';
    document.getElementById('surahs-list-view').style.display = 'block';
}
