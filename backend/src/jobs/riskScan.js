import cron from 'node-cron';
import { scanAllClients } from '../services/atRiskService.js';

export const startRiskScanJob = () => {
  cron.schedule('0 6 * * *', async () => {
    console.log('[Risk Scan] Running daily scan...');
    await scanAllClients();
  });
  console.log('[Risk Scan] Scheduled daily at 06:00');
};