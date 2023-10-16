import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";



function SongTable({ songs, spotifyUser, prompt }) {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [playlistLink, setPlaylistLink] = useState(null);

    function openPlaylistLink() {
        window.open(playlistLink, "_blank");
    }

    function AddButton() {
        if (loading) {
            return (
                <Button variant="success" type="primary" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    &nbsp;Adding...
                </Button>
            )
        }
        else if (success) {
            return (
                <Button variant="success" type="primary" onClick={openPlaylistLink}>
                    Go to playlist
                </Button>
            )
        }
        else if (error) {
            return (
                <Button variant="error" type="primary" disabled>
                    Error when adding songs :(
                </Button>
            )
        }
        else {
            return (
                <Button variant="success" type="submit" onClick={handleSubmit}>
                    Add to Spotify
                </Button>
            )
        }
    }

    useEffect(() => {
        setLoading(false);
        setSuccess(false);
        setError(false);
    }, [setLoading, setSuccess, setError])

    const handleSubmit = async (event) => {
        setLoading(true);

        // Create the playlist
        fetch("https://api.spotify.com/v1/users/" + spotifyUser.id + "/playlists", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + spotifyUser.token
            },
            body: JSON.stringify({
                name: prompt
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const playlistID = data.id;
                const playlistURL = data.external_urls.spotify;
                const promises = [];
                const songURIs = [];
                for (const song of songs) {
                    const s = song.split('$|$');
                    const songName = s[0];
                    const artistName = s[1];

                    // Search for each song and add it to the promises list
                    // Below line produces strange results sometimes
                    // promises.push(fetch("https://api.spotify.com/v1/search?q=:" + songName + "artist:" + artistName + "&type=track&limit=1", {
                    promises.push(fetch("https://api.spotify.com/v1/search?q=:" + songName + " " + artistName + "&type=track&limit=1", {
                        headers: {
                            Authorization: "Bearer " + spotifyUser.token
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            if (data.tracks.items.length > 0) {
                                songURIs.push(data.tracks.items[0].uri);
                            }
                            else {
                                console.log("Could not find song " + songName + " by " + artistName);
                            }
                        }));
                }

                // Await all the search promises, then add the songs to the playlist
                Promise.all(promises).then(() => {
                    if (songURIs.length !== 0) {
                        fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + spotifyUser.token
                            },
                            body: JSON.stringify({
                                uris: songURIs
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                                setLoading(false);
                                setSuccess(true);
                                setPlaylistLink(playlistURL);
                            })
                            .catch(error => {
                                console.log("Error when adding songs to playlist");
                                console.log(error);
                                setError(true);
                            });
                    }
                });
            })
            .catch(error => {
                console.log("Error when creating playlist");
                console.log(error);
                setError(true);
            });
    };

    if (songs.length === 0) {
        return <></>;
    }
    const songMap = songs.map((song, index) => {
        const s = song.split('$|$');
        return (
            <tr key={index}>
                <td>{s[0]}</td>
                <td>{s[1]}</td>
            </tr>
        )
    });
    return (
        <div>
            <div className="overflow-auto" style={{ maxHeight: "25vh" }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th scope='col'>Song Name</th>
                            <th scope='col'>Artist</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songMap}
                    </tbody>
                </Table>
            </div>
            <br />
            <AddButton loading={loading} onClick={handleSubmit} success={success} error={error} />
        </div>
    )
}

export default SongTable;