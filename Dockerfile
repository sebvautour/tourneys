FROM node:22.13.1-bookworm AS build_frontend

COPY . /app

WORKDIR /app

RUN yarn && yarn build

FROM golang:1.23-bookworm AS build_backend

COPY go.* /app/
COPY *.go /app/
COPY cmd/ /app/cmd
COPY internal/ /app/internal

COPY --from=build_frontend /app/dist/ /app/dist

WORKDIR /app

ARG CGO_ENABLED=0

RUN go build -o tourneys cmd/tourneys/main.go && chmod +x tourneys

FROM scratch

COPY --from=build_backend /app/tourneys /bin/tourneys
COPY --from=build_backend /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

CMD [ "/bin/tourneys" ]
