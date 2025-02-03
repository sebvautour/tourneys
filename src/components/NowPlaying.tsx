import GameSeries from "./GameSeries"

function NowPlaying() {
    return (
        <>
            <GameSeries series={{
                teamA: { name: "MTL", coach: "Play1", logo: "TODO" },
                teamAScore: 3,
                teamB: { name: "VAN", coach: "Play2", logo: "TODO" },
                teamBScore: 2,
            }} title="Now Playing"
                size="lg" />
        </>
    )
}

export default NowPlaying