
// Setup
// -----------------------------------------------------------------------------

const browserWindow = require("electron").remote.getCurrentWindow();

class Dockable {

    constructor(params = {}) {
        // Default Configs
        this.config = Object.assign({
            corners: {
                top: 30,
                right: 30,
                bottom: 30,
                left: 30,
            },
            useCorners: true,
        }, params);

        // Default State
        this.state = {
            isEnabled: false,
            mouse: {
                button: 0,
                downEvent: null,
                moveEvent: null,
            },
            screen: null,
        };

        // Bindings
        this.Handle_OnMouseDown = this.Handle_OnMouseDown.bind(this);
        this.Handle_OnMouseMove = this.Handle_OnMouseMove.bind(this);
        this.Handle_OnMouseUp = this.Handle_OnMouseUp.bind(this);
        this.Handle_Drag = this.Handle_Drag.bind(this);

        // Auto-enable
        this.enable();
    }

    attachEvents() {
        if (this.state.isEnabled) {
            return;
        }

        window.addEventListener("mousedown", this.Handle_OnMouseDown);
        window.addEventListener("mousemove", this.Handle_OnMouseMove);
        window.addEventListener("mouseup", this.Handle_OnMouseUp);
        window.addEventListener("mousemove", this.Handle_Drag);
    }

    detachEvents() {
        if (!this.state.isEnabled) {
            return;
        }

        window.removeEventListener("mousedown", this.Handle_OnMouseDown);
        window.removeEventListener("mousemove", this.Handle_OnMouseMove);
        window.removeEventListener("mouseup", this.Handle_OnMouseUp);
        window.removeEventListener("mousemove", this.Handle_Drag);
    }

    enable() {
        this.attachEvents();

        this.state.isEnabled = true;
    }

    disable() {
        this.state.isEnabled = false;
    }


    // Event Handlers
    // -------------------------------------------------------------------------

    Handle_Drag(e) {
        const state = this.state;
        const config = this.config;

        if (state.mouse.button === 1) {
            let windowX = state.mouse.moveEvent.screenX - state.mouse.downEvent.clientX;
            let windowY = state.mouse.moveEvent.screenY - state.mouse.downEvent.clientY;
            let windowHeight = window.outerHeight;
            let windowWidth = window.outerWidth;

            if (state.isEnabled) {
                if (config.useCorners) {
                    if (windowX < config.corners.left - state.screen.availLeft) windowX = 0;
                    if (windowY < config.corners.top + state.screen.availTop) windowY = 0;
                    if (windowX > state.screen.width - windowWidth - config.corners.right) windowX = state.screen.width - windowWidth;
                    if (windowY > state.screen.height - windowHeight - config.corners.bottom) windowY = state.screen.height - windowHeight;
                }
            }

            browserWindow.setPosition(windowX, windowY, false);
        }
    }

    Handle_OnMouseDown(e) {
        this.state.mouse.button = 1;
        this.state.mouse.downEvent = e;
    }

    Handle_OnMouseMove(e) {
        this.state.mouse.moveEvent = e;
        this.state.screen = window.screen;
    }

    Handle_OnMouseUp(e) {
        this.state.mouse.button = 0;
        this.state.mouse.downEvent = null;
    }
}

module.exports = Dockable;
