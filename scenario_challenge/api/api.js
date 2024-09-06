const express = require('express');
const axios = require('axios');
const router = express.Router();

// สถานะเครื่องซักผ้า
const machines = {
    1: { status: 'available', countdown: 0 }, 
    2: { status: 'available', countdown: 0 }
};

// LINE API URL และ Token
const LINE_API_URL = 'https://notify-api.line.me/api/notify';
const LINE_TOKEN = 'xquEfwDs9OVZV5mgDGtOuvbTfR8BS0gUA1MAdejW3Xy';
// ฟังก์ชันส่งข้อความแจ้งเตือนผ่าน LINE Notify
async function sendLineNotification(message) {
    try {
        const response = await axios.post(LINE_API_URL, `message=${encodeURIComponent(message)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${LINE_TOKEN}`
            }
        });

        if (response.status === 200) {
            console.log('ส่งแจ้งเตือนสำเร็จ');
        } else {
            console.log(`ส่งแจ้งเตือนไม่สำเร็จ: ${response.status}`);
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งแจ้งเตือน:', error.message);
    }
}

// เริ่มการใช้งานเครื่องซักผ้า
router.post('/start', (req, res) => {
    const { machineId, coins } = req.body;
    const requiredCoins = 50; // จำนวนเหรียญที่ต้องการ

    if (machines[machineId]) {
        if (machines[machineId].status === 'in use') {
            res.status(400).json({ error: 'เครื่องซักผ้ากำลังทำงาน ไม่สามารถหยอดเหรียญเพิ่มได้' });
        } else if (coins >= requiredCoins) {
            machines[machineId].status = 'in use';
            machines[machineId].countdown = 2; // ตั้งค่าเวลาทำงานจำลองเป็น 10 นาที
            res.json({ message: `เครื่องซักผ้าหมายเลข ${machineId} เริ่มทำงานแล้ว` });
        } else {
            res.status(400).json({ error: `ต้องหยอดเหรียญอย่างน้อย ${requiredCoins} บาท` });
        }
    } else {
        res.status(400).json({ error: 'ไม่พบเครื่องซักผ้าหมายเลขนี้' });
    }
});

// ตรวจสอบสถานะเครื่องซักผ้า
router.get('/status', (req, res) => {
    res.json(machines);
});

// อัพเดทสถานะเครื่องซักผ้าและลดเวลาลงทุกๆ นาที
function updateMachineStatus() {
    setInterval(() => {
        Object.keys(machines).forEach(machineId => {
            const machine = machines[machineId];
            if (machine.status === 'in use' && machine.countdown > 0) {
                machine.countdown -= 1; // ลดเวลานับถอยหลังลง 1 นาที
                console.log(`เครื่องซักผ้าหมายเลข ${machineId} เหลือเวลา ${machine.countdown} นาที`);

                if (machine.countdown === 1) {
                    sendLineNotification(`เครื่องซักผ้าหมายเลข ${machineId} เหลือเวลาใช้งานน้อยกว่า 1 นาที`);
                } else if (machine.countdown === 0) {
                    machine.status = 'available'; // ตั้งค่าเป็น available เมื่อเวลาหมด
                    console.log(`เครื่องซักผ้าหมายเลข ${machineId} ว่างแล้ว`);
                }
            }
        });
    }, 60000); // อัพเดททุกๆ 1 นาที
}

// เรียกใช้ฟังก์ชันอัพเดทสถานะ
updateMachineStatus();

module.exports = router;
