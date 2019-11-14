(function () {
  const matching = { '(': ')>', ')': '(<', '[': ']>', ']': '[<', '{': '}>', '}': '{<' };
  function findMatchingBracket(cm) {
    let cur = cm.getCursor(), line = cm.getLineHandle(cur.line), pos = cur.ch - 1;
    const match = (pos >= 0 && matching[line.text.charAt(pos)]) || matching[line.text.charAt(++pos)];
    if (!match) return null;
    let forward = match.charAt(1) == '>', d = forward ? 1 : -1;
    const style = cm.getTokenAt({ line: cur.line, ch: pos + 1 }).type;

    let stack = [line.text.charAt(pos)], re = /[(){}[\]]/;
    function scan(line, lineNo, start) {
      if (!line.text) return;
      let pos = forward ? 0 : line.text.length - 1, end = forward ? line.text.length : -1;
      if (start != null) pos = start + d;
      for (; pos != end; pos += d) {
        const ch = line.text.charAt(pos);
        if (re.test(ch) && cm.getTokenAt({ line: lineNo, ch: pos + 1 }).type == style) {
          const match = matching[ch];
          if (match.charAt(1) == '>' == forward) stack.push(ch);
          else if (stack.pop() != match.charAt(0)) return { pos, match: false };
          else if (!stack.length) return { pos, match: true };
        }
      }
    }
    for (var i = cur.line, found, e = forward ? Math.min(i + 100, cm.lineCount()) : Math.max(-1, i - 100); i != e; i += d) {
      if (i == cur.line) found = scan(line, i, pos);
      else found = scan(cm.getLineHandle(i), i);
      if (found) break;
    }
    return { from: { line: cur.line, ch: pos }, to: found && { line: i, ch: found.pos }, match: found && found.match };
  }

  function matchBrackets(cm, autoclear) {
    const found = findMatchingBracket(cm);
    if (!found) return;
    const style = found.match ? 'CodeMirror-matchingbracket' : 'CodeMirror-nonmatchingbracket';
    const one = cm.markText(found.from, { line: found.from.line, ch: found.from.ch + 1 },
      { className: style });
    const two = found.to && cm.markText(found.to, { line: found.to.line, ch: found.to.ch + 1 },
      { className: style });
    const clear = function () {
      cm.operation(() => { one.clear(); two && two.clear(); });
    };
    if (autoclear) setTimeout(clear, 800);
    else return clear;
  }

  let currentlyHighlighted = null;
  function doMatchBrackets(cm) {
    cm.operation(() => {
      if (currentlyHighlighted) {currentlyHighlighted(); currentlyHighlighted = null;}
      if (!cm.somethingSelected()) currentlyHighlighted = matchBrackets(cm, false);
    });
  }

  CodeMirror.defineOption('matchBrackets', false, (cm, val) => {
    if (val) cm.on('cursorActivity', doMatchBrackets);
    else cm.off('cursorActivity', doMatchBrackets);
  });

  CodeMirror.defineExtension('matchBrackets', function () {matchBrackets(this, true);});
  CodeMirror.defineExtension('findMatchingBracket', function () {return findMatchingBracket(this);});
}());
