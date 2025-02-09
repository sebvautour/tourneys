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
import apiClient from './apiClient.ts'
import { createZitadelAuth, ZitadelConfig } from "@zitadel/react";
import LoginCallback from './LoginCallback.tsx'

export default function AppParams() {
  const [params, setParams] = useState(null as components["schemas"]["FrontendParams"] | null);

  const fetchParams = async () => {
    const { data, error } = await apiClient.GET("/params", {});
    if (error) {
      console.log(error);
      return;
    }
    setParams(data.params)
  }

  useEffect(() => {
    fetchParams()
  }, []);

  let content = <></>
  if (params !== null) {
    content = <App params={params} />
  }

  return (
    <>
      {content}
    </>
  )
}

interface Props {
  params: components["schemas"]["FrontendParams"]
}

function App(props: Props) {
  const [selectedTournament, setSelectedTournament] = useState(undefined as components["schemas"]["Tournament"] | undefined);
  const [users, setUsers] = useState(undefined as components["schemas"]["User"][] | undefined);
  const [teams, setTeams] = useState(undefined as components["schemas"]["Team"][] | undefined);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const frontendURL = URL.parse(document.location.href);
  const authConfig: ZitadelConfig = {
    redirect_uri: `${frontendURL?.protocol ?? 'https'}//${frontendURL?.host}/callback`,
    post_logout_redirect_uri: `${frontendURL?.protocol ?? 'https'}//${frontendURL?.host}/`,
    authority: props.params.authAuthority,
    client_id: props.params.authClientId,
    scope: props.params.authScope,
  };
  const zitadel = createZitadelAuth(authConfig);

  function login() {
    zitadel.authorize();
  }

  function logout() {
    zitadel.signout();
  }

  useEffect(() => {
    zitadel.userManager.getUser().then((user) => {
      if (user && !user.expired) {
        setAuthToken(user.access_token ?? null);
      } else {
        setAuthToken(null);
      }
    });
  }, [zitadel]);

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
      <Nav
        tournamentName={selectedTournament?.name ?? ''}
        authenticated={authToken}
        handleLogin={login}
        handleLogout={logout}
      />
      <BrowserRouter>
        <Routes>
          <Route index element={<Overview
            tournamentId={selectedTournament?.id ?? ''}
            users={users ?? []}
            teams={teams ?? []}
            authToken={authToken}
          />} />
          <Route path="series/:seriesId" element={<Series
            users={users ?? []}
            teams={teams ?? []}
            authToken={authToken} />} />
          <Route path="callback" element={<LoginCallback
            authenticated={authToken}
            setAuth={setAuthToken}
            userManager={zitadel.userManager}
          />} />
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
