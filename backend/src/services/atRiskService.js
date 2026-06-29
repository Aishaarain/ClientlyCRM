import Client from '../models/Client.js';
import InteractionLog from '../models/InteractionLog.js';
import Invoice from '../models/Invoice.js';

export async function scanAllClients() {
  const clients = await Client.find({ status: { $ne: 'inactive' }, isDeleted: false });
  let flagged = 0;
  for (const client of clients) {
    const score = await computeRiskScore(client._id);
    const newStatus = score >= 60 ? 'at-risk' : 'active';
    await Client.findByIdAndUpdate(client._id, { riskScore: score, status: newStatus });
    if (newStatus === 'at-risk') flagged++;
  }
  console.log(`Risk scan done. ${flagged}/${clients.length} flagged.`);
}

async function computeRiskScore(clientId) {
  let score = 0;
  const logs = await InteractionLog.find({ clientId }).sort({ loggedAt: -1 }).limit(5);
  score += logs.filter(l => l.sentiment === 'risk').length * 15;
  if (logs.length > 0) {
    const days = (Date.now() - new Date(logs[0].loggedAt)) / 86400000;
    if (days > 30) score += 20;
    else if (days > 14) score += 10;
  }
  const overdue = await Invoice.findOne({ clientId, status: 'overdue' });
  if (overdue) score += 15;
  return Math.min(score, 100);
}