const apiUrl = 'http://localhost:3000/api';
let totalCoins = 0; // ตัวแปรเก็บจำนวนเหรียญที่หยอด

// ฟังก์ชันเพิ่มเหรียญ
function addCoins() {
    const coins = parseInt(document.getElementById('coinsInput').value);
    if (coins && coins > 0) {
        totalCoins += coins;
        alert(`เพิ่มเหรียญเรียบร้อย รวมเหรียญ: ${totalCoins}`);
    } else {
        alert('กรุณากรอกจำนวนเหรียญที่ถูกต้อง');
    }
}

// ฟังก์ชันเริ่มเครื่องซักผ้า
function startMachine(machineId) {
    if (totalCoins < 50) {
        alert('เหรียญไม่พอ ต้องหยอดเหรียญอย่างน้อย 50 บาท');
        return;
    }

    fetch(`${apiUrl}/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ machineId, coins: totalCoins })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error); // แสดงข้อความข้อผิดพลาด
        } else {
            alert(data.message);
            totalCoins = 0; // รีเซ็ตจำนวนเหรียญหลังจากเริ่มเครื่อง
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาด');
    });
}

// ฟังก์ชันตรวจสอบสถานะเครื่องซักผ้า
function checkStatus() {
    fetch(`${apiUrl}/status`)
    .then(response => response.json())
    .then(data => {
        let statusText = '';
        for (const [machineId, machine] of Object.entries(data)) {
            statusText += `เครื่องซักผ้าหมายเลข ${machineId}: ${machine.status} (เหลือเวลา ${machine.countdown} นาที)<br>`;
        }
        document.getElementById('statusDisplay').innerHTML = statusText;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการดึงสถานะ');
    });
}
