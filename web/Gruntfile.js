module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "dist/css/style.css": "src/main/less/style.less"
        }
      }
    },
    concat: {
      options: {
        seperator: ";"
      },
      dist: {
        src: [
          "src/main/js/hypertoc.js",
          "src/main/js/*.js"
        ],
        dest: "dist/js/main.js"
      }
    },
    uglify: {
      dist: {
        files: {
          "dist/js/main.min.js": ["dist/js/main.js"]
        }
      }
    },
    copy: {
      resources: {
        files: [
          {expand:true, cwd: "src/resources", src:"**/*", dest: "dist/"}
        ]
      }
    },
    watch: {
      styles: {
        files: ["src/main/less/**/*.less"],
        tasks: ["less"],
        options: {
          nospawn: true
        }
      },
      js: {
        files: ["src/main/js/*.js"],
        tasks: ["concat", "uglify"],
        options: {
          nospawn: true
        }
      },
      resources: {
        files: ["src/resources/**/*"],
        tasks: ["copy"],
        options: {
          nospawn: true
        }
      }
    },
    compress: {
      target: {
        options: {
          archive: "target/<%= pkg.name %>-<%= pkg.version %>.zip"
        },
        files: [
          {expand: true, cwd:"dist", src: "**/*"}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.registerTask('default', ['copy', 'less', 'concat', 'uglify']);
  grunt.registerTask('release', ['default', 'compress']);
}
