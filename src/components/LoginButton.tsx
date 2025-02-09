import Button from '@mui/material/Button';

type Props = {
    handleLogin: () => void;
    handleLogout: () => void;
    authenticated: string | null;
};

export default function LoginButton(props: Props) {
    return (
        <>
            <Button
                onClick={props.authenticated ? props.handleLogout : props.handleLogin}
                color='inherit'
            >
                {props.authenticated ? 'Logout' : 'Login'}
            </Button>
        </>
    )
}
