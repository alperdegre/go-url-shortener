package db

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"time"
)

type User struct {
	gorm.Model
	Username string
	Password string
}

type URL struct {
	ID        uint `gorm:"primarykey"`
	CreatedAt time.Time
	ShortURL  string
	LongURL   string
	UserID    uint
	User      User
}

type DB struct {
	Pool *gorm.DB
}

func InitDB() (*gorm.DB, error) {
	// Get DB connection string from .env
	dbConnectionString := os.Getenv("DATABASE_URL")
	fmt.Println(dbConnectionString)
	if dbConnectionString == "" {
		log.Fatal("DATABASE_URL env variable is not set")
	}

	// Connect to the postgres DB using GORM
	for i := 0; i < 3; i++ {
		gormDb, err := gorm.Open(postgres.New(postgres.Config{
			DSN: dbConnectionString,
		}), &gorm.Config{})
		if err == nil {
			return gormDb, nil
		}
		fmt.Printf("[%d/3] - Error connecting to DB, retrying in 5 seconds...\n", i+1)
		time.Sleep(5 * time.Second)
	}

	log.Fatal("Error connecting to DB")
	return nil, nil
}

func (db *DB) TryMigrations() {
	// Run the GORM auto migrate on DB
	err := db.Pool.AutoMigrate(&User{}, &URL{})

	// If there is an error, log it and exit
	if err != nil {
		log.Printf("There was an error while migrating")
		log.Fatal(err)
	}
}

// Gets the user from db using the username and returns it
func (db *DB) GetUser(username string) (User, error) {
	var user User
	result := db.Pool.Where("username = ?", username).First(&user)

	if result.Error != nil {
		return user, result.Error
	}

	return user, nil
}

// Creates a new user with the provided username and hashed password
func (db *DB) CreateUser(username string, password string) (User, error) {
	db.Pool.Create(&User{Username: username, Password: password})

	user, err := db.GetUser(username)

	if err != nil {
		return user, err
	}

	return user, nil
}

// Creates a new URL with the provided short URL, long URL and user ID
func (db *DB) CreateURL(shortURL string, longURL string, userID uint) (string, error) {
	db.Pool.Create(&URL{ShortURL: shortURL, LongURL: longURL, UserID: userID})

	return shortURL, nil
}

// Gets the URL from the db using the short URL and returns it
func (db *DB) GetURLFromShortURL(shortURL string) (URL, error) {
	var url URL
	result := db.Pool.Where("short_url = ?", shortURL).First(&url)

	if result.Error != nil {
		return url, result.Error
	}

	return url, nil
}

func (db *DB) GetURLFromLongURL(longURL string, userID uint) URL {
	var url URL
	result := db.Pool.Where("long_url = ? AND user_id = ?", longURL, userID).First(&url)

	if result.Error != nil {
		return url
	}

	return url
}

func (db *DB) DeleteUrl(urlID string) error {
	db.Pool.Where("id = ?", urlID).Delete(&URL{})

	return nil
}

func (db *DB) GetUserURLs(userID uint) ([]URL, error) {
	log.Printf("User Id From Func: %d ", userID)
	var urls []URL
	result := db.Pool.Find(&urls)

	if result.Error != nil {
		log.Println(result.Error)
		return nil, result.Error
	}

	return urls, nil
}
