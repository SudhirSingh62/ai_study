# HireMe

HireMe is an AI candidate profile backed by FastAPI and Groq. The browser
client in [`frontend/`](./frontend/) lets a recruiter ask questions that are
answered from the resume parsed by [`backend/main.py`](./backend/main.py).

Before starting the API, place the candidate's resume at
`backend/SudhirSingh_Resume.pdf`. The resume and API key are intentionally
kept out of version control.

## Run locally

1. Set `GROQ_API_KEY` in `week2/hireme/.env`.
2. Start the API from this directory:

   ```bash
   uv run uvicorn backend.main:app --reload --port 8000
   ```

3. Serve the frontend from another terminal:

   ```bash
   python -m http.server 5173 --directory frontend
   ```

4. Open `http://localhost:5173`.

The frontend uses `GET /` as its health check and sends questions to
`POST /chat` as `{ "question": "..." }`. The chat endpoint responds with an
SSE stream, so answers appear progressively as the model generates them. The
API enables CORS for the local ports used above.