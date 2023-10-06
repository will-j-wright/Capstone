import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SpotifyToken } from "./App";

const successMessage = 'Successfully loaded Spotify details';
const failureMessage = 'Failed to load Spotify details';

function CallbackPage({ updateSpotifyToken }) {
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
        fetch('http://localhost:5000/spotify?code=' + params.get('code'))
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setLoadingMessage(failureMessage);
                    updateSpotifyToken(null);
                }
                else {
                    setLoadingMessage(successMessage);
                    updateSpotifyToken(new SpotifyToken(data.access_token, Date.now() + data.expires_in * 1000));
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