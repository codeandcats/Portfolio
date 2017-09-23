var request = require("request");
var linq = require("./linq");

var cmsUrl =
	process.env.CMS_URL +
	"/wp-json/posts?fields=id,title,type,content,terms&filter[posts_per_page]=1000";

module.exports = function(callback) {

	request(cmsUrl, function (error, response, body) {

		if (!error && response.statusCode == 200) {

			var posts = JSON.parse(body);

			var content = {
				skills: getSkills(posts),
				education: getEducation(posts),
				workHistory: getWorkHistory(posts),
				contact: {
					emailAddress: process.env.CONTACT_EMAIL_ADDRESS
				},
				footer:
					"Copyright © Ben Daniel " +
					(new Date()).getFullYear() +
					". Written with Node.js, Express, Jade, Less, Bootstrap."
			};

			callback(null, content);
		}
	});

};

function getSkills(posts) {

	var result = linq
		.From(posts)
		.Where(function(post) { return getPostCategory(post) == "Skills"; })
		.Select(function(post) { return getSkillsFromPost(post) })
		.OrderBy(function(skills) { return skills.order; })
		.ToArray();

	return result;
}

function getSkillsFromPost(post) {

	var result = {
		title: post.title,
		order: post.post_meta && post.post_meta.order,
		columns: []
	};

	var lines = (post.content || "").trim().split("\r\n");

	var column = null;
	var list = null;

	function addList() {
		if (list) {
			column.lists.push(list);
			list = null;
		}
	}

	function addColumn() {
		if (column) {
			result.columns.push(column);
		}
	}

	for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {

		var line = lines[lineIndex];

		if (!line) {
			continue;
		}

		if (line.toLowerCase() == "column") {
			addList();
			addColumn();
			column = { lists: [] };
		}
		else if (line.substr(0, 4).toLowerCase() == "list") {

			addList();

			list = {};

			var listTitle = line.substr(4).trim();
			if (listTitle) {
				list.title = listTitle;
			}

			list.skills = [];
		}
		else if (line[0] == "-") {
			list.skills.push(line.substr(1).trim());
		}
	}

	addList();
	addColumn();

	return result;
}

function getEducation(posts) {

	const allCertifications = linq
		.From(posts)
		.Where(function(post) { return getPostCategory(post) == "Certification"; })
		.Select(function(post) { return getEducationFromPost(post); })
		.OrderByDescending(function(education) { return education.order; })
		.ToArray();

	const middleIndex = Math.ceil(allCertifications.length / 2);
	const column1 = allCertifications.splice(0, middleIndex);
	const column2 = allCertifications;
	const certifications = {
		columns: [
			column1,
			column2
		]
	};

	var result = {

		tertiary: linq
			.From(posts)
			.Where(function(post) { return getPostCategory(post) == "Tertiary Education"; })
			.Select(function(post) { return getEducationFromPost(post); })
			.OrderByDescending(function(education) { return education.order; })
			.ToArray(),

		certifications: certifications
	};

	return result;
}

function getEducationFromPost(post) {

	var education = {
		title: post.title,
		academy: post.post_meta && post.post_meta.academy,
		graduationDate: post.post_meta && post.post_meta.graduationDate ?
			new Date(post.post_meta.graduationDate) :
			new Date(2000, 1, 1),
		order: post.post_meta && +post.post_meta.order
	};

	return education;
}

function getWorkHistory(posts) {

	var result = linq
		.From(posts)
		.Where(function(post) { return getPostCategory(post) == "Work History"; })
		.Select(function(post) { return getJobFromPost(post); })
		.OrderByDescending(function(job) { return job.yearEnded || Number.MAX_VALUE; })
		.ToArray();

	return result;
}

function getJobFromPost(post) {

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
        yearStarted: yearStarted,
        yearEnded: yearEnded,
		description: post.content
	};

	return job;
}

function getPostCategory(post) {

	var category =
		post.terms && post.terms.category &&
		post.terms.category.length && post.terms.category[0] &&
		post.terms.category[0].name;

	return category;
}