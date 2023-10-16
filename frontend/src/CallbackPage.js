import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SpotifyToken } from "./App";

const successMessage = 'Successfully loaded Spotify details';
const failureMessage = 'Failed to load Spotify details';

const backendURL = process.env.REACT_APP_BACKEND;

function CallbackPage({ updateSpotifyUser }) {
    const [params] = useSearchParams();

    const [loadingMessage, setLoadingMessage] = useState('Loading Spotify details...');

    // The auth transaction happens on the backend because
    // we need to keep the client secret secret.
    useEffect(() => {
        if (params.get('error')) {
            console.log(params.get('error'));
            setLoadingMessage(failureMessage);
            return;
        }
        fetch(backendURL + '/spotify?code=' + params.get('code'))
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setLoadingMessage(failureMessage);
                    updateSpotifyUser(null);
                }
                else {
                    setLoadingMessage(successMessage);
                    updateSpotifyUser(new SpotifyToken(data.access_token, Date.now() + data.expires_in * 1000));
                }
            })
    }, []);
    return (
        <div>
            <h1>{loadingMessage}.</h1>
        </div>
    );
}

export default CallbackPage;