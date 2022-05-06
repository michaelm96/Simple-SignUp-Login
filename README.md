# Simple App

A simple sign up / sign in app.


## Installation
#### to run in the local:

Clone:

```bash
  git clone https://github.com/michaelm96/Simple-SignUp-Login.git
```

Server:

```bash
  cd  Simple-SignUp-Login/server
  npm install // install the depedencies
  nodemon // running the server
```

### Note: Don't forget to fill the .env file

Client:

```bash
  cd  Simple-SignUp-Login/client
  npm install // install the depedencies
  npm run start // running the client
```

### Note: Don't forget to fill the .env file
    
## Documentation

#### For documentation click this [link](https://documenter.getpostman.com/view/13824226/UyxbsAYV) that will open the postman documentation.



## Demo

### Server
https://michael.surf

### Client
https://main.d380i5iq3nakdg.amplifyapp.com

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Server

`GOOGLE_CLIENT_ID`
`SECRET_KEY`
`FRONTEND_LINK`
`FROM_EMAIL`
`EMAIL_PASS`
`CRYPTR_KEY`
`SALT_ROUNDS`

### Client

`REACT_APP_BACKEND_URL`
`REACT_APP_GOOGLE_CLIENT_ID`
`REACT_APP_FACEBOOK_APP_ID`


## Tech Stack

**Client:** React, Material UI, Moment.js.

**Server:** Node, Express, Sequelize, Postgres, Nodemailer, Moment.js, JWT.

