module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			development: {
				options: {
					paths: ["./public/stylesheets/app"],
					yuicompress: true
				},
				files: {
					"./public/stylesheets/app/style.css": "./public/stylesheets/app/style.less"
				}
			}
		},
		watch: {
			less: {
				files: "public/stylesheets/app/**/*.less",
				tasks: ["less"]
			}
		}
	});

	grunt.registerTask('default', ["less"]);
	grunt.registerTask('auto-build', ["watch"]);
};