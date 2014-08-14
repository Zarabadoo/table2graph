module.exports = function(grunt) {
  require('time-grunt');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    autoprefixer: {
      css: {
        src: 'styles/**/*.css'
      }
    },
    concat: {
      options: {
        sourcemap: true,
        separator: "\n"
      },
      rickshaw: {
        src: [
          'bower_components/rickshaw/src/helpers/startUMD.js',
          'bower_components/rickshaw/src/js/Rickshaw.js',
          'bower_components/rickshaw/src/js/Rickshaw.Class.js',
          'bower_components/rickshaw/src/js/Rickshaw.Compat.ClassList.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.js',
          'bower_components/rickshaw/src/js/Rickshaw.Fixtures.Color.js',
          'bower_components/rickshaw/src/js/Rickshaw.Fixtures.RandomData.js',
          'bower_components/rickshaw/src/js/Rickshaw.Fixtures.Time.js',
          'bower_components/rickshaw/src/js/Rickshaw.Fixtures.Time.Local.js',
          'bower_components/rickshaw/src/js/Rickshaw.Fixtures.Number.js',
          'bower_components/rickshaw/src/js/Rickshaw.Color.Palette.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Ajax.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Annotate.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Axis.Time.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Axis.X.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Axis.Y.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Axis.Y.Scaled.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Behavior.Series.Highlight.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Behavior.Series.Order.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Behavior.Series.Toggle.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.HoverDetail.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.JSONP.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Legend.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.RangeSlider.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.RangeSlider.Preview.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Renderer.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Renderer.Line.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Renderer.Stack.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Renderer.Bar.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Renderer.Area.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Renderer.ScatterPlot.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Renderer.Multi.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Renderer.LinePlot.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Smoother.js',
          'bower_components/rickshaw/src/js/Rickshaw.Graph.Socketio.js',
          'bower_components/rickshaw/src/js/Rickshaw.Series.js',
          'bower_components/rickshaw/src/js/Rickshaw.Series.FixedDuration.js',
          'bower_components/rickshaw/src/helpers/endUMD.js',
        ],
        dest: 'scripts/rickshaw.js'
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'styles/styles.css': 'lib/sass/styles.scss'
        }
      }
    },
    watch: {
      sass: {
        files: 'lib/sass/**/*.scss',
        tasks: ['css']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['css', 'concat']);
  grunt.registerTask('css', ['sass', 'autoprefixer']);
};
