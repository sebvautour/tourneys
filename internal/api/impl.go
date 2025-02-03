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
	GameById(ctx context.Context, Id uuid.UUID) (*Game, error)
	GamesBySeriesId(ctx context.Context, seriesId uuid.UUID) ([]Game, error)
}

type Server struct {
	db DB
}

// assert that Server implements the generated StrictServerInterface
var _ StrictServerInterface = (*Server)(nil)

func NewServer(db DB) ServerInterface {
	s := Server{db: db}

	return NewStrictHandlerWithOptions(s, []StrictMiddlewareFunc{CORS}, StrictHTTPServerOptions{
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

func (s Server) GetUsers(ctx context.Context, request GetUsersRequestObject) (GetUsersResponseObject, error) {
	res, err := s.db.Users(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get users from db: %w", err)
	}
	return GetUsers200JSONResponse{
		Users: res,
	}, nil
}
