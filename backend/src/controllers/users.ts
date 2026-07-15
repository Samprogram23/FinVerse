import { Response } from 'express';
import fs from 'fs';
import path from 'path';

const USERS_PATH = path.join(__dirname, '../../data/users.json');

interface AuthRequest extends Request {
  user?: any;
}

const readUsers = (): any[] => {
  if (!fs.existsSync(USERS_PATH)) return [];
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf-8'));
};

const writeUsers = (data: any[]): void => {
  const dir = path.dirname(USERS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2));
};

const getProfile = (req: AuthRequest, res: Response): void => {
  const users = readUsers();
  const user = users.find((u: any) => u.id === req.user.id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    balance: user.balance || 0,
    monthlyIncome: user.monthlyIncome || 0,
  });
};

const updateBalance = (req: AuthRequest, res: Response): void => {
  const { balance } = req.body;
  const users = readUsers();
  const index = users.findIndex((u: any) => u.id === req.user.id);
  if (index === -1) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  users[index].balance = parseFloat(balance);
  writeUsers(users);
  res.json({ message: 'Balance updated', balance: parseFloat(balance) });
};

const updateIncome = (req: AuthRequest, res: Response): void => {
  const { monthlyIncome } = req.body;
  const users = readUsers();
  const index = users.findIndex((u: any) => u.id === req.user.id);
  if (index === -1) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  users[index].monthlyIncome = parseFloat(monthlyIncome);
  writeUsers(users);
  res.json({ message: 'Income updated', monthlyIncome: parseFloat(monthlyIncome) });
};

export { getProfile, updateBalance, updateIncome };