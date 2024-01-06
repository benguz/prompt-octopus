from flask import Flask, request, flash, redirect, url_for, session, render_template, abort, jsonify
import openai
import json
import requests
import os
import asyncio
import aiohttp

app = Flask(__name__)
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

@app.route('/')
def hello_world():
    return render_template('index.html')

async def fetch_completion(session, model_name, prompt, input_chat):
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": input_chat}
        ]
    }
    async with session.post("https://api.openai.com/v1/chat/completions", json=payload) as response:
        result = await response.json()
        return result['choices'][0]['message']['content']

async def multiple_prompts():
    data = request.get_json()

    # Extract 'prompts' and 'inputChat' from the received data
    prompts = data.get('prompts', [])
    input_chat = data.get('input', '')
    model_name= data.get('model', 'gpt-3.5-turbo')

    # add typing during response https://platform.openai.com/docs/api-reference/streaming#chat/create-stream
    # add multiple models

    async with aiohttp.ClientSession(headers={"Authorization": f"Bearer {OPENAI_API_KEY}"}) as session:
        tasks = [fetch_completion(session, model_name, prompt, input_chat) for prompt in prompts]
        results = await asyncio.gather(*tasks)

    return jsonify(results), 200

@app.route('/multiple_prompts', methods=['POST'])
def handle_request():
    return asyncio.run(multiple_prompts())