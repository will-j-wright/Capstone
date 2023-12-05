import './History.css';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from "react";
import SongTable from './SongTable';

class Playlist {
    constructor(name, songs, date) {
        this.name = name;
        this.songs = songs;
        this.date = date;
    }
}

function History({ spotifyUser }) {

    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (playlists.length === 0) {
            fetch(process.env.REACT_APP_BACKEND + "/history?id=" + spotifyUser.id)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data && data.length > 0) {
                        setPlaylists(data.map(e => new Playlist(e.name, e.songs, e.date)));
                    }
                });
        }
    });

    if (playlists.length > 0) {
        return (
            <div className='history-container'>
                <Container className='justify-content-md-center' data-bs-theme="light">
                    <Row xs={1} sm={2} md={3}>
                        {playlists.map((e, i) => {
                            return (
                                <Col key={i}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title tag="h5" className='d-flex justify-content-center'>{e.name}</Card.Title>
                                            <Row>
                                                <Col>
                                                    <Card.Subtitle tag="h6" className="mb-2 text-muted">{new Date(e.date).toLocaleDateString()}</Card.Subtitle>
                                                </Col>
                                                <Col className='d-flex justify-content-end'>
                                                    <Card.Subtitle tag="h6" className="mb-2 text-muted justify-content-end">{e.songs.length} songs</Card.Subtitle>
                                                </Col>
                                            </Row>
                                            <SongTable songs={e.songs} spotifyUser={spotifyUser} prompt={e.name} />
                                        </Card.Body>
                                    </Card>
                                    <br />
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </div>
        )
    }
    else {
        return (
            <div className='welcome-container'>
                <Container className='container-fluid bg-light text-dark p-5 rounded text-center' data-bs-theme="light">
                    <h2 className='fw-bold'>Hello, {spotifyUser.name}!</h2>
                    <p>It looks like you don't have any history yet. To get started, head back to the home page!</p>
                </Container>
            </div>
        )
    }
}

export default History