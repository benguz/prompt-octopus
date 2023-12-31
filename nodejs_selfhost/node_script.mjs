import express from 'express';
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000; // You can choose your preferred port

// app.use(cors({ origin: ['https://fix.school', 'https://doorstopeducation.org'] })); Set CORS origins
app.use(express.json()); // for parsing application/json
app.use(express.static('assets'));

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

app.post('/multiple_prompts', async (req, res) => {
    const { prompts, input } = req.body;
    let results = [];

    for (const prompt of prompts) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: input }
                ]
            });

            results.push(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error calling OpenAI:', error);
            return res.status(500).json({ message: 'Error processing request' });
        }
    }

    res.json(results);
});

// Additional route to handle the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});