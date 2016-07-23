module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            jsFiles: ['src/**/*.js']
        },

        concat: {
            js: {
                src: ['src/**/*-module.js', 'src/**/*-service.js', 'src/**/*-directive.js'],
                dest: 'dist/angularjs-html5-joystick.js'
            }
        },

        uglify: {
            bundle: {
                files: {'dist/angularjs-html5-joystick.min.js': 'dist/angularjs-html5-joystick.js'}
            }
        },

        copy: {
            example: {
                expand: true,
                cwd: 'dist',
                src: '**',
                dest: 'example/lib/angularjs-html5-joystick/'
            }
        }        
        
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['jshint:jsFiles', 'concat:js', 'uglify:bundle', 'copy:example']);
};