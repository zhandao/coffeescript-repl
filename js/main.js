// Generated by CoffeeScript 1.3.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  require(['jquery', 'coffee-script', 'nodeutil'], function($, CoffeeScript, nodeutil) {
    return $(function() {
      var $input, $inputcopy, $inputdiv, $inputl, $inputr, $output, $prompt, CoffeeREPL, SAVED_CONSOLE_LOG, escapeHTML, init, resizeInput, scrollToBottom;
      SAVED_CONSOLE_LOG = console.log;
      $output = $('#output');
      $input = $('#input');
      $prompt = $('#prompt');
      $inputdiv = $('#inputdiv');
      $inputl = $('#inputl');
      $inputr = $('#inputr');
      $inputcopy = $('#inputcopy');
      escapeHTML = function(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      };
      CoffeeREPL = (function() {
        var DEFAULT_SETTINGS;

        CoffeeREPL.name = 'CoffeeREPL';

        DEFAULT_SETTINGS = {
          lastVariable: '$_',
          maxLines: 500,
          maxDepth: 2,
          showHidden: false,
          colorize: true
        };

        function CoffeeREPL(output, input, prompt, settings) {
          var k, v, _ref;
          this.output = output;
          this.input = input;
          this.prompt = prompt;
          if (settings == null) {
            settings = {};
          }
          this.handleKeypress = __bind(this.handleKeypress, this);

          this.clear = __bind(this.clear, this);

          this.addToSaved = __bind(this.addToSaved, this);

          this.addToHistory = __bind(this.addToHistory, this);

          this.setPrompt = __bind(this.setPrompt, this);

          this.processSaved = __bind(this.processSaved, this);

          this.print = __bind(this.print, this);

          this.history = [];
          this.historyi = -1;
          this.saved = '';
          this.multiline = false;
          this.settings = $.extend({}, DEFAULT_SETTINGS);
          if (localStorage && localStorage.settings) {
            _ref = JSON.parse(localStorage.settings);
            for (k in _ref) {
              v = _ref[k];
              this.settings[k] = v;
            }
          }
          for (k in settings) {
            v = settings[k];
            this.settings[k] = v;
          }
          this.input.keydown(this.handleKeypress);
        }

        CoffeeREPL.prototype.resetSettings = function() {
          return localStorage.settings = {};
        };

        CoffeeREPL.prototype.saveSettings = function() {
          return localStorage.settings = JSON.stringify($.extend({}, this.settings));
        };

        CoffeeREPL.prototype.print = function() {
          var args, o, s;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          s = args.join(' ') || ' ';
          o = this.output[0].innerHTML + s + '\n';
          this.output[0].innerHTML = o.split('\n').slice(-this.settings.maxLines).join('\n');
          return;
        };

        CoffeeREPL.prototype.processSaved = function() {
          var compiled, ouput, output, value;
          try {
            compiled = CoffeeScript.compile(this.saved);
            compiled = compiled.slice(14, -17);
            value = eval.call(window, compiled);
            window[this.settings.lastVariable] = value;
            output = nodeutil.inspect(value, this.settings.showHidden, this.settings.maxDepth, this.settings.colorize);
          } catch (e) {
            if (e.stack) {
              output = e.stack;
              if (output.split('\n')[0] !== e.toString()) {
                ouput = "" + (e.toString()) + "\n" + e.stack;
              }
            } else {
              output = e.toString();
            }
          }
          this.saved = '';
          return this.print(output);
        };

        CoffeeREPL.prototype.setPrompt = function() {
          var s;
          s = this.multiline ? '------' : 'coffee';
          return this.prompt.html("" + s + "&gt;&nbsp;");
        };

        CoffeeREPL.prototype.addToHistory = function(s) {
          this.history.unshift(s);
          return this.historyi = -1;
        };

        CoffeeREPL.prototype.addToSaved = function(s) {
          this.saved += s.slice(0, -1) === '\\' ? s.slice(0, -1) : s;
          this.saved += '\n';
          return this.addToHistory(s);
        };

        CoffeeREPL.prototype.clear = function() {
          this.output[0].innerHTML = '';
          return;
        };

        CoffeeREPL.prototype.handleKeypress = function(e) {
          var input;
          switch (e.which) {
            case 13:
              e.preventDefault();
              input = this.input.val();
              this.input.val('');
              this.print(this.prompt.html() + escapeHTML(input));
              if (input) {
                this.addToSaved(input);
                if (input.slice(0, -1) !== '\\' && !this.multiline) {
                  return this.processSaved();
                }
              }
              break;
            case 27:
              e.preventDefault();
              input = this.input.val();
              if (input && this.multiline && this.saved) {
                input = this.input.val();
                this.input.val('');
                this.print(this.prompt.html() + escapeHTML(input));
                this.addToSaved(input);
                this.processSaved();
              } else if (this.multiline && this.saved) {
                this.processSaved();
              }
              this.multiline = !this.multiline;
              return this.setPrompt();
            case 38:
              e.preventDefault();
              if (this.historyi < this.history.length - 1) {
                this.historyi += 1;
                return this.input.val(this.history[this.historyi]);
              }
              break;
            case 40:
              e.preventDefault();
              if (this.historyi > 0) {
                this.historyi += -1;
                return this.input.val(this.history[this.historyi]);
              }
          }
        };

        return CoffeeREPL;

      })();
      resizeInput = function(e) {
        var content, width;
        width = $inputdiv.width() - $inputl.width();
        content = $input.val();
        content.replace(/\n/g, '<br/>');
        $inputcopy.html(content);
        $inputcopy.width(width);
        $input.width(width);
        return $input.height($inputcopy.height() + 2);
      };
      scrollToBottom = function() {
        return window.scrollTo(0, $prompt[0].offsetTop);
      };
      init = function() {
        var repl;
        $input.keydown(scrollToBottom);
        $(window).resize(resizeInput);
        $input.keyup(resizeInput);
        $input.change(resizeInput);
        $('html').click(function(e) {
          if (e.clientY > $input[0].offsetTop) {
            return $input.focus();
          }
        });
        repl = new CoffeeREPL($output, $input, $prompt);
        console.log = function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          SAVED_CONSOLE_LOG.apply(console, args);
          return repl.print.apply(repl, args);
        };
        window.$$ = repl;
        resizeInput();
        $input.focus();
        window.help = function() {
          var text;
          text = [" ", "<strong>Features</strong>", "<strong>========</strong>", "+ <strong>Esc</strong> toggles multiline mode.", "+ <strong>Up/Down arrow</strong> flips through line history.", "+ <strong>" + repl.settings.lastVariable + "</strong> stores the last returned value.", "+ Access the internals of this console through <strong>$$</strong>.", "+ <strong>$$.clear()</strong> clears this console.", " ", "<strong>Settings</strong>", "<strong>========</strong>", "You can modify the behavior of this REPL by altering <strong>$$.settings</strong>:", " ", "+ <strong>lastVariable</strong> (" + repl.settings.lastVariable + "): variable name in which last returned value is stored", "+ <strong>maxLines</strong> (" + repl.settings.maxLines + "): max line count of this console", "+ <strong>maxDepth</strong> (" + repl.settings.maxDepth + "): max depth in which to inspect outputted object", "+ <strong>showHidden</strong> (" + repl.settings.showHidden + "): flag to output hidden (not enumerable) properties of objects", "+ <strong>colorize</strong> (" + repl.settings.colorize + "): flag to colorize output (set to false if REPL is slow)", " ", "<strong>$$.saveSettings()</strong> will save settings to localStorage.", "<strong>$$.resetSettings()</strong> will reset settings to default.", " "].join('\n');
          return repl.print(text);
        };
        return repl.print(["# CoffeeScript v1.3.1 REPL", "# <a href=\"https://github.com/larryng/coffeescript-repl\" target=\"_blank\">https://github.com/larryng/coffeescript-repl</a>", "#", "# help() for features and tips."].join('\n'));
      };
      return init();
    });
  });

}).call(this);
