package db

import (
	"log"
	"os"
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
	gormDb, err := gorm.Open(postgres.New(postgres.Config{
		DSN: dbConnectionString,
	}), &gorm.Config{})

	if err != nil {
		log.Fatal(err)
	}

	return gormDb, nil
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
func (db *DB) GetURL(shortURL string) (URL, error) {
	var url URL;
	result := db.Pool.Where("short_url = ?", shortURL).First(&url);

	if result.Error != nil {
		return url, result.Error
	}

	return url, nil
}