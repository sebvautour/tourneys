package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
	"github.com/sebvautour/tourneys"
	"github.com/sebvautour/tourneys/internal/api"
	"github.com/sebvautour/tourneys/internal/db"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization/oauth"
	"github.com/zitadel/zitadel-go/v3/pkg/zitadel"
)

const (
	// TODO: paramethise these
	authDomain  = "auth.svtr.dev"
	authKeyPath = "./keys.json"
)

func main() {
	ctx := context.Background()

	dbClient, err := db.New(ctx)
	if err != nil {
		log.Fatalf("failed to create db: %s\n", err)
	}

	auth, err := authorization.New(ctx, zitadel.New(authDomain), oauth.DefaultAuthorization(authKeyPath))
	if err != nil {
		log.Fatalf("failed to create auth: %s\n", err)
	}

	authMW, err := api.AuthMiddleware(func(ctx context.Context, token string) error {
		_, err := auth.CheckAuthorization(ctx, token)
		return err
	})
	if err != nil {
		log.Fatalf("failed to create auth middleware: %s\n", err)
	}

	createTestData(ctx, dbClient)

	apiServer := api.NewServer(dbClient)

	mux := http.NewServeMux()

	mux.Handle("/", tourneys.FrontendFiles{})

	api.HandlerFromMuxWithBaseURL(apiServer, mux, "/api/v1")

	mux.HandleFunc("/ping", func(w http.ResponseWriter, _ *http.Request) {
		w.Write([]byte("pong"))
	})

	var handlerWithMidlewares http.Handler

	handlerWithMidlewares = authMW(mux)

	handlerWithMidlewares = cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost},
		AllowedHeaders: []string{
			"Authorization",
			"Content-Type",
		},
	}).Handler(handlerWithMidlewares)

	webserver := &http.Server{
		Handler: handlerWithMidlewares,
		Addr:    "0.0.0.0:8080",
	}

	log.Fatalln(webserver.ListenAndServe())
}

func createTestData(ctx context.Context, dbClient *db.DB) {
	t, err := dbClient.CreateTournament(ctx, api.Tournament{
		Name: "Test Tournament",
	})
	if err != nil {
		log.Fatalf("failed to create tournament: %s\n", err)
	}

	teams := make([]api.Team, 8)
	for i := range teams {
		createdTeam, err := dbClient.CreateTeam(ctx, api.Team{
			Name: fmt.Sprintf("Team %v", i),
			Slug: fmt.Sprintf("TM%v", i),
		})
		if err != nil {
			log.Fatalf("failed to create team: %s\n", err)
		}
		teams[i] = *createdTeam
	}

	firstPlayer, err := dbClient.CreateUser(ctx, api.User{
		Name:      "First Player",
		Shortname: "player1",
	})
	if err != nil {
		log.Fatalf("failed to create user: %s\n", err)
	}

	secondPlayer, err := dbClient.CreateUser(ctx, api.User{
		Name:      "Second Player",
		Shortname: "player2",
	})
	if err != nil {
		log.Fatalf("failed to create user: %s\n", err)
	}

	// create first round (0) games and populate it by teams and players
	for i := 0; i < len(teams)/2; i++ {
		firstTeamId := teams[i].Id
		secondTeamId := teams[len(teams)-i-1].Id

		createdSeries, err := dbClient.CreateSeries(ctx, api.Series{
			TournamentId:     t.Id,
			Round:            0,
			FirstTeamId:      firstTeamId,
			SecondTeamId:     secondTeamId,
			FirstTeamUserId:  firstPlayer.Id,
			SecondTeamUserId: secondPlayer.Id,
		})
		if err != nil {
			log.Fatalf("failed to create series: %s\n", err)
		}

		for g := 0; g < 7; g++ {
			game := api.Game{
				SeriesId: createdSeries.Id,
			}
			if g%2 == 0 {
				game.HomeTeamId = firstTeamId
				game.HomeTeamUserId = firstPlayer.Id
				game.AwayTeamId = secondTeamId
				game.AwayTeamUserId = secondPlayer.Id

			} else {
				game.HomeTeamId = secondTeamId
				game.HomeTeamUserId = secondPlayer.Id
				game.AwayTeamId = firstTeamId
				game.AwayTeamUserId = firstPlayer.Id
			}

			_, err := dbClient.CreateGame(ctx, game)
			if err != nil {
				log.Fatalf("failed to create game: %s\n", err)
			}
		}
	}

	// create second (1) and third (2) round series
	// without teams/players populated yet
	for i := 0; i < 3; i++ {
		round := 1
		if i > 1 {
			round = 2
		}

		createdSeries, err := dbClient.CreateSeries(ctx, api.Series{
			TournamentId: t.Id,
			Round:        round,
		})
		if err != nil {
			log.Fatalf("failed to create series: %s\n", err)
		}

		for g := 0; g < 7; g++ {
			_, err := dbClient.CreateGame(ctx, api.Game{
				SeriesId: createdSeries.Id,
			})
			if err != nil {
				log.Fatalf("failed to create game: %s\n", err)
			}
		}
	}
}
