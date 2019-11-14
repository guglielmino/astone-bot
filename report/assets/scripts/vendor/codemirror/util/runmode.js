CodeMirror.runMode = function (string, modespec, callback, options) {
  const mode = CodeMirror.getMode(CodeMirror.defaults, modespec);

  if (callback.nodeType == 1) {
    const tabSize = (options && options.tabSize) || CodeMirror.defaults.tabSize;
    let node = callback, col = 0;
    node.innerHTML = '';
    callback = function (text, style) {
      if (text == '\n') {
        node.appendChild(document.createElement('br'));
        col = 0;
        return;
      }
      let content = '';
      // replace tabs
      for (let pos = 0;;) {
        const idx = text.indexOf('\t', pos);
        if (idx == -1) {
          content += text.slice(pos);
          col += text.length - pos;
          break;
        } else {
          col += idx - pos;
          content += text.slice(pos, idx);
          const size = tabSize - col % tabSize;
          col += size;
          for (let i = 0; i < size; ++i) content += ' ';
          pos = idx + 1;
        }
      }

      if (style) {
        const sp = node.appendChild(document.createElement('span'));
        sp.className = `cm-${ style.replace(/ +/g, ' cm-')}`;
        sp.appendChild(document.createTextNode(content));
      } else {
        node.appendChild(document.createTextNode(content));
      }
    };
  }

  let lines = CodeMirror.splitLines(string), state = CodeMirror.startState(mode);
  for (let i = 0, e = lines.length; i < e; ++i) {
    if (i) callback('\n');
    const stream = new CodeMirror.StringStream(lines[i]);
    while (!stream.eol()) {
      const style = mode.token(stream, state);
      callback(stream.current(), style, i, stream.start);
      stream.start = stream.pos;
    }
  }
};
