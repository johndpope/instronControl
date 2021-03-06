'use strict';

var { remote } = require('electron');
var process = remote.process;

remote.getCurrentWindow().closeDevTools();

var obtains = [
  'µ/components',
  `./src/interface/wifiConfig/wifiControl.js`,
  `./src/backend/${process.platform == 'darwin' ? 'dummy.js' : ''}`,
];

obtain(obtains, ({ Button, Dropdown, Card, Menu }, wifi, { encoder, driver })=> {
  exports.app = {};

  driver.onEStop = ()=> {
    µ('#growl').message('E-Stop Pressed', 'warn', true);
  };

  driver.onEStopClear = ()=> {
    µ('#growl').message('E-Stop released', 'success');
  };

  driver.onLimit = (which)=> {
    µ('#growl').message(`${which > 0 ? 'Top' : 'Bottom'} limit reached`, 'warn', true);
  };

  driver.onLimitClear = ()=> {
    µ('#growl').message('Limit switch cleared', 'success');
  };

  exports.app.start = ()=> {
    if (process.platform == 'darwin') {
      µ('.rotator')[0].className = 'normal';
    }

    console.log('started');

    document.onkeydown = (e)=> {
      if (e.key == ' ') driver.enable();
      if (e.key == 's') driver.disable();
      if (e.key == '1') driver.forceDrive(.5);;
    };

    document.onkeyup = (e)=> {
      if (e.which == 27) {
        process.kill(process.pid, 'SIGINT'); //doesn't actually kill, just sends signal
      } else if (e.which == 73 && e.getModifierState('Control') &&  e.getModifierState('Shift')) {
        require('electron').remote.getCurrentWindow().toggleDevTools();
      }
    };

    process.on('SIGINT', ()=> {
      //cleanup funcitons here
      encoder.close();
      driver.close();
      process.nextTick(function () { process.exit(0); });
    });
  };

  provide(exports);
});
