
// Configs
require("dotenv").config();

// References
const { app, protocol, BrowserWindow } = require("electron");
const nfs = require("fs");
const npjoin = require("path").join;
const es6Path = npjoin(__dirname, "app");

// Constants
const DEBUG_MODE = process.env.DEBUG === "true";
const INDEX_FILEPATH = process.env.INDEX_FILEPATH || "./app/index.html";
const WINDOW_HEIGHT = parseInt(process.env.WINDOW_HEIGHT) || 300;
const WINDOW_WIDTH = parseInt(process.env.WINDOW_WIDTH) || 600;

// Variables
let mainWindow;

// Setup
if (protocol["registerStandardSchemes"]) {
    protocol.registerStandardSchemes(["es6"]);
}
else {
    protocol.registerSchemesAsPrivileged([
        {
            scheme: "es6",
            privileges: {
                standard: true,
                secure: true
            }
        }
    ]);
}


/**
 * Re-create window if not exists after clicking dock icon
 */
app.on("activate", Handle_CreateWindow);

/**
 * Ready to create electron windows
 */
app.on("ready", Handle_OnReady);

/**
 * Kill all windows and processes
 */
app.on("window-all-closed", Handle_OnWindowAllClosed);


// Event Handlers
// -----------------------------------------------------------------------------

function Handle_CreateWindow() {
    if (mainWindow == null) {
        createAndLoadWindow();
    }
}

function Handle_OnReady() {
    // Register ES6
    protocol.registerBufferProtocol("es6", (req, cb) => {
        const url = req.url.replace("es6://", "");
        const join = npjoin(es6Path, url);

        nfs.readFile(join, (e, b) => {
            cb({
                mimeType: "text/javascript",
                data: b
            })
        })
    });

    // Create Window
    Handle_CreateWindow();
}

function Handle_OnWindowAllClosed() {
    app.quit();
}

function Handle_OnWindowClosed() {
    mainWindow = null;
}


// Actions
// -----------------------------------------------------------------------------

function createWindow(url) {
    const win = new BrowserWindow({
        alwaysOnTop: false,
        frame: false,
        hasShadow: true,
        height: WINDOW_HEIGHT,
        resizable: true,
        transparent: true,
        width: WINDOW_WIDTH,
        webPreferences: {
            nodeIntegration: true
        },
    });

    // Load the index.html of the app.
    win.loadFile(url);

    // Open the DevTools.
    if (DEBUG_MODE) {
        win.webContents.openDevTools();
    }

    return win;
}

function createAndLoadWindow() {
    // Create the browser window.
    mainWindow = createWindow(INDEX_FILEPATH);

    // Emitted when the window is closed.
    mainWindow.on("closed", Handle_OnWindowClosed);
}
