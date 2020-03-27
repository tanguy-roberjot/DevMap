const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
  async index(req, res){
    const { latitude, longitude, techs } = req.query;
    const techsArray = techs.split(',').map(tech => tech.trim());
    console.log(techsArray);

    const devs = await Dev.find({
      techs: {
        $in: techsArray
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    })
    return res.json({ devs });
  }
}