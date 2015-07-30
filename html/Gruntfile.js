module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "css/style.css": "less/style.less"
        }
      }
    },
    concat: {
      options: {
        seperator: ";"
      },
      dist: {
        src: [
          "js/hypertoc.js",
          "js/*.js",
          "!js/main.js",
          "!js/main.min.js"
        ],
        dest: "js/main.js"
      }
    },
    uglify: {
      dist: {
        files: {
          "js/main.min.js": ["js/main.js"]
        }
      }
    },
    watch: {
      styles: {
        files: ["less/**/*.less"],
        tasks: ["less"],
        options: {
          nospawn: true
        }
      },
      js: {
        files: ["js/*.js"],
        tasks: ["concat", "uglify"],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['less', 'concat', 'uglify']);
}
