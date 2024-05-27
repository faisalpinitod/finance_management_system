const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
  const { amount, categoryId } = req.body;
  const userId = req.userId;

  try {
    const budget = await prisma.budget.create({
      data: { amount, categoryId, userId },
    });
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ error: 'Budget creation failed' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const userId = req.userId;

  const budgets = await prisma.budget.findMany({ where: { userId } });
  res.json(budgets);
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { amount, categoryId } = req.body;
  const userId = req.userId;

  try {
    const budget = await prisma.budget.updateMany({
      where: { id, userId },
      data: { amount, categoryId },
    });
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ error: 'Budget update failed' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.budget.deleteMany({
      where: { id, userId },
    });
    res.status(204).json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Budget deletion failed' });
  }
});

module.exports = router;
