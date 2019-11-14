/* global $:false, _:false, Morris:false, __history:false */
/* jshint browser:true*/

$(() => {
  'use strict';

  function drawHistoricalChart(history) {
    const data = _.map(history, (record) => {
      const date = new Date(record.date);
      return {
        date: `${date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate()}`,
        average_maintainability: parseFloat(record.average.maintainability),
        average_sloc: record.average.sloc
      };
    }).slice(-20);

    Morris.Area({
      element: 'chart_historical_sloc',
      data,
      xkey: 'date',
      ykeys: ['average_sloc'],
      parseTime: false,
      lineColors: ['#2A2A2A'],
      pointSize: 0,
      lineWidth: 0,
      grid: false,
      axes: false,
      hideHover: 'always',
      fillOpacity: 1
    });

    Morris.Area({
      element: 'chart_historical_maint',
      data,
      xkey: 'date',
      ykeys: ['average_maintainability'],
      labels: ['Maintainability'],
      ymax: 100,
      parseTime: false,
      lineColors: ['#2A2A2A'],
      pointSize: 0,
      lineWidth: 0,
      grid: false,
      axes: false,
      hideHover: 'always',
      fillOpacity: 1
    });
  }

  function drawCharts() {
    $('.js-chart').empty();
    drawHistoricalChart(__history);
  }

  drawCharts();

  $(window).on('resize', _.debounce(drawCharts, 200));
});
