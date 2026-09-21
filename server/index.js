import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Root Info & Redirect Handler
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Schema-Change Impact Agent Backend API</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #090d16; color: #f1f5f9; padding: 40px; text-align: center; }
          .card { max-width: 500px; margin: 0 auto; background: #1e293b; padding: 30px; border-radius: 16px; border: 1px solid #334155; }
          a { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; }
          a:hover { background: #4f46e5; }
          code { font-family: monospace; background: #0f172a; padding: 2px 6px; border-radius: 4px; color: #818cf8; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🤖 Schema-Change Impact Agent API</h2>
          <p>This is the Express backend API running on port <code>3001</code>.</p>
          <p>To access the single-page React dashboard UI, visit the frontend server at:</p>
          <a href="http://localhost:5173">Open React Dashboard (http://localhost:5173) ➔</a>
        </div>
      </body>
    </html>
  `);
});

// Temporary Diagnostic Endpoint
app.get('/api/diag', (req, res) => {
  const key = process.env.XAI_API_KEY || '';
  const exists = Boolean(key && key.trim() !== '');
  const length = key.length;
  const first4 = exists && length >= 4 ? key.slice(0, 4) : 'N/A';
  const last4 = exists && length >= 4 ? key.slice(-4) : 'N/A';
  const model = process.env.XAI_MODEL || 'Not Set';

  res.json({
    exists,
    length,
    first4,
    last4,
    model
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    apiKeyConfigured: Boolean(process.env.XAI_API_KEY && process.env.XAI_API_KEY.trim() !== ''),
    model: process.env.XAI_MODEL || 'grok-2-latest'
  });
});

/**
 * POST /api/analyze
 * Receives affected schema changes and affected integration mappings.
 * Calls Grok API to perform AI-driven impact analysis.
 */
app.post('/api/analyze', async (req, res) => {
  try {
    const { affectedMappings, schemaChanges } = req.body;

    if (!affectedMappings || !Array.isArray(affectedMappings) || affectedMappings.length === 0) {
      return res.status(400).json({
        error: 'Invalid payload',
        message: 'No affected mappings provided for analysis.'
      });
    }

    const apiKey = process.env.XAI_API_KEY;
    const modelName = process.env.XAI_MODEL || 'grok-2-latest';

    // If API key is missing, handle gracefully with fallback mock analysis and warning flag
    if (!apiKey || apiKey.trim() === '' || apiKey.trim() === 'your_key_here') {
      console.warn('[Backend Warning] XAI_API_KEY is not set in .env. Returning synthesized mock analysis for demo purposes.');
      const fallbackResults = generateFallbackAnalysis(affectedMappings, schemaChanges);
      return res.json({
        success: true,
        isMockMode: true,
        warning: 'XAI_API_KEY is missing in backend .env file. Showing fallback synthesized analysis.',
        model: modelName,
        analyzedAt: new Date().toISOString(),
        analyses: fallbackResults
      });
    }

    // Prepare system prompt & user prompt for xAI Grok API
    const systemPrompt = `You are Refold AI's Autonomous Integration Drift Agent.
Your task is to analyze API schema changes that impact CRM-to-ERP integration field mappings.

You must analyze each affected mapping and return ONLY a valid JSON array of objects. Do not include markdown code block backticks, extra text, or preamble outside the JSON array.

Each object in the returned JSON array MUST have the following structure:
{
  "mapping_id": "string",
  "name": "string",
  "source_field": "string",
  "target_field": "string",
  "break_type": "FIELD_RENAMED" | "FIELD_REMOVED" | "TYPE_MISMATCH",
  "confidence_score": number (80-99),
  "what_changed": "string short description",
  "why_affected": "detailed technical explanation of why runtime mapping will fail",
  "suggested_fix": "exact code/JSON update or expression to remediate",
  "changelog_entry": "concise 1-sentence engineering release note"
}`;

    const userPrompt = `Analyze the following schema changes and their corresponding affected integration mappings:

Schema Changes Detected:
${JSON.stringify(schemaChanges, null, 2)}

Affected Mappings:
${JSON.stringify(affectedMappings, null, 2)}

Return structured JSON for each affected mapping matching the required JSON format.`;

    // Call Grok API via standard OpenAI-compatible completions endpoint
    const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1500
      })
    });

    if (!grokResponse.ok) {
      const errorText = await grokResponse.text();
      console.error('[Grok API Error Response]:', grokResponse.status, errorText);
      
      let humanWarning = `Grok API HTTP ${grokResponse.status}`;
      if (errorText.includes('permission-denied') || errorText.includes('credits')) {
        humanWarning = `xAI API key authenticated successfully, but console.x.ai account requires API credits (HTTP 403). Using autonomous fallback synthesis.`;
      } else {
        humanWarning = `Grok API returned HTTP ${grokResponse.status}. Falling back to offline synthesis: ${errorText.substring(0, 120)}`;
      }

      // Fallback on Grok error so app never breaks visually for user
      const fallbackResults = generateFallbackAnalysis(affectedMappings, schemaChanges);
      return res.json({
        success: true,
        isMockMode: true,
        warning: humanWarning,
        model: modelName,
        analyzedAt: new Date().toISOString(),
        analyses: fallbackResults
      });
    }

    const data = await grokResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Received empty content from Grok API response');
    }

    // Clean potential markdown backticks from response text
    let cleanJsonText = content.trim();
    if (cleanJsonText.startsWith('```json')) {
      cleanJsonText = cleanJsonText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJsonText.startsWith('```')) {
      cleanJsonText = cleanJsonText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const analyses = JSON.parse(cleanJsonText);

    return res.json({
      success: true,
      isMockMode: false,
      model: data.model || modelName,
      analyzedAt: new Date().toISOString(),
      analyses: Array.isArray(analyses) ? analyses : [analyses]
    });

  } catch (error) {
    console.error('[Backend Server Error]:', error);
    // On unexpected error, return fallback result gracefully
    const fallbackResults = generateFallbackAnalysis(req.body?.affectedMappings || [], req.body?.schemaChanges || []);
    return res.status(200).json({
      success: true,
      isMockMode: true,
      warning: `Backend processed request with fallback due to error: ${error.message}`,
      analyses: fallbackResults
    });
  }
});

/**
 * Helper to synthesize deterministic analysis when offline or when API key is missing.
 */
function generateFallbackAnalysis(affectedMappings, schemaChanges) {
  return affectedMappings.map(mapping => {
    const fieldName = mapping.source_field.replace('crm.', '');
    const change = schemaChanges.find(c => c.field === fieldName || c.oldField === fieldName);

    if (change?.type === 'RENAMED' || fieldName === 'contact_email') {
      return {
        mapping_id: mapping.id,
        name: mapping.name,
        source_field: mapping.source_field,
        target_field: mapping.target_field,
        break_type: 'FIELD_RENAMED',
        confidence_score: 96,
        what_changed: `CRM field 'contact_email' was renamed to 'primary_email' in API v2.0.0`,
        why_affected: `The pipeline attempts to extract payload.contact_email which now resolves to undefined. The target ERP system require customer_email, causing null constraints violations on customer creation.`,
        suggested_fix: `Update mapping source path:\nFROM: crm.contact_email\nTO:   crm.primary_email`,
        changelog_entry: `Remapped primary contact email payload field from deprecated contact_email to v2.0 primary_email.`
      };
    }

    if (change?.type === 'REMOVED' || fieldName === 'annual_revenue') {
      return {
        mapping_id: mapping.id,
        name: mapping.name,
        source_field: mapping.source_field,
        target_field: mapping.target_field,
        break_type: 'FIELD_REMOVED',
        confidence_score: 99,
        what_changed: `CRM field 'annual_revenue' was completely removed in API v2.0.0`,
        why_affected: `The target ERP field erp.arr_amount relies on this value for financial reporting and credit score calculation. Passing null drops risk evaluation telemetry.`,
        suggested_fix: `Set fallback transform or fetch revenue from Account API endpoint:\nerp.arr_amount = payload.account_financials?.annual_revenue ?? 0;`,
        changelog_entry: `Flagged removed revenue field and inserted default fallback value transformer for ERP credit pipeline.`
      };
    }

    if (change?.type === 'TYPE_MISMATCH' || fieldName === 'account_status') {
      return {
        mapping_id: mapping.id,
        name: mapping.name,
        source_field: mapping.source_field,
        target_field: mapping.target_field,
        break_type: 'TYPE_MISMATCH',
        confidence_score: 92,
        what_changed: `CRM field 'account_status' changed from string ("ACTIVE") to nested object ({ status_code: "ACT", label: "Active" })`,
        why_affected: `The ERP system expects a flat string status code. Mapping the whole object causes '[object Object]' coercion or string validation failure in NetSuite ERP API.`,
        suggested_fix: `Update transformation path to extract sub-property:\nFROM: crm.account_status\nTO:   crm.account_status.status_code`,
        changelog_entry: `Adapted account status extractor to access nested status_code property from updated v2.0 schema object.`
      };
    }

    return {
      mapping_id: mapping.id,
      name: mapping.name,
      source_field: mapping.source_field,
      target_field: mapping.target_field,
      break_type: 'FIELD_RENAMED',
      confidence_score: 88,
      what_changed: `Source field ${mapping.source_field} modified in v2.0.0`,
      why_affected: `Field property signature drift prevents direct mapping validation.`,
      suggested_fix: `Review mapping transformation rules for ${mapping.source_field}.`,
      changelog_entry: `Updated mapping configuration for ${mapping.name}.`
    };
  });
}

app.listen(PORT, () => {
  console.log(`[Backend Server] Running on http://localhost:${PORT}`);
  console.log(`[Backend Server] API Key present: ${Boolean(process.env.XAI_API_KEY)}`);
  console.log(`[Backend Server] Target Model: ${process.env.XAI_MODEL || 'grok-2-latest'}`);
});
