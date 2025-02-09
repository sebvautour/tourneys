import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoginButton from './LoginButton';

interface Props {
    tournamentName: string
    handleLogin: () => void;
    handleLogout: () => void;
    authenticated: string | null;
}

function Nav(props: Props) {
    return (
        <Box sx={{ flexGrow: 1, paddingBottom: '1em' }}>
            <AppBar position="static" color='primary' enableColorOnDark>
                <Toolbar>
                    <Box>
                        <Button variant="text" href='/' color='inherit'>Overview</Button>
                    </Box>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }} >
                        {props.tournamentName}
                    </Typography>
                    <LoginButton
                        handleLogin={props.handleLogin}
                        handleLogout={props.handleLogout}
                        authenticated={props.authenticated} />
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Nav