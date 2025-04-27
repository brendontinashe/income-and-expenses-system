const Income = require('../models/Income');

// @desc    Get all incomes
// @route   GET /api/incomes
// @access  Private
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add new income
// @route   POST /api/incomes
// @access  Private
exports.addIncome = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    const income = await Income.create({
      amount,
      description,
      category,
      user: req.user.id,
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update income
// @route   PUT /api/incomes/:id
// @access  Private
exports.updateIncome = async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Make sure user owns income
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete income
// @route   DELETE /api/incomes/:id
// @access  Private
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Make sure user owns income
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await income.remove();

    res.status(200).json({ message: 'Income removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}; 