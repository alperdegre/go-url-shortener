package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email        string
	Password     string  
}

type URL struct {
	gorm.Model
	ShortURL string
	LongURL  string
	UserID   uint
	User     User
}

type DB struct {
 	Pool *gorm.DB
}

func InitDB() (*gorm.DB, error) {
	envErr := godotenv.Load()
	if envErr != nil {
		log.Fatal();
	}

	// Get DB connection string from .env
	dbConnectionString := os.Getenv("DATABASE_URL");

	if dbConnectionString == "" {
		log.Fatal("DATABASE_URL env variable is not set");
	}

	// Connect to the postgres DB using GORM
	for i := 0; i < 3; i++ {
		gormDb, err := gorm.Open(postgres.New(postgres.Config{
			DSN: dbConnectionString,
		}), &gorm.Config{})
		if err == nil {
			return gormDb, nil
		}
		fmt.Printf("[%d/3] - Error connecting to DB, retrying in 5 seconds...\n", i + 1);
		time.Sleep(5 * time.Second)
	}

	log.Fatal("Error connecting to DB");
	return nil, nil
}

func (db *DB) TryMigrations() {
	// Run the GORM auto migrate on DB
	err := db.Pool.AutoMigrate(&User{}, &URL{})

	// If there is an error, log it and exit
	if err != nil {
		log.Printf("There was an error while migrating");
		log.Fatal(err)
	}
}

// Gets the user from db using the email and returns it
func (db *DB) GetUser(email string) (User, error) {
	var user User;
	result := db.Pool.Where("email = ?", email).First(&user);

	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

// Creates a new user with the provided email and hashed password
func (db *DB) CreateUser(email string, password string) (User, error){
	db.Pool.Create(&User{Email: email, Password: password});

	user, err := db.GetUser(email);

	if err != nil {
		return user, err
	}

	return user, nil
}

// Creates a new URL with the provided short URL, long URL and user ID
func (db *DB) CreateURL(shortURL string, longURL string, userID uint) (string, error) {
	db.Pool.Create(&URL{ShortURL: shortURL, LongURL: longURL, UserID: userID});

	return shortURL, nil
}

// Gets the URL from the db using the short URL and returns it
func (db *DB) GetURLFromShortURL(shortURL string) (URL, error) {
	var url URL;
	result := db.Pool.Where("short_url = ?", shortURL).First(&url);

	if result.Error != nil {
		return url, result.Error
	}

	return url, nil
}

func (db *DB) GetURLFromLongURL(longURL string, userID uint) (URL, error) {
	var url URL;
	result := db.Pool.Where("long_url = ? AND user_id = ?", longURL, userID).First(&url);

	if result.Error != nil {
		return url, result.Error
	}

	return url, nil
}

func (db *DB) DeleteUrl(urlID string) error {
	db.Pool.Where("id = ?", urlID).Delete(&URL{});

	return nil
}

func (db *DB) GetUserURLs(userID uint) []URL {
	log.Printf("User Id From Func: %d ", userID);
	var urls []URL;
	result := db.Pool.Find(&urls);

	if result.Error != nil {
		log.Println(result.Error);
		return nil
	}

	return urls
}