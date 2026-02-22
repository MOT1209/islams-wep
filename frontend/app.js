// ملف التفاعلات الرئيسية للصفحة الأمامية (Frontend App Logic)

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Dark Mode Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    });

    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const menuToggleBtn = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggleBtn.addEventListener('click', () => {
        mainNav.classList.toggle('nav-open');
    });

    // إعداد Base URL لطلبات الـ API المحلية الخاصة بنا
    window.API_BASE_URL = 'http://localhost:5000/api';

});
