# Shortster

## General info
A Node.js API to shorten urls provided by user. The user inputs a long (full) URL and optionally a short identifier, and a shorter version of the URL that redirects to the full url is returned. This can be very useful for sharing long links.

We call the short identifier "a shortcode". A shortcode can be generated automatically or specified by the user. By accessing the **/:shortcode:** path, the user will be redirected to the full url which was provided when creating the shortcode record.

The API will not allow the user to create a new shortcode entry if the shortcode has already been used.

### General assumptions
- the **user** is any person using API, API can be used without any additional logging (no users table in the database),
- the shortcode can be automatically created by the API if not provided by the user - **(6 characters long, may contain digits, upper case letters, and lowercase letters. The codes are case sensitive)**,
- the shortcode can be customized - it has to match the criteria **(no special characters, at least 4 characters long)**,
- the **user can generate reports for the created shortcodes** - a report for a single shortcode will contain a click count, the date when the record was added to DB, and the date of the last visit

## Technologies
The project was created using:
* Node.js 14.15.4 - compatibile with versions >14.0.0
* Express.js 4.17.1
* Knex 0.21.17 for SQL queries, setup for SQLite3 5.0.1
* Mocha 8.2.1, Chai 4.2.0 (with Chai-http 4.3.0) and Sinon 9.2.4 for tests, Istanbul for test coverage report

## Setup

To run the project locally, go to the project directory and run:

### `npm install`

firstly, to install all the dependencies for the app.
Before running the API in development mode, make sure that the NODE_ENV variable is not set to "test".
To seed the DB with initial data, run the command:

```
npx knex seed:run --env development
```

### `npm start`

to run the app. By default, the app will run on port 4000. When running locally, the base URL will be:
```
http://localhost:4000
```

## Tests

To run the tests, set the **NODE_ENV** variable to **"test"**. Test data will be inserted to DB automatically before the tests.

### `npm test`

to launch the test runner in the interactive watch mode

### `npm test-with-coverage`

to launch the test runner in the interactive watch mode with the coverage report

## Usage

The base URL for the api on a local environment:
```
http://localhost:4000
```
## Routes:
```
GET / - retrieve all urls added to database
POST / - add a new url to the database
GET /:shortcode - redirect to the full url provided for the shortcode
GET /:shortcode/stats - retrieve stats for the shortcode
```

### Assumptions:
- **no PATCH route for single shortcode** - user cannot change the added shortcode. This is done to prevent malicious behavior. For instance, somebody else could change a once shared code, and create a security risk.
- **no DELETE route for single shortcode** - user cannot delete the added shortcode, if it would be deleted and new record for the same shortcode would be added, it could lead to redirecting to a wrong url.

In case of problems with the DB connection, the user will receive an error message for the request.

### GET /
**Retrieving all urls added to database**

The response:
```
HTTP/1.0 200 OK
Content-Type: application/json
[
  {
    "id": 1,
    "fullUrl": "...",
    "shortUrl": "...",
    "createdAt": "..."
  },
  {
    ...
  }
]
```

### POST /
**Adding new record**

#### Parameters
```
  {
    "fullUrl": "...",
    "shortUrl": "...",
  }
```
The **shortUrl** is optional, in case is not provided (only **fullUrl** in the request), API will generate unique shortcode (exactly 6 characters long).

**shortUrl** provided by user should match the criteria: can contain digits, upper case letters, and lowercase letters and be at least 4 characters long.

API will respond with an error if the **shortUrl** is not correct or already used.

#### Response

The response will be the newly created record:
```
HTTP/1.0 200 OK
Content-Type: application/json
{
    "id": ...,
    "fullUrl": "...",
    "shortUrl": "...",
    "createdAt": "..."
}
```
### GET /:shortcode
**Redirecting to full url provided for the shortcode**

User will be redirected to the url provided for shortcode, it shortcode is valid. 
New visit will be added to the DB (to count clicks and dates of visits).

### GET /:shortcode/stats
**Retrieving stats for provided shortcode (if valid)**

The response:
```
HTTP/1.0 200 OK
Content-Type: application/json
{
    "id": ..,
    "shortUrl": "...",
    "fullUrl": "...",
    "createdAt": "...",
    "clicks": ...,
    "lastVisit": "..."
}
```
If the shortcode has not been used, the clicks will be equal 0, lastVisit - null.
