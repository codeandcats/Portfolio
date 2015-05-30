var request = require("request");

// TODO: Turn this into env var
var cmsUrl = process.env.CMS_URL;

module.exports = function(callback) {
	
	request(cmsUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			
			var posts = JSON.parse(body);
			
			var content = {
				workHistory: getWorkHistory(posts), 
				footer: 
					"Copyright © Ben Daniel " + 
					(new Date()).getFullYear() + 
					". Written with Node.js, Express, Jade, Less, Bootstrap."
			};
			
			callback(null, content);
		}
	});
	
};

function getWorkHistory(posts)
{
	var result = [];
	
	for (var index = 0; index < posts.length; index++) {
		
		var post = posts[index];
		
		var category =
			post.terms && post.terms.category && 
			post.terms.category.length && post.terms.category[0] &&
			post.terms.category[0].name;
		
		if (category == "Work History") {
			
			var job = {
				title: post.title,
				company: post.post_meta && post.post_meta.company,
				years: post.post_meta && post.post_meta.years,
				description: post.content
			};
			
			result.push(job);
			
		}
		
	}
	
	return result;
}