const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const routes = express.Router();

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

routes.post('/devs', celebrate({
  [Segments.BODY] : Joi.object().keys({
    github_username: Joi.string().required(),
    techs: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  })
}), DevController.create);

routes.get('/devs', DevController.index);
routes.get('/search', celebrate({
  [Segments.QUERY] : Joi.object().keys({
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    techs: Joi.string().required(),
  })
}), SearchController.index);

module.exports = routes;