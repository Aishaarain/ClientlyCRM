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
import teamRoutes from './routes/team.js';
import { errorHandler } from './middleware/errorHandler.js';
import workspaceRoutes from './routes/workSpace.js';
import taskRoutes from './routes/task.js';

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    "https://cliently-crm-freelance.vercel.app",
    "https://cliently-crm-freelance-git-main-aishaarains-projects.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/v1/auth',         authRoutes);
app.use('/api/v1/clients',      clientRoutes);
app.use('/api/v1/projects',     projectRoutes);
app.use('/api/v1/invoices',     invoiceRoutes);
app.use('/api/v1/interactions', interactionRoutes);
app.use('/api/v1/ai',           aiRoutes);
app.use('/api/v1/team',         teamRoutes);
app.use('/api/v1/workspaces',   workspaceRoutes);
app.use('/api/v1/tasks',        taskRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  startRiskScanJob();
});
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Cliently CRM API is running' });
});
export default app;
