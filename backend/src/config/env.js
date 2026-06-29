const required = ['MONGODB_URI', 'JWT_SECRET', 'GROQ_API_KEY'];

export const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(', ')}`);
};