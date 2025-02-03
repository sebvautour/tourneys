package tourneys

import (
	"embed"
	"net/http"
	"path"
	"strings"
)

//go:embed dist/*
var embeddedFiles embed.FS

const (
	distFolder    = "dist"
	indexFileName = "dist/index.html"
)

// FrontendFiles provides an implementation of fs.File to serve
// the frontend files
//
// Since this is a single page app, any html file requested will be returned index.html
type FrontendFiles struct{}

func (FrontendFiles) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if strings.Contains(r.Header.Get("Accept"), "text/html") {
		http.ServeFileFS(w, r, embeddedFiles, indexFileName)
		return
	}
	http.ServeFileFS(w, r, embeddedFiles, path.Join(distFolder, r.URL.Path))
}
