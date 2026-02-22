const mysql = require('mysql2');
require('dotenv').config();

// إنشاء إتصال بقاعدة البيانات محلياً
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'islamic_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// التعامل بالنظام الحديث (Promises)
const db = pool.promise();

// اختبار الاتصال لمعرفة ما إذا كانت القاعدة تعمل أم لا
db.getConnection()
    .then(connection => {
        console.log('Database connected successfully!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database: ', err.message);
    });

module.exports = db;
