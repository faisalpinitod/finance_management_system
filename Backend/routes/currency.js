const express = require('express');
const axios = require('axios');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/convert', verifyToken, async (req, res) => {
  const { from, to, amount } = req.query;

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/YOUR_API_KEY/pair/${from}/${to}/${amount}`);
    const convertedAmount = response.data.conversion_result;
    res.json({ convertedAmount });
  } catch (error) {
    res.status(400).json({ error: 'Currency conversion failed' });
  }
});

module.exports = router;
