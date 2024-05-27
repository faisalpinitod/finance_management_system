const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, async (req, res) => {
//   const { amount, type, categoryId } = req.body;
//   const userId = req.userId;

//   try {
//     const transaction = await prisma.transaction.create({
//       data: {
//         amount,
//         type,
//         categoryId,
//         userId
//       }
//     });
//     res.status(201).json(transaction);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: 'Transaction creation failed' });
//   }
// });



// const express = require('express');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const router = express.Router();
// const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
  const { amount, type, categoryId } = req.body;
  const userId = req.userId;

  try {
    // Fetch the budget for the category
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if the transaction amount exceeds the budget limit
    if (type === 'expense' && amount > category.budget) {
      return res.status(400).json({ error: 'Transaction amount exceeds budget limit' });
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        categoryId,
        userId
      }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Transaction creation failed' });
  }
});

module.exports = router;


router.get('/', verifyToken, async (req, res) => {
  const userId = req.userId;

  const transactions = await prisma.transaction.findMany({
    where: { userId }
  });
  res.json(transactions);
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { amount, type, categoryId } = req.body;
  const userId = req.userId;

  try {
    const transaction = await prisma.transaction.updateMany({
      where: { id, userId },
      data: { amount, type, categoryId }
    });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: 'Transaction update failed' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.transaction.deleteMany({
      where: { id, userId }
    });
    res.status(204).json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Transaction deletion failed' });
  }
});

module.exports = router;
