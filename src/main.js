const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const createMainWindow = () => {
  let mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    title: "Blackjack",
    icon: "Images/blackjack.png",
    show: false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: false
    }
  });
  mainWindow.setTitle("Blackjack");
  const startURL = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL).then(mainWindow.title = "Blackjack").catch((e) => console.error(e));

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
    app.quit();
});