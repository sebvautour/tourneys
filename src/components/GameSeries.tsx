import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';
import Team from './Team';
import BarChartIcon from '@mui/icons-material/BarChart';
import { series, gameStats } from '../types';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface Props {
    size: string
    title?: string
    series: series
    stats?: gameStats
    hideActions?: boolean
}

function GameSeries(props: Props) {
    let title = <></>;
    if (props.title) {
        title = (
            <CardHeader title={props.title} />
        );
    }

    let stats = <></>;
    if (props.stats) {
        stats = (
            <Grid size={4}>
                <Table>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align='center'>Period {props.stats.period}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align='center'>{props.stats.teamAStats.shots}</TableCell>
                        <TableCell align='center'>Shots</TableCell>
                        <TableCell align='center'>{props.stats.teamBStats.shots}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align='center'>{props.stats.teamAStats.hits}</TableCell>
                        <TableCell align='center'>Hits</TableCell>
                        <TableCell align='center'>{props.stats.teamBStats.hits}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align='center'>{props.stats.teamAStats.faceoffsWon}</TableCell>
                        <TableCell align='center'>Faceoffs Won</TableCell>
                        <TableCell align='center'>{props.stats.teamBStats.faceoffsWon}</TableCell>
                    </TableRow>
                </Table>
            </Grid>
        )
    }

    let actions = (
        <CardActions sx={{
            padding: 0,
        }}>
            <Button href={`/series/${props.series.id}`}><BarChartIcon /></Button>
        </CardActions>
    );
    if (props.hideActions) {
        actions = <></>;
    }

    return (
        <Card variant='outlined'>
            {title}
            <CardContent sx={{
                padding: 0,
            }}>
                <Grid container sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Grid>
                        <Team team={props.series.teamA} score={props.series.teamAScore} size={props.size} />
                    </Grid>
                    {stats}
                    <Grid>
                        <Team team={props.series.teamB} score={props.series.teamBScore} size={props.size} />
                    </Grid>
                </Grid>
            </CardContent>
            {actions}
        </Card>
    );
}

export default GameSeries