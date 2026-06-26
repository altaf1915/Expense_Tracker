import expenseModel from "../models/expenseSchema.js";

const buildQuery = (req) => {
  const query = { userId: req.user.id };
  const { search, category, startDate, endDate } = req.query;

  if (search) query.title = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  return query;
};

export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, description = "", date } = req.body;
    const parsedAmount = Number(amount);

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ success: false, message: "Title, amount, category, and date are required" });
    }

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be greater than zero" });
    }

    const expense = await expenseModel.create({
      userId: req.user.id,
      title,
      amount: parsedAmount,
      category,
      description,
      date,
    });

    res.status(201).json({ success: true, message: "Expense added", data: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await expenseModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, message: "Expense updated", data: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await expenseModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.json({ success: true, message: "Expense deleted", data: expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expenses = await expenseModel.find(buildQuery(req)).sort({ date: -1, createdAt: -1 });
    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
