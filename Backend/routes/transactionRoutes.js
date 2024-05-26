const express = require('express');
const { createTransaction, getTransactions, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, createTransaction);
router.get('/', authenticateToken, getTransactions);
router.put('/:id', authenticateToken, updateTransaction);
router.delete('/:id', authenticateToken, deleteTransaction);

module.exports = router;
