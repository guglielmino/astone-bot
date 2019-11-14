(function () {
  if (!CodeMirror.modeURL) CodeMirror.modeURL = '../mode/%N/%N.js';

  const loading = {};
  function splitCallback(cont, n) {
    let countDown = n;
    return function () { if (--countDown == 0) cont(); };
  }
  function ensureDeps(mode, cont) {
    const deps = CodeMirror.modes[mode].dependencies;
    if (!deps) return cont();
    const missing = [];
    for (var i = 0; i < deps.length; ++i) {
      if (!CodeMirror.modes.hasOwnProperty(deps[i])) {missing.push(deps[i]);}
    }
    if (!missing.length) return cont();
    const split = splitCallback(cont, missing.length);
    for (var i = 0; i < missing.length; ++i) {CodeMirror.requireMode(missing[i], split);}
  }

  CodeMirror.requireMode = function (mode, cont) {
    if (typeof mode !== 'string') mode = mode.name;
    if (CodeMirror.modes.hasOwnProperty(mode)) return ensureDeps(mode, cont);
    if (loading.hasOwnProperty(mode)) return loading[mode].push(cont);

    const script = document.createElement('script');
    script.src = CodeMirror.modeURL.replace(/%N/g, mode);
    const others = document.getElementsByTagName('script')[0];
    others.parentNode.insertBefore(script, others);
    const list = loading[mode] = [cont];
    var count = 0, poll = setInterval(() => {
      if (++count > 100) return clearInterval(poll);
      if (CodeMirror.modes.hasOwnProperty(mode)) {
        clearInterval(poll);
        loading[mode] = null;
        ensureDeps(mode, () => {
          for (let i = 0; i < list.length; ++i) list[i]();
        });
      }
    }, 200);
  };

  CodeMirror.autoLoadMode = function (instance, mode) {
    if (!CodeMirror.modes.hasOwnProperty(mode)) {
      CodeMirror.requireMode(mode, () => {
        instance.setOption('mode', instance.getOption('mode'));
      });
    }
  };
}());
