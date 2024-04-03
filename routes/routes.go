package routes

import (
	"crypto"
	"encoding/hex"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/alperdegre/go-url-shortener/db"
	constants "github.com/alperdegre/go-url-shortener/util"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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

func (r *Router) CreateShortenedUrl(ctx *gin.Context){
	var reqJson shortenUrlRequest;

	userID := ctx.MustGet(constants.USER_KEY).(uint);

	if err := ctx.ShouldBindJSON(&reqJson); err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	hashedUrl := r.createHash(reqJson.Url);

	shortenedUrl, err := r.Db.CreateURL(hashedUrl, reqJson.Url, userID);

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"url": shortenedUrl});
}

func (r *Router) GetShortenedUrl(ctx *gin.Context){
	hash := ctx.Param("hash");

	url, err := r.Db.GetURL(hash);

	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	ctx.Redirect(http.StatusMovedPermanently, url.LongURL);
}

func (r *Router) SignUp(ctx *gin.Context){
	var reqJson authUser;

	if err := ctx.ShouldBindJSON(&reqJson); err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	envErr := godotenv.Load()
	if envErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	_, err := r.Db.GetUser(reqJson.Username);

	if err != gorm.ErrRecordNotFound {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost);

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	hashedPassword := string(hashedBytes);

	user, err := r.Db.CreateUser(reqJson.Username, hashedPassword);

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	jwtSecret := os.Getenv("JWT_SECRET");
	expireToken := time.Now().Add(time.Hour * 24).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": user.ID,
		"username": user.Email,
		"exp": expireToken,
	});

	tokenString, err := token.SignedString([]byte(jwtSecret));

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": tokenString});
}

func (r *Router) Login(ctx *gin.Context){
	var reqJson authUser;

	if err := ctx.ShouldBindJSON(&reqJson); err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	envErr := godotenv.Load()
	if envErr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	user, err := r.Db.GetUser(reqJson.Username);

	if err == gorm.ErrRecordNotFound {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User does not exist"})
		return
	}

	hashErr := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(reqJson.Password));

	if hashErr != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
		return
	}

	jwtSecret := os.Getenv("JWT_SECRET");
	expireToken := time.Now().Add(time.Hour * 24).Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": user.ID,
		"username": user.Email,
		"exp": expireToken,
	});

	tokenString, err := token.SignedString([]byte(jwtSecret));

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"token": tokenString});
}

func (r *Router) createHash(url string) string {
	var hash string
	var urlRecord db.URL;

    for {
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