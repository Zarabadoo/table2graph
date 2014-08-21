/**
 * Create an tooltip showing data from all graphs.
 * ----------------------------------------------------------------------------
 */

Rickshaw.namespace('Rickshaw.Graph.ClickDetail');

Rickshaw.Graph.ClickDetail = Rickshaw.Class.create(Rickshaw.Graph.HoverDetail, {
  formatter: function(series, x, y, formattedX, formattedY, d) {
    var self = this,
        options = this.graph.rawData.options,
        columns = this.graph.rawData.columns,
        xKey = columns[options.columnX - 1],
        yKey = columns[options.columnY - 1],
        nameKey = columns[options.columnName - 1],
        data = this.graph.rawData.groups,
        head = function () {
          var date = '<th>' + new Date(x * 1000).toUTCString() + '</th>',
              variations = '<th style="background-color: ' + series.color + ';">' + series.shortName + '</th>';

          // Output the name of the series' siblings.
          for (var i = 0; i < self.graph.series.length; i++) {
            if (series.name != self.graph.series[i].name) {
              variations = variations + '<th style="background-color: ' + self.graph.series[i].color + ';">' + self.graph.series[i].shortName + '</th>';
            }
          }

          return '<thead><tr>' + date + variations + '</tr></thead>';
        },
        row = function (data) {
          var output = '<td class="label">' + data.property + '</td>';

          for (var i = 0; i < data.data.length; i++) {
            if (typeof data.data[i].active != 'undefined' && data.data[i].active == true) {
              output = output + '<td class="active">' + data.data[i].value + '</td>';
            }
            else {
              output = output + '<td>' + data.data[i].value + '</td>';
            }
          }

          return '<tr>' + output + '</tr>';
        },
        rows = function () {
          var output = '';

          // Build each row of data.
          for (var key = 0; key < data[series.name].length; key++) {
            if (data[series.name][key][xKey] == x) {
              for (var property in data[series.name][key]) {
                if (data[series.name][key].hasOwnProperty(property) && property != xKey && property != nameKey) {
                  var rowData = {property: property, data: [{value: data[series.name][key][property], active: true}]};

                  for (var group in data) {
                    if (data.hasOwnProperty(group) && series.name != data[group][key][nameKey]) {
                      rowData.data.push({value: data[group][key][property]});
                    }
                  }

                  output = output + row(rowData);
                };
              };
            };
          };

          return '<tbody>' + output + '</tbody>';
        };

    return '<table class="lift-graph-details">' + head() + rows() + '</table>';
  },
  render: function (args) {
    var graph = this.graph,
        points = args.points,
        point = points.filter( function(p) { return p.active } ).shift();

    if (point.value.y === null) return;

    var formattedXValue = point.formattedXValue,
        formattedYValue = point.formattedYValue;

    this.element.innerHTML = '';
    this.element.style.left = graph.x(point.value.x) + 'px';

    var item = document.createElement('div');

    item.className = 'item';

    // invert the scale if this series displays using a scale
    var series = point.series,
        actualY = series.scale ? series.scale.invert(point.value.y) : point.value.y;

    item.innerHTML = this.formatter(series, point.value.x, actualY, formattedXValue, formattedYValue, point);

    this.element.appendChild(item);

    var dot = document.createElement('div'),
        topPosition = this.graph.y(point.value.y0 + point.value.y);

    dot.className = 'dot';
    dot.style.top = topPosition + 'px';
    dot.style.borderColor = series.color;

    this.element.appendChild(dot);

    if (point.active) {
      item.classList.add('active');
      dot.classList.add('active');
    }

    var $item = $(item),
        itemWidth = parseInt($item.innerWidth()),
        itemHeight = parseInt($item.innerHeight()),
        itemMargin = parseInt($item.css('margin-top')) + parseInt($item.css('margin-bottom'));

    item.style.top = Math.round(topPosition - itemHeight - itemMargin) + 'px';
    item.style.left = Math.round(itemWidth / 2) * -1 + 'px';

    // Assume left alignment until the element has been displayed and
    // bounding box calculations are possible.
    var alignables = [item];

    alignables.forEach(function(el) {
      el.classList.add('bottom');
      el.classList.add('center');
    });

    this.show();

    var alignment = this._calcLayout(item);

    if (alignment.left > alignment.right) {
      item.style.left = 'auto';
      item.classList.remove('center');
      item.classList.remove('right');
      item.classList.add('left');
    }

    if (alignment.right > alignment.left) {
      item.style.left = 'auto';
      item.classList.remove('center');
      item.classList.remove('left');
      item.classList.add('right');
    }

    if (alignment.top === 0) {
      item.style.top = topPosition + 'px';
      item.classList.remove('bottom');
      item.classList.add('top');
    }

    if (typeof this.onRender == 'function') {
      this.onRender(args);
    }
  },
  _calcLayout: function(element) {
    var layout = {top: 0, right: 0, bottom: 0, left: 0},
        parentRect = this.element.parentNode.getBoundingClientRect(),
        rect = element.getBoundingClientRect();

    if (rect.top > parentRect.top) {
      layout.top += rect.top - parentRect.top;
    }

    if (rect.bottom < parentRect.bottom) {
      layout.bottom += parentRect.bottom - rect.bottom;
    }

    if (rect.right > parentRect.right) {
      layout.right += rect.right - parentRect.right;
    }

    if (rect.left < parentRect.left) {
      layout.left += parentRect.left - rect.left;
    }

    return layout;
  }
});
