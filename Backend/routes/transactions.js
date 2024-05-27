const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

// POST /transactions
// router.post('/', verifyToken, async (req, res) => {
//   const { amount, type, categoryId } = req.body;
//   const userId = req.userId;

//   try {
//     // Fetch the budget for the category
//     const category = await prisma.category.findUnique({ where: { id: categoryId } });
//     if (!category) {
//       return res.status(404).json({ error: 'Category not found' });
//     }

//     // Check if the transaction amount exceeds the budget limit
//     if (type === 'expense' && amount > category.budget) {
//       return res.status(400).json({ error: 'Transaction amount exceeds budget limit' });
//     }
    
    // const totalExpenses = category.transactions.reduce((total, transaction) => {
    //   if (transaction.type === 'expense') {
    //     return total + transaction.amount;
    //   }
    //   return total;
    // }, 0);

    // // Check if the new transaction exceeds the budget limit
    // if (type === 'expense' && totalExpenses + amount > category.budget) {
    //   return res.status(400).json({ error: 'Transaction amount exceeds budget limit' });
    // }


    router.post('/', verifyToken, async (req, res) => {
      const { amount, type, categoryId } = req.body;
      const userId = req.userId;
    
      try {
        // Fetch the category and its associated transactions
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
          include: { transactions: true }
        });
        
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
    
        // Calculate the total income and total expenses for the category
        const totalIncome = category.transactions.reduce((total, transaction) => {
          if (transaction.type === 'income') {
            return total + transaction.amount;
          }
          return total;
        }, 0);
    
        const totalExpenses = category.transactions.reduce((total, transaction) => {
          if (transaction.type === 'expense') {
            return total + transaction.amount;
          }
          return total;
        }, 0);
    
        // Calculate the remaining balance (budget limit - total expenses)
        const remainingBalance = category.budget - totalExpenses;
    
        // Check if the new transaction (if it's an expense) will cause total expenses to exceed total income
        if (type === 'expense' && totalExpenses + amount > totalIncome) {
          return res.status(400).json({ error: 'Total expenses exceed total income' });
        }
    
        // Check if the new transaction amount exceeds the remaining balance
        if (type === 'expense' && amount > remainingBalance) {
          return res.status(400).json({ error: 'Transaction amount exceeds remaining balance' });
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
    
        res.status(201).json({ transaction, remainingBalance });
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Transaction creation failed' });
      }
    });

    // router.post('/', verifyToken, async (req, res) => {
    //   const { amount, type, categoryId } = req.body;
    //   const userId = req.userId;
    
    //   try {
    //     // Fetch the category and its associated transactions
    //     const category = await prisma.category.findUnique({
    //       where: { id: categoryId },
    //       include: { transactions: true }
    //     });
        
    //     if (!category) {
    //       return res.status(404).json({ error: 'Category not found' });
    //     }
    
    //     // Calculate the total income and total expenses for the category
    //     const totalIncome = category.transactions.reduce((total, transaction) => {
    //       if (transaction.type === 'income') {
    //         return total + transaction.amount;
    //       }
    //       return total;
    //     }, 0);
    
    //     const totalExpenses = category.transactions.reduce((total, transaction) => {
    //       if (transaction.type === 'expense') {
    //         return total + transaction.amount;
    //       }
    //       return total;
    //     }, 0);
    
    //     // Check if the new transaction (if it's an expense) will cause total expenses to exceed total income
    //     if (type === 'expense' && totalExpenses + amount > totalIncome) {
    //       return res.status(400).json({ error: 'Total expenses exceed total income' });
    //     }
    
    //     // Create the transaction
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

// GET /transactions
router.get('/', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId }
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to fetch transactions' });
  }
});

// PUT /transactions/:id
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { amount, type, categoryId } = req.body;
  const userId = req.userId;

  try {
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id), userId },
      data: { amount, type, categoryId }
    });
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Transaction update failed' });
  }
});

// DELETE /transactions/:id
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.transaction.delete({
      where: { id: parseInt(id), userId }
    });
    res.status(204).json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Transaction deletion failed' });
  }
});

module.exports = router;
