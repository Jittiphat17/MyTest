const express = require('express')
const app = express() //server
const port = 3000 // port


function fibonacci(n) {
    const sequence = [0,1]
    let sum = 1


    for(let i = 2; i<n ; i++){
        const next = sequence[i - 1] + sequence[i -2] // สูตร fibonacci
        sequence.push(next)
        sum += next
    }

    return {
        "member-count":sequence.length,
        "sequence":sequence,
        "total":sum
    }
}

// end point
app.get('/api/test/:number',(req, res) => {
    const number = parseInt(req.params.number)


    if(isNaN(number) || number < 1 || number > 100){
        res.status(400).json({error: "ใส่ตัวเลขระหว่าง 1-100 เท่านั้น"})
    }else{
        const result = fibonacci(number)
        res.json(result)
    }
})

// start app
app.listen(port, () => {
    console.log(` เซิร์ฟเวอร์ทำงานที่ http://localhost:${port}/` )
})