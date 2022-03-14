/* Wake Lock part from https://web.dev/wake-lock/ (sources: https://glitch.com/edit/#!/wake-lock-demo?path=script.js%3A1%3A0 ) */
/* Fullscreen part & card design from https://github.com/KTibow/fullscreen-card */
var wake_lock_supported;
let wakeLock = null;

if ("wakeLock" in navigator && "request" in navigator.wakeLock) {
  wake_lock_supported = true;
} else {
  wake_lock_supported = false;
  console.warn("Browser Control Card: Wake Lock API not supported.");
}

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch (e) {
    wakeLock = null;
  }
};

const cancelWakeLock = () => {
  wakeLock.release();
  wakeLock = null;
};

const handleVisibilityChange = () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
};

// Icons and CSS style for buttons
const fullscreen_icon = '<ha-icon icon="mdi:fullscreen"></ha-icon>';
const fullscreen_exit_icon = '<ha-icon icon="mdi:fullscreen-exit"></ha-icon>';
const wake_lock_icon = '<ha-icon icon="mdi:sleep"></ha-icon>';
const wake_unlock_icon = '<ha-icon icon="mdi:sleep-off"></ha-icon>';
const zoom_in_icon = '<ha-icon icon="mdi:magnify-plus"></ha-icon>';
const zoom_out_icon = '<ha-icon icon="mdi:magnify-minus"></ha-icon>';
const refresh_icon = '<ha-icon icon="mdi:refresh"></ha-icon>';

const buttons_css_style =
  "border: 2px solid var(--primary-color);" +
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
    this._hass = hass;
  }

  setConfig(config) {
    this.config = config;

    if (this.config) {
      this.content = document.createElement("ha-card");
      this.content.style.padding = "15px";

      /********************************************************
                            Full-screen button
            ********************************************************/
      if (!this.config.hide_fullscreen) {
        this.fullscreen = false;
        this.fullscreenbtn = document.createElement("a");
        this.fullscreenbtn.innerHTML = fullscreen_icon;
        this.fullscreenbtn.style.cssText = buttons_css_style;
        this.fullscreenbtn.onclick = function () {
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
      }

      /********************************************************
                       Sleep lock button (if supported)
            ********************************************************/
      if (!this.config.hide_screenlock && wake_lock_supported) {
        this.wake_lock = false;
        this.nowakebtn = document.createElement("a");
        this.nowakebtn.innerHTML = wake_lock_icon;
        this.nowakebtn.style.cssText = buttons_css_style;
        this.nowakebtn.onclick = function () {
          if (this.wake_lock) {
            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChange
            );
            document.removeEventListener(
              "fullscreenchange",
              handleVisibilityChange
            );
            cancelWakeLock();
            this.nowakebtn.innerHTML = wake_lock_icon;
          } else {
            requestWakeLock();
            document.addEventListener(
              "visibilitychange",
              handleVisibilityChange
            );
            document.addEventListener(
              "fullscreenchange",
              handleVisibilityChange
            );
            this.nowakebtn.innerHTML = wake_unlock_icon;
          }
          this.wake_lock = !this.wake_lock;
        }.bind(this);
        this.content.appendChild(this.nowakebtn);
      }

      /********************************************************
                               Zoom buttons
            ********************************************************/
      if (!this.config.hide_zoom) {
        this.zoom_level = 1.0;

        this.zoominbtn = document.createElement("a");
        this.zoominbtn.innerHTML = zoom_in_icon;
        this.zoominbtn.style.cssText = buttons_css_style;
        this.zoominbtn.onclick = function () {
          this.zoom_level = this.zoom_level + 0.1;
          document.body.style.zoom = this.zoom_level;
        }.bind(this);
        this.content.appendChild(this.zoominbtn);

        this.zoomoutbtn = document.createElement("a");
        this.zoomoutbtn.innerHTML = zoom_out_icon;
        this.zoomoutbtn.style.cssText = buttons_css_style;
        this.zoomoutbtn.onclick = function () {
          this.zoom_level = this.zoom_level - 0.1;
          if (this.zoom_level < 0.0) {
            this.zoom_level = 0.0;
          } else {
            document.body.style.zoom = this.zoom_level;
          }
        }.bind(this);
        this.content.appendChild(this.zoomoutbtn);
      }

      /********************************************************
                              Refresh button
            ********************************************************/
      if (!this.config.hide_refresh) {
        this.refreshbtn = document.createElement("a");
        this.refreshbtn.innerHTML = refresh_icon;
        this.refreshbtn.style.cssText = buttons_css_style;
        this.refreshbtn.onclick = function () {
          document.location.reload();
        }.bind(this);
        this.content.appendChild(this.refreshbtn);
      }

      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      this.appendChild(this.content);
    }
  }

  static getStubConfig() {
    return {
      hide_fullscreen: false,
      hide_screenlock: false,
      hide_zoom: false,
      hide_refresh: false,
    };
  }

  getCardSize() {
    return 2;
  }

  static getConfigElement() {
    return document.createElement("browser-control-card-editor");
  }
}

customElements.define("browser-control-card", BrowserControlCard);

import { html, css, LitElement } from "https://unpkg.com/lit?module";

class BrowserControlCardEditor extends LitElement {
  static get properties() {
    return { hass: {}, _config: {} };
  }

  setConfig(config) {
    this._config = config;
  }

  fireEvent() {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: this._config };
    this.dispatchEvent(event);
  }

  fullscreenChange(ev) {
    this._config.hide_fullscreen = !ev.target.checked;
    this.fireEvent();
  }
  screenLockChange(ev) {
    this._config.hide_screenlock = !ev.target.checked;
    this.fireEvent();
  }
  zoomChange(ev) {
    this._config.hide_zoom = !ev.target.checked;
    this.fireEvent();
  }
  refreshChange(ev) {
    this._config.hide_refresh = !ev.target.checked;
    this.fireEvent();
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      Note: some buttons may be hidden if your current browser does not support
      the feature
      <ul class="switches">
        <li class="switch">
          <ha-switch
            .checked=${!this._config.hide_fullscreen}
            @change="${this.fullscreenChange}"
          >
          </ha-switch
          ><span><ha-icon icon="mdi:fullscreen"></ha-icon></span>
        </li>
        <li class="switch">
          <ha-switch
            .checked=${!this._config.hide_screenlock}
            @change="${this.screenLockChange}"
          >
          </ha-switch
          ><span><ha-icon icon="mdi:sleep"></ha-icon></span>
        </li>
        <li class="switch">
          <ha-switch
            .checked=${!this._config.hide_zoom}
            @change="${this.zoomChange}"
          >
          </ha-switch
          ><span
            ><ha-icon icon="mdi:magnify-plus"></ha-icon> /
            <ha-icon icon="mdi:magnify-minus"></ha-icon
          ></span>
        </li>
        <li class="switch">
          <ha-switch
            .checked=${!this._config.hide_refresh}
            @change="${this.refreshChange}"
          >
          </ha-switch
          ><span><ha-icon icon="mdi:refresh"></ha-icon></span>
        </li>
      </ul>
    `;
  }

  static get styles() {
    return css`
      .switches {
        margin: 8px 0;
        list-style: none;
        padding: 0;
      }
      .switch {
        display: flex;
        align-items: center;
        height: 40px;
      }
      .switches span {
        padding: 0 16px;
      }
    `;
  }
}

customElements.define("browser-control-card-editor", BrowserControlCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "browser-control-card",
  name: "Browser Control Card",
  preview: true,
  description:
    "Card to control browser settings: full-screen, wake lock, zoom...",
});
