const prisma = require('../config/prisma');

exports.createTransaction = async (req, res) => {
  const { amount, type, category } = req.body;
  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      category,
      userId: req.user.id,
    },
  });
  res.status(201).json(transaction);
};

exports.getTransactions = async (req, res) => {
  const transactions = await prisma.transaction.findMany({ where: { userId: req.user.id } });
  res.json(transactions);
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category } = req.body;

  const transaction = await prisma.transaction.update({
    where: { id },
    data: { amount, type, category },
  });
  res.json(transaction);
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  await prisma.transaction.delete({ where: { id } });
  res.status(204).send();
};
