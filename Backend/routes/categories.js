const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: 'Category creation failed' });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: 'Category update failed' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id },
    });
    res.status(204).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Category deletion failed' });
  }
});

module.exports = router;
