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

export interface Props {
  users: components["schemas"]["User"][]
  teams: components["schemas"]["Team"][]
}

export default function Series(props: Props) {
  let { seriesId } = useParams();

  const [rows, setRows] = useState([] as components["schemas"]["Game"][]);
  const [currentSeries, setSeries] = useState({} as components["schemas"]["Series"]);

  const client = apiClient;

  const fetchGames = async () => {
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
    setSeries(seriesData.series);
  }

  useEffect(() => {
    fetchGames();
  }, []);


  return (
    <>
      <GameSeries size='lg' hideActions series={{
        id: currentSeries.id,
        round: currentSeries.round,
        teamA: {
          id: currentSeries.firstTeamId ?? '',
          name: props.teams.filter((v) => v.id === currentSeries.firstTeamId)[0]?.slug ?? 'TBD',
          coach: props.users.filter((v) => v.id === currentSeries.firstTeamUserId)[0]?.shortname ?? 'TBD',
          logo: "TODO",
        },
        teamAScore: currentSeries.firstTeamScore,
        teamB: {
          id: currentSeries.secondTeamId ?? '',
          name: props.teams.filter((v) => v.id === currentSeries.secondTeamId)[0]?.slug ?? 'TBD',
          coach: props.users.filter((v) => v.id === currentSeries.secondTeamUserId)[0]?.shortname ?? 'TBD',
          logo: "TODO",
        },
        teamBScore: currentSeries.secondTeamScore,
      }} />
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ paddingLeft: '.5em', paddingTop: '.5em' }}>Games</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Home Team</TableCell>
              <TableCell align="right">Home User</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Away Team</TableCell>
              <TableCell align="right">Away User</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">
                  TODO
                </TableCell>
                <TableCell align="right">{props.teams.filter((v) => v.id === row.homeTeamId)[0]?.name ?? 'TBD'}</TableCell>
                <TableCell align="right">{props.users.filter((v) => v.id === row.homeTeamUserId)[0]?.name ?? 'TBD'}</TableCell>
                <TableCell align="right">{row.homeTeamScore ?? '-'}</TableCell>
                <TableCell align="right">{props.teams.filter((v) => v.id === row.awayTeamId)[0]?.name ?? 'TBD'}</TableCell>
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
