package api

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/getkin/kin-openapi/openapi3filter"
	middleware "github.com/oapi-codegen/nethttp-middleware"
)

type ValidateAuth func(ctx context.Context, token string) error

var (
	ErrAuth = errors.New("invalid auth")
)

// AuthMiddleware provides a middleware that validates an auth token using
// the ValidateAuth func provided for requests that require auth based
// on the OpenAPI spec.
//
// Note: scope is not currently
func AuthMiddleware(v ValidateAuth) (func(next http.Handler) http.Handler, error) {
	spec, err := GetSwagger()
	if err != nil {
		return nil, fmt.Errorf("loading spec: %w", err)
	}

	validator := middleware.OapiRequestValidatorWithOptions(spec,
		&middleware.Options{
			Options: openapi3filter.Options{
				AuthenticationFunc: newAuthenticator(v),
			},
			SilenceServersWarning: true,
			ErrorHandler: func(w http.ResponseWriter, message string, statusCode int) {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)

				_ = json.NewEncoder(w).Encode(Error{
					Code:    http.StatusUnauthorized,
					Message: message,
				})
			},
		})

	return validator, nil
}

func newAuthenticator(v ValidateAuth) openapi3filter.AuthenticationFunc {
	return func(ctx context.Context, input *openapi3filter.AuthenticationInput) error {
		return authenticate(v, ctx, input)
	}
}

func authenticate(validateAuth ValidateAuth, ctx context.Context, input *openapi3filter.AuthenticationInput) error {
	if input.SecuritySchemeName != "BearerAuth" {
		return fmt.Errorf("%w: security scheme %s != 'BearerAuth'", ErrAuth, input.SecuritySchemeName)
	}

	authHeaderValue := input.RequestValidationInput.Request.Header.Get("Authorization")
	if authHeaderValue == "" {
		return fmt.Errorf("%w: missing Authorization header", ErrAuth)
	}

	if err := validateAuth(ctx, authHeaderValue); err != nil {
		return fmt.Errorf("%w: %s", ErrAuth, err)
	}

	return nil
}
