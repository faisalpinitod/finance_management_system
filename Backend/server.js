const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const categoryRoutes = require('./routes/categories');
const reportRoutes = require('./routes/reports');
const currencyRoutes = require('./routes/currency');

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/budgets', budgetRoutes);
app.use('/categories', categoryRoutes);
app.use('/reports', reportRoutes);
app.use('/currency', currencyRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
