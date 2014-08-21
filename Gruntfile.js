module.exports = function(grunt) {
  require('time-grunt');

  var rickshawSrc = [
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
      ],
      liftSrc = [
        'lib/scripts/Rickshaw.Graph.Axis.LabeledY.js',
        'lib/scripts/Rickshaw.Graph.ClickDetail.js',
        'lib/scripts/Rickshaw.Graph.TableLegend.js',
        'lib/scripts/graphs.js',
        'lib/scripts/lift.js'
      ];


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    autoprefixer: {
      css: {
        src: 'styles/**/*.css'
      }
    },
    clean: {
      style: ['styles/**'],
      script: ['scripts/**'],
    },
    concat: {
      options: {
        sourceMap: true,
        separator: "\n"
      },
      rickshaw: {
        src: rickshawSrc,
        dest: 'scripts/rickshaw.js'
      },
      lift: {
        src: liftSrc,
        dest: 'scripts/lift.js'
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
    uglify: {
      options: {
        sourceMap: true,
      },
      rickshaw: {
        options: {
          mangle: { except: ["$super"] }
        },
        files: [{
          src: rickshawSrc,
          dest: 'scripts/rickshaw.min.js'
        }]
      },
      lift: {
        files: { 'scripts/lift.min.js': liftSrc }
      }
    },
    watch: {
      sass: {
        files: 'lib/sass/**/*.scss',
        tasks: ['style']
      },
      scripts: {
        files: 'lib/scripts/**/*.js',
        tasks: ['script']
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['default']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['style', 'script']);
  grunt.registerTask('style', ['clean:style', 'sass', 'autoprefixer']);
  grunt.registerTask('script', ['clean:script', 'concat', 'uglify']);
};
