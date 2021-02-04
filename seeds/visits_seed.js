exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('visits')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('visits').insert([
        { id: 1, urlId: 1, date: '2021-02-03 14:42:44' },
      ]);
    })
    .then(function () {
      return knex('visits').insert([
        { id: 2, urlId: 1, date: '2021-02-03 14:54:34' },
      ]);
    })
    .then(function () {
      return knex('visits').insert([
        { id: 3, urlId: 2, date: '2021-02-03 15:23:34' },
      ]);
    })
    .then(function () {
      return knex('visits').insert([
        { id: 4, urlId: 2, date: '2021-02-03 18:50:00' },
      ]);
    })
    .then(function () {
      return knex('visits').insert([
        { id: 5, urlId: 2, date: '2021-02-03 20:54:34' },
      ]);
    });
};
