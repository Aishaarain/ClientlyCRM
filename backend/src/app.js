import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { startRiskScanJob } from './jobs/riskScan.js';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import projectRoutes from './routes/projects.js';
import invoiceRoutes from './routes/invoices.js';
import interactionRoutes from './routes/interactions.js';
import aiRoutes from './routes/ai.js';
import teamRoutes from './routes/team.js'; // ✅ fix: default import + correct filename
import { errorHandler } from './middleware/errorHandler.js';
import workspaceRoutes from './routes/workSpace.js'; // ← add this import
import taskRoutes from './routes/task.js';

dotenv.config();

const app = express();
app.use(helmet());

// ✅ First cors: dev allows all, prod restricts to CLIENT_URL
app.use(cors({
  origin: process.env.NODE_ENV === 'development'
    ? true
    : process.env.CLIENT_URL,
  credentials: true,
}));

// ✅ Second cors: kills any origin not in allowedOrigins (your original logic kept)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5002',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/v1/auth',         authRoutes);
app.use('/api/v1/clients',      clientRoutes);
app.use('/api/v1/projects',     projectRoutes);
app.use('/api/v1/invoices',     invoiceRoutes);
app.use('/api/v1/interactions', interactionRoutes);
app.use('/api/v1/ai',           aiRoutes);
app.use('/api/v1/team',         teamRoutes);
app.use('/api/v1/workspaces',   workspaceRoutes); // ← add this
app.use('/api/v1/tasks', taskRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  startRiskScanJob();
});

export default app;