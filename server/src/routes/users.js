const express = require('express');
const router = express.Router();

// Example route — replace with real DB logic
router.get('/', async (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

module.exports = router;
