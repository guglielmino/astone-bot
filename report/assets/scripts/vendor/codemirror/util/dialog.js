// Open simple dialogs on top of an editor. Relies on dialog.css.

(function () {
  function dialogDiv(cm, template, bottom) {
    const wrap = cm.getWrapperElement();
    let dialog;
    dialog = wrap.appendChild(document.createElement('div'));
    if (bottom) {
      dialog.className = 'CodeMirror-dialog CodeMirror-dialog-bottom';
    } else {
      dialog.className = 'CodeMirror-dialog CodeMirror-dialog-top';
    }
    dialog.innerHTML = template;
    return dialog;
  }

  CodeMirror.defineExtension('openDialog', function (template, callback, options) {
    const dialog = dialogDiv(this, template, options && options.bottom);
    let closed = false, me = this;
    function close() {
      if (closed) return;
      closed = true;
      dialog.parentNode.removeChild(dialog);
    }
    let inp = dialog.getElementsByTagName('input')[0], button;
    if (inp) {
      CodeMirror.on(inp, 'keydown', (e) => {
        if (e.keyCode == 13 || e.keyCode == 27) {
          CodeMirror.e_stop(e);
          close();
          me.focus();
          if (e.keyCode == 13) callback(inp.value);
        }
      });
      inp.focus();
      CodeMirror.on(inp, 'blur', close);
    } else if (button = dialog.getElementsByTagName('button')[0]) {
      CodeMirror.on(button, 'click', () => {
        close();
        me.focus();
      });
      button.focus();
      CodeMirror.on(button, 'blur', close);
    }
    return close;
  });

  CodeMirror.defineExtension('openConfirm', function (template, callbacks, options) {
    const dialog = dialogDiv(this, template, options && options.bottom);
    const buttons = dialog.getElementsByTagName('button');
    let closed = false, me = this, blurring = 1;
    function close() {
      if (closed) return;
      closed = true;
      dialog.parentNode.removeChild(dialog);
      me.focus();
    }
    buttons[0].focus();
    for (let i = 0; i < buttons.length; ++i) {
      var b = buttons[i];
      (function (callback) {
        CodeMirror.on(b, 'click', (e) => {
          CodeMirror.e_preventDefault(e);
          close();
          if (callback) callback(me);
        });
      }(callbacks[i]));
      CodeMirror.on(b, 'blur', () => {
        --blurring;
        setTimeout(() => { if (blurring <= 0) close(); }, 200);
      });
      CodeMirror.on(b, 'focus', () => { ++blurring; });
    }
  });
}());
