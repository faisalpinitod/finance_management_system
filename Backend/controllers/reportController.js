const reportService = require('../services/reportService');

exports.getMonthlyReport = async (req, res) => {
  const { month, year } = req.query;
  try {
    const report = await reportService.getMonthlyReport(req.user.id, parseInt(month), parseInt(year));
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCategoryWiseExpense = async (req, res) => {
  const { category } = req.query;
  try {
    const report = await reportService.getCategoryWiseExpense(req.user.id, category);
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
