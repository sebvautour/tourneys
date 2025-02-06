import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Overview from './Overview.tsx'
import Series from './Series.tsx'
import Nav from './components/Nav.tsx'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { components } from './api.generated';
import { tournament } from './types.ts'
import apiClient from './apiClient.ts'

function App() {
  const [selectedTournament, setSelectedTournament] = useState(undefined as tournament | undefined);
  const [users, setUsers] = useState(undefined as components["schemas"]["User"][] | undefined);
  const [teams, setTeams] = useState(undefined as components["schemas"]["Team"][] | undefined);


  const client = apiClient;

  const fetchTournament = async () => {
    const { data, error } = await client.GET("/tournaments", {});
    if (error) {
      console.log(error);
      return;
    }
    if (data.tournaments.length === 0) {
      console.log("no tournaments found in the backend");
      return;
    }

    setSelectedTournament(data.tournaments[0]);

    const { data: usersData, error: usersError } = await client.GET("/users", {});
    if (usersError) {
      console.log(usersError);
      return;
    }
    setUsers(usersData.users);

    const { data: teamsData, error: teamsError } = await client.GET("/teams", {});
    if (teamsError) {
      console.log(teamsError);
      return;
    }
    setTeams(teamsData.teams);

  }

  useEffect(() => {
    fetchTournament()
  }, []);


  let content = (
    <>
      <Nav tournamentName={selectedTournament?.name ?? ''} />
      <BrowserRouter>
        <Routes>
          <Route index element={<Overview
            tournamentId={selectedTournament?.id ?? ''}
            users={users ?? []}
            teams={teams ?? []}
          />} />
          <Route path="series/:seriesId" element={<Series
            users={users ?? []}
            teams={teams ?? []} />} />
        </Routes>
      </BrowserRouter>
    </>
  );

  const isLoading = selectedTournament === undefined || users === undefined || teams === undefined;
  if (isLoading) {
    content = (
      <>
        <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4em' }} >
            <CircularProgress />
            <Typography variant="subtitle1" >
              Loading...
            </Typography>
          </Box>
        </Container >
      </>
    )
  }

  return (
    <>
      {content}
    </>
  )
}

export default App
