var process = require('electron').remote.process;

obtain(['child_process', './../piFig/src/wifi.js'], ({ exec, execSync }, wifi)=> {

  exports.scan = (cb)=> {
    if (process.platform == 'darwin') {
      exec('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s', (err, stdout, stderr)=> {
        var lines = stdout.split('\n');
        var ssids = [];
        lines.forEach((line)=> {
          var macReg = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/g;
          var macPos = macReg.exec(line);
          if (macPos) {
            ssids.push(line.substr(0, macPos.index).trim());
          }
        });
        if (!ssids.length) exports.scan(cb);
        cb(0, ssids);
      });
    } else {
      console.log('requesting SSIDs');
      console.log(`sudo iwlist wlan0 scan | awk -F ':' '/ESSID:/ {print $2;}'`);
      console.log(exec("sudo iwlist wlan0 scan | awk -F ':' '/ESSID:/ {print $2;}'", (err, stdout, stderr)=> {
        if (err) console.log(err);
        var lines = stdout.split('\n');
        cb(0, lines.map(val=>val.split('"').join('')));
      }));
    }
  };

  exports.getSSID = ()=> {
    if (process.platform != 'darwin') {
      return execSync('iwgetid -r');
    } else return execSync(`/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'`);
  };

  exports.restart = (cb)=> {
    exec('wpa_cli -i wlan0 reconfigure', (err, std, stderr)=> {
      cb(err);
    });
  };

  exports.connect = ({ ssid, password }, cb)=> {
    if (process.platform != 'darwin') {
      wifi.configure({ ssid: ssid, password: password });
      exports.restart(cb);
    } else {
      cb();
    }
  };
});
