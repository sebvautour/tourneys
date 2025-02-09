/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get users
         * @description Returns a list of users.
         */
        get: operations["getUsers"];
        put?: never;
        /**
         * Create user
         * @description Create a user
         */
        post: operations["createUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get teams
         * @description Returns a list of teams.
         */
        get: operations["getTeams"];
        put?: never;
        /**
         * Create team
         * @description Create a team
         */
        post: operations["createTeam"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tournaments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get tournaments
         * @description Returns a list of tournaments.
         */
        get: operations["getTournaments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tournaments/{tournamentId}/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get tournament series
         * @description Returns a list of series for a tournament.
         */
        get: operations["getSeriesByTournamentId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tournaments/{tournamentId}/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get games
         * @description Returns a list of games for a tournament.
         */
        get: operations["getGamesByTournamentId"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/series": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create series
         * @description Create a series
         */
        post: operations["createSeries"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/series/{seriesId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get series
         * @description Returns a list of series by ID.
         */
        get: operations["getSeriesById"];
        /**
         * Update series
         * @description Update an existing series
         */
        put: operations["updateSeriesById"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create game
         * @description Create a game
         */
        post: operations["createGame"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{gameId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get games
         * @description Returns a game by ID.
         */
        get: operations["getGameById"];
        /**
         * Update an existing game
         * @description Update an existing game
         */
        put: operations["updateGameById"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/params": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get frontend params
         * @description Get parameters used by the frontend
         */
        get: operations["getFrontendParams"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        FrontendParams: {
            authAuthority: string;
            authClientId: string;
            authScope: string;
        };
        Error: {
            code: number;
            message: string;
        };
        User: {
            /** Format: uuid */
            id: string;
            name: string;
            shortname: string;
        };
        Team: {
            /** Format: uuid */
            id: string;
            name: string;
            slug: string;
        };
        Tournament: {
            /** Format: uuid */
            id: string;
            name: string;
        };
        Series: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            tournamentId: string;
            /** @description round number that this series is a part of (0, 1, 2) */
            round: number;
            /** Format: uuid */
            firstTeamId?: string;
            /** Format: uuid */
            secondTeamId?: string;
            /** Format: uuid */
            firstTeamUserId?: string;
            /** Format: uuid */
            secondTeamUserId?: string;
            firstTeamScore?: number;
            secondTeamScore?: number;
        };
        Game: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            seriesId: string;
            /** Format: uuid */
            homeTeamId?: string;
            /** Format: uuid */
            awayTeamId?: string;
            /** Format: uuid */
            homeTeamUserId?: string;
            /** Format: uuid */
            awayTeamUserId?: string;
            homeTeamScore?: number;
            awayTeamScore?: number;
        };
    };
    responses: {
        /** @description A client side bad request error */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description Missing or invalid auth token */
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
        /** @description A server error occurred */
        ServerError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["Error"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getUsers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        users: components["schemas"]["User"][];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["ServerError"];
        };
    };
    createUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Create a new user */
        requestBody: {
            content: {
                "application/json": components["schemas"]["User"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        user: components["schemas"]["User"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["ServerError"];
        };
    };
    getTeams: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        teams: components["schemas"]["Team"][];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["ServerError"];
        };
    };
    createTeam: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Create a new team */
        requestBody: {
            content: {
                "application/json": components["schemas"]["Team"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        team: components["schemas"]["Team"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["ServerError"];
        };
    };
    getTournaments: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        tournaments: components["schemas"]["Tournament"][];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["ServerError"];
        };
    };
    getSeriesByTournamentId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of tournament */
                tournamentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        series: components["schemas"]["Series"][];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["ServerError"];
        };
    };
    getGamesByTournamentId: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of tournament */
                tournamentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        games: components["schemas"]["Game"][];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["ServerError"];
        };
    };
    createSeries: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Create a new series */
        requestBody: {
            content: {
                "application/json": components["schemas"]["Series"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        series: components["schemas"]["Series"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["ServerError"];
        };
    };
    getSeriesById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of series */
                seriesId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        series: components["schemas"]["Series"];
                        games: components["schemas"]["Game"][];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["ServerError"];
        };
    };
    updateSeriesById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of series */
                seriesId: string;
            };
            cookie?: never;
        };
        /** @description Update an existing series */
        requestBody: {
            content: {
                "application/json": components["schemas"]["Series"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        series: components["schemas"]["Series"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["ServerError"];
        };
    };
    createGame: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** @description Create a new game */
        requestBody: {
            content: {
                "application/json": components["schemas"]["Game"];
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        game: components["schemas"]["Game"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["ServerError"];
        };
    };
    getGameById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of game */
                gameId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        game: components["schemas"]["Game"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["ServerError"];
        };
    };
    updateGameById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of game */
                gameId: string;
            };
            cookie?: never;
        };
        /** @description Update an existing game */
        requestBody: {
            content: {
                "application/json": components["schemas"]["Game"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        game: components["schemas"]["Game"];
                    };
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["ServerError"];
        };
    };
    getFrontendParams: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        params: components["schemas"]["FrontendParams"];
                    };
                };
            };
            500: components["responses"]["ServerError"];
        };
    };
}
