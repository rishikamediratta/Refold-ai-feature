import dotenv from 'dotenv';

dotenv.config();

const key = process.env.XAI_API_KEY || '';
const model = process.env.XAI_MODEL || 'Not Set';

const exists = Boolean(key && key.trim() !== '');
const length = key.length;
const first4 = exists && length >= 4 ? key.slice(0, 4) : 'N/A';
const last4 = exists && length >= 4 ? key.slice(-4) : 'N/A';

console.log('--- DIAGNOSTIC ENVIRONMENT REPORT ---');
console.log(`XAI_API_KEY Exists: ${exists}`);
console.log(`XAI_API_KEY Length: ${length}`);
console.log(`XAI_API_KEY Prefix (first 4): ${first4}`);
console.log(`XAI_API_KEY Suffix (last 4): ${last4}`);
console.log(`XAI_MODEL Value: ${model}`);
console.log('------------------------------------');
