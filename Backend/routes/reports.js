const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/monthly', verifyToken, async (req, res) => {
  const userId = req.userId;
  const { month, year } = req.query;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(`${year}-${month}-01`),
          lt: new Date(`${year}-${parseInt(month) + 1}-01`),
        },
      },
    });

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    res.json({ totalIncome, totalExpense, transactions });
  } catch (error) {
    res.status(400).json({ error: 'Report generation failed' });
  }
});

module.exports = router;
