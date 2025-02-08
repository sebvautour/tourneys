import { forwardRef, useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Grid from '@mui/material/Grid2';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { components } from '../api.generated';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { unknownTeam, unknownUser } from '../types';
import apiClient from '../apiClient';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


interface Props {
    openEdit: boolean
    handleCloseEdit: (updated: boolean) => void
    series: components["schemas"]["Series"]
    users: components["schemas"]["User"][]
    teams: components["schemas"]["Team"][]
}

function Editor(props: Props) {
    const [series, setSeries] = useState({} as components['schemas']['Series']);

    useEffect(() => {
        setSeries({
            firstTeamScore: 0,
            secondTeamScore: 0,
            ...props.series,
        });
    }, [props.series]);

    const handleInput = (updatedSeries: Partial<components["schemas"]["Series"]>) => {
        setSeries({
            ...series,
            ...updatedSeries,
        })
    }

    const handleSave = (async () => {
        const { error } = await apiClient.PUT('/series/{seriesId}', {
            params: {
                path: { seriesId: series?.id ?? '' },
            },
            body: series
        })

        if (error) {
            console.log(error);
            return;
        }

        props.handleCloseEdit(true);
    })

    let teamForms = [];
    for (let i = 0; i < 2; i++) {
        const gridDirection = i % 2 ? 'row-reverse' : 'row';
        const formName = i % 2 ? 'Second Team' : 'First Team';

        teamForms.push((
            <Grid size={6} key={i}>
                <Card variant='outlined'>
                    <CardContent>
                        <Grid container
                            direction={gridDirection}
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            <Grid>
                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                    {formName}
                                </Typography>
                            </Grid>
                            <Grid>
                                <TextField
                                    value={i % 2 ? series.secondTeamScore : series.firstTeamScore}
                                    onChange={(e) => {
                                        handleInput(i % 2 ?
                                            { secondTeamScore: typeof e.target.value === 'undefined' ? undefined : Number(e.target.value) } :
                                            { firstTeamScore: typeof e.target.value === 'undefined' ? undefined : Number(e.target.value) }
                                        )
                                    }}
                                    label="Score"
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                        <Autocomplete
                            value={i % 2 ? series.secondTeamId : series.firstTeamId}
                            onChange={(_, v) => handleInput(i % 2 ? { secondTeamId: v ?? undefined } : { firstTeamId: v ?? undefined })}
                            disablePortal
                            options={props.teams.map((t) => t.id)}
                            getOptionLabel={(s) => props.teams.filter((t) => t.id === s)[0]?.name ?? unknownTeam.name}
                            renderInput={(params) => <TextField {...params} label="Team" />}
                            sx={{
                                paddingTop: '1em'
                            }}
                        />
                        <Autocomplete
                            value={i % 2 ? series.secondTeamUserId : series.firstTeamUserId}
                            onChange={(_, v) => handleInput(i % 2 ? { secondTeamUserId: v ?? undefined } : { firstTeamUserId: v ?? undefined })}
                            disablePortal
                            options={props.users.map((t) => t.id)}
                            getOptionLabel={(s) => props.users.filter((t) => t.id === s)[0]?.name ?? unknownUser.name}
                            renderInput={(params) => <TextField {...params} label="Player" />}
                            sx={{
                                paddingTop: '1em'
                            }}
                        />
                    </CardContent>
                </Card>
            </Grid>
        ));

    }
    return (
        <Dialog
            fullScreen
            open={props.openEdit}
            onClose={() => props.handleCloseEdit(false)}
            slots={{ transition: Transition }}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => props.handleCloseEdit(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Edit Series
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleSave}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            <Grid container>
                {teamForms}
            </Grid>
        </Dialog>
    );
}

export default Editor