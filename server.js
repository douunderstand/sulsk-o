import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import compression from 'compression';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Максимальная оптимизация
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(join(__dirname, 'public'), {
  maxAge: '1d',
  etag: false
}));

// Премиум система аутентификации
const users = [{
  id: uuidv4(),
  username: 'admin',
  password: '$2a$10$8K1p/a0dRTlR0dSXMe.5Ee.tbOjK.V8k.X.3JY.Iz.s7q5nq5p5vO', // 1234
  avatar: '👑',
  theme: 'cosmic',
  lastLogin: new Date()
}];

// Real-time системные данные
const systemData = {
  cpu: 0,
  memory: 0,
  network: 0,
  storage: 0,
  temperature: 0
};

// API endpoints
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  
  if (user && await bcrypt.compare(password, user.password)) {
    user.lastLogin = new Date();
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        theme: user.theme
      },
      token: uuidv4()
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

app.get('/api/system/performance', (req, res) => {
  // Симуляция реальных системных данных
  systemData.cpu = Math.round(Math.random() * 40 + 10);
  systemData.memory = Math.round(Math.random() * 50 + 30);
  systemData.network = Math.round(Math.random() * 100);
  systemData.storage = Math.round(Math.random() * 80 + 10);
  systemData.temperature = Math.round(Math.random() * 20 + 40);
  
  res.json(systemData);
});

app.get('/api/weather', (req, res) => {
  res.json({
    temperature: Math.round(Math.random() * 25 + 15),
    condition: ['☀️', '🌤️', '🌧️', '⛅', '🌙'][Math.floor(Math.random() * 5)],
    humidity: Math.round(Math.random() * 40 + 50),
    location: 'Sulsk City',
    updated: new Date().toISOString()
  });
});

// WebSocket реального времени
io.on('connection', (socket) => {
  console.log('🔗 Premium user connected to Sulsk OS');
  
  socket.emit('system:welcome', {
    message: 'Welcome to Sulsk OS Premium',
    version: '5.0.0',
    timestamp: new Date().toISOString(),
    features: ['real-time', 'themes', 'widgets', 'animations']
  });

  // Real-time системный мониторинг
  const systemInterval = setInterval(() => {
    systemData.cpu = Math.round(Math.random() * 40 + 10);
    systemData.memory = Math.round(Math.random() * 50 + 30);
    
    socket.emit('system:performance', systemData);
    socket.emit('system:time', {
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    });
  }, 2000);

  // Обработка событий окон
  socket.on('window:action', (data) => {
    socket.broadcast.emit('window:update', {
      ...data,
      id: uuidv4(),
      timestamp: Date.now()
    });
  });

  // Уведомления
  socket.on('notification:send', (data) => {
    io.emit('notification:receive', {
      id: uuidv4(),
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    clearInterval(systemInterval);
    console.log('🔒 User disconnected from Sulsk OS');
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'operational', 
    version: '5.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Запуск премиум сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('\n✨ Sulsk OS Premium Server Started ✨');
  console.log(`🚀 Version: 5.0.0 - Ultimate Edition`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Access: http://localhost:${PORT}`);
  console.log(`💫 Real-time WebSocket: Enabled`);
  console.log(`🎨 Premium Styling: Activated`);
  console.log(`⚡ Performance: Optimized\n`);
});