package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
)

type DB interface {
	Teams(ctx context.Context) ([]Team, error)
	Users(ctx context.Context) ([]User, error)
	Tournaments(ctx context.Context) ([]Tournament, error)
	SeriesByTournamentId(ctx context.Context, tournamentId uuid.UUID) ([]Series, error)
	SeriesById(ctx context.Context, Id uuid.UUID) (*Series, error)
	UpdateSeriesById(ctx context.Context, Id uuid.UUID, s Series) error
	GameById(ctx context.Context, Id uuid.UUID) (*Game, error)
	UpdateGameById(ctx context.Context, Id uuid.UUID, g Game) error
	GamesBySeriesId(ctx context.Context, seriesId uuid.UUID) ([]Game, error)
	CreateUser(ctx context.Context, v User) (*User, error)
	CreateTeam(ctx context.Context, v Team) (*Team, error)
	CreateGame(ctx context.Context, t Game) (*Game, error)
	CreateSeries(ctx context.Context, t Series) (*Series, error)
}

type Server struct {
	db             DB
	frontendParams FrontendParams
}

// assert that Server implements the generated StrictServerInterface
var _ StrictServerInterface = (*Server)(nil)

func NewServer(db DB, frontendParams FrontendParams) ServerInterface {
	s := Server{
		db:             db,
		frontendParams: frontendParams,
	}

	return NewStrictHandlerWithOptions(s, []StrictMiddlewareFunc{}, StrictHTTPServerOptions{
		RequestErrorHandlerFunc:  s.RequestErrorHandlerFunc,
		ResponseErrorHandlerFunc: s.ResponseErrorHandlerFunc,
	})
}

func (s Server) RequestErrorHandlerFunc(w http.ResponseWriter, r *http.Request, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)

	_ = json.NewEncoder(w).Encode(Error{
		Code:    http.StatusBadRequest,
		Message: err.Error(),
	})
}

func (s Server) ResponseErrorHandlerFunc(w http.ResponseWriter, r *http.Request, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)

	_ = json.NewEncoder(w).Encode(Error{
		Code:    http.StatusInternalServerError,
		Message: err.Error(),
	})
}

func (s Server) GetGameById(ctx context.Context, request GetGameByIdRequestObject) (GetGameByIdResponseObject, error) {
	res, err := s.db.GameById(ctx, request.GameId)
	if err != nil {
		return nil, fmt.Errorf("failed to get game from db: %w", err)
	}
	return GetGameById200JSONResponse{
		Game: *res,
	}, nil
}

func (s Server) UpdateGameById(ctx context.Context, request UpdateGameByIdRequestObject) (UpdateGameByIdResponseObject, error) {
	if err := s.db.UpdateGameById(ctx, request.GameId, *request.Body); err != nil {
		return nil, fmt.Errorf("failed to update game from db: %w", err)
	}

	request.Body.Id = request.GameId

	return UpdateGameById200JSONResponse{
		Game: *request.Body,
	}, nil
}

func (s Server) CreateGame(ctx context.Context, request CreateGameRequestObject) (CreateGameResponseObject, error) {
	res, err := s.db.CreateGame(ctx, *request.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to create game from db: %w", err)
	}

	return CreateGame201JSONResponse{
		Game: *res,
	}, nil
}

func (s Server) GetSeriesById(ctx context.Context, request GetSeriesByIdRequestObject) (GetSeriesByIdResponseObject, error) {
	res, err := s.db.SeriesById(ctx, request.SeriesId)
	if err != nil {
		return nil, fmt.Errorf("failed to get series from db: %w", err)
	}

	games, err := s.db.GamesBySeriesId(ctx, res.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to get games from db: %w", err)
	}
	return GetSeriesById200JSONResponse{
		Series: *res,
		Games:  games,
	}, nil
}

func (s Server) UpdateSeriesById(ctx context.Context, request UpdateSeriesByIdRequestObject) (UpdateSeriesByIdResponseObject, error) {
	if err := s.db.UpdateSeriesById(ctx, request.SeriesId, *request.Body); err != nil {
		return nil, fmt.Errorf("failed to update series from db: %w", err)
	}

	request.Body.Id = request.SeriesId

	return UpdateSeriesById200JSONResponse{
		Series: *request.Body,
	}, nil
}

func (s Server) CreateSeries(ctx context.Context, request CreateSeriesRequestObject) (CreateSeriesResponseObject, error) {
	res, err := s.db.CreateSeries(ctx, *request.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to create series from db: %w", err)
	}

	return CreateSeries201JSONResponse{
		Series: *res,
	}, nil
}

func (s Server) CreateTeam(ctx context.Context, request CreateTeamRequestObject) (CreateTeamResponseObject, error) {
	createdResource, err := s.db.CreateTeam(ctx, *request.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to create team from db: %w", err)
	}
	return CreateTeam201JSONResponse{
		Team: *createdResource,
	}, nil
}

func (s Server) GetTeams(ctx context.Context, request GetTeamsRequestObject) (GetTeamsResponseObject, error) {
	res, err := s.db.Teams(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get teams from db: %w", err)
	}
	return GetTeams200JSONResponse{
		Teams: res,
	}, nil
}

func (s Server) GetTournaments(ctx context.Context, request GetTournamentsRequestObject) (GetTournamentsResponseObject, error) {
	res, err := s.db.Tournaments(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get tournaments from db: %w", err)
	}
	return GetTournaments200JSONResponse{
		Tournaments: res,
	}, nil
}

func (s Server) GetGamesByTournamentId(ctx context.Context, request GetGamesByTournamentIdRequestObject) (GetGamesByTournamentIdResponseObject, error) {
	series, err := s.db.SeriesByTournamentId(ctx, request.TournamentId)
	if err != nil {
		return nil, fmt.Errorf("failed to get series from db: %w", err)
	}

	// this could could be removed by adding a GamesByTournamentId db method
	var res []Game
	for _, tournamentSeries := range series {
		games, err := s.db.GamesBySeriesId(ctx, tournamentSeries.Id)
		if err != nil {
			return nil, fmt.Errorf("failed to get games from db: %w", err)
		}
		res = append(res, games...)
	}

	return GetGamesByTournamentId200JSONResponse{
		Games: res,
	}, nil
}

func (s Server) GetSeriesByTournamentId(ctx context.Context, request GetSeriesByTournamentIdRequestObject) (GetSeriesByTournamentIdResponseObject, error) {
	res, err := s.db.SeriesByTournamentId(ctx, request.TournamentId)
	if err != nil {
		return nil, fmt.Errorf("failed to get series from db: %w", err)
	}
	return GetSeriesByTournamentId200JSONResponse{
		Series: res,
	}, nil
}

func (s Server) CreateUser(ctx context.Context, request CreateUserRequestObject) (CreateUserResponseObject, error) {
	createdResource, err := s.db.CreateUser(ctx, *request.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to create user from db: %w", err)
	}
	return CreateUser201JSONResponse{
		User: *createdResource,
	}, nil
}

func (s Server) GetUsers(ctx context.Context, request GetUsersRequestObject) (GetUsersResponseObject, error) {
	res, err := s.db.Users(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get users from db: %w", err)
	}
	return GetUsers200JSONResponse{
		Users: res,
	}, nil
}

func (s Server) GetFrontendParams(ctx context.Context, _ GetFrontendParamsRequestObject) (GetFrontendParamsResponseObject, error) {
	return GetFrontendParams200JSONResponse{
		Params: s.frontendParams,
	}, nil
}
