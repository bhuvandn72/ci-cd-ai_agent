## Autonomous CI/CD Healing Agent

Autonomous DevOps agent for CI/CD failure detection, repair, and validation with a React dashboard.

## Repository Structure

```
autonomous-cicd-agent/
├── backend/
├── frontend/
├── docker/
├── sample_project/
└── README.md
```

## Tech Stack

- Backend: FastAPI, Python
- Frontend: React
- Runtime Isolation: Docker
- Git Automation: GitPython
- Optional LLM Fixing: OpenAI API

## Backend Architecture

- `services/git_service.py`: clone, branch creation, commit, push
- `docker_runner.py`: dockerized pytest runs and structured test output
- `classifier.py`: regex extraction and bug type classification
- `fixer.py`: deterministic fix engine + optional LLM logic fixer
- `agents/iteration_controller.py`: retry loop, fix application, scoring, timeline
- `services/scoring.py`: score computation
- `results.json`: final run output for frontend consumption

## Supported Bug Types

- `LINTING`
- `SYNTAX`
- `INDENTATION`
- `IMPORT`
- `TYPE_ERROR` (classified)
- `LOGIC` (LLM path)

## Setup

### Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend API docs:

- `http://127.0.0.1:8000/docs`

Optional environment variables:

- `OPENAI_API_KEY`: required only for `LOGIC` bug fixing
- `OPENAI_MODEL`: optional model override (default: `gpt-4.1-mini`)
- `MAX_RETRIES`: retry loop limit (default: `5`)

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend default URL:

- `http://127.0.0.1:3000`

## API Usage

`POST /run-agent`

Request body:

```json
{
  "repo_url": "https://github.com/owner/repo.git",
  "team_name": "My Team",
  "leader_name": "Leader Name"
}
```

The endpoint returns the run payload and writes `backend/results.json`.

## results.json Output

Key output fields:

- `branch_name`
- `ci_status`
- `iterations`
- `commits`
- `score`
- `fixes`
- `timeline`
- `test_result`

## Branch and Commit Rules

- Branch format: `TEAM_NAME_LEADER_NAME_AI_Fix`
- Commit prefix: `[AI-AGENT]`
- Fixes are pushed to the AI branch, not main

## Known Limitations

- If the target repository has no pytest-discoverable tests, run status is `no_tests`.
- LLM-based logic fixing requires a valid OpenAI API key.
- Deterministic fixes are intentionally narrow and pattern-based.

## Team

- Add team members here

## Deployment

- Frontend URL: add deployed URL
- Backend URL: add deployed URL
- Demo Video URL: add LinkedIn demo URL
