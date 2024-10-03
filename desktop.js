import {app, BrowserWindow, nativeImage, Tray, Menu} from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
//import './server.js';
//import './database.js';
//import './public/index.js';

//const socket = io('http://localhost:3000')

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let top = {};

app.on('ready', () => {

    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          webSecurity: false,
      }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.webContents.openDevTools();
});

app.once("ready", ev => {
    top.win = new BrowserWindow({
        width: 800,
        height: 600,
        center: true,
        minimizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: true,
            sandbox: true,
        },                                
    });
    top.win.loadURL("http://localhost:3000");

    top.win.on("close", ev => {
        ev.sender.hide();
        ev.preventDefault();
    });

    // Aqui definimos o caminho do ícone local
    const iconPath = path.join(__dirname, 'public', 'Brigada.jpg');
    top.tray = new Tray(nativeImage.createFromPath(iconPath));

    const menu = Menu.buildFromTemplate([
        {label: "Actions", submenu: [
            {label: "Abrir o chat", click: (item, window, event) => {
                top.win.show();
            }},
        ]},
        {type: "separator"},
        {role: "quit"},
    ]);

    top.tray.setToolTip("SentinelHSC");
    top.tray.setContextMenu(menu);

    top.icons = new BrowserWindow({
        show: false, webPreferences: {offscreen: true}});
    top.icons.loadURL("http://localhost:3000");

    top.icons.webContents.on("paint", (event, dirty, image) => {
        if (top.tray) top.tray.setImage(image.resize({width: 16, height: 16}));
    });
});

app.on("before-quit", ev => {
    top.win.removeAllListeners("close");
    top = null;
});
