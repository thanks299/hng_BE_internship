# Gender Classifier API

A production-ready REST API built with **Node.js (ES Modules) + Express** that classifies the gender of a given name via [Genderize.io](https://genderize.io), enriched with confidence metadata.

---

## Project Structure

```
gender-classifier-api/
├── src/
│   ├── middleware/
│   │   ├── cors.js             # CORS headers + OPTIONS preflight
│   │   └── errorHandler.js     # Global Express error handler
│   ├── routes/
│   │   └── classify.js         # GET /api/classify — validation & response shaping
│   ├── services/
│   │   └── genderize.js        # Axios wrapper for the Genderize.io API
│   ├── utils/
│   │   └── response.js         # sendError() helper
│   ├── config.js               # PORT, URLs, timeout constants
│   ├── app.js                  # Express app factory (no listen — testable)
│   └── server.js               # Entry point — calls app.listen()
├── tests/
│   └── classify.test.js        # Jest + Supertest suite (11 tests)
├── package.json
└── README.md
```

---

## Requirements

| Tool    | Version |
|---------|---------|
| Node.js | ≥ 18.x  |
| npm     | ≥ 9.x   |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start (production)
npm start

# Start (dev — auto-restarts on file change, no extra deps)
npm run dev
```

Server listens on **http://localhost:3000** by default.  
Override with `PORT=8080 npm start`.

---

## Running Tests

```bash
npm test
```

Uses **Jest** + **Supertest** + **axios-mock-adapter** — no live network required.

---

## API Reference

### `GET /api/classify?name={name}`

#### Success `200`

```json
{
  "status": "success",
  "data": {
    "name": "james",
    "gender": "male",
    "probability": 0.95,
    "sample_size": 144369,
    "is_confident": true,
    "processed_at": "2024-11-01T12:34:56.789Z"
  }
}
```

| Field          | Description                                                           |
|----------------|-----------------------------------------------------------------------|
| `sample_size`  | Record count from Genderize (renamed from `count`).                  |
| `is_confident` | `true` only if `probability >= 0.7` **AND** `sample_size >= 100`.    |
| `processed_at` | UTC timestamp (ISO 8601) of when this server processed the request.  |

#### Errors — all follow `{ "status": "error", "message": "..." }`

| Status | Condition                                              |
|--------|--------------------------------------------------------|
| `400`  | `name` is missing or empty.                            |
| `422`  | `name` supplied more than once (array).                |
| `404`  | Genderize returned `gender: null` or `count: 0`.       |
| `502`  | Genderize API returned a non-2xx status.               |
| `504`  | Request to Genderize API timed out.                    |
| `500`  | Unexpected internal error.                             |

#### Example

```bash
curl "http://localhost:3000/api/classify?name=james"
```
