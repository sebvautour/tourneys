export interface team {
    logo?: string
    name?: string
    coach?: string
}

export interface series {
    teamA: team
    teamAScore: number
    teamB: team
    teamBScore: number
}

export interface gameStats {
    teamAStats: teamGameStats
    teamBStats: teamGameStats
    period: number
}

export interface teamGameStats {
    shots: number
    hits: number
    faceoffsWon: number
}