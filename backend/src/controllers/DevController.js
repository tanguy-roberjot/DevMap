const axios = require('axios');
const Dev = require('../models/Dev');
const { findConnections, sendMessage } = require('../websocket');
module.exports = {
  async create(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;
   
    let dev = await Dev.findOne({ github_username });
    if(!dev){
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
      const techsArray = techs.split(',').map(tech => tech.trim());
      let { name, avatar_url, bio, login} = apiResponse.data;
      if(!name){
        name = login;
      }

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
      try{
        dev = await Dev.create({
          github_username,
          name,
          avatar_url,
          bio,
          techs: techsArray,
          location
        });
      } catch(err) {
        console.log(err)
      }
      const sendMessageTo = findConnections({ latitude, longitude }, techsArray);
      console.log(sendMessageTo);
      sendMessage(sendMessageTo, 'new-dev', dev);
    }
    return res.json(dev);
  },

  async index(req, res){
    const devs = await Dev.find();

    return res.json(devs);
  }
}