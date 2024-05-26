const prisma = require('../config/prisma');

const getMonthlyReport = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return { totalIncome, totalExpenses, transactions };
};

const getCategoryWiseExpense = async (userId, category) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      category,
      type: 'expense',
    },
  });

  const totalExpense = transactions.reduce((sum, t) => sum + t.amount, 0);

  return { category, totalExpense, transactions };
};

module.exports = {
  getMonthlyReport,
  getCategoryWiseExpense,
};
