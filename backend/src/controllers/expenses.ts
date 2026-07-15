import { Response } from 'express';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../data/expenses.json');
const USERS_PATH = path.join(__dirname, '../../data/users.json');

interface AuthRequest extends Request {
  user?: any;
}

const ensureFile = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
};

const readExpenses = () => {
  ensureFile();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

const writeExpenses = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const readUsers = () => JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
const writeUsers = (data: any) => fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2));

export const getExpenses = (req: AuthRequest, res: Response): void => {
  const expenses = readExpenses();
  const userExpenses = expenses.filter((e: any) => e.userId === req.user.id);
  res.json(userExpenses);
};

export const addExpense = (req: AuthRequest, res: Response): void => {
  const { amount, description, category, date } = req.body;
  const expenses = readExpenses();

  const newExpense = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    description,
    category: category || 'other',
    date: date || new Date().toISOString(),
    userId: req.user.id,
    createdAt: new Date().toISOString(),
  };

  expenses.push(newExpense);
  writeExpenses(expenses);

  // Update user balance
  const users = readUsers();
  const userIndex = users.findIndex((u: any) => u.id === req.user.id);
  if (userIndex !== -1) {
    users[userIndex].balance = (users[userIndex].balance || 0) - parseFloat(amount);
    writeUsers(users);
  }

  res.status(201).json(newExpense);
};

export const updateExpense = (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;
  const expenses = readExpenses();

  const index = expenses.findIndex(
    (e: any) => e.id === id && e.userId === req.user.id
  );

  if (index === -1) {
    res.status(404).json({ message: 'Expense not found' });
    return;
  }

  const oldAmount = expenses[index].amount;
  expenses[index] = { ...expenses[index], amount: parseFloat(amount), description, category, date };
  writeExpenses(expenses);

  // Update user balance
  const users = readUsers();
  const userIndex = users.findIndex((u: any) => u.id === req.user.id);
  if (userIndex !== -1) {
    users[userIndex].balance = (users[userIndex].balance || 0) + oldAmount - parseFloat(amount);
    writeUsers(users);
  }

  res.json(expenses[index]);
};

export const deleteExpense = (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  let expenses = readExpenses();

  const expenseToDelete = expenses.find(
    (e: any) => e.id === id && e.userId === req.user.id
  );

  if (!expenseToDelete) {
    res.status(404).json({ message: 'Expense not found' });
    return;
  }

  expenses = expenses.filter(
    (e: any) => !(e.id === id && e.userId === req.user.id)
  );
  writeExpenses(expenses);

  // Update user balance
  const users = readUsers();
  const userIndex = users.findIndex((u: any) => u.id === req.user.id);
  if (userIndex !== -1) {
    users[userIndex].balance = (users[userIndex].balance || 0) + expenseToDelete.amount;
    writeUsers(users);
  }

  res.json({ message: 'Expense deleted' });
};