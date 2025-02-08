import TournamentChart from './components/TournamentChart';
import { Props } from './components/TournamentChart';
import Container from '@mui/material/Container';


function Home(props: Props) {

  return (
    <>
      <Container>
        <TournamentChart {...props} />
      </Container>
    </>
  )
}

export default Home
