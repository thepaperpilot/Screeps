module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    require('dotenv').config();

    grunt.initConfig({
        screeps: {
            options: {
                email: process.env.SCREEPS_EMAIL,
                password: process.env.SCREEPS_PASSWORD,
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['src/*.js']
            }
        }
    });
}
