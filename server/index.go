package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/alperdegre/go-url-shortener/db"
	"github.com/alperdegre/go-url-shortener/routes"
	constants "github.com/alperdegre/go-url-shortener/util"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
)

type App struct {
	router routes.Router
}

func main(){
	envErr := godotenv.Load()

	if envErr != nil {
		log.Fatal();
	}

	port := os.Getenv("PORT");

	if port == "" {
		log.Fatal("PORT env variable is not set");
	}

	// Initializes db and gets the pointer to the gorm.DB instance
	gormDb, err := db.InitDB();

	if err != nil {
		log.Fatal(err);
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
	app.router.Db.TryMigrations();

	// Router
	router := gin.Default();

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
			api.POST("/shorten", app.router.CreateShortenedUrl)
		}
	}

	router.Run();
}

// AuthMiddleware checks the Authorization header and validates the JWT token
func AuthMiddleware(ctx *gin.Context){
	envErr := godotenv.Load()
	if envErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	jwtSecret := os.Getenv("JWT_SECRET");
	token := ctx.GetHeader("Authorization");

	if token == "" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort();
		return
	}

	// Parses the token and validates it
	parsed, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("there was an error while parsing the token")
		}

		return []byte(jwtSecret), nil
	})

	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort();
		return
	}

	if !parsed.Valid {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort();
		return
	}

	// Gets the claims out of parsed token
	claims, ok := parsed.Claims.(jwt.MapClaims)

	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort();
		return
	}

	// Checks the id claim, converts it to uint and sets it to the context
	if id, ok := claims["id"].(float64); ok {
		userId := uint(id)
		ctx.Set(constants.USER_KEY, userId);
		ctx.Next();
	} else {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		ctx.Abort();
		return
	}
}