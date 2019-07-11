

import Dockable from "/lib/index.js";
const BrowserWindow = require("electron").remote.getCurrentWindow();


// Setup Dockable
// -----------------------------------------------------------------------------

const dock = new Dockable({
    useCorners: true,
});


// Controls
// -----------------------------------------------------------------------------

document.querySelector("[name=chk_enabled]").onclick = (e) => {
    if (e.currentTarget.checked) {
        dock.enable();
    }
    else {
        dock.disable();
    }
}


// Event Handlers
// -----------------------------------------------------------------------------

document.querySelectorAll("button[onclick]").forEach((el) => {
    el.onclick = (e) => {
        const method = e.currentTarget.getAttribute("onclick");
        window[method](e);
    }
});

window.Handle_OnClickClose = (e) => {
    e.preventDefault();
    BrowserWindow.close();
}
