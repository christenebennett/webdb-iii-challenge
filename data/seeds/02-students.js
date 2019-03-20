
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {id: 1, name: 'Molly', cohort_id: '1'},
        {id: 2, name: 'Dana', cohort_id: '2'},
        {id: 3, name: 'George', cohort_id: '3'}
      ]);
    });
};
