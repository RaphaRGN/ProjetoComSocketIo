import {app, BrowserWindow, nativeImage, Tray, Menu, ipcMain} from 'electron'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;
let top = {};

app.once("ready", ev => {
    // Função para criar a janela principal
    const createMainWindow = () => {
        top.win = new BrowserWindow({
            width: 800, height: 600, center: true, minimizable: false, show: false,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
                webSecurity: true,
                sandbox: true,
            },                                
        });
        top.win.loadURL("http://localhost:3000");
        top.win.on("close", ev => {
            ev.sender.hide();
            ev.preventDefault(); // previne que o processo seja encerrado
        });
    };

    // Inicializa a janela principal
    createMainWindow();

    // Criação da bandeja com o ícone
    top.tray = new Tray(nativeImage.createFromPath(path.join(__dirname,'Brigada2.png')));
    
    const menu = Menu.buildFromTemplate([
        {label: "Ações", submenu: [
            {label: "Abrir chat", click: (item, window, event) => {
                // Verifica se a janela ainda existe e não foi destruída
                if (top.win && !top.win.isDestroyed()) {
                    top.win.show();
                } else {
                    // Se a janela foi destruída, recrie-a
                    createMainWindow();
                    top.win.show();
                }
            }},
        ]},
        {type: "separator"},
        {role: "quit"}, // "role": ação pré-definida do sistema
    ]);

    top.tray.setToolTip("SentinelHSC");
    top.tray.setContextMenu(menu);

    // Janela oculta para icone animado (caso necessário)
    top.icons = new BrowserWindow({
        show: false, webPreferences: {offscreen: true}
    });
    top.icons.loadURL("http://localhost:3000");
    
    });
// Evento antes de fechar a aplicação
app.on("before-quit", ev => {
    if (top.win && !top.win.isDestroyed()) {
        top.win.destroy(); 
    }
    top = null;
});

ipcMain.on('show-window', () => {

if (top.win && !top.win.isDestroyed()){

    top.win.show()

        }   

else{

    createMainWindow();
        top.win.show();

    }

});