/**
 * Test implementation and features.
 * ----------------------------------------------------------------------------
 */

$( document ).ready(function () {
  // Use our above jQuery function on a table.
  $('table[data-lift-statistics]').liftGraph();

  var $statistics = $('.lift-statisics'),
      $chooser = $('<select>'),
      children = [];

  $statistics.children('.lift-statistic-category').each(function (i) {
    var $this = $(this),
        name = $this.children('.lift-statistic-category-name').text(),
        $option = $('<option value="' + i + '">' + name + '</option>');

    $chooser.append($option);

    if (i !== 0) {
      $this.hide();
    }

    children.push($this);
  });

  $statistics.before($chooser);

  $chooser.change(function () {
    children[$(this).val()].show();
    children[$(this).val()].siblings('.lift-statistic-category').hide();
  });
});

//# sourceMappingURL=lift-module.js.map