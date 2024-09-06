const express = require('express');
const path = require('path');
const api = require('./api/api');

const app = express();
app.use(express.json()); // ใช้ JSON ในการประมวลผล request

// ใช้ API ที่แยกออกมา
app.use('/api', api);

// ตั้งค่าให้ express เสิร์ฟไฟล์ static ของ frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// รันเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log('เซิร์ฟเวอร์กำลังทำงานที่ http://localhost:3000');
});
