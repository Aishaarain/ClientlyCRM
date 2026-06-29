import api, { API_URL } from './axios.js';

async function streamPost(path, payload, onToken) {
  const token = localStorage.getItem('velora_token');
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'AI request failed');
  }

  if (!response.body) {
    throw new Error('Streaming is not supported in this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() || '';

    for (const event of events) {
      const line = event.split('\n').find((row) => row.startsWith('data:'));
      if (!line) continue;
      const data = line.replace(/^data:\s*/, '');
      if (data === '[DONE]') return fullText;
      try {
        const parsed = JSON.parse(data);
        if (parsed.text) {
          fullText += parsed.text;
          onToken?.(parsed.text, fullText);
        }
      } catch {
        // Ignore malformed chunks and continue streaming.
      }
    }
  }

  return fullText;
}

export const aiApi = {
  generateProposal: (payload, onToken) => streamPost('/ai/proposal', payload, onToken),
  generateFollowUp: (payload, onToken) => streamPost('/ai/follow-up', payload, onToken),
  queryInsights: (payload, onToken) => streamPost('/ai/insight', payload, onToken),
  getAIContent: (params = {}) => api.get('/ai/content', { params }).then((res) => res.data),
  updateAIContent: (id, content) => api.put(`/ai/content/${id}`, { content }).then((res) => res.data),
};
