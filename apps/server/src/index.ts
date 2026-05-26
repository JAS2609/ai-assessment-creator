import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { connectDB } from './config/db';
import { redis } from './config/redis';
import assignmentRoutes from './routes/assignments';
import { initWSServer } from './ws/wsManager';
import './workers/generationWorker';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/api/assignments', assignmentRoutes);

initWSServer(wss);

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap();