package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"reflect"

	"github.com/rs/cors"
	"github.com/sebvautour/tourneys"
	"github.com/sebvautour/tourneys/internal/api"
	"github.com/sebvautour/tourneys/internal/db"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization"
	"github.com/zitadel/zitadel-go/v3/pkg/authorization/oauth"
	"github.com/zitadel/zitadel-go/v3/pkg/zitadel"
)

type Params struct {
	ListenAddr           string `env:"TOURNEYS_LISTEN_ADDR"`
	AuthDomain           string `env:"TOURNEYS_AUTH_DOMAIN"`
	AuthKeyPath          string `env:"TOURNEYS_AUTH_KEY_PATH"`
	FrontendAuthClientID string `env:"TOURNEYS_FRONTEND_AUTH_CLIENT_ID"`
	FrontendAuthScope    string `env:"TOURNEYS_FRONTEND_AUTH_SCOPE"`
}

// Parse uses env tags defined in the Params struct fields
// to lookup environment vars to fill the values
func (p *Params) Parse() error {
	t := reflect.TypeOf(*p)
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)

		envName := field.Tag.Get("env")
		envValue, ok := os.LookupEnv(envName)
		if !ok {
			return fmt.Errorf("missing %s env var", envName)
		}

		fieldValue := reflect.Indirect(reflect.ValueOf(p)).FieldByName(field.Name)

		if fieldValue.Kind() != reflect.String {
			return fmt.Errorf("params field %s is not a string", field.Name)
		}

		fieldValue.SetString(envValue)
	}
	return nil
}

func main() {
	ctx := context.Background()

	var params Params
	if err := params.Parse(); err != nil {
		log.Fatalln(err)
	}

	apiHandler, err := createAPI(ctx, params)
	if err != nil {
		log.Fatalln(err)
	}

	globalMux := http.NewServeMux()
	globalMux.Handle("/api/v1/", apiHandler)
	globalMux.Handle("/", tourneys.FrontendFiles{})

	webserver := &http.Server{
		Handler: globalMux,
		Addr:    params.ListenAddr,
	}

	log.Fatalln(webserver.ListenAndServe())
}

func createAPI(ctx context.Context, params Params) (http.Handler, error) {
	dbClient, err := db.New(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create db: %s", err)
	}

	auth, err := authorization.New(ctx, zitadel.New(params.AuthDomain), oauth.DefaultAuthorization(params.AuthKeyPath))
	if err != nil {
		return nil, fmt.Errorf("failed to create auth: %s", err)
	}

	authMW, err := api.AuthMiddleware(func(ctx context.Context, token string) error {
		_, err := auth.CheckAuthorization(ctx, token)
		return err
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create auth middleware: %s", err)
	}

	createTestData(ctx, dbClient)

	apiServer := api.NewServer(dbClient, api.FrontendParams{
		AuthAuthority: fmt.Sprintf("https://%s/", params.AuthDomain),
		AuthClientId:  params.FrontendAuthClientID,
		AuthScope:     params.FrontendAuthScope,
	})

	mux := http.NewServeMux()

	api.HandlerFromMuxWithBaseURL(apiServer, mux, "/api/v1")

	handlerWithMidlewares := authMW(mux)
	handlerWithMidlewares = cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost},
		AllowedHeaders: []string{
			"Authorization",
			"Content-Type",
		},
	}).Handler(handlerWithMidlewares)

	return handlerWithMidlewares, nil
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
