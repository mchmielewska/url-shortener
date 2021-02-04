exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('urls')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('urls').insert([
        {
          id: 1,
          fullUrl: 'https://redux.js.org/style-guide/style-guide',
          shortUrl: 'x79iW0',
          createdAt: '2021-02-03 12:56:35',
        },
      ]);
    })
    .then(function () {
      return knex('urls').insert([
        {
          id: 2,
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'qlakeR',
          createdAt: '2021-02-03 12:58:34',
        },
      ]);
    })
    .then(function () {
      return knex('urls').insert([
        {
          id: 3,
          fullUrl:
            'https://dev.to/rukykf/integration-testing-with-nodejs-jest-knex-and-sqlite-in-memory-databases-2ila',
          shortUrl: '7QQ4r3',
          createdAt: '2021-02-03 13:00:19',
        },
      ]);
    });
};
