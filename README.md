# Prompt Octopus 🐙
Run side-by-side prompt engineering and compare as many prompt responses as you need! Try it online at [https://promptoctopus.com](https://promptoctopus.com) or self-host.

## Self-Hosting
You'll need an OpenAI API key.
### Python
Move /assets into /python_selfhost/static

Working in /python_selfhost, run Python (ex. with Windows):
```
virtualenv .venv
.venv\scripts\activate
```

Next:
```
pip install -r requirements.txt
set FLASK_APP=python_backend.py
```
(use "export" instead of "set" on mac)

```
flask run
```

### Node.js
In the /nodejs_selfhost folder run:
```
npm init -y
npm install express cors dotenv openai@^4.0.0
```

add .env file to project directory and write 
```
OPENAI_API_KEY=your_api_key_here
```

Move the index.html file from /nodejs_selfhost into your assets folder, then move the folder into /nodejs_selfhost 
```
node node_script.js
```


