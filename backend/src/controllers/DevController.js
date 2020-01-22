const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
  
      // se name não existir, vai receber os dados do login
      const { name = login, avatar_url, bio } = apiResponse.data;
    
      const techsArray = parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });
    }
  
    return res.json(dev);
  },

  async update(req, res) {
    const { name, bio, avatar_url, techs, latitude, longitude } = req.body;

    let editedDev = await Dev.findById(req.params.id);

    if (techs) {
      const techsArray = parseStringAsArray(techs);
      editedDev.techs = techsArray;
    } else {
      editedDev.techs = editedDev.techs;
    }

    if (latitude && longitude) {
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
      editedDev.location = location;
    } else {
      editedDev.location = editedDev.location;
    }
    
    editedDev.name = name || editedDev.name;
    editedDev.avatar_url = avatar_url || editedDev.avatar_url;
    editedDev.bio = bio || editedDev.bio;

    const result = await editedDev.save();

    return res.json(result);
  },

  async destroy(req, res) {
    const deletedDev = await Dev.findByIdAndDelete(req.params.id);

    return res.json({ message: `Dev deleted: ${deletedDev.name}` })
  },
};