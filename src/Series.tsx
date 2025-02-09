import { useState, useEffect } from 'react';
import { useParams } from "react-router";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { components } from './api.generated';
import GameSeries from "./components/GameSeries";
import { Typography } from '@mui/material';
import apiClient from './apiClient';
import { unknownTeam, unknownUser } from './types';

export interface Props {
  users: components["schemas"]["User"][]
  teams: components["schemas"]["Team"][]
  authToken: string | null
}

export default function Series(props: Props) {
  let { seriesId } = useParams();

  const [rows, setRows] = useState([] as components["schemas"]["Game"][]);
  const [currentSeries, setCurrentSeries] = useState({} as components["schemas"]["Series"]);

  const client = apiClient;

  const fetchSeries = async () => {
    const { data: seriesData, error: seriesError } = await client.GET("/series/{seriesId}", {
      params: {
        path: { seriesId: seriesId ?? '' },
      },
    });
    if (seriesError) {
      console.log(seriesError);
      return;
    }

    setRows(seriesData.games);
    setCurrentSeries(seriesData.series);
  }

  useEffect(() => {
    fetchSeries();
  }, []);


  return (
    <>
      <GameSeries size='lg' hideSeriesLink series={{
        series: currentSeries,
        firstTeam: {
          team: props.teams.filter((v) => v.id === currentSeries.firstTeamId)[0] ?? unknownTeam,
          user: props.users.filter((v) => v.id === currentSeries.firstTeamUserId)[0] ?? unknownUser,
        },
        secondTeam: {
          team: props.teams.filter((v) => v.id === currentSeries.secondTeamId)[0] ?? unknownTeam,
          user: props.users.filter((v) => v.id === currentSeries.secondTeamUserId)[0] ?? unknownUser,
        }
      }}
        users={props.users}
        teams={props.teams}
        handleUpdate={fetchSeries}
        authToken={props.authToken}
      />
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ paddingLeft: '.5em', paddingTop: '.5em' }}>Games</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right"></TableCell>
              <TableCell align="right">#</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Home</TableCell>
              <TableCell align="right">Home User</TableCell>
              <TableCell align="right">Home Score</TableCell>
              <TableCell align="right">Away</TableCell>
              <TableCell align="right">Away User</TableCell>
              <TableCell align="right">Away Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right"></TableCell>
                <TableCell align="right">
                  {i + 1}
                </TableCell>
                <TableCell align="right">
                  TODO
                </TableCell>
                <TableCell align="right">{props.teams.filter((v) => v.id === row.homeTeamId)[0]?.slug ?? 'TBD'}</TableCell>
                <TableCell align="right">{props.users.filter((v) => v.id === row.homeTeamUserId)[0]?.name ?? 'TBD'}</TableCell>
                <TableCell align="right">{row.homeTeamScore ?? '-'}</TableCell>
                <TableCell align="right">{props.teams.filter((v) => v.id === row.awayTeamId)[0]?.slug ?? 'TBD'}</TableCell>
                <TableCell align="right">{props.users.filter((v) => v.id === row.awayTeamUserId)[0]?.name ?? 'TBD'}</TableCell>
                <TableCell align="right">{row.awayTeamScore ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
