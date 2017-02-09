'use strict';


module.exports = function mocha_istanbul(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    // Options
    return {
        coverage: {
            src: ['lib', 'controllers'], // What to check for coverage
            options: {
                src: ['test/**/*.js'], // Where the tests are
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
