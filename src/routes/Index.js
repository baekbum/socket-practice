const express = require('express');
const router = express.Router();
 
/* GET home page. */
router.get('/', (req, res) => {
    console.log('홈');
});

module.exports = router;