const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const dbConfig = require('./knexfile.js');

const db = knex(dbConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

// list all cohorts
// [GET] /api/cohorts This route will return an array of all cohorts.
server.get('/api/cohorts', async (req, res) => {
  try {
    const cohorts = await db('cohorts');
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json(error);
  }
})

// [POST] /api/cohorts This route should save a new cohort to the database.
server.post('/api/cohorts', async (req, res) => {
  try {
    const [id] = await db('cohorts').insert(req.body);
    const cohort = await db('cohorts')
      .where({ id })
      .first();
    res.status(201).json(cohort);
  } catch (error) {
    res.status(500).json(error);
  }
})

// [GET] /api/cohorts/:id This route will return the cohort with the matching id.
server.get('/api/cohorts/:id', async (req, res) => {
  try {
    const cohort = await db('cohorts')
      .where({id: req.params.id})
      .first();
      if (cohort){
        res.status(200).json(cohort);
      } else {
        res.status(404).json({message: 'Record does not exist'});
      }
  } catch (error) {
    res.status(500).json(error);
  }
})

// [GET] /api/cohorts/:id/students returns all students for the cohort with the specified id.
server.get('/api/cohorts/:id/students', async (req, res) => {
  const {id} = req.params;
  try {
    const students = await db('students')
      .where('cohort_id', id)
      res.status(200).json(students);
  } catch (error) {
    res.status(500).json(error);
  }
})

// [PUT] /api/cohorts/:id This route will update the cohort with the matching id using information sent in the body of the request.
server.put('/api/cohorts/:id', async (req, res) => {
  try {
    const count = await db('cohorts')
      .where({id: req.params.id})
      .update(req.body);
    if (count > 0) {
      const cohort = await db('cohorts')
      .where({id: req.params.id})
      .first();
    res.status(200).json(cohort);
    } else {
      res.status(404).json({message: 'Record not found.'});
    }
  } catch (error) {
    res.status(500).json(error);
  }
})

// [DELETE] /api/cohorts/:id This route should delete the specified cohort.
server.delete('/api/cohorts/:id', async (req, res) => {
  try {
    const count = await db('cohorts')
      .where({id: req.params.id})
      .del();
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({error: 'Record not found'});
      }
  } catch (error) {
    res.status(500).json(error);
  }
})

// list all students
server.get('/api/students', async (req, res) => {
  try {
    const students = await db('students');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json(error)
  }
})

const port = 5000;
server.listen(port, () => console.log(`server is listening on port ${port}`))