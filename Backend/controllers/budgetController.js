const prisma = require('../config/prisma');

exports.createBudget = async (req, res) => {
  const { amount, category } = req.body;
  const budget = await prisma.budget.create({
    data: {
      amount,
      category,
      userId: req.user.id,
    },
  });
  res.status(201).json(budget);
};

exports.getBudgets = async (req, res) => {
  const budgets = await prisma.budget.findMany({ where: { userId: req.user.id } });
  res.json(budgets);
};

exports.updateBudget = async (req, res) => {
  const { id } = req.params;
  const { amount, category } = req.body;

  const budget = await prisma.budget.update({
    where: { id },
    data: { amount, category, updatedAt: new Date() },
  });
  res.json(budget);
};

exports.deleteBudget = async (req, res) => {
  const { id } = req.params;
  await prisma.budget.delete({ where: { id } });
  res.status(204).send();
};
