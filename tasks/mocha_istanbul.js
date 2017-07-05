'use strict';


module.exports = function mocha_istanbul(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    // Options
    return {
        coverage: {
            src: ['test/**/*.js'/*,'lib', 'controllers'*/], // Where the tests are
            options: {
                src: ['test/**/*.js'],
                options: {
                    timeout: 6000,
                    'check-leaks': true,
                    ui: 'bdd',
                    reporter: 'spec'
                }
            }
        }
    };
}
