/**
 * Create a graph using data from a table element and Rickshaw.
 */
+function ($) {
  'use strict';

  // Assemble the object.
  var liftGraph = function (element, options) {
    this.type =
    this.options =
    this.enabled =
    this.$element = null

    this.init('liftGraph', element, options);
  };

  // Define the plugin defaults.
  liftGraph.DEFAULTS = {
    scheme: null,
    renderer: null,
    width: null,
    height: null,
    min: null,
    max: null,
    padding: null,
    interpolation: null,
    stack: null,
  };

  // Initialize the plugin functionality.
  liftGraph.prototype.init = function (type, element, options) {
    this.type = type
    this.$element = $(element)
    this.options = this.getOptions(options)
    this.enabled = true

    this.render();
  };

  // Enable the graph.
  liftGraph.prototype.enable = function () {
    this.enabled = true;
  };

  // Disable the graph.
  liftGraph.prototype.disable = function () {
    this.enabled = false;
  };

  // Get the option value of a data attribute.
  liftGraph.prototype.dataAttr = function (key) {
    return this.$element.attr('data-' + this.type + '-' + key);
  };

  // Get default values.
  liftGraph.prototype.getDefaults = function () {
    return liftGraph.DEFAULTS;
  };

  // Reset the table.
  liftGraph.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('lift.' + this.type);
  }

  // Get options.
  liftGraph.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), options);
    for (var i in options) {
      options[i] = this.dataAttr(i) || options[i];
    }
    return options;
  };

  // Get the labels for the x axis.
  liftGraph.prototype.getLabelsX = function () {
    if (typeof this.labelsX == 'undefined') {
      var headers = this.$element.find('thead > tr > th'),
          labels = {};

      delete headers[0];

      headers.each(function (i) {
        if (typeof this != 'undefined') {
          labels[i - 1] = $(this).text();
        };
      });

      this.labelsX = labels;
    }
  }

  // Get the optimal number of palette colors.
  liftGraph.prototype.getPalette = function (count) {
    var color = new Rickshaw.Fixtures.Color(),
        scheme = this.options.scheme || 'colorwheel',
        configuration = {scheme: scheme};

    if (color.schemes[scheme].length < count) {
      configuration.interpolatedStopCount = count;
    }

    this.palette = new Rickshaw.Color.Palette(configuration);
  }

  // Get the series data form the table.
  liftGraph.prototype.getSeries = function () {
    var rows = this.$element.find('tbody > tr'),
        series = [];

    this.getPalette(rows.length);

    var palette = this.palette;

    rows.each(function (row) {
      series[row] = {
        name: $(this).find('td:first-child').text(),
        color: palette.color(),
        data: []
      };

      $(this).children('td:not(td:first-child)').each(function (key) {
        series[row].data.push({x: key, y: parseFloat($(this).text())});
      });
    });

    this.series = series;
  }

  // Get the graph object.
  liftGraph.prototype.getGraph = function () {
    this.graph = new Rickshaw.Graph({
      element: this.$graph[0],
      series: this.series
    });

    var configuration = {};

    // Set the custom renderer.
    if (this.options.renderer != null) {
      configuration.renderer = this.options.renderer;
    }

    // Set the custom width.
    if (this.options.width != null) {
      configuration.width = this.options.width;
    }

    // Set the custom height.
    if (this.options.height != null) {
      configuration.height = this.options.height;
    }

    // Set the custom min.
    if (this.options.max != null) {
      configuration.max = this.options.max;
    }

    // Set the custom max.
    if (this.options.min != null) {
      configuration.min = this.options.min;
    }

    // Set the custom padding.
    if (this.options.padding != null) {
      var data = this.options.padding.split(' '),
          dataLength = data.length,
          padding = {},
          position = ['top', 'right', 'bottom', 'left'];

      for (var i = 0; i < dataLength; i++) {
        padding[position[i]] = parseFloat(data[i]);
      }

      configuration.padding = padding;
    }

    // Set the custom interpolation.
    if (this.options.interpolation != null) {
      configuration.interpolation = this.options.interpolation;
    }

    this.graph.configure(configuration);
  }

  // Get the x-axis.
  liftGraph.prototype.getAxisX = function () {

    var labels = this.labelsX,
        getLabel = function (n) {
          return labels[n];
        }

    this.axisX = new Rickshaw.Graph.Axis.X({
      element: this.$axisX[0],
      tickFormat: getLabel,
      orientation: 'bottom',
      graph: this.graph
    });
  }

  // Get the y-axis.
  liftGraph.prototype.getAxisY = function () {
    this.axisY = new Rickshaw.Graph.Axis.Y({
      element: this.$axisY[0],
      orientation: 'left',
      graph: this.graph
    });
  }

  // Get the legend.
  liftGraph.prototype.getLegend = function () {
    this.legend = new Rickshaw.Graph.Legend({
      element: this.$legend[0],
      graph: this.graph
    });
  }

  // Format the elements of the graph.
  liftGraph.prototype.build = function () {
    this.$graph = $('<div class="lift-graph-graph"></div>');
    this.$axisX = $('<div class="lift-graph-axis-x"></div>');
    this.$axisY = $('<div class="lift-graph-axis-y"></div>');
    this.$legend = $('<div class="lift-graph-legend"></div>');

    this.$element.addClass('lift-graph-table')
      .wrap('<div class="lift-graph-container"></div>')
      .before(this.$legend)
      .before(this.$graph)
      .before(this.$axisY)
      .before(this.$axisX);
  }

  // Hide the table.
  liftGraph.prototype.hideTable = function () {
    this.$element.hide();
  }

  // Show the table.
  liftGraph.prototype.showTable = function () {
    this.$element.show();
  }

  // Render the graph.
  liftGraph.prototype.render = function () {
    this.build();
    this.getLabelsX();
    this.getSeries();
    this.getGraph();
    this.getAxisX();
    this.getAxisY();
    this.getLegend();
    this.graph.render();
    this.hideTable();
  };

  // Define the jQuery plugin.
  var old = $.fn.railroad;

  $.fn.liftGraph = function (options) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('lift.graph'),
          options = typeof options == 'object' && option;

      if (!data && options == 'destroy') return;
      if (!data) $this.data('lift.graph', (data = new liftGraph(this, options)));
      if (typeof option == 'string') data[option]();
    });
  }

  $.fn.liftGraph.Constrictor = liftGraph;

  $.fn.liftGraph.noConflict = function () {
    $.fn.liftGraph = old;
    return this;
  }
}(jQuery);


/**
 * Test implementation and features.
 */
$( document ).ready(function () {
  // Use our above jQuery function on a table.
  $('table[data-liftGraph-table]').liftGraph();

  // Play with features using random data generated by Rickshaw.
  // var chartWidth = function () {
  //   return $('#lift-chart').width();
  // }
  //
  // var seriesData = [ [], [], [] ];
  // var random = new Rickshaw.Fixtures.RandomData(12);
  //
  // for (var i = 0; i < 12; i++) {
  // 	random.addData(seriesData);
  // }
  //
  // var ticksTreatment = 'glow',
  //     xValues = function (n) {
  //       var map = {
  //         0: 'January',
  //         1: 'February',
  //         2: 'March',
  //         3: 'April',
  //         4: 'May',
  //         5: 'June',
  //         6: 'July',
  //         7: 'August',
  //         8: 'September',
  //         9: 'October',
  //         10: 'November',
  //         11: 'December'
  //       }
  //
  //       return map[n]
  //     },
  //     palette = new Rickshaw.Color.Palette({
  //       scheme: 'munin'
  //     }),
  //     graph = new Rickshaw.Graph({
  //       element: document.querySelector('#lift-chart'),
  //       renderer: 'line',
  //       interpolation: 'linear',
  //       height: 500,
  //       series: [
  //         {
  //           name: 'Stuff',
  //           color: this.palette.color(),
  //           data: seriesData[0]
  //         },
  //         {
  //           name: 'More stuff',
  //           color: this.palette.color(),
  //           data: seriesData[1]
  //         },
  //         {
  //           name: 'Look at all of this stuff!',
  //           color: this.palette.color(),
  //           data: seriesData[2]
  //         }
  //       ]
  //     }),
  //     hover = new Rickshaw.Graph.HoverDetail({
  //       graph: graph
  //     }),
  //     highlight = new Rickshaw.Graph.Behavior.Series.Highlight({
  //       graph: graph
  //     }),
  //     toggle = new Rickshaw.Graph.Behavior.Series.Toggle({
  //       graph: graph
  //     }),
  //     axisX = new Rickshaw.Graph.Axis.X({
  //       // tickFormat: xValues,
  //       // pixelsPerTick: 20,
  //       orientation: 'top',
  //       ticksTreatment: ticksTreatment,
  //       graph: graph
  //     }),
  //     axisY = new Rickshaw.Graph.Axis.Y({
  //       timeFixture: new Rickshaw.Fixtures.Time('month'),
  //       ticksTreatment: ticksTreatment,
  //       graph: graph
  //     }),
  //     legend = new Rickshaw.Graph.Legend({
  //       element: document.querySelector('#lift-chart-legend'),
  //       graph: graph
  //     }),
  //     toggly = new Rickshaw.Graph.Behavior.Series.Toggle({
  //     	graph: graph,
  //     	legend: legend
  //     }),
  //     order = new Rickshaw.Graph.Behavior.Series.Order( {
  //     	graph: graph,
  //     	legend: legend
  //     } ),
  //     highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
  //     	graph: graph,
  //     	legend: legend
  //     } ),
  //     smoother = new Rickshaw.Graph.Smoother( {
  //     	graph: graph,
  //     	element: document.querySelector('#smoother')
  //     } );
  //
  // graph.render();
});
