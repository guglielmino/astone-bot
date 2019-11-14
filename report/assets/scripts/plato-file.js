/* global $:false, _:false, Morris:false, CodeMirror:false, __report:false, __history:false */
/* jshint browser:true*/

$(() => {
  'use strict';

  // bootstrap popover
  $('[rel=popover]').popover();

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  function focusFragment() {
    $('.plato-mark').removeClass('focus');
    const markId = window.location.hash.substr(1);
    if (markId) $(`.${ markId}`).addClass('focus');
    return focusFragment;
  }

  window.onhashchange = focusFragment();

  const srcEl = document.getElementById('file-source');

  const options = {
    lineNumbers: true,
    gutters: ['plato-gutter-jshint', 'plato-gutter-complexity'],
    readOnly: 'nocursor'
  };

  const cm = CodeMirror.fromTextArea(srcEl, options);

  let byComplexity = [], bySloc = [];

  const popoverTemplate = _.template($('#complexity-popover-template').text());
  const gutterIcon = $('<a><i class="plato-gutter-icon icon-cog"></i></a>');

  const popovers = cm.operation(() => {
    const queuedPopovers = [];
    __report.complexity.methods.forEach((fn, i) => {
      byComplexity.push({
        label: fn.name,
        value: fn.cyclomatic
      });
      bySloc.push({
        label: fn.name,
        value: fn.sloc.physical,
        formatter(x) { return `${x } lines`; }
      });

      const name = fn.name === '<anonymous>' ? 'function\\s*\\([^)]*\\)' : fn.name;
      const line = fn.lineStart - 1;
      const className = `plato-mark-fn-${ i}`;
      const gutter = {
        gutterId: 'plato-gutter-complexity',
        el: gutterIcon.clone().attr('name', className)[0]
      };
      const popover = {
        type: 'popover',
        title: fn.name === '<anonymous>' ? '&lt;anonymous&gt;' : `function ${ fn.name }`,
        content: popoverTemplate(fn)
      };
      queuedPopovers.push(cm.markPopoverText({ line, ch: 0 }, name, className, gutter, popover));
    });
    return queuedPopovers;
  });

  popovers.forEach((fn) => {fn();});

  const scrollToLine = function (i) {
    const origScroll = [window.pageXOffset, window.pageYOffset];
    window.location.hash = `#plato-mark-fn-${ i}`;
    window.scrollTo(origScroll[0], origScroll[1]);
    const line = __report.complexity.methods[i].lineStart;
    const coords = cm.charCoords({ line, ch: 0 });
    $('body,html').animate({ scrollTop: coords.top - 50 }, 250);
  };

  // yield to the browser
  setTimeout(() => {
    drawFunctionCharts([
      { element: 'fn-by-complexity', data: byComplexity },
      { element: 'fn-by-sloc', data: bySloc }
    ]);
    drawHistoricalCharts(__history);
  }, 0);

  cm.operation(() => {
    addLintMessages(__report);
  });


  function drawFunctionCharts(charts) {
    charts.forEach((chart) => {
      Morris.Donut(chart).on('click', scrollToLine);
    });
  }

  function drawHistoricalCharts(history) {
    $('.historical.chart').empty();
    const data = _.map(history, (record) => {
      const date = new Date(record.date);
      return {
        date: `${date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate()}`,
        maintainability: parseFloat(record.maintainability).toFixed(2),
        sloc: record.sloc
      };
    }).slice(-20);
    Morris.Line({
      element: 'chart_historical_sloc',
      data,
      xkey: 'date',
      ykeys: ['sloc'],
      labels: ['Lines of Code'],
      parseTime: false
    });
    Morris.Line({
      element: 'chart_historical_maint',
      data,
      xkey: 'date',
      ykeys: ['maintainability'],
      labels: ['Maintainability'],
      ymax: 100,
      parseTime: false
    });
  }

  function addLintMessages(report) {
    const lines = {};
    report.jshint.messages.forEach((message) => {
      const text = `Column: ${ message.column } "${ message.message }"`;
      if (_.isArray(message.line)) {
        message.line.forEach((line) => {
          if (!lines[line]) lines[line] = '';
          lines[line] += `<div class="plato-jshint-message text-${message.severity}">${ text }</div>`;
        });
      } else {
        if (!lines[message.line]) lines[message.line] = '';
        lines[message.line] += `<div class="plato-jshint-message text-${message.severity}">${ text }</div>`;
      }
    });
    const marker = document.createElement('a');
    marker.innerHTML = '<i class="plato-gutter-icon icon-eye-open"></i>';
    Object.keys(lines).forEach((line) => {
      const lineWidget = document.createElement('div');
      lineWidget.innerHTML = lines[line];
      cm.setGutterMarker(line - 1, 'plato-gutter-jshint', marker.cloneNode(true));
      cm.addLineWidget(line - 1, lineWidget);
    });
  }
});

