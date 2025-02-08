import { useState } from 'react';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid2';
import Team from './Team';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import { gameStats } from '../types';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Editor from './Editor';
import type { components } from '../api.generated';
import { SeriesTeam } from '../types';

interface Props {
    size: string
    title?: string
    series: SeriesTeam
    stats?: gameStats
    hideSeriesLink?: boolean
    users: components["schemas"]["User"][]
    teams: components["schemas"]["Team"][]
    handleUpdate: () => void
}

function GameSeries(props: Props) {
    const [openEdit, setOpenEdit] = useState(false);

    const handleClickOpenEdit = () => {
        setOpenEdit(true);
    };

    const handleCloseEdit = (updated: boolean) => {
        if (updated) {
            props.handleUpdate();
        }
        setOpenEdit(false);
    };


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

    let cardActions = <></>;
    let actionButtons = [];

    if (!props.hideSeriesLink) {
        actionButtons.push((
            <Button href={`/series/${props.series.series.id}`} key='series'><BarChartIcon /></Button>
        ));
    }
    // if has edit
    actionButtons.push((
        <Button onClick={handleClickOpenEdit} key='edit'><EditIcon /></Button>
    ));

    if (actionButtons.length !== 0) {
        cardActions = (
            <CardActions sx={{
                padding: 0,
            }}>
                {actionButtons}
            </CardActions>
        );
    }

    return (
        <>
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
                            <Team team={props.series.firstTeam} score={props.series.series.firstTeamScore} size={props.size} />
                        </Grid>
                        {stats}
                        <Grid>
                            <Team team={props.series.secondTeam} score={props.series.series.secondTeamScore} size={props.size} />
                        </Grid>
                    </Grid>
                </CardContent>
                {cardActions}
            </Card>
            <Editor openEdit={openEdit} handleCloseEdit={(handleCloseEdit)}
                series={props.series.series}
                users={props.users}
                teams={props.teams} />
        </>
    );
}

export default GameSeries