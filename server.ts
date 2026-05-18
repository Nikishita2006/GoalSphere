import express from 'express';
import Database from 'better-sqlite3';
import { GoogleGenAI } from "@google/genai";
import { format } from 'date-fns';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());

const db = new Database('database.sqlite');
db.prisma = false; // Just a reminder we're using raw sqlite

// --- DB INITIALIZATION ---
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT, -- Optional, but keeping as requested
      role TEXT NOT NULL, -- 'employee', 'manager', 'admin'
      managerId TEXT,
      department TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      thrustArea TEXT,
      uom TEXT NOT NULL, -- 'min', 'max', 'timeline', 'zero'
      target REAL,
      weightage REAL NOT NULL,
      status TEXT DEFAULT 'Not Started', -- 'Not Started', 'On Track', 'Completed'
      plannedAchievement REAL,
      actualAchievement REAL DEFAULT 0,
      isApproved INTEGER DEFAULT 0,
      isLocked INTEGER DEFAULT 0,
      isReturned INTEGER DEFAULT 0,
      managerComment TEXT,
      sharedGoalId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id TEXT PRIMARY KEY,
      goalId TEXT NOT NULL,
      quarter TEXT NOT NULL, -- 'Q1', 'Q2', 'Q3', 'Q4'
      achievement REAL NOT NULL,
      managerComment TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS shared_goals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      target REAL,
      creatorId TEXT NOT NULL,
      department TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      goalId TEXT,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT, -- 'approval', 'submission', 'reminder'
      isRead INTEGER DEFAULT 0,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS escalations (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      targetUserId TEXT NOT NULL,
      reason TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Admin if not exists
  const admin = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
  if (!admin) {
    db.prepare(`
      INSERT INTO users (id, name, email, role, department)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin-1', 'HR Admin', 'hr@goalsphere.com', 'admin', 'Human Resources');
    
    // Seed some users
    db.prepare('INSERT OR IGNORE INTO users (id, name, email, role, managerId, department) VALUES (?, ?, ?, ?, ?, ?)').run('mgr-1', 'Sarah Manager', 'sarah@goalsphere.com', 'manager', 'admin-1', 'Engineering');
    db.prepare('INSERT OR IGNORE INTO users (id, name, email, role, managerId, department) VALUES (?, ?, ?, ?, ?, ?)').run('emp-1', 'John Doe', 'john@goalsphere.com', 'employee', 'mgr-1', 'Engineering');
    
    // Add User's specific email as admin for full access
    db.prepare('INSERT OR IGNORE INTO users (id, name, email, role, department) VALUES (?, ?, ?, ?, ?)').run('user-primary', 'Primary User', 'm.nikishitareddy1010@gmail.com', 'admin', 'Human Resources');

    // Add Judge Demo Accounts
    db.prepare('INSERT OR IGNORE INTO users (id, name, email, role, department) VALUES (?, ?, ?, ?, ?)').run('judge-1', 'Judge (Admin View)', 'judge-admin@goalsphere.com', 'admin', 'Governance');
    db.prepare('INSERT OR IGNORE INTO users (id, name, email, role, managerId, department) VALUES (?, ?, ?, ?, ?, ?)').run('judge-2', 'Judge (Manager View)', 'judge-manager@goalsphere.com', 'manager', 'judge-1', 'Operations');
    db.prepare('INSERT OR IGNORE INTO users (id, name, email, role, managerId, department) VALUES (?, ?, ?, ?, ?, ?)').run('judge-3', 'Judge (Employee View)', 'judge-employee@goalsphere.com', 'employee', 'judge-2', 'Engineering');
  }
}

initDb();

// Migration: Ensure new columns exist for old databases
try { db.prepare("ALTER TABLE users ADD COLUMN password TEXT").run(); } catch(e) {}
try { db.prepare("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP").run(); } catch(e) {}

// --- API ROUTES ---

// Utils
function logAudit(userId: string, action: string, details: any, goalId?: string) {
  db.prepare(`
    INSERT INTO audit_logs (id, userId, goalId, action, details)
    VALUES (?, ?, ?, ?, ?)
  `).run(Math.random().toString(36).substr(2, 9), userId, goalId || null, action, JSON.stringify(details));
}

function notify(userId: string, message: string, type: string) {
  db.prepare(`
    INSERT INTO notifications (id, userId, message, type)
    VALUES (?, ?, ?, ?)
  `).run(Math.random().toString(36).substr(2, 9), userId, message, type);
}

// User Profile & Register/Login
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, department } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  
  try {
    db.prepare(`
      INSERT INTO users (id, name, email, password, role, department)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, email, password || null, role || 'employee', department || 'General');
    
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json(user);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!user) return res.status(401).json({ error: 'User not found' });
  
  // If user provided a password during registration, check it
  if (user.password && password && user.password !== password) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  res.json(user);
});

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// Goals
app.get('/api/goals/:userId', (req, res) => {
  const goals = db.prepare('SELECT * FROM goals WHERE userId = ?').all(req.params.userId);
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
  const { userId, title, description, thrustArea, uom, target, weightage, sharedGoalId } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  
  // Validation: Max 8 goals
  const count = db.prepare('SELECT COUNT(*) as count FROM goals WHERE userId = ?').get(userId) as any;
  if (count.count >= 8) return res.status(400).json({ error: 'Maximum 8 goals allowed' });

  db.prepare(`
    INSERT INTO goals (id, userId, title, description, thrustArea, uom, target, weightage, sharedGoalId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, title, description, thrustArea, uom, target, weightage, sharedGoalId || null);

  logAudit(userId, 'CREATE_GOAL', { title, weightage }, id);
  res.json({ id });
});

app.put('/api/goals/:id', (req, res) => {
  const { title, description, thrustArea, uom, target, weightage, status, actualAchievement, senderId } = req.body;
  const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Goal not found' });

  if (existing.isLocked && !req.body.adminOverride) {
    return res.status(403).json({ error: 'Goal is locked' });
  }

  db.prepare(`
    UPDATE goals 
    SET title = ?, description = ?, thrustArea = ?, uom = ?, target = ?, weightage = ?, status = ?, actualAchievement = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, description, thrustArea, uom, target, weightage, status, actualAchievement, req.params.id);

  logAudit(senderId || existing.userId, 'UPDATE_GOAL', { title, status }, req.params.id);
  res.json({ success: true });
});

app.post('/api/goals/submit', (req, res) => {
  const { userId } = req.body;
  
  // Check weightage total
  const total = db.prepare('SELECT SUM(weightage) as total FROM goals WHERE userId = ?').get(userId) as any;
  if (total.total !== 100) {
    return res.status(400).json({ error: 'Total weightage must be exactly 100%' });
  }

  db.prepare('UPDATE goals SET isLocked = 1, isReturned = 0 WHERE userId = ?').run(userId);
  
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (user.managerId) {
    notify(user.managerId, `New goal sheet submitted by ${user.name}`, 'submission');
  }
  
  logAudit(userId, 'SUBMIT_GOALS', { userId });
  res.json({ success: true });
});

// Manager Actions
app.get('/api/manager/team/:managerId', (req, res) => {
  const team = db.prepare('SELECT * FROM users WHERE managerId = ?').all(req.params.managerId);
  res.json(team);
});

app.post('/api/goals/approve', (req, res) => {
  const { goalId, managerId } = req.body;
  db.prepare('UPDATE goals SET isApproved = 1, isLocked = 1 WHERE id = ?').run(goalId);
  
  const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId) as any;
  notify(goal.userId, 'Your goal has been approved by your manager.', 'approval');
  
  logAudit(managerId, 'APPROVE_GOAL', { goalId }, goalId);
  res.json({ success: true });
});

app.post('/api/goals/return', (req, res) => {
  const { goalId, managerId, comment } = req.body;
  db.prepare('UPDATE goals SET isLocked = 0, isReturned = 1, managerComment = ? WHERE id = ?').run(comment, goalId);
  
  const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(goalId) as any;
  notify(goal.userId, `Your goal sheet was returned for rework. Reason: ${comment}`, 'rejection');
  
  logAudit(managerId, 'RETURN_GOAL', { goalId, comment }, goalId);
  res.json({ success: true });
});

// AI Assistant
app.post('/api/ai/suggest', async (req, res) => {
  const { prompt, context } = req.body;
  try {
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY!,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } 
    });
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are GoalSphere AI Assistant. Use the following context to help an employee: ${JSON.stringify(context)}. User says: ${prompt}`,
      config: {
        systemInstruction: "You are an expert performance coach. Help employees with SMART goals, productivity tips, and performance improvement strategies. Keep it professional and empathetic."
      }
    });
    res.json({ response: result.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI Error' });
  }
});

// Notifications
app.get('/api/notifications/:userId', (req, res) => {
  const notes = db.prepare('SELECT * FROM notifications WHERE userId = ? ORDER BY timestamp DESC').all(req.params.userId);
  res.json(notes);
});

// Admin overrides
app.post('/api/admin/unlock', (req, res) => {
  const { userId, adminId } = req.body;
  db.prepare('UPDATE goals SET isLocked = 0 WHERE userId = ?').run(userId);
  logAudit(adminId, 'UNLOCK_GOALS', { targetUserId: userId });
  res.json({ success: true });
});

app.get('/api/logs', (req, res) => {
  const logs = db.prepare(`
    SELECT l.*, u.name as userName 
    FROM audit_logs l 
    JOIN users u ON l.userId = u.id 
    ORDER BY timestamp DESC LIMIT 100
  `).all();
  res.json(logs);
});

// Dashboard Data
app.get('/api/analytics/summary/:userId', (req, res) => {
  const goals = db.prepare('SELECT * FROM goals WHERE userId = ?').all(req.params.userId) as any[];
  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'Completed').length,
    onTrack: goals.filter(g => g.status === 'On Track').length,
    notStarted: goals.filter(g => g.status === 'Not Started').length,
    overallSuccess: 0
  };

  // UoM Logic
  let weightedSuccess = 0;
  goals.forEach(g => {
    let success = 0;
    if (g.uom === 'min') {
      success = g.target > 0 ? (g.actualAchievement / g.target) * 100 : 0;
    } else if (g.uom === 'max') {
      success = g.actualAchievement > 0 ? (g.target / g.actualAchievement) * 100 : 100;
      if (g.actualAchievement === 0) success = 100;
    } else if (g.uom === 'zero') {
      success = g.actualAchievement === 0 ? 100 : 0;
    } else { // timeline/manual
      success = g.actualAchievement; 
    }
    weightedSuccess += (Math.min(100, success) * g.weightage) / 100;
  });
  stats.overallSuccess = weightedSuccess;

  res.json(stats);
});

const PORT = 3000;

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`GoalSphere running on port ${PORT}`);
  });
}

startServer();
