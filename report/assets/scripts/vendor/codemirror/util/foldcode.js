// the tagRangeFinder function is
//   Copyright (C) 2011 by Daniel Glazman <daniel@glazman.org>
// released under the MIT license (../../LICENSE) like the rest of CodeMirror
CodeMirror.tagRangeFinder = function (cm, start) {
  const nameStartChar = 'A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
  const nameChar = `${nameStartChar }\-\:\.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040`;
  const xmlNAMERegExp = new RegExp(`^[${ nameStartChar }][${ nameChar }]*`);

  let lineText = cm.getLine(start.line);
  let found = false;
  let tag = null;
  let pos = start.ch;
  while (!found) {
    pos = lineText.indexOf('<', pos);
    if (pos == -1) // no tag on line
    {return;}
    if (pos + 1 < lineText.length && lineText[pos + 1] == '/') { // closing tag
      pos++;
      continue;
    }
    // ok we seem to have a start tag
    if (!lineText.substr(pos + 1).match(xmlNAMERegExp)) { // not a tag name...
      pos++;
      continue;
    }
    var gtPos = lineText.indexOf('>', pos + 1);
    if (gtPos == -1) { // end of start tag not in line
      var l = start.line + 1;
      let foundGt = false;
      var lastLine = cm.lineCount();
      while (l < lastLine && !foundGt) {
        const lt = cm.getLine(l);
        gtPos = lt.indexOf('>');
        if (gtPos != -1) { // found a >
          foundGt = true;
          const slash = lt.lastIndexOf('/', gtPos);
          if (slash != -1 && slash < gtPos) {
            var str = lineText.substr(slash, gtPos - slash + 1);
            if (!str.match(/\/\s*\>/)) // yep, that's the end of empty tag
            {return;}
          }
        }
        l++;
      }
      found = true;
    } else {
      const slashPos = lineText.lastIndexOf('/', gtPos);
      if (slashPos == -1) { // cannot be empty tag
        found = true;
        // don't continue
      } else { // empty tag?
        // check if really empty tag
        var str = lineText.substr(slashPos, gtPos - slashPos + 1);
        if (!str.match(/\/\s*\>/)) { // finally not empty
          found = true;
          // don't continue
        }
      }
    }
    if (found) {
      const subLine = lineText.substr(pos + 1);
      tag = subLine.match(xmlNAMERegExp);
      if (tag) {
        // we have an element name, wooohooo !
        tag = tag[0];
        // do we have the close tag on same line ???
        if (lineText.indexOf(`</${ tag }>`, pos) != -1) // yep
        {
          found = false;
        }
        // we don't, so we have a candidate...
      } else {found = false;}
    }
    if (!found) {pos++;}
  }

  if (found) {
    const startTag = `(\\<\\/${ tag }\\>)|(\\<${ tag }\\>)|(\\<${ tag }\\s)|(\\<${ tag }$)`;
    const startTagRegExp = new RegExp(startTag);
    const endTag = `</${ tag }>`;
    let depth = 1;
    var l = start.line + 1;
    var lastLine = cm.lineCount();
    while (l < lastLine) {
      lineText = cm.getLine(l);
      const match = lineText.match(startTagRegExp);
      if (match) {
        for (let i = 0; i < match.length; i++) {
          if (match[i] == endTag) {depth--;} else {depth++;}
          if (!depth) {
            return { from: { line: start.line, ch: gtPos + 1 },
              to: { line: l, ch: match.index } };
          }
        }
      }
      l++;
    }
    return;
  }
};

CodeMirror.braceRangeFinder = function (cm, start) {
  let line = start.line, lineText = cm.getLine(line);
  let at = lineText.length, startChar, tokenType;
  for (;;) {
    const found = lineText.lastIndexOf('{', at);
    if (found < start.ch) break;
    tokenType = cm.getTokenAt({ line, ch: found }).type;
    if (!/^(comment|string)/.test(tokenType)) { startChar = found; break; }
    at = found - 1;
  }
  if (startChar == null || lineText.lastIndexOf('}') > startChar) return;
  let count = 1, lastLine = cm.lineCount(), end, endCh;
  outer: for (let i = line + 1; i < lastLine; ++i) {
    let text = cm.getLine(i), pos = 0;
    for (;;) {
      let nextOpen = text.indexOf('{', pos), nextClose = text.indexOf('}', pos);
      if (nextOpen < 0) nextOpen = text.length;
      if (nextClose < 0) nextClose = text.length;
      pos = Math.min(nextOpen, nextClose);
      if (pos == text.length) break;
      if (cm.getTokenAt({ line: i, ch: pos + 1 }).type == tokenType) {
        if (pos == nextOpen) ++count;
        else if (!--count) { end = i; endCh = pos; break outer; }
      }
      ++pos;
    }
  }
  if (end == null || end == line + 1) return;
  return { from: { line, ch: startChar + 1 },
    to: { line: end, ch: endCh } };
};

CodeMirror.indentRangeFinder = function (cm, start) {
  let tabSize = cm.getOption('tabSize'), firstLine = cm.getLine(start.line);
  const myIndent = CodeMirror.countColumn(firstLine, null, tabSize);
  for (let i = start.line + 1, end = cm.lineCount(); i < end; ++i) {
    const curLine = cm.getLine(i);
    if (CodeMirror.countColumn(curLine, null, tabSize) < myIndent) {
      return { from: { line: start.line, ch: firstLine.length },
        to: { line: i, ch: curLine.length } };
    }
  }
};

CodeMirror.newFoldFunction = function (rangeFinder, widget) {
  if (widget == null) widget = '\u2194';
  if (typeof widget === 'string') {
    const text = document.createTextNode(widget);
    widget = document.createElement('span');
    widget.appendChild(text);
    widget.className = 'CodeMirror-foldmarker';
  }

  return function (cm, pos) {
    if (typeof pos === 'number') pos = { line: pos, ch: 0 };
    const range = rangeFinder(cm, pos);
    if (!range) return;

    let present = cm.findMarksAt(range.from), cleared = 0;
    for (let i = 0; i < present.length; ++i) {
      if (present[i].__isFold) {
        ++cleared;
        present[i].clear();
      }
    }
    if (cleared) return;

    const myWidget = widget.cloneNode(true);
    CodeMirror.on(myWidget, 'mousedown', () => {myRange.clear();});
    var myRange = cm.markText(range.from, range.to, {
      replacedWith: myWidget,
      clearOnEnter: true,
      __isFold: true
    });
  };
};
