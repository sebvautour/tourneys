import GameSeries from "./GameSeries";
import Grid from '@mui/material/Grid2';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { series } from "../types";
import { SxProps } from "@mui/material";

function TournamentChart() {
    const quarterFinals: series[] = [
        {
            teamA: { name: "MTL", coach: "Play1", logo: "TODO" },
            teamAScore: 3,
            teamB: { name: "VAN", coach: "Play2", logo: "TODO" },
            teamBScore: 2,
        },
        {
            teamA: { name: "OTT", coach: "Play1", logo: "TODO" },
            teamAScore: 2,
            teamB: { name: "TOR", coach: "Play2", logo: "TODO" },
            teamBScore: 3,
        },
        {
            teamA: { name: "EDM", coach: "Play1", logo: "TODO" },
            teamAScore: 3,
            teamB: { name: "CAG", coach: "Play2", logo: "TODO" },
            teamBScore: 2,
        },
        {
            teamA: { name: "WIN", coach: "Play1", logo: "TODO" },
            teamAScore: 2,
            teamB: { name: "BOS", coach: "Play2", logo: "TODO" },
            teamBScore: 3,
        },
    ];
    const semiFinals: series[] = [
        {
            teamA: { name: "MTL", coach: "Play1", logo: "TODO" },
            teamAScore: 3,
            teamB: { name: "TOR", coach: "Play2", logo: "TODO" },
            teamBScore: 2,
        },
        {
            teamA: { name: "CAG", coach: "Play1", logo: "TODO" },
            teamAScore: 2,
            teamB: { name: "BOS", coach: "Play2", logo: "TODO" },
            teamBScore: 3,
        }
    ];
    const finals: series[] = [
        {
            teamA: { name: "MTL", coach: "Play1", logo: "TODO" },
            teamAScore: 2,
            teamB: { name: "BOS", coach: "Play2", logo: "TODO" },
            teamBScore: 3,
        }
    ];

    const rowStyle: SxProps = {
        height: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    }

    const quarterFinalsRow = (
        <Grid container direction="column" sx={rowStyle} spacing={2}>
            {quarterFinals.map((series) => (
                <Grid >
                    <GameSeries series={series} size="sm" />
                </Grid>
            ))}
        </Grid>
    );

    const semiFinalsRow = (
        <Grid container direction="column" sx={rowStyle} spacing={2}>
            {semiFinals.map((series) => (
                <Grid >
                    <GameSeries series={series} size="sm" />
                </Grid>
            ))}
        </Grid>
    );

    const finalsRow = (
        <Grid container direction="column" sx={rowStyle} spacing={2}>
            {finals.map((series) => (
                <Grid >
                    <GameSeries series={series} size="sm" />
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Grid container >
            <Grid size={3}>
                {quarterFinalsRow}
            </Grid>
            <Grid size={1}>
                <Grid container direction="column" sx={rowStyle} spacing={2}>
                    <Grid>
                        <ArrowForwardIosIcon />
                    </Grid>
                    <Grid>
                        <ArrowForwardIosIcon />
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={3}>
                {semiFinalsRow}
            </Grid>
            <Grid size={1}>
                <Grid container direction="column" sx={rowStyle} spacing={2}>
                    <Grid>
                        <ArrowForwardIosIcon />
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={3}>
                {finalsRow}
            </Grid>
        </Grid>
    )
}

export default TournamentChart