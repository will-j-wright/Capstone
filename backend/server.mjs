import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

const PORT = process.env.PORT || 5000;
const FE_PORT = 3000;
const app = express();

// Load environment variables from .env file
// Requires environment variable SPOTIFY_CLIENT_ID
// and SPOTIFY_CLIENT_SECRET
dotenv.config();

var client_id = process.env.SPOTIFY_CLIENT_ID;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var redirect_uri = 'http://localhost:' + FE_PORT + '/callback';

app.use(cors());
app.use(express.json());

// Do Spotify auth token exchange
// This requires a secret so we do it on the backend
app.get('/spotify', function (req, res) {
    const code = req.query.code;
    console.log(code);
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
            console.log(response.data);
            res.send(response.data);
        })
        .catch(function (error) {
            console.log(error);
            if (error.response) {
                res.status(error.response.status).send(error.response.data);
            }
            else {
                res.status(500).send({});
            }
        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});