import {app, BrowserWindow} from 'electron'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow({
      width:800,
      height: 600,
        webPreferences: {
            nodeIntegration: true, // Habilitar require() no frontend
            contextIsolation: false, // Desabilitar isolamento do contexto
            webSecurity: false,
        }
    });

    mainWindow.loadFile(path.join(__dirname,'index.html'));

    // Abrir as DevTools para facilitar a depuração
    mainWindow.webContents.openDevTools();
});