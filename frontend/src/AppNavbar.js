import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import SpotifyButton from './SpotifyButton';
import { Link } from 'react-router-dom';

function AppNavbar({ spotifyUser, updateSpotifyUser }) {
    if (spotifyUser)
        return (
            <Navbar bg='dark'>
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">Spotify Playlist Generator</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/history">History</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className='justify-content-end'>
                        <SpotifyButton spotifyUser={spotifyUser} updateSpotifyUser={updateSpotifyUser} />
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    else
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