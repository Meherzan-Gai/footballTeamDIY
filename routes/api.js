const express = require('express');
const router = express.Router();
const { BalldontlieAPI } = require('@balldontlie/sdk');

const api = new BalldontlieAPI({ apiKey: "f96a7ffe-aa3d-4bc5-a23e-1a827ef765d6" });

router.get('/teams', async (req, res) => {
  console.log('GET /teams triggered');
  try {
    const response = await api.nfl.getTeams();
    res.render('getinfo', { result: response.data, error: null });
  } catch (err) {
    console.error(err);
    res.render('getinfo', { result: null, error: 'Failed to fetch teams.' });
  }
});

router.get('/players', async (req, res) => {
  console.log('GET /players triggered');
  try {
    const response = await api.nfl.getPlayers();
    res.render('getinfo', { result: response.data, error: null });
  } catch (err) {
    console.error(err);
    res.render('getinfo', { result: null, error: 'Failed to fetch players.' });
  }
});

router.get('/player/search', async (req, res) => {
  const query = req.query.search;
  console.log(`GET /player/search?search=${query}`);
  if (!query) return res.render('getinfo', { result: null, error: 'Player name is required.' });

  try {
    const response = await api.nfl.getPlayers({ search: query });
    if (response.data.length === 0) {
      res.render('getinfo', { result: null, error: 'Player not found.' });
    } else {
      res.render('getinfo', { result: response.data[0], error: null });
    }
  } catch (err) {
    console.error(err);
    res.render('getinfo', { result: null, error: 'Error searching for player.' });
  }
});

router.get('/team/search', async (req, res) => {
  const query = req.query.search;
  console.log(`GET /team/search?search=${query}`);
  if (!query) return res.render('getinfo', { result: null, error: 'Team name is required.' });

  try {
    const response = await api.nfl.getTeams();
    const match = response.data.find(team =>
      team.full_name.toLowerCase().includes(query.toLowerCase())
    );

    if (!match) {
      res.render('getinfo', { result: null, error: 'Team not found.' });
    } else {
      res.render('getinfo', { result: match, error: null });
    }
  } catch (err) {
    console.error(err);
    res.render('getinfo', { result: null, error: 'Error searching for team.' });
  }
});



module.exports = router;