import { app, BrowserWindow, ipcMain, dialog } from 'electron'
var fs = require("fs");
var process = require("process");
var _ = require('lodash');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: true
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('findTmpls', (event, arg) => {
  fs.readdir(arg, (err, data) => {
    if (err) throw err;
    var tmpls = data;
    event.sender.send('findTmpls-reply', tmpls)
  });
})

ipcMain.on('getContent', (event, arg) => {
  var buffer = fs.readFileSync(arg);
  event.returnValue = buffer.toString();
})

ipcMain.on('getData', (event, arg) => {
  var defaultText='[]';
  fs.stat('./data.js', function(err, stat){
    if(stat&&stat.isFile()) {
      fs.readFile('./data.js', (err, data) => {
        if (err) throw err;
        event.returnValue = data.toString();
      });
    } else {
      fs.writeFile('./data.js', defaultText,function(err){
        if(err) throw err;
        event.returnValue = defaultText;
      })
    }
});

})

ipcMain.on('export', (event, arg) => {
  dialog.showSaveDialog(function (filename) {
    fs.appendFile(filename, arg);
  });
})

ipcMain.on('batch-export', (event, arg) => {
  console.log(arg);
  fs.writeFile('./data.js', JSON.stringify(arg), function (err) {
    if (err) {
      return console.error(err);
    }
  });

  _.each(arg, function (x, index) {
    fs.readFile(x.path, (err, data) => {
      if (err) throw err;
      var text = _.template(data)(JSON.parse(x.keyword));
      fs.writeFile(x.exportPath, text, (err) => {
      });
      event.sender.send('batch-export-reply', `第${index + 1}行完成`);
    });
  });


})

// process.on('uncaughtException', function (err) {
//   console.error('Error caught in uncaughtException event:', err);
//   event.sender.send('error', err.message);
// });