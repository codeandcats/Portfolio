var request = require("request");

var cmsUrl =
	process.env.CMS_URL +
	"/wp-json/posts?fields=id,title,type,content,terms&filter[posts_per_page]=1000";

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

function getWorkHistory(posts) {
	
	var result = [];
	
	for (var index = 0; index < posts.length; index++) {
		
		var post = posts[index];
		
		var category =
			post.terms && post.terms.category && 
			post.terms.category.length && post.terms.category[0] &&
			post.terms.category[0].name;
			
		if (category == "Work History") {
			
			var job = postToJob(post);
			
			result.push(job);
			
		}
		
	}
	
	return result;
}

function postToJob(post) {
	
	var company = post.post_meta && post.post_meta.company;
			
	var yearStarted = post.post_meta && post.post_meta.yearStarted;
	var yearEnded = post.post_meta && post.post_meta.yearEnded;
	var years =
		yearEnded && yearEnded != yearStarted ?
		yearStarted + " - " + yearEnded :
		yearStarted == yearEnded ?
		yearStarted :
		yearStarted + " - Present";
	
	var job = {
		title: post.title,
		company: company,
		years: years,
		description: post.content
	};
			
	return job;
}