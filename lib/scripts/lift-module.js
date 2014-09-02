/**
 * Apply the liftGraph plugin.
 * ----------------------------------------------------------------------------
 */

$( document ).ready(function () {
  var $statistics = $('.lift-statisics'),
      $switches = $('<div class="lift-switches">'),
      $chooser = $('<select class="lift-graph-switch">'),
      graphs = {},
      children = [],
      dataSelectors = [],
      formItem = function(label, input) {
        var $wrapper = $('<div class="form-item">');

        $wrapper
          .append('<label>' + label + '</label>' + "\n");

        for (var i = 0; i < input.length; i++) {
          $wrapper
            .append(input[i]);
        }

        return $wrapper;
      };

  // Process the data in all tables.
  $statistics.children('.lift-statistic-category').each(function (graphKey) {
    var $this = $(this),
        $graph = $this.find('table[data-lift-statistics]');
        dataLabels = [],
        name = $this.children('.lift-statistic-category-name').text(),
        variationColumn = $graph.attr('data-liftgraph-columnname') - 1,
        xColumn = $graph.attr('data-liftgraph-columnx') - 1,
        attr = typeof $graph.attr('data-liftgraph-excluded') !== 'undefined' ? $graph.attr('data-liftgraph-excluded').split(',') : [];
        $option = $('<option value="' + graphKey + '">' + name + '</option>')
        $dataSelector = $('<select class="lift-data-switch">');

    for (var i = 0; i < attr.length; i++) {
      attr[i] = parseFloat(attr[i]);
    }

    $chooser.append($option);
    $graph.liftGraph();

    if (graphKey !== 0) {
      $this.addClass('inactive')
    }
    else {
      $this.addClass('active')
    }

    graphs[name] = $graph;
    children[graphKey] = $this;

    // Collect the data able to be fed to the y-axis.
    $graph.find('thead > tr > th').each(function (dataKey) {
      if (attr.indexOf(dataKey + 1) === -1) {
        var label = $(this).text(),
            $dataOption = $('<option value="' + dataKey + '">' + label + '</option>');

        dataLabels.push($(this).text());

        if (dataKey !== variationColumn && dataKey !== xColumn) {
          $dataSelector.append($dataOption);
        }
      }
    });

    if (graphKey !== 0) {
      $dataSelector
        .addClass('inactive')
    }
    else {
      $dataSelector
        .addClass('active')
    }

    // Change the data fed to the y-axis and update the graph.
    $dataSelector.change(function () {
      $graph.attr('data-liftgraph-columny', parseFloat($(this).val()) + 1)
        .liftGraph('update');
    })

    dataSelectors[graphKey] = $dataSelector;
  });

  // Change the displayed data when the select changes.
  $chooser.change(function () {
    var option = $(this).val(),
        text = this.options[this.selectedIndex].text;

    children[option]
      .addClass('active')
      .removeClass('inactive');
    dataSelectors[option]
      .addClass('active')
      .removeClass('inactive');
    graphs[text]
      .liftGraph('update');
    children[option]
      .siblings('.lift-statistic-category')
      .addClass('inactive')
      .removeClass('active');
    dataSelectors[option]
      .siblings('.lift-data-switch')
      .addClass('inactive')
      .removeClass('active');
  });


  // Add all switches to the page.
  $switches
    .append(formItem('Goals', $chooser))
    .append(formItem('Metrics', dataSelectors));
  $statistics
    .before($switches);
});
