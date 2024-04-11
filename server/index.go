package main

import (
	"fmt"
	"github.com/alperdegre/go-url-shortener/db"
	"github.com/alperdegre/go-url-shortener/routes"
	constants "github.com/alperdegre/go-url-shortener/util"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"log"
	"net/http"
	"os"
	"strconv"
)

type App struct {
	router routes.Router
}

func main() {
	// Initializes db and gets the pointer to the gorm.DB instance
	gormDb, err := db.InitDB()

	if err != nil {
		log.Fatal(err)
	}

	// Initializes the App struct with the router
	app := &App{
		router: routes.Router{
			Db: db.DB{
				Pool: gormDb,
			},
		},
	}

	// Tries to run the migrations
	app.router.Db.TryMigrations()

	// Router
	router := gin.Default()

	// CORS
	config := cors.DefaultConfig()
	config.AllowCredentials = true
	config.AllowOrigins = []string{"http://localhost:4000", "https://localhost:4000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}

	router.Use(cors.New(config))

	// Public get route thtat redirects to the original URL
	router.GET("/:hash", app.router.GetShortenedUrl)

	// Auth routes
	auth := router.Group("/auth")
	{
		auth.POST("/login", app.router.Login)
		auth.POST("/signup", app.router.SignUp)
	}

	// API routes
	api := router.Group("/api")
	{
		api.Use(AuthMiddleware)
		{
			api.GET("/get", app.router.GetURLs)
			api.POST("/shorten", app.router.CreateShortenedUrl)
			api.POST("/delete/:urlID", app.router.DeleteUrl)
		}
	}

	router.Run(":3000")
}

// AuthMiddleware checks the Authorization header and validates the JWT token
func AuthMiddleware(ctx *gin.Context) {
	jwtSecret := os.Getenv("JWT_SECRET")
	token := ctx.GetHeader("Authorization")

	if token == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort()
		return
	}

	// Parses the token and validates it
	parsed, err := jwt.ParseWithClaims(token, &routes.CustomJWTClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("there was an error while parsing the token")
		}

		return []byte(jwtSecret), nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort()
		return
	}

	if !parsed.Valid {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort()
		return
	}

	// Gets the claims out of parsed token
	claims, ok := parsed.Claims.(*routes.CustomJWTClaims)

	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort()
		return
	}

	userId, err := strconv.ParseUint(claims.Id, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		ctx.Abort()
		return
	}

	ctx.Set(constants.USER_KEY, uint(userId))
	ctx.Next()
}

