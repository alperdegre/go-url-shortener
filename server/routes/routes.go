package routes

import (
	"crypto"
	"encoding/hex"
	"github.com/alperdegre/go-url-shortener/db"
	constants "github.com/alperdegre/go-url-shortener/util"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

type Router struct {
	Db db.DB
}

type authUser struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type shortenUrlRequest struct {
	Url string `json:"url" binding:"required"`
}

type CustomJWTClaims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func (r *Router) CreateShortenedUrl(ctx *gin.Context) {
	var reqJson shortenUrlRequest

	// Get the user id from the context
	userID := ctx.MustGet(constants.USER_KEY).(uint)

	// Parse the request body
	if err := ctx.ShouldBindJSON(&reqJson); err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	existingLongUrl := r.Db.GetURLFromLongURL(reqJson.Url, userID)

	if existingLongUrl.ShortURL != "" {
		ctx.JSON(http.StatusOK, gin.H{"url": existingLongUrl.ShortURL})
		return
	}

	// Create a hash from the URL
	hashedUrl := r.createHash(reqJson.Url)

	// Add the shortened url and get it from the db
	shortenedUrl, err := r.Db.CreateURL(hashedUrl, reqJson.Url, userID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Return the shortened URL
	ctx.JSON(http.StatusOK, gin.H{"url": shortenedUrl})
}

func (r *Router) GetShortenedUrl(ctx *gin.Context) {
	// Get hashed url from the param
	hash := ctx.Param("hash")

	// Check db and get the URL struct which has the long and short URL
	url, err := r.Db.GetURLFromShortURL(hash)

	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	// If the URL exists, redirect to the long URL
	ctx.Redirect(http.StatusMovedPermanently, url.LongURL)
}

func (r *Router) SignUp(ctx *gin.Context) {
	// Parse the request body
	var reqJson authUser
	if err := ctx.ShouldBindJSON(&reqJson); err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := r.Db.GetUser(reqJson.Username)

	// Check if the user already exists
	if err != gorm.ErrRecordNotFound {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	// Generates a hashed password
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(reqJson.Password), bcrypt.DefaultCost)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Convert bytes to string
	hashedPassword := string(hashedBytes)

	// Create a user
	user, err := r.Db.CreateUser(reqJson.Username, hashedPassword)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	expireToken := time.Now().Add(time.Hour * 24).Unix()

	claims := &CustomJWTClaims{
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			Id:        strconv.Itoa(int(user.ID)),
			ExpiresAt: expireToken,
		},
	}

	// Create a token with the user id, username and a 24 hour expiration time
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(jwtSecret))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": tokenString, "userID": user.ID, "expiry": expireToken})
}

func (r *Router) Login(ctx *gin.Context) {
	// Parse the request body
	var reqJson authUser

	if err := ctx.ShouldBindJSON(&reqJson); err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Check if the user exists
	user, err := r.Db.GetUser(reqJson.Username)

	if err == gorm.ErrRecordNotFound {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User does not exist"})
		return
	}

	// Compare the hashed password with the password in the request
	hashErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(reqJson.Password))

	if hashErr != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
		return
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	expireToken := time.Now().Add(time.Hour * 24).Unix()

	claims := &CustomJWTClaims{
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			Id:        strconv.Itoa(int(user.ID)),
			ExpiresAt: expireToken,
		},
	}

	// Create a token with the user id, username and a 24 hour expiration time
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(jwtSecret))

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Return the token
	ctx.JSON(http.StatusOK, gin.H{"token": tokenString, "userID": user.ID, "expiry": expireToken})
}

func (r *Router) DeleteUrl(ctx *gin.Context) {
	// Get url id from the param
	urlID := ctx.Param("urlID")

	err := r.Db.DeleteUrl(urlID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "URL deleted"})
}

func (r *Router) GetURLs(ctx *gin.Context) {
	// Get the user id from the context
	userID := ctx.MustGet(constants.USER_KEY).(uint)

	// Get all the URLs of the user
	urls, err := r.Db.GetUserURLs(userID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Return the URLs
	ctx.JSON(http.StatusOK, gin.H{"urls": urls})
}

func (r *Router) createHash(url string) string {
	var hash string
	var urlRecord db.URL

	for {
		// Create a SHA256 hash of the URL and take the first 10 characters
		hasher := crypto.SHA256.New()
		hasher.Write([]byte(url))
		hash = hex.EncodeToString(hasher.Sum(nil))[:10]

		if err := r.Db.Pool.Where("short_url = ?", hash).First(&urlRecord).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				// Hash does not exist in the database, break the loop
				break
			} else {
				// An error occurred while querying the database
				log.Println(err)
				return ""
			}
		}

		// Hash exists in the database, modify the url and try again
		url += "1"
	}

	return hash
}
