export const zeroUUID = '00000000-0000-0000-0000-000000000000';

export interface tournament {
    id: string
    name: string
}

export interface user {
    id: string
    name: string
    shortname: string
}

export interface team {
    id: string
    logo?: string
    name?: string
    coach?: string
}

export interface series {
    id: string
    round: number
    teamA: team
    teamAScore?: number
    teamB: team
    teamBScore?: number
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