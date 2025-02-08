import { useState, useEffect } from "react";
import GameSeries from "./GameSeries";
import Grid from '@mui/material/Grid2';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SxProps } from "@mui/material";
import type { components } from '../api.generated';
import apiClient from "../apiClient";
import { Typography } from '@mui/material';
import { SeriesTeam, unknownTeam, unknownUser } from "../types";

export interface Props {
    tournamentId: string
    users: components["schemas"]["User"][]
    teams: components["schemas"]["Team"][]
}

function TournamentChart(props: Props) {
    const [series, setSeries] = useState([] as SeriesTeam[]);

    const client = apiClient;

    const fetchSeries = async () => {
        const { data: seriesData, error: seriesError } = await client.GET("/tournaments/{tournamentId}/series", {
            params: {
                path: { tournamentId: props.tournamentId },
            },
        });
        if (seriesError) {
            console.log(seriesError);
            return;
        }

        setSeries(seriesData.series.map((s) => ({
            series: s,
            firstTeam: {
                team: props.teams.filter((v) => v.id === s.firstTeamId)[0] ?? unknownTeam,
                user: props.users.filter((v) => v.id === s.firstTeamUserId)[0] ?? unknownUser,
            },
            secondTeam: {
                team: props.teams.filter((v) => v.id === s.secondTeamId)[0] ?? unknownTeam,
                user: props.users.filter((v) => v.id === s.secondTeamUserId)[0] ?? unknownUser,
            }
        })))
    }

    useEffect(() => {
        fetchSeries()
    }, []);


    const rowStyle: SxProps = {
        height: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    }

    let columns = [];
    // create a column for each round
    // 0 - quarter finals
    // 1 - semi finals
    // 2 - finals
    for (let i = 0; i < 3; i++) {
        columns.push(
            <Grid size={3} key={'round-' + i}>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>{i === 0 ? 'Quarter Finals' : (i === 1 ? "Semi Finals" : "Finals")}</Typography>
                <Grid container direction="column" sx={rowStyle} spacing={2}>
                    {series.filter((v) => v.series.round === i).map((series) => (
                        <Grid key={series.series.id}>
                            <GameSeries series={series} size="sm"
                                users={props.users}
                                teams={props.teams}
                                handleUpdate={fetchSeries} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        )

        // add arrows for half the amount of 
        let arrows = [];
        for (let a = 0; a < Math.floor(series.filter((v) => v.series.round === i).length / 2); a++) {
            arrows.push(
                <Grid key={i + '-' + a}>
                    <ArrowForwardIosIcon />
                </Grid>
            );

        }
        if (arrows.length !== 0) {
            columns.push(
                <Grid size={1} key={'round-arrows-' + i}>
                    <Grid container direction="column" sx={rowStyle} spacing={2}>
                        {arrows}
                    </Grid>
                </Grid>
            )
        }

    }

    return (
        <Grid container >
            {columns}
        </Grid>
    )
}

export default TournamentChart