+function ($) {
  'use strict';

  var liftGraph = function (element, options) {
    this.type =
    this.options =
    this.enabled =
    this.$element = null

    this.init('liftGraph', element, options);
  };

  liftGraph.DEFAULTS = {
    type: 'line',
    palette: 'munin'
  };

  liftGraph.prototype.init = function (type, element, options) {
    this.type = type
    this.$element = $(element)
    this.options = this.getOptions(options)
    this.enabled = true

    this.render();
  };

  liftGraph.prototype.enable = function () {
    this.enabled = true;
  };

  liftGraph.prototype.disable = function () {
    this.enabled = false;
  };

  liftGraph.prototype.dataAttr = function (key) {
    return this.$element.attr('data-' + this.type + '-' + key);
  };

  liftGraph.prototype.getDefaults = function () {
    return liftGraph.DEFAULTS;
  };

  liftGraph.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('lift.' + this.type);
  }

  liftGraph.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), options);
    for (var i in options) {
      options[i] = this.dataAttr(i) || options[i];
    }
    return options;
  };

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

    return this.labelsX;
  }

  liftGraph.prototype.getSeries = function () {
    if (typeof this.series == 'undefined') {
      var series = [],
          palette = new Rickshaw.Color.Palette({
            scheme: 'munin'
          });

      this.$element.find('tbody > tr').each(function (row) {
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

    return this.series;
  }

  liftGraph.prototype.getGraph = function () {}

  liftGraph.prototype.render = function () {
    var $element = this.$element.addClass('lift-graph-table'),
        labelsX = this.getLabelsX(),
        series = this.getSeries();

    var labels = function (n) {
      return labelsX[n];
    }

    this.$graph = $('<div class="lift-graph-graph"></div>');
    this.$legend = $('<div class="lift-graph-legend"></div>');

    $element.wrap('<div class="lift-graph-container"></div>').before(this.$graph).before(this.$legend);

    var graph = new Rickshaw.Graph({
          element: this.$graph[0],
          renderer: 'line',
          interpolation: 'linear',
          height: 500,
          series: this.series
        }),
        axisX = new Rickshaw.Graph.Axis.X({
          tickFormat: labels,
          graph: graph
        }),
        axisY = new Rickshaw.Graph.Axis.Y({
          graph: graph
        });

    graph.render();

    console.log(this);
  };

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






$( document ).ready(function () {
  $('table[data-liftGraph-type]').liftGraph();

  var chartWidth = function () {
    return $('#lift-chart').width();
  }

  var seriesData = [ [], [], [] ];
  var random = new Rickshaw.Fixtures.RandomData(12);

  for (var i = 0; i < 12; i++) {
  	random.addData(seriesData);
  }

  console.log(seriesData);

  var ticksTreatment = 'glow',
      xValues = function (n) {
        var map = {
          0: 'January',
          1: 'February',
          2: 'March',
          3: 'April',
          4: 'May',
          5: 'June',
          6: 'July',
          7: 'August',
          8: 'September',
          9: 'October',
          10: 'November',
          11: 'December'
        }

        return map[n]
      },
      palette = new Rickshaw.Color.Palette({
        scheme: 'munin'
      }),
      graph = new Rickshaw.Graph({
        element: document.querySelector('#lift-chart'),
        renderer: 'line',
        interpolation: 'linear',
        height: 500,
        series: [
          {
            name: 'Stuff',
            color: palette.color(),
            data: seriesData[0]
          },
          {
            name: 'More stuff',
            color: palette.color(),
            data: seriesData[1]
          },
          {
            name: 'Look at all of this stuff!',
            color: palette.color(),
            data: seriesData[2]
          }
        ]
      }),
      hover = new Rickshaw.Graph.HoverDetail({
        graph: graph
      }),
      highlight = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: graph
      }),
      toggle = new Rickshaw.Graph.Behavior.Series.Toggle({
        graph: graph
      }),
      axisX = new Rickshaw.Graph.Axis.X({
        // tickFormat: xValues,
        // pixelsPerTick: 20,
        orientation: 'top',
        ticksTreatment: ticksTreatment,
        graph: graph
      }),
      axisY = new Rickshaw.Graph.Axis.Y({
        timeFixture: new Rickshaw.Fixtures.Time('month'),
        ticksTreatment: ticksTreatment,
        graph: graph
      }),
      legend = new Rickshaw.Graph.Legend({
        element: document.querySelector('#lift-chart-legend'),
        graph: graph
      }),
      toggly = new Rickshaw.Graph.Behavior.Series.Toggle({
      	graph: graph,
      	legend: legend
      }),
      order = new Rickshaw.Graph.Behavior.Series.Order( {
      	graph: graph,
      	legend: legend
      } ),
      highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
      	graph: graph,
      	legend: legend
      } ),
      smoother = new Rickshaw.Graph.Smoother( {
      	graph: graph,
      	element: document.querySelector('#smoother')
      } );

  graph.render();
});
