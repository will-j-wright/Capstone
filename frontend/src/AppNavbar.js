import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import SpotifyButton from './SpotifyButton';
import { Link } from 'react-router-dom';

function AppNavbar({ spotifyUser, updateSpotifyUser }) {
    return (
        <Navbar bg='dark'>
            <Container fluid>
                <Navbar.Brand as={Link} to="/">Spotify Playlist Generator</Navbar.Brand>
                <Navbar.Collapse className='justify-content-end'>
                    <SpotifyButton spotifyUser={spotifyUser} updateSpotifyUser={updateSpotifyUser} />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar