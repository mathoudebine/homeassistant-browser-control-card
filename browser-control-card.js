/* Wake Lock part from https://web.dev/wake-lock/ (sources: https://glitch.com/edit/#!/wake-lock-demo?path=script.js%3A1%3A0 ) */
/* Fullscreen part & card design from https://github.com/KTibow/fullscreen-card */
var wake_lock_supported;
let wakeLock = null;

if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
    wake_lock_supported = true;
} else {
    wake_lock_supported = false;
    console.error('Wake Lock API not supported.');
}

const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
    } catch (e) {
        wakeLock = null;
    }
};

const cancelWakeLock = () => {
    wakeLock.release();
    wakeLock = null;
}

const handleVisibilityChange = () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
};

var the_card;

// Icons and CSS style for buttons
const fullscreen_icon = "<ha-icon icon=\"mdi:fullscreen\"></ha-icon>";
const fullscreen_exit_icon = "<ha-icon icon=\"mdi:fullscreen-exit\"></ha-icon>";
const wake_lock_icon = "<ha-icon icon=\"mdi:sleep\"></ha-icon>";
const wake_unlock_icon = "<ha-icon icon=\"mdi:sleep-off\"></ha-icon>";
const zoom_in_icon = "<ha-icon icon=\"mdi:magnify-plus\"></ha-icon>";
const zoom_out_icon = "<ha-icon icon=\"mdi:magnify-minus\"></ha-icon>";
const refresh_icon = "<ha-icon icon=\"mdi:refresh\"></ha-icon>";

const buttons_css_style = "border: 2px solid var(--primary-color);" +
    "font-size: 2em;" +
    "padding: 0.5em;" +
    "display: inline-block;" +
    "background: var(--primary-color);" +
    "color: var(--primary-background-color);" +
    "text-align: center;" +
    "border-radius: var(--ha-card-border-radius, 4px);" +
    "cursor: pointer;" +
    "margin-right: 5px;" +
    "margin-bottom: 2px;" +
    "margin-top: 2px;";
class BrowserControlCard extends HTMLElement {
    set hass(hass) {
        if (!this.content && this.config) {
            this.content = document.createElement("ha-card");
            this.content.style.padding = "15px";

            /********************************************************
                            Full-screen button
            ********************************************************/
            this.fullscreen = false;
            this.fullscreenbtn = document.createElement("a");
            this.fullscreenbtn.innerHTML = fullscreen_icon;
            this.fullscreenbtn.style.cssText = buttons_css_style;
            this.fullscreenbtn.onclick = function() {
                if (this.fullscreen) {
                    document.exitFullscreen();
                    this.fullscreenbtn.innerHTML = fullscreen_icon;
                } else {
                    document.documentElement.requestFullscreen();
                    this.fullscreenbtn.innerHTML = fullscreen_exit_icon;
                }
                this.fullscreen = !this.fullscreen;
            }.bind(this);
            this.content.appendChild(this.fullscreenbtn);

            /********************************************************
                       Sleep lock button (if supported)
            ********************************************************/
            if (wake_lock_supported) {
                this.wake_lock = false;
                this.nowakebtn = document.createElement("a");
                this.nowakebtn.innerHTML = wake_lock_icon;
                this.nowakebtn.style.cssText = buttons_css_style;
                this.nowakebtn.onclick = function() {
                    if (this.wake_lock) {
                        document.removeEventListener('visibilitychange', handleVisibilityChange);
                        document.removeEventListener('fullscreenchange', handleVisibilityChange);
                        cancelWakeLock();
                        this.nowakebtn.innerHTML = wake_lock_icon;
                    } else {
                        requestWakeLock();
                        document.addEventListener('visibilitychange', handleVisibilityChange);
                        document.addEventListener('fullscreenchange', handleVisibilityChange);
                        this.nowakebtn.innerHTML = wake_unlock_icon;
                    }
                    this.wake_lock = !this.wake_lock;
                }.bind(this);
                this.content.appendChild(this.nowakebtn);
            }

            /********************************************************
                               Zoom buttons
            ********************************************************/
            this.zoom_level = 1.0

            this.zoominbtn = document.createElement("a");
            this.zoominbtn.innerHTML = zoom_in_icon;
            this.zoominbtn.style.cssText = buttons_css_style;
            this.zoominbtn.onclick = function() {
                this.zoom_level = this.zoom_level + 0.1
                document.body.style.zoom = this.zoom_level
            }.bind(this);
            this.content.appendChild(this.zoominbtn);

            this.zoomoutbtn = document.createElement("a");
            this.zoomoutbtn.innerHTML = zoom_out_icon;
            this.zoomoutbtn.style.cssText = buttons_css_style;
            this.zoomoutbtn.onclick = function() {
                this.zoom_level = this.zoom_level - 0.1
                if (this.zoom_level < 0.0) {
                    this.zoom_level = 0.0
                } else {
                    document.body.style.zoom = this.zoom_level
                }
            }.bind(this);
            this.content.appendChild(this.zoomoutbtn);

            /********************************************************
                              Refresh button
            ********************************************************/
            this.refreshbtn = document.createElement("a");
            this.refreshbtn.innerHTML = refresh_icon;
            this.refreshbtn.style.cssText = buttons_css_style;
            this.refreshbtn.onclick = function() {
                document.location.reload();
            }.bind(this);
            this.content.appendChild(this.refreshbtn);


            this.appendChild(this.content);
            the_card = this;
        }
    }
    setConfig(config) {
        this.config = config;
    }
    getCardSize() {
        return 2;
    }
}

customElements.define("browser-control-card", BrowserControlCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "browser-control-card",
    name: "Browser Control Card",
    preview: true,
    description: "Card to control browser settings: fullscreen, wake lock",
});
document.body.onkeydown = (event) => {
    if (event.key == "F11") {
        event.preventDefault();
        the_card.fullscreenbtn.onclick();
    }
};