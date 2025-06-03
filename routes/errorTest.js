const express = require('express');
const router = express.Router();

router.get('/trigger-error', (req, res, next) => {
  // Intentional error
  const error = new Error('Intentional server error');
  error.status = 500;
  next(error);
});

module.exports = router;