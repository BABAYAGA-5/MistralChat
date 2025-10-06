from datetime import datetime
import requests
from django.conf import settings

MISTRAL_API_KEY = settings.MISTRAL_API_KEY
API_URL = settings.API_URL
MAX_TOKENS = settings.MAX_TOKENS
MAX_TOKENS_TITLE = settings.MAX_TOKENS_TITLE
TEMPERATURE = settings.TEMPERATURE
TEMPERATURE_TITLE = settings.TEMPERATURE_TITLE

def send_message(messages, model="mistral-small-latest"):
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": [{"role": "system", "content": "You are a helpful assistant."}] + messages,
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"], datetime.now().isoformat()
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")

def get_title(message, model="mistral-small-latest"):
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }
    prompt = "Generate a concise title for the following conversation:\n"

    payload = {
        "model": model,
        "messages": [{"role": "system", "content": prompt},
                     {"role": "user", "content": message}],

        "temperature": TEMPERATURE_TITLE,
        "max_tokens": MAX_TOKENS_TITLE
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        title = response.json()["choices"][0]["message"]["content"]
        # Strip surrounding quotes if present
        title = title.strip().strip('"').strip("'")
        return title
    else:
        raise Exception(f"Error {response.status_code}: {response.text}")