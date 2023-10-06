// This component is either a button that says "Login to Spotify" or "Logged in to Spotify as {username}" depending on whether the user is logged in or not.

import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useEffect, useState } from "react";

const client_id = '0d7a966720dc443bbe32df982b3cfb9a'; // This is not a secret, it will be passed in the URI to Spotify
const redirect_uri = 'http://localhost:3000/callback';

const logInMessage = 'Login to Spotify';
const logOutMessage = 'Log out'

// When the user clicks the button, redirect them to Spotify to log in
// This will redirect them back to the callback page
function spotifyLogin() {
    var scope = 'user-read-private user-read-email';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function spotifyLogout(updateSpotifyToken) {
    //TODO: Logout
}

function SpotifyButton({ spotifyToken, updateSpotifyToken }) {

    const [photoURI, setPhotoURI] = useState(null);

    useEffect(() => {
        if (spotifyToken) {
            fetch("https://api.spotify.com/v1/me", {
                headers: {
                    "Authorization": "Bearer " + spotifyToken.token
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data && !data.error) {
                        setPhotoURI(data.images[0].url);
                    };
                });
        }
    }, [spotifyToken]);

    if (spotifyToken) {
        return (
            <Button variant="danger" onClick={() => spotifyLogout(updateSpotifyToken)}>
                <Image src={photoURI} className="mr-2" roundedCircle width="30" height="30" style={{ marginRight: '10px' }} />
                <span>{logOutMessage}</span>
            </Button>
        )
    }
    else {
        return (
            <Button variant="success" onClick={spotifyLogin}>{logInMessage}</Button>
        );
    }
}

export default SpotifyButton;

