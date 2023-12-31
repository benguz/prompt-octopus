from flask import Flask, request, flash, redirect, url_for, session, render_template, abort, jsonify
import openai
import json
import requests
import os
from flask_cors import cross_origin

app = Flask(__name__)
openai.api_key = os.environ.get('OPENAI_API_KEY')

@app.route('/')
def hello_world():
    return render_template('index.html')

# @cross_origin(origins=['https://fix.school', 'https://doorstopeducation.org', 'https://doorstoped.org', 'https://doorstopped.org', 'https://testing.fix.school'])
@app.route('/multiple_prompts', methods=['POST'])
def multiple_prompts():
    data = request.get_json()

    # Extract 'prompts' and 'inputChat' from the received data
    prompts = data.get('prompts', [])
    input_chat = data.get('input', '')
    model_name= data.get('input', 'gpt-3.5-turbo')

    # add typing during response https://platform.openai.com/docs/api-reference/streaming#chat/create-stream
    # add multiple models

    results = []

    for prompt in prompts:
        completion = openai.ChatCompletion.create(
            model=model_name,
            messages= [
                {"role": "system", "content": prompt},
                {"role": "user", "content": input_chat}
            ]
        )
        results.append(completion.choices[0].message.content)

    return jsonify(results), 200