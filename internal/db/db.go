package db

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sebvautour/tourneys/internal/api"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type DB struct {
	Conn *gorm.DB
}

func New(ctx context.Context) (*DB, error) {
	gormDB, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("opening db: %w", err)
	}

	if err := gormDB.WithContext(ctx).AutoMigrate(
		api.User{},
		api.Team{},
		api.Tournament{},
		api.Series{},
		api.Game{},
	); err != nil {
		return nil, fmt.Errorf("auto migrate models: %w", err)
	}

	return &DB{
		Conn: gormDB,
	}, nil
}

var _ api.DB = (*DB)(nil)

func (db *DB) CreateUser(ctx context.Context, v api.User) (*api.User, error) {
	v.Id = uuid.New()
	if err := db.Conn.WithContext(ctx).Create(&v).Error; err != nil {
		return nil, err
	}
	return &v, nil
}

func (db *DB) Users(ctx context.Context) (res []api.User, _ error) {
	return res, db.Conn.WithContext(ctx).Find(&res).Error
}

func (db *DB) CreateTeam(ctx context.Context, v api.Team) (*api.Team, error) {
	v.Id = uuid.New()
	if err := db.Conn.WithContext(ctx).Create(&v).Error; err != nil {
		return nil, err
	}
	return &v, nil
}

func (db *DB) Teams(ctx context.Context) (res []api.Team, _ error) {
	return res, db.Conn.WithContext(ctx).Find(&res).Error
}

func (db *DB) CreateTournament(ctx context.Context, t api.Tournament) (*api.Tournament, error) {
	t.Id = uuid.New()
	if err := db.Conn.WithContext(ctx).Create(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (db *DB) Tournaments(ctx context.Context) (res []api.Tournament, _ error) {
	return res, db.Conn.WithContext(ctx).Find(&res).Error
}

func (db *DB) CreateSeries(ctx context.Context, t api.Series) (*api.Series, error) {
	t.Id = uuid.New()
	if err := db.Conn.WithContext(ctx).Create(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (db *DB) SeriesByTournamentId(ctx context.Context, tournamentId uuid.UUID) (res []api.Series, _ error) {
	return res, db.Conn.
		WithContext(ctx).
		Where("tournament_id = ?", tournamentId).
		Find(&res).
		Error
}

func (db *DB) SeriesById(ctx context.Context, Id uuid.UUID) (res *api.Series, _ error) {
	res = &api.Series{
		Id: Id,
	}

	return res, db.Conn.
		WithContext(ctx).
		First(res).
		Error
}

func (db *DB) CreateGame(ctx context.Context, t api.Game) (*api.Game, error) {
	t.Id = uuid.New()
	if err := db.Conn.WithContext(ctx).Create(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (db *DB) GameById(ctx context.Context, Id uuid.UUID) (res *api.Game, _ error) {
	res = &api.Game{
		Id: Id,
	}

	return res, db.Conn.
		WithContext(ctx).
		First(res).
		Error
}

func (db *DB) GamesBySeriesId(ctx context.Context, seriesId uuid.UUID) (res []api.Game, _ error) {
	return res, db.Conn.
		WithContext(ctx).
		Where("series_id = ?", seriesId).
		Find(&res).
		Error
}
