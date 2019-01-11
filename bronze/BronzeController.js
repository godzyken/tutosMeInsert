var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var Bronze = require('./bronze');

router.get('/', function (req, res) {
    Bronze.getbronze(function (err, rows) {
        if(err) {
            res.status(400).json(err);
        }
        else
        {
            res.json(rows);
        }
    });
});

router.post('/', function (req, res) {
    Bronze.createbronze(req.body, function (err, count) {
        if(err) {
            res.status(400).json(err);
        }
        else
        {
            res.json(req.body);
        }
    });
});

module.exports = router;