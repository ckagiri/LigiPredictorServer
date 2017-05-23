import {Express, Request, Response} from 'express';

module.exports = (app: Express) => {
  app.use((req, res, next) => {
    if (req.query.id) {
      req.query._id = req.query.id
      delete req.query.id
    }
    next()
  })
}