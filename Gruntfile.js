module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            jsFiles: ['src/**/*.js']
        },

        concat: {
            js: {
                files: {'dist/angularjs-html5-joystick.js' : 'src/**/*.js'}
            }
        },

        uglify: {
            bundle: {
                files: {'dist/angularjs-html5-joystick.min.js': 'dist/angularjs-html5-joystick.js'}
            }
        }
        
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint:jsFiles', 'concat:js', 'uglify:bundle']);
};