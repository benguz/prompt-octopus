# Prompt Octopus 🐙
Run side-by-side prompt engineering and compare as many prompt responses as you need! Try it online at [https://promptoctopus.com](https://promptoctopus.com) or self-host.

## Self-Hosting
You'll need an OpenAI API key.
### Python
Move /assets into /python_selfhost/static
```
mv assets python_selfhost/static
```

Working in /python_selfhost, run Python (ex. with Windows):
```
pip install virtualenv
virtualenv .venv # or python -m venv .venv
.venv\scripts\activate
# source .venv/bin/activate for mac/unix
```

Next:
```
pip install -r requirements.txt
set FLASK_APP=app.py
```
(use "export" instead of "set" on mac)

create a .env file in /python_selfhost and add:
```
OPENAI_API_KEY='your-api-key-here'
```

You're ready to go! Run: 
```
python -m flask run
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
mv index.html assets
mv assets nodejs_selfhost

node node_script.js
```

## As seen on...
<a href="https://theresanaiforthat.com/ai/prompt-octopus/?ref=featured&v=777588" target="_blank"><img width="300" src="https://media.theresanaiforthat.com/featured3.png"></a>
