document.addEventListener('DOMContentLoaded', () => {
    // محاولة جلب الموقع التلقائي عند فتح الصفحة
    detectLocation();
});

function detectLocation() {
    const locElement = document.getElementById('location-name');
    const loader = document.getElementById('loader');
    const container = document.getElementById('times-container');

    locElement.innerText = 'جاري تحديد إحداثيات موقعك...';
    loader.style.display = 'block';
    container.style.display = 'none';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                fetchPrayerTimes(lat, lng);
            },
            error => {
                console.error("Geolocation error:", error);
                locElement.innerHTML = '<span style="color:red;">تم رفض أو تعذر الوصول للموقع. سيتم عرض مواقيت (مكة المكرمة) افتراضياً.</span>';
                // مكة كافتراضي
                fetchPrayerTimes(21.4225, 39.8262, 'مكة المكرمة، السعودية');
            }
        );
    } else {
        locElement.innerText = 'متصفحك لا يدعم تحديد الموقع.';
        fetchPrayerTimes(21.4225, 39.8262, 'مكة المكرمة، السعودية');
    }
}

async function fetchPrayerTimes(lat, lng, defaultName = null) {
    const loader = document.getElementById('loader');
    const container = document.getElementById('times-container');
    const locElement = document.getElementById('location-name');
    const dateElement = document.getElementById('date-gregorian-hijri');

    try {
        // Aladhan API - يعطينا أوقات الصلاة والتاريخ الهجري والميلادي حسب الإحداثيات
        const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200) {
            const timings = data.data.timings;
            const meta = data.data.meta;
            const date = data.data.date;

            // تحديث اسم المنطقة إذا أمكن (Aladhan يوفر Timezone كمؤشر أو نكتفي بالموقع كروياً)
            if (defaultName) {
                locElement.innerText = defaultName;
            } else {
                locElement.innerText = `المنطقة الزمنية: ${meta.timezone}`;
            }

            dateElement.innerText = `${date.hijri.weekday.ar} ${date.hijri.day} ${date.hijri.month.ar} ${date.hijri.year} هـ  |  ${date.gregorian.date}`;

            // الأوقات التي نريد عرضها
            const prayers = [
                { id: 'Fajr', name: 'الفجر', icon: 'fa-cloud-moon' },
                { id: 'Sunrise', name: 'الشروق', icon: 'fa-sun' },
                { id: 'Dhuhr', name: 'الظهر', icon: 'fa-sun' },
                { id: 'Asr', name: 'العصر', icon: 'fa-cloud-sun' },
                { id: 'Maghrib', name: 'المغرب', icon: 'fa-cloud-moon' },
                { id: 'Isha', name: 'العشاء', icon: 'fa-moon' }
            ];

            container.innerHTML = '';

            prayers.forEach(p => {
                const card = document.createElement('div');
                card.className = 'glass-panel time-card';
                card.innerHTML = `
                    <div style="font-size: 2rem; color: var(--secondary-color); margin-bottom:10px;">
                        <i class="fa-solid ${p.icon}"></i>
                    </div>
                    <div class="prayer-name">${p.name}</div>
                    <div class="prayer-time">${formatTime(timings[p.id])}</div>
                `;
                container.appendChild(card);
            });

            loader.style.display = 'none';
            container.style.display = 'grid';
        }

    } catch (error) {
        console.error("Error fetching timings:", error);
        loader.innerHTML = '<span style="color:red;">حدث خطأ أثناء جلب مواقيت الصلاة.</span>';
    }
}

// تحويل الوقت من نظام 24 ساعة إلى 12 ساعة مع (ص/م)
function formatTime(time24) {
    let [hours, minutes] = time24.split(':');
    hours = parseInt(hours);
    const suffix = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12 || 12; // 0 becomes 12
    return `${hours}:${minutes} ${suffix}`;
}
