# GO URL SHORTENER

GO Url Shortener *- you guessed it -* a URL shortener made with Go.

I wanted to learn Go so I decided to make a URL shortener with it as a first project.

It uses React for frontend, PostgreSQL in a container as a DB and Go for the backend.

## Features

- Shorten URLs
- Redirect to original URL
- View all shortened URLs
- Delete shortened URLs
- Simple Authentication

## Tech Stack

- Go
- PostgreSQL
- React
- Docker + Docker Compose

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Setup and Installation

1. Clone the repo
   ```bash
   git clone https://github.com/alperdegre/go-url-shortener.git
   cd go-url-shortener
    ```
2. Start the app
   ```bash
   docker-compose up
   ```
3. Open [http://localhost:4000](http://localhost:4000) in your browser

And thats it! Theres a default .env file in the root directory. Feel free to change the values to your liking.

## License

Distributed under the MIT License. See `LICENSE` for more information.
    
