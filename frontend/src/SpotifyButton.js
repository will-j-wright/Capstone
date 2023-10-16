// This component is either a button that says "Login to Spotify" or "Logged in to Spotify as {username}" depending on whether the user is logged in or not.

import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const client_id = '0d7a966720dc443bbe32df982b3cfb9a'; // This is not a secret, it will be passed in the URI to Spotify
const redirect_uri = 'http://localhost:3000/callback';

const logInMessage = 'Login to Spotify';
const logOutMessage = 'Log out'

// When the user clicks the button, redirect them to Spotify to log in
// This will redirect them back to the callback page
function spotifyLogin() {
    var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function spotifyLogout(updateSpotifyUser) {
    //TODO: Logout
}

function SpotifyButton({ spotifyUser, updateSpotifyUser }) {

    const [photoURI, setPhotoURI] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        if (spotifyUser) {
            fetch("https://api.spotify.com/v1/me", {
                headers: {
                    "Authorization": "Bearer " + spotifyUser.token
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data && !data.error) {
                        setPhotoURI(data.images[0].url);
                        var u = spotifyUser;
                        u.name = data.display_name;
                        u.id = data.id;
                        u.photoURI = data.images[0].url;
                        updateSpotifyUser(u);
                        nav('/');
                    };
                });
        }
    }, [spotifyUser, updateSpotifyUser, nav]);

    if (spotifyUser) {
        return (
            <Button variant="danger" onClick={() => spotifyLogout(updateSpotifyUser)}>
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

