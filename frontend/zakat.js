function calculateZakat() {
    const amountInput = document.getElementById('amount').value;
    const resultBox = document.getElementById('result-box');
    const resultAmount = document.getElementById('result-amount');

    // التأكد من أن القيمة المدخلة صحيحة وموجبة
    if (amountInput === '' || isNaN(amountInput) || amountInput <= 0) {
        alert("الرجاء إدخال مبلغ صحيح وموجب لحساب الزكاة.");
        resultBox.style.display = 'none';
        return;
    }

    const amount = parseFloat(amountInput);

    // حساب ربع العشر (2.5%)
    const zakatValue = amount * 0.025;

    // تنسيق الرقم (الفواصل)
    resultAmount.innerText = zakatValue.toLocaleString('ar-EG') + ' وحدة نقدية';

    // إظهار مربع النتيجة بحركة لطيفة
    resultBox.style.display = 'block';

    // حركة بسيطة
    resultBox.style.animation = 'none';
    setTimeout(() => {
        resultBox.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}
