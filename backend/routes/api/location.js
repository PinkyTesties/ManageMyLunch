const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { latitude, longitude } = req.body;
    // 这里可以添加更多处理逻辑，例如保存到数据库
    res.json({ status: 'Location received', latitude, longitude });
});

module.exports = router;
