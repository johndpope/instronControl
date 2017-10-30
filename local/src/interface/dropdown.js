obtain([], ()=> {
  if (!customElements.get('drop-down')) {
    var dir = '';
    if (__dirname) dir = __dirname;
    else dir = exports.src.substr(0, exports.src.lastIndexOf('/'));

    window.loadCSS(dir + '/dropdown.css');

    class Dropdown extends HTMLElement {
      constructor(props) {
        super(props);

        console.log('Y no u work?');
      }

      get disabled() {
        return (µ('|>disabled', this) == '');
      }

      set disabled(val) {
        if (val) this.setAttribute('disabled', '');
        else this.removeAttribute('disabled');
      }

      get open() {
        return (µ('|>open', this) == '');
      }

      set open(val) {
        if (val) this.setAttribute('open', '');
        else this.removeAttribute('open');
      }

      get value() {
        return this.children(this.selectedIndex).value;
      }

      get selected() {
        return this.children(this.selectedIndex);
      }

      set selected(val) {
        this.display.innerHTML = '';
        this.selectedIndex = Array.prototype.indexOf.call(this.children, val);
        this.display.appendChild(val.cloneNode(true));
      }

      addOption (text, value) {
        var newOpt = µ('+drop-opt', this);
        newOpt.value = value;
        newOpt.textContent = text;
        return newOpt;
      }

      removeOption (opts) {
        // remove child code here.
        if (opts && opts.index) this.removeChild(this.children(opts.index));
        else if (opts && opts.node) this.removeChild(opts.node);
      }

      connectedCallback() {
        //register events, check contents, etc.
        var _this = this;

        this.root = _this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style> @import "${dir}/dropInternal.css";</style>`;

        _this.tray = µ('+div', this.root);
        _this.tray.className = 'tray';
        µ('+slot', _this.tray);

        _this.display = µ('+div', this.root);
        _this.display.className = 'display';

        _this.onmousedown = (e)=> {
          e.preventDefault();
          _this.pressed = true;
        };

        _this.onmouseup = (e)=> {
          e.preventDefault();
          if (_this.pressed && !_this.disabled) _this.open = true;
        };

        document.addEventListener('mousedown', (e)=> {
          e.preventDefault();
          console.log(e.target);
          if (this.open && e.target.parentElement != _this) this.open = false;
        });

        _this.onSelect = (which)=> { console.log(`${which} was chosen`);};

        _this.onchange = ()=> {
          _this.onSelect(_this.value);
        };

      };
    }

    class DropOpt extends HTMLElement {
      constructor(props) {
        super(props);
      }

      get value() {
        return µ('|>value', this);
      }

      set value(val) {
        if (val) this.setAttribute('open', val);
        else this.removeAttribute('open');
      }

      connectedCallback() {
        //register events, check contents, etc.
        var _this = this;

        _this.onclick = ()=> {
          _this.parentElement.open = false;
          _this.parentElement.selected = _this;
        };

        document.addEventListener('mousedown', (e)=> {
          e.preventDefault();
          console.log(e.target);
          if (this.open && e.target.parentElement != _this) this.open = false;
        });

      };
    }

    customElements.define('drop-opt', DropOpt);
    customElements.define('drop-down', Dropdown);
  }

  exports.Button = customElements.get('drop-down');
});
