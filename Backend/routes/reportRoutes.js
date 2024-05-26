const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/monthly-report', reportController.getMonthlyReport);
router.get('/category-expense', reportController.getCategoryWiseExpense);

module.exports = router;
