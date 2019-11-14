(function () {
  CodeMirror.commands.newlineAndIndentContinueMarkdownList = function (cm) {
    let pos = cm.getCursor(), token = cm.getTokenAt(pos);
    let space;
    if (token.className == 'string') {
      const full = cm.getRange({ line: pos.line, ch: 0 }, { line: pos.line, ch: token.end });
      var listStart = /\*|\d+\./, listContinue;
      if (token.string.search(listStart) == 0) {
        const reg = /^[\W]*(\d+)\./g;
        const matches = reg.exec(full);
        if(matches) {listContinue = `${parseInt(matches[1]) + 1 }.  `;} else {listContinue = '*   ';}
        space = full.slice(0, token.start);
        if (!/^\s*$/.test(space)) {
          space = '';
          for (let i = 0; i < token.start; ++i) space += ' ';
        }
      }
    }

    if (space != null) {cm.replaceSelection(`\n${ space }${listContinue}`, 'end');} else {cm.execCommand('newlineAndIndent');}
  };
}());
