const API_URL = window.API_BASE_URL || 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
});

async function loadArticles() {
    const grid = document.getElementById('articles-grid');
    const loader = document.getElementById('loader');

    try {
        const response = await fetch(`${API_URL}/articles`);
        if (!response.ok) throw new Error('Network response was not ok');
        const articles = await response.json();

        loader.style.display = 'none';

        if (articles.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">لا توجد مقالات مضافة حالياً.</div>';
            return;
        }

        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'glass-panel article-card';

            // Format Date
            const date = new Date(article.published_at).toLocaleDateString('ar-EG');

            card.innerHTML = `
                <span class="article-category">${article.category}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}...</p>
                <div class="article-meta">
                    <span><i class="fa-solid fa-user-pen"></i> ${article.author_name || 'مجهول'}</span>
                    <span><i class="fa-solid fa-eye"></i> ${article.views_count}</span>
                </div>
            `;

            card.onclick = () => openArticle(article.id);
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching articles:', error);
        loader.innerHTML = '<p style="color:red;">حدث خطأ أثناء تحميل المقالات. قم بتشغيل السيرفر المحلي.</p>';
    }
}

async function openArticle(id) {
    document.getElementById('articles-list-view').style.display = 'none';
    const reader = document.getElementById('article-reader');
    reader.style.display = 'block';

    document.getElementById('reader-content').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري تحميل المقال...';

    try {
        const response = await fetch(`${API_URL}/articles/${id}`);
        if (!response.ok) throw new Error('Not found');
        const article = await response.json();

        document.getElementById('reader-category').innerText = article.category;
        document.getElementById('reader-title').innerText = article.title;
        document.getElementById('reader-author').innerHTML = `<i class="fa-solid fa-user-edit"></i> ${article.author_name || 'إدارة الموقع'}`;
        document.getElementById('reader-date').innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${new Date(article.published_at).toLocaleDateString('ar-EG')}`;
        document.getElementById('reader-views').innerHTML = `<i class="fa-solid fa-eye"></i> ${article.views_count}`;
        document.getElementById('reader-content').innerText = article.content; // text preserving newlines

    } catch (error) {
        document.getElementById('reader-content').innerHTML = '<p style="color:red;">خطأ في تحميل بيانات المقال.</p>';
    }
}

function backToArticles() {
    document.getElementById('article-reader').style.display = 'none';
    document.getElementById('articles-list-view').style.display = 'block';
}
