# 🤖 AI-Powered Resume Evaluator

An AI-powered resume screening tool built with **Python, Pydantic, Groq LLMs, and structured outputs**.

The project takes a **Job Description (JD)** and multiple **PDF/DOCX resumes**, extracts useful information, compares candidates against the requirements, and produces a **match score, strengths, missing skills, and hiring verdict**.

---

## 🔄 Project Flow

```text
Job Description
      ↓
JD Parsing
      ↓
Structured JD Data
      ↓
Pydantic Validation
      ↓
Resume Files
      ↓
PDF / DOCX Parsing
      ↓
Clean Resume Text
      ↓
Structured Resume Data
      ↓
Pydantic Validation
      ↓
LLM Matching
      ↓
Structured Response
      ↓
Match Score + Missing Skills + Verdict
      ↓
Candidate Ranking
      ↓
Useful Hiring Application
```

## 🎯 What This Project Does

- Takes a Job Description as input.
- Reads multiple resumes automatically.
- Supports PDF and Word (.docx) resumes.
- Extracts clean text from resumes.
- Converts unstructured text into structured information.
- Uses Pydantic models to define expected data.
- Uses Groq LLM API for intelligent extraction and matching.
- Compares candidate skills with job requirements.
- Generates a match percentage from 0-100.
- Identifies matching skills.
- Identifies missing important skills.
- Checks whether experience requirements are met.
- Generates a final hiring verdict.
- Ranks candidates from highest to lowest match.

## 🧠 Concepts Used

This project combines the concepts learned during Week 1 of the AI Engineer course.

### 1. LLM API Calls

The project uses the Groq API to communicate with an LLM.

```python
from groq import Groq

client = Groq(api_key=my_api_key)
```


The LLM is responsible for extracting information and intelligently comparing the Job Description with candidate resumes.
### 2. System Prompts
System prompts are used to control the behavior of the LLM.
Instead of simply asking:
Analyze this resume.

we provide clear instructions about:
- What information to extract.
- What format to return.
- How to evaluate the candidate.
- What fields should be included.
- How the final score should be generated.
This makes the output more predictable and useful for application logic.
### 3. Temperature = 0
For extraction and evaluation tasks, consistency is important.
Using:
```python
temperature = 0
```


helps reduce unnecessary variation in the model's responses.
For example, the same resume should ideally receive a similar evaluation when evaluated against the same Job Description.
## 🧩 Structured Output
Raw LLM output is difficult to use directly inside a real application.
For example, an LLM might return:
This candidate seems like a good fit because they have Python
experience and some knowledge of machine learning...

A program cannot reliably depend on this exact wording.
Instead, we want something like:
```json
{
    "candidate_name": "Sudhir Singh",
    "matching_skills": [
        "Python",
        "SQL",
        "Machine Learning"
    ],
    "missing_important_skills": [
        "Java",
        ".NET"
    ],
    "match_percentage": 82,
    "verdict": "Strong fit"
}
```

Now Python can easily access:
```python
result.match_percentage
result.matching_skills
result.missing_important_skills
```


This is why structured output is important in production AI applications.
## 🛡️ Pydantic
Pydantic is used to define the expected structure of the data.
Example:
```python
from pydantic import BaseModel


class Ticket(BaseModel):
      name: str
      email: str
      issue: str
```


Instead of trusting the LLM blindly, we define what the output should look like.
Pydantic helps with:
- Data validation
- Type checking
- Structured data
- Reliable application logic
In this project, Pydantic models are used for structured Job Description and resume information.
## 📄 Resume Parsing
The project supports resumes in:
- PDF
- DOCX

The basic pipeline is:
Resume File
     ↓
File Parser
     ↓
Extract Text
     ↓
Clean Text
     ↓
Send to LLM
     ↓
Structured Resume Data

For PDF files, text can be extracted using libraries such as:
```python
from pypdf import PdfReader
```


For Word documents, the document content can be extracted and converted into plain text.
Tables are also considered because resumes frequently contain information inside tables.

## 📝 Job Description Processing
The Job Description is also converted into structured information.
For example:
Required Skills:
Python
Java
SQL
Machine Learning
AI
.NET

can be converted into structured data.
This makes it easier to compare the requirements against candidate information.

## 🤖 LLM Matching
After processing both inputs:
Job Description
       +
Candidate Resume
       ↓
      LLM
       ↓
Candidate Evaluation

The LLM determines:
- Matching skills
- Missing skills
- Experience requirement
- Overall match percentage
- Final verdict
- Reasoning

## 📊 Candidate Scoring
Each candidate receives a score between:
0 - 100

For example:
Sudhir Singh      - 82%
ASHER MUSTAFA     - 78%
Gaurav Singh      - 45%
Utkarsh           - 34%

The candidates can then be ranked based on their scores.

## 🏆 Example Output
TOP 2 CANDIDATES

Sudhir Singh - 82%

```python
{
    'candidate_name': 'Sudhir Singh',
    'matching_skills': [
        'Artificial Intelligence',
        'Machine Learning',
        'Large Language Models',
        'Python',
        'C',
        'SQL',
        'AWS Cloud',
        'Google Cloud',
        'Prompt engineering',
        'Git/GitHub'
    ],
    'missing_important_skills': [
        'Java',
        '.NET'
    ],
    'experience_requirement_met': True,
    'overall_match_percentage': 82,
    'final_verdict': 'Strong fit for the role with most required skills covered.'
}
```

Another candidate might receive:
Gaurav Singh - 45%

because several important requirements are missing.

## 🔍 Important Design Principle
The LLM should not directly control the entire application.
A better architecture is:
```text
User Input
    ↓
Parser
    ↓
Structured Data
    ↓
Validation
    ↓
LLM
    ↓
Structured Response
    ↓
Validation
    ↓
Business Logic
    ↓
Final Result
```

The LLM is responsible for the intelligent part.
Python handles the application logic.
Pydantic helps ensure that the data has the expected structure.

## 💰 Token Awareness
LLM APIs charge based on tokens.
The project can therefore be optimized by:
- Sending only relevant resume content.
- Avoiding unnecessary repeated prompts.
- Keeping system prompts concise.
- Processing only required information.
- Choosing an appropriate model.
- Controlling output length.
For a production system, token usage should always be considered because thousands of resumes can result in significant API usage.

## ⚡ Rate Limiting
When processing multiple resumes, making API requests too quickly can cause rate-limit problems.
A simple approach is to add a delay between requests:
```python
import time

time.sleep(...)
```


This is useful when processing a batch of candidates.

## 📚 Complete Pipeline
The complete project can be understood as:
```text
                    ┌─────────────────┐
                    │  Job Description│
                    └────────┬────────┘
                             ↓
                       JD Extraction
                             ↓
                    ┌─────────────────┐
                    │ Structured JD   │
                    │      Data       │
                    └────────┬────────┘
                             ↓
                       Pydantic
                       Validation
                             ↓
┌───────────────┐      ┌─────────────────┐
│ PDF Resume    │ ───→ │                 │
└───────────────┘      │ Resume Parsing  │
                       │                 │
┌───────────────┐      │                 │
│ DOCX Resume   │ ───→ │                 │
└───────────────┘      └────────┬────────┘
                                ↓
                         Resume Text
                                ↓
                         LLM Extraction
                                ↓
                       Structured Resume
                                ↓
                          Pydantic
                          Validation
                                ↓
                     ┌──────────────────┐
                     │   LLM Matching   │
                     └────────┬─────────┘
                              ↓
                     Candidate Evaluation
                              ↓
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
        Match Score     Missing Skills    Verdict
              ↓               ↓               ↓
              └───────────────┼───────────────┘
                              ↓
                     Candidate Ranking
                              ↓
                       Hiring Decision
```

## 🛠️ Tech Stack
- Python
- Groq API
- Pydantic
- JSON
- PDF parsing
- DOCX parsing
- uv
- Python-dotenv
- LLM-based evaluation

## 📁 Project Structure
```text
day5/
│
├── README.md
│
├── resume_parser.py
│
├── pyproject.toml
│
├── resumes/
│   ├── candidate1.pdf
│   ├── candidate2.pdf
│   ├── candidate3.pdf
│   └── ...
│
└── src/
    └── day5/
        └── __init__.py
```

## 🔐 Environment Variables
Create a .env file:
```env
GROQ_API_KEY=your_api_key_here
```

Never commit your API key to GitHub.
Make sure .env is included in .gitignore.
Example:
```gitignore
.env
.venv/
__pycache__/
*.pyc
```

## ▶️ Running the Project
Create the environment:
```bash
uv venv --python 3.11
```

Activate it:
```bash
source .venv/bin/activate
```

Install dependencies:
```bash
uv add groq python-dotenv pypdf python-docx pydantic
```

Run the project:
```bash
uv run resume_parser.py
```

## 🎯 Real-World Use Case
This project can be used as a basic AI-powered recruitment screening system.
A recruiter provides:
Job Description
+
Multiple Candidate Resumes

The system produces:
Candidate
     ↓
Skills
     ↓
Missing Skills
     ↓
Experience Check
     ↓
Match Score
     ↓
Hiring Verdict

This can help recruiters quickly identify candidates who are more aligned with a particular role.
## 🚀 Future Improvements
Possible improvements include:
- Build a web UI using Streamlit.
- Upload resumes directly from the browser.
- Upload a Job Description through the UI.
- Show candidate scores using charts.
- Add candidate filtering.
- Add resume ranking.
- Add downloadable reports.
- Store candidate results in a database.
- Add authentication.
- Add caching to reduce API costs.
- Add RAG for company-specific hiring requirements.
- Add recruiter feedback loops.
- Improve scoring with deterministic rules.
- Add batch processing.
- Add explainable scoring.
- Deploy the application.
## 💼 Resume Project Description
AI-Powered Resume-JD Matcher
Built an AI-powered resume evaluation system using Python, Pydantic, and Groq LLMs that parses PDF/DOCX resumes, extracts structured candidate information, compares candidates against job requirements, generates 0-100 match scores, identifies missing skills, and ranks candidates based on overall suitability.
## 🧠 Interview Explanation
If an interviewer asks:
"Explain your project."
A good answer:
I built an AI-powered resume evaluator that takes a Job Description and multiple candidate resumes as input. I first parse PDF and DOCX resumes into clean text. Then I use Pydantic schemas and an LLM to convert the unstructured information into structured data. After that, I compare the candidate's skills and experience against the Job Description using an LLM and generate a match score, missing skills, and a hiring verdict. Finally, I rank the candidates based on their scores.
The main reason I used structured output and Pydantic was reliability. Raw LLM text is difficult for application code to consume, so I wanted predictable fields that could be validated and passed into downstream business logic.

## ❓ Why Not Just Ask the LLM to Rank Resumes?
Because a production application needs more than a paragraph of text.
We need predictable information such as:
candidate_name
matching_skills
missing_skills
experience_requirement_met
match_percentage
verdict

Structured output makes the result easier to:
- Validate
- Store
- Search
- Sort
- Display
- Pass to another service
- Use in business logic
## 🎤 Key Interview Takeaways
Raw Text
LLMs naturally return text.
Text is flexible for humans but difficult for deterministic application logic.
JSON
JSON gives us a predictable data format.
Pydantic
Pydantic lets us define and validate the expected structure.
Temperature
For extraction and evaluation tasks, lower temperature, especially 0, helps produce more consistent results.
Tokens
Tokens affect API cost and response limits.
Efficient prompting and avoiding unnecessary input can reduce cost.
Rate Limiting
Batch processing many resumes requires controlling request frequency to avoid API rate limits.
LLM
The LLM provides semantic understanding and intelligent matching.
Python
Python controls the application logic and workflow.
## 🏁 Final Architecture
Documents
   ↓
Parsing
   ↓
Structured Data
   ↓
Validation
   ↓
LLM
   ↓
Structured Response
   ↓
Business Logic
   ↓
Useful Application

This project represents the complete Week 1 AI Engineer workflow:
LLM API
   ↓
Prompt Engineering
   ↓
Token Awareness
   ↓
Structured Outputs
   ↓
Pydantic Validation
   ↓
Real AI Application

## 👨‍💻 Author
Sudhir Singh
B.Tech CSE