const express = require('express');
const { createBudget, getBudgets, updateBudget, deleteBudget } = require('../controllers/budgetController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, createBudget);
router.get('/', authenticateToken, getBudgets);
router.put('/:id', authenticateToken, updateBudget);
router.delete('/:id', authenticateToken, deleteBudget);

module.exports = router;
