'use strict';

var path = require('path');

var lrSnippet  = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
  return connect.static(path.resolve(dir));
};

module.exports = function(grunt) {
  grunt.initConfig({

    watchify: {
      options: {
        debug: true
      },
      core: {
        src: './src/core/index.js',
        dest: 'dist/ThreejsGuiDataexplorer.js'
      },
      examples: {
        src: './src/examples/index.js',
        dest: 'dist/ThreejsGuiDataexplorer-examples.js'
      }
    },

    watch: {
      app: {
        files: ['dist/ThreejsGuiDataexplorer.js','dist/ThreejsGuiDataexplorer-examples.js', 'examples/**/*'],
        options: {
          livereload: true
        }
      }
    },

    open: {
      example : {
        // Change this to '0.0.0.0' to access the server from outside.
        path: 'http://localhost:9000/examples/01_Basic'
      }
    },

    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.')
            ];
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-watchify');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', ['watchify', 'connect', 'open', 'watch']);
};
