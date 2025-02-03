import Grid from '@mui/material/Grid2';
import { team } from '../types';
import mtlLogo from '../assets/mtl.png';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

interface Props {
    size: string,
    team: team,
    score: number,
}

function Team(props: Props) {
    return (
        <Paper elevation={0} sx={{
            paddingRight: '.5em',
            paddingLeft: '.5em',
        }}>
            <Grid spacing={1} container>
                <Grid display="flex" justifyContent="center" alignItems="center">
                    <img src={mtlLogo} style={{ height: '2em', textAlign: 'center' }} />
                </Grid>
                <Grid display="flex" justifyContent="center" alignItems="center">
                    <Grid container>
                        <Grid display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="subtitle1" sx={{
                                fontSize: props.size === 'lg' ? '3em' : '1em',
                            }}>{props.score}</Typography>
                        </Grid>
                        <Grid sx={{
                            paddingLeft: '.5em',
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}>
                            <Typography variant="h6">{props.team.name}</Typography>
                            <Typography variant="subtitle1">{props.team.coach}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default Team