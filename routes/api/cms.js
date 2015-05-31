var express = require('express');
var router = express.Router();
var cms = require("../../utils/cms");

// SPA FTW!
router.get('/', function(req, res, next) {
	
	cms(function(error, content) {
		
		if (!error && content) {
			res.json(content);
		}
		else {
			// Internal Server Error
			res.render(500, error);
		}
		
	});
	
});

module.exports = router;