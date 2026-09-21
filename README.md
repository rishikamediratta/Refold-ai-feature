# Schema-Change Impact Agent 🚀

A single-page React application and Express backend demonstrating how an AI agent detects integration breakages caused by API/schema drift, isolates affected mappings, and uses **xAI's Grok API** to synthesize remediation strategies.

---

## 🌟 Key Features

1. **Autonomous Schema Drift Detection**: Compares baseline `old_schema.json` vs drifted `new_schema.json` (detects removed fields, renamed fields, and type mismatches).
2. **Selective Payload Filtering**: Cross-references detected changes against `mapping_config.json` to filter out healthy mappings and send **ONLY** affected endpoints to the AI backend.
3. **Grok API Integration**: Backend (`POST /api/analyze`) calls xAI's OpenAI-compatible Grok API (`https://api.x.ai/v1/chat/completions`) using standard `XAI_API_KEY` and `XAI_MODEL` environment variables.
4. **Structured Impact Dashboard**: Displays cards for each affected mapping with:
   - Break Type badge (Field Removed, Field Renamed, Type Mismatch)
   - Confidence score percentage
   - What Changed in API payload
   - Why Integration Breaks
   - Suggested Remediation Fix snippet (with copy button)
   - Release note / Changelog summary
5. **Resilient Fallback Mode**: If `XAI_API_KEY` is not present in `.env`, the backend provides fallback synthesis so the application works seamlessly out-of-the-box for quick demonstration.

---

## 🛠️ Project Structure

```
├── data/
│   ├── old_schema.json         # Mock CRM Contact object v1.0.0
│   ├── new_schema.json         # Mock CRM Contact object v2.0.0 (with intentional breaking changes)
│   └── mapping_config.json     # Integration mappings between CRM & ERP
├── server/
│   └── index.js                # Express backend server (POST /api/analyze)
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Header with status badges & Grok trigger
│   │   ├── StatsOverview.jsx   # Stat counters (Total, Affected, Critical, Healthy)
│   │   ├── SchemaDiffView.jsx  # Side-by-side JSON schema diff visualizer
│   │   ├── ImpactCard.jsx      # Detailed card for each affected mapping
│   │   ├── HealthyMappingsView.jsx # Table of unaffected integration nodes
│   │   └── ApiKeyWarningBanner.jsx # Warning banner for missing API key
│   ├── utils/
│   │   └── schemaDiff.js       # JS diff engine for detecting schema drift
│   ├── App.jsx                 # Dashboard container & state orchestrator
│   ├── index.css               # Styling & Tailwind CSS setup
│   └── main.jsx                # React root
├── .env.example                # Template for environment variables
├── .gitignore                  # Ignores .env and build files
├── package.json                # Dependencies and scripts
└── vite.config.js              # Vite config with server proxy
```

---

## 🚦 Quick Start Guide

### 1. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and add your Grok API key:

```env
XAI_API_KEY=your_actual_xai_api_key_here
XAI_MODEL=grok-2-latest
PORT=3001
```

### 2. Install Dependencies

```bash
cmd /c npm install
```

### 3. Run Application

Run both the backend server and frontend development server concurrently:

```bash
cmd /c npm run dev
```

- **Frontend Dashboard**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

Alternatively, you can run them in separate terminals:

**Terminal 1 (Backend):**
```bash
cmd /c npm run server
```

**Terminal 2 (Frontend):**
```bash
cmd /c npm run client
```

---

## 🔒 Security Note

- The `XAI_API_KEY` is kept **strictly server-side** in Node.js / Express.
- The frontend React app never accesses or exposes the API key.
- `.env` is included in `.gitignore` and is never committed.
