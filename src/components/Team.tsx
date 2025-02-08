import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { TeamUser } from '../types';

interface Props {
    size: string,
    team: TeamUser,
    score?: number,
}

function Team(props: Props) {
    let logo = (
        <Avatar variant="square" sx={{ objectFit: 'scale-down', height: "40px", width: "60px" }}>{props.team.team.slug === 'TBD' ? '?' : props.team.team.slug}</Avatar>
    );
    if (false) { // TODO implement logo URLs
        logo = (
            <Avatar variant="square" alt={props.team.team.slug} src={'TODO'} sx={{ objectFit: 'scale-down', height: "40px", width: "60px" }} />
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
                            }}>{props.score ?? 0}</Typography>
                        </Grid>
                        <Grid sx={{
                            paddingLeft: '.5em',
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}>
                            <Typography variant="h6">{props.team.team.slug}</Typography>
                            <Typography variant="subtitle1">{props.team.user.shortname}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default Team