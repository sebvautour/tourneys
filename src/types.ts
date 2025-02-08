import type { components } from './api.generated';

export const zeroUUID = '00000000-0000-0000-0000-000000000000';

export const unknownTeam: components["schemas"]["Team"] = {
    id: "",
    name: "To be determined",
    slug: 'TBD'
}

export const unknownUser: components["schemas"]["User"] = {
    id: "",
    name: "To be determined",
    shortname: 'TBD'
}

export interface SeriesTeam {
    series: components["schemas"]["Series"]
    firstTeam: TeamUser
    secondTeam: TeamUser
}

export interface TeamUser {
    team: components["schemas"]["Team"]
    user: components["schemas"]["User"]
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