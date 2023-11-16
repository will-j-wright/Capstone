import './load_env.mjs';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import OpenAI from 'openai';
import fs from 'fs';
import db from './db_conn.mjs';

const PORT = process.env.PORT || 5000;
const FE_PORT = 3000;
const app = express();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const frontendURL = process.env.REACT_APP_FRONTEND;
const redirect_uri = frontendURL + '/callback';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

var promptTemplate = fs.readFileSync('prompt.txt', 'utf8');

app.use(cors());
app.use(express.json());

// Do Spotify auth token exchange
// This requires a secret so we do it on the backend
app.get('/spotify', function (req, res) {
    const code = req.query.code;
    if (!code) {
        res.status(400).send({});
        return;
    }

    // Make request to Spotify endpoint for auth token
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }
    const body = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret
    }

    axios.post('https://accounts.spotify.com/api/token', body, options)
        .then(function (response) {
            res.send(response.data);
        })
        .catch(function (error) {
            console.log("Error when exchanging auth code for token");
            if (error.response) {
                res.status(error.response.status).send(error.response.data);
                console.log(error.response.data);
            }
            else {
                res.status(500).send({});
            }
        });
});

app.get('/history', async (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.status(400).send({});
        return;
    }

    // Get the user's history and sort it by most recent, then take the first 10
    const coll = db.collection('histories');
    const hist = await coll.find({ id: id }, { sort: { _id: -1 }, projection: { _id: 0 } }).limit(10).toArray();
    res.send(hist);
});

app.post('/history', async (req, res) => {
    const userID = req.body.id;
    const name = req.body.name;
    const songs = req.body.songs;
    const date = new Date();

    if (!name || !songs) {
        res.status(400).send({});
        return;
    }

    const hist = { id: userID, name: name, songs: songs, date: date };
    db.collection('histories').insertOne(hist);

    res.send({});
});

async function queryOpenAI(userPrompt, numSongs) {
    const prompt = promptTemplate.replace('{NUM}', numSongs).replace('{PROMPT}', userPrompt);
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4',
        n: 1,
    });
    if (chatCompletion.choices)
        return chatCompletion.choices[0].message.content;
    else
        return "";
}

app.post('/openai', async function (req, res) {
    const userPrompt = req.body.prompt;
    const numSongs = req.body.numSongs;

    if (!userPrompt || !numSongs) {
        res.status(400).send({});
        return;
    }

    var completion;
    do {
        console.log("Querying OpenAI");
        completion = await queryOpenAI(userPrompt, numSongs);
        console.log("Got response from OpenAI, " + completion.split('\n').length + " lines");
    } while (!completion.includes("$|$") || completion.split('\n').length != numSongs); // Ensure the prompt follows our rules

    res.send(completion.split('\n'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});