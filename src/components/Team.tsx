import Grid from '@mui/material/Grid2';
import { team } from '../types';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';

interface Props {
    size: string,
    team: team,
    score?: number,
}

function Team(props: Props) {
    let logo = (
        <Avatar variant="square" sx={{ objectFit: 'scale-down', height: "40px", width: "60px" }}>{props.team.name === 'TBD' ? '?' : props.team.name}</Avatar>
    );
    if (props.team.logo) {
        logo = (
            <Avatar variant="square" alt={props.team.name} src={props.team.logo} sx={{ objectFit: 'scale-down', height: "40px", width: "60px" }} />
        );
    }
    return (
        <Paper elevation={0} sx={{
            paddingRight: '.5em',
            paddingLeft: '.5em',
        }}>
            <Grid spacing={1} container>
                <Grid display="flex" justifyContent="center" alignItems="center">
                    {logo}
                </Grid>
                <Grid display="flex" justifyContent="center" alignItems="center">
                    <Grid container>
                        <Grid display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="subtitle1" sx={{
                                fontSize: props.size === 'lg' ? '3em' : '1em',
                            }}>{props.score ?? '-'}</Typography>
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