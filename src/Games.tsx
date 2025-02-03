import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  date: string,
  homeTeamName: string,
  homeTeamScore: number,
  awayTeamName: string,
  awayTeamScore: number,
) {
  return { date, homeTeamName, homeTeamScore, awayTeamName, awayTeamScore };
}

const rows = [
  createData('TBD', 'MTL', 2, 'VAN', 0)
];

export default function Games() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Home Team</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Away Team</TableCell>
            <TableCell align="right">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date + row.homeTeamName + row.awayTeamName}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.homeTeamName}</TableCell>
              <TableCell align="right">{row.homeTeamScore}</TableCell>
              <TableCell align="right">{row.awayTeamName}</TableCell>
              <TableCell align="right">{row.awayTeamScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
