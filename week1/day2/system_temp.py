import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
my_api_key=os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key kaha hai bhai")

client=Groq(api_key=my_api_key)

model = "openai/gpt-oss-120b"
role="user"
# prompt="i love you babu"
prompt = "suggest me the name for my new startup which is related to AI and ML and also suggest me the domain name for that startup. only 1 name and 1 domain name"
# message me role and content

message_system ={
    "role": "system",
    # "content": "You are a my girlfriend and so much loving."
    # "content": "you are my office colleague and you are also my manager."
    "content": "You are a startup name generator and domain name generator. You will suggest me the name for my new startup which is related to AI and ML and also suggest me the domain name for that startup."
}

message={
    "role": role,
    "content": prompt
}

messages=[message_system, message]

response=client.chat.completions.create(model=model, messages=messages,temperature=2)
print(response)

print("#######################################")

answer=response.choices[0].message.content
print(answer)