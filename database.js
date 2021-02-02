const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = 'db.sqlite';

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(
      `CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullUrl TEXT, 
            shortUrl TEXT UNIQUE,
            createdAt TIMESTAMP
            )`,
      (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
      }
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS stats (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              urlId INTEGER, 
              date TIMESTAMP,
              FOREIGN KEY(urlId) REFERENCES urls(id)
              )`,
      (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
      }
    );
  }
});

module.exports = db;
