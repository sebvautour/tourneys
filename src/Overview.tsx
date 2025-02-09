import TournamentChart from './components/TournamentChart';
import { Props } from './components/TournamentChart';


function Home(props: Props) {

  return (
    <>
      <TournamentChart {...props} />
    </>
  )
}

export default Home
