const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const budgetRoutes = require('./routes/budgets');
const categoryRoutes = require('./routes/categories');
const currencyRoutes = require('./routes/currency');
const reportRoutes = require('./routes/reports');
const transactionRoutes = require('./routes/transactions');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/budgets', budgetRoutes);
app.use('/categories', categoryRoutes);
app.use('/currency', currencyRoutes);
app.use('/reports', reportRoutes);
app.use('/transactions', transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
