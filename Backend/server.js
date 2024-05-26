require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use('/auth', authRoutes);
app.use('/budgets', budgetRoutes);
app.use('/transactions', transactionRoutes);
app.use('/reports', reportRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

