import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const hasGroqApiKey = Boolean(process.env.GROQ_API_KEY?.trim());

const groq = hasGroqApiKey
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const getGroqClient = () => {
  if (!groq) {
    const error = new Error('AI features are disabled because GROQ_API_KEY is missing in backend/.env.');
    error.statusCode = 503;
    throw error;
  }

  return groq;
};

const FAST_MODEL  = 'llama-3.1-8b-instant';
const SMART_MODEL = 'llama-3.3-70b-versatile';

// 1. Proposal writer (streaming)
export async function streamProposal({ client, project }, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  const stream = await getGroqClient().chat.completions.create({
    model: SMART_MODEL, stream: true,
    messages: [
      { role: 'system', content: 'You are an expert freelance proposal writer. Write professional proposals with sections: Executive Summary, Scope of Work, Deliverables, Timeline, Investment.' },
      { role: 'user', content: `Client: ${client.name} (${client.company || 'Independent'})\nProject: ${project.title}\nDescription: ${project.description}\nDeliverables: ${project.deliverables?.join(', ')}\nBudget: ${project.currency || 'USD'} ${project.budget}` },
    ],
  });

  let fullContent = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) { fullContent += text; res.write(`data: ${JSON.stringify({ text })}\n\n`); }
  }
  res.write('data: [DONE]\n\n');
  res.end();
  return fullContent;
}

// 2. Follow-up email drafter (streaming)
export async function streamFollowUp({ client, invoice, daysOverdue }, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  const tone = daysOverdue <= 3 ? 'gentle and friendly' : daysOverdue <= 14 ? 'professional and firm' : 'serious and urgent';

  const stream = await getGroqClient().chat.completions.create({
    model: SMART_MODEL, stream: true,
    messages: [
      { role: 'system', content: `You write payment follow-up emails for freelancers. Tone: ${tone}. Never be rude. Always include next steps.` },
      { role: 'user', content: `Client: ${client.name}\nInvoice: ${invoice.invoiceNumber}\nAmount: $${invoice.total}\nDue date: ${invoice.dueDate}\nDays overdue: ${daysOverdue}` },
    ],
  });

  let fullContent = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) { fullContent += text; res.write(`data: ${JSON.stringify({ text })}\n\n`); }
  }
  res.write('data: [DONE]\n\n');
  res.end();
  return fullContent;
}

// 3. Sentiment tagger (non-streaming, fast model)
export async function tagSentiment(content) {
  if (!groq) {
    return {
      sentiment: 'neutral',
      reason: 'AI sentiment disabled because GROQ_API_KEY is missing.',
    };
  }

  const response = await getGroqClient().chat.completions.create({
    model: FAST_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'Classify client interaction sentiment. Return ONLY valid JSON, no explanation. The sentiment value MUST be exactly one of: positive, neutral, risk. Example: {"sentiment":"risk","reason":"Client sounds unhappy about delay."}',
      },
      { role: 'user', content },
    ],
  });

  const raw = response.choices[0].message.content
    .trim()
    .replace(/```json|```/g, '');

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      sentiment: 'neutral',
      reason: 'Could not parse AI sentiment response.',
    };
  }

  let sentiment = parsed.sentiment?.toLowerCase();

  if (sentiment === 'negative') sentiment = 'risk';
  if (sentiment === 'bad') sentiment = 'risk';
  if (sentiment === 'angry') sentiment = 'risk';

  const allowedSentiments = ['positive', 'neutral', 'risk'];

  if (!allowedSentiments.includes(sentiment)) {
    sentiment = 'neutral';
  }

  return {
    sentiment,
    reason: parsed.reason || 'No reason provided.',
  };
}

// 4. Insights two-pass (streaming summary)
export async function insightsTwoPass({ query, rawResults }, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  const stream = await getGroqClient().chat.completions.create({
    model: SMART_MODEL, stream: true,
    messages: [
      { role: 'system', content: 'Summarise CRM data in plain English for freelancers. Be concise and actionable.' },
      { role: 'user', content: `Question: "${query}"\n\nData: ${JSON.stringify(rawResults, null, 2)}\n\nSummarise to directly answer the question.` },
    ],
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
}