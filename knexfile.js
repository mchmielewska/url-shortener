// Update with your config settings.

module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: './data/db_test.sqlite3',
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    useNullAsDefault: true,
  },
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/db.sqlite3',
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      },
    },
  },
};
