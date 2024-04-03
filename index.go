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

	gormDb, err := db.InitDB();

	if err != nil {
		log.Fatal(err);
	}

	app := &App{
		router: routes.Router{
			Db: db.DB{
				Pool: gormDb,
			},
		},
	}

	app.router.Db.TryMigrations();

	router := gin.Default();

	router.GET("/:hash", app.router.GetShortenedUrl)

	auth := router.Group("/auth")
	{
		auth.POST("/login", app.router.Login)
		auth.POST("/signup", app.router.SignUp)
	}

	api := router.Group("/api")
	{
		api.Use(AuthMiddleware)
		{
			api.POST("/shorten", app.router.CreateShortenedUrl)
		}
	}

	router.Run();
}

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

	claims, ok := parsed.Claims.(jwt.MapClaims)

	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		ctx.Abort();
		return
	}

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