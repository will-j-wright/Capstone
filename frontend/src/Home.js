import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState } from 'react';
import SongTable from './SongTable';
import './Home.css';

function SubmitButton({ loading }) {
    if (loading) {
        return (
            <Button variant="primary" type="submit" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                &nbsp;Creating...
            </Button>
        )
    }
    else {
        return (
            <Button variant="primary" type="submit">
                Create
            </Button>
        )
    }
}

function Home({ spotifyUser, updateSpotifyUser }) {

    const [prompt, setPrompt] = useState('');
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableKey, setTableKey] = useState(0);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        setLoading(true);
        fetch("http://localhost:5000/openai", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: form.prompt.value,
                numSongs: form.numSongs.value
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPrompt(form.prompt.value);
                setSongs(data);
                setLoading(false);
                setTableKey(tableKey + 1);
            });
    };

    if (!spotifyUser) return (
        <div className='welcome-container'>
            <Container className='container-fluid bg-light text-dark p-5 rounded'>
                <h2 className='fw-bold'>Spotify Playlist Generator</h2>
                <br />
                <p>Welcome to Spotify Playlist Generator! To get started, Log in with Spotify in the top right corner!</p>
            </Container>
        </div>
    )

    return (
        <div className='welcome-container'>
            <Container className='container-fluid bg-light text-dark p-5 rounded text-center' data-bs-theme="light">
                <h2 className='fw-bold'>Hello, {spotifyUser.name}!</h2>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="prompt" >
                                <Form.Control required type="text" className='text-center' placeholder="Enter an idea for a playlist" />
                                <Form.Control.Feedback type="invalid">Enter a prompt</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs={2}>
                            <Form.Group className="mb-3" controlId="numSongs" >
                                <Form.Control required type="number" className='text-center' min={1} max={20} placeholder="# of songs" />
                                <Form.Control.Feedback type="invalid">Enter a number between 1 and 20</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <SubmitButton loading={loading}>
                            Create
                        </SubmitButton>
                    </Row>
                </Form>
                <br />
                <SongTable key={tableKey} songs={songs} spotifyUser={spotifyUser} prompt={prompt} />
            </Container>
        </div>
    )
}

export default Home;