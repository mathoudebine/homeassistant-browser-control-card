/* Wake Lock part from https://web.dev/wake-lock/ (sources: https://glitch.com/edit/#!/wake-lock-demo?path=script.js%3A1%3A0 ) */
/* Fullscreen part & card design from https://github.com/KTibow/fullscreen-card */
var wake_lock_supported;
if ("wakeLock" in navigator && "request" in navigator.wakeLock) {
  wake_lock_supported = true;
} else {
  wake_lock_supported = false;
  console.warn(
    "Browser Control Card: Wake Lock API not supported by this browser."
  );
}

var css_zoom_supported;
try {
  if (CSS.supports("zoom", "1")) {
    css_zoom_supported = true;
  } else {
    css_zoom_supported = false;
    console.warn(
      "Browser Control Card: CSS Zoom not supported by this browser."
    );
  }
} catch (error) {
  // When in doubt, display the zoom buttons
  css_zoom_supported = true;
  console.warn(
    "Browser Control Card: CSS Zoom may not be supported by this browser."
  );
}

let wakeLock = null;
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

const handleVisibilityChangeOnWakeLock = () => {
  if (wakeLock !== null && document.visibilityState === "visible") {
    requestWakeLock();
  }
};

const ha = document.querySelector("body > home-assistant");
const ha_main = ha.shadowRoot.querySelector("home-assistant-main");
const ha_panel_lovelace = ha_main.shadowRoot.querySelector("ha-panel-lovelace");

function hideNavbar(hideNavbar) {
  try {
    if (!ha_panel_lovelace) {
      return;
    }
    let huiRoot = ha_panel_lovelace.shadowRoot.querySelector("hui-root");
    if (!huiRoot) {
      return;
    }
    huiRoot = huiRoot.shadowRoot;
    const view = huiRoot.querySelector("#view");
    let appToolbar = huiRoot.querySelector("app-toolbar");
    if (!appToolbar) {
      // Changed with 2023.04
      appToolbar = huiRoot.querySelector("div.toolbar");
    }
    if (!appToolbar) {
      // Changed with 2026.02
      appToolbar = huiRoot.querySelector("div.header");
    }
    if (hideNavbar) {
      appToolbar.style.setProperty("display", "none");
      view.style.minHeight = "100vh";
      view.style.marginTop = "0";
      view.style.paddingTop = "0";
    } else {
      appToolbar.style.removeProperty("display");
      view.style.removeProperty("min-height");
      view.style.removeProperty("margin-top");
      view.style.removeProperty("padding-top");
    }
    window.dispatchEvent(new Event("resize"));
  } catch (e) {
    console.warn(e);
  }
}

function hideSidebar(hideSidebar) {
  try {
    if (ha_panel_lovelace) {
      const ha_menu_button = ha_panel_lovelace.shadowRoot
        .querySelector("hui-root")
        .shadowRoot.querySelector("ha-menu-button");
      if (ha_menu_button) {
        if (hideSidebar) {
          ha_menu_button.style.display = "none";
        } else {
          ha_menu_button.style.removeProperty("display");
        }
      }
    }
  } catch (e) {
    console.warn(e);
  }

  try {
    const sidebar = ha_main.shadowRoot
      .querySelector("ha-drawer")
      .shadowRoot.querySelector("aside");
    if (sidebar) {
      if (hideSidebar) {
        sidebar.style.maxWidth = "0px";
        ha_main.style.setProperty(
          "--mdc-drawer-width",
          "env(safe-area-inset-left)"
        );
      } else {
        sidebar.style.maxWidth = "";
        ha_main.style.removeProperty("--mdc-drawer-width");
      }
      window.dispatchEvent(new Event("resize"));
    }
  } catch (e) {
    console.warn(e);
  }
}

// Icons and CSS style for buttons
const fullscreen_icon = '<ha-icon icon="mdi:fullscreen"></ha-icon>';
const fullscreen_exit_icon = '<ha-icon icon="mdi:fullscreen-exit"></ha-icon>';
const wake_lock_icon = '<ha-icon icon="mdi:sleep-off"></ha-icon>';
const zoom_in_icon = '<ha-icon icon="mdi:magnify-plus"></ha-icon>';
const zoom_out_icon = '<ha-icon icon="mdi:magnify-minus"></ha-icon>';
const refresh_icon = '<ha-icon icon="mdi:refresh"></ha-icon>';
const hide_navbar_icon = '<ha-icon icon="mdi:table-row-remove"></ha-icon>';
const hide_sidebar_icon = '<ha-icon icon="mdi:playlist-remove"></ha-icon>';

const button_style =
  "border: none;" +
  "padding: 0.5rem;" +
  "display: inline-block;" +
  "background: var(--primary-color);" +
  "color: var(--text-primary-color);" +
  "text-align: center;" +
  "border-radius: var(--ha-card-border-radius, 4px);" +
  "cursor: pointer;" +
  "margin-right: 5px;" +
  "margin-bottom: 2px;" +
  "margin-top: 2px;";

const big_icon_style = "--mdc-icon-size: var(--ha-font-size-5xl);";

function getIconStyle(small_icon) {
  if (small_icon) {
    return "";
  } else {
    return big_icon_style;
  }
}
class BrowserControlCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    // Clone the configuration to edit it if necessary (e.g. for old config. keys)
    this.config = structuredClone(config);

    if (this.config) {
      this.content = document.createElement("ha-card");

      if (!this.config.no_padding) {
        this.content.style.padding = "1rem";
      }

      this.content.style.display = "flex";
      this.content.style.alignItems = "center";
      if (!this.config.layout) {
        this.config.layout = "center"
      }
      this.content.style.justifyContent = this.config.layout;

      // Convert old configuration keys
      if (!this.config.controls) {
        this.config.controls = [];
        if (!this.config.hide_fullscreen) {
          this.config.controls.push("fullscreen")
        }
        if (!this.config.hide_screenlock) {
          this.config.controls.push("wakelock")
        }
        if (!this.config.hide_zoom) {
          this.config.controls.push("zoom")
        }
        if (!this.config.hide_refresh) {
          this.config.controls.push("reload")
        }
        if (!this.config.hide_navbar) {
          this.config.controls.push("navbar")
        }
        if (!this.config.hide_sidebar) {
          this.config.controls.push("sidebar")
        }
      }

      /********************************************************
                            Full-screen button
      ********************************************************/
      if (this.config.controls.includes('fullscreen')) {
        this.fullscreen = false;
        this.fullscreenbtn = document.createElement("button");
        this.fullscreenbtn.innerHTML = fullscreen_icon;
        this.fullscreenbtn.style.cssText = button_style;
        this.fullscreenbtn.title = "Enter fullscreen";
        this.fullscreenbtn.getElementsByTagName("ha-icon")[0].style.cssText =
          getIconStyle(this.config.small_buttons);
        this.fullscreenbtn.onclick = function () {
          if (this.fullscreen) {
            document.exitFullscreen();
            this.fullscreenbtn.innerHTML = fullscreen_icon;
            this.fullscreenbtn.getElementsByTagName(
              "ha-icon"
            )[0].style.cssText = getIconStyle(this.config.small_buttons);
            this.fullscreenbtn.title = "Enter fullscreen";
          } else {
            document.documentElement.requestFullscreen();
            this.fullscreenbtn.innerHTML = fullscreen_exit_icon;
            this.fullscreenbtn.getElementsByTagName(
              "ha-icon"
            )[0].style.cssText = getIconStyle(this.config.small_buttons);
            this.fullscreenbtn.title = "Exit fullscreen";
          }
          this.fullscreen = !this.fullscreen;
        }.bind(this);
        this.content.appendChild(this.fullscreenbtn);
      }

      /********************************************************
                        Sleep lock button (if supported)
      ********************************************************/
      if (this.config.controls.includes('wakelock') && wake_lock_supported) {
        this.wake_lock = false;
        this.nowakebtn = document.createElement("button");
        this.nowakebtn.innerHTML = wake_lock_icon;
        this.nowakebtn.style.cssText = button_style;
        this.nowakebtn.style.background = "var(--disabled-color)";
        this.nowakebtn.title = "Keep screen awake";
        this.nowakebtn.getElementsByTagName("ha-icon")[0].style.cssText =
          getIconStyle(this.config.small_buttons);
        this.nowakebtn.onclick = function () {
          if (this.wake_lock) {
            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChangeOnWakeLock
            );
            document.removeEventListener(
              "fullscreenchange",
              handleVisibilityChangeOnWakeLock
            );
            cancelWakeLock();
            this.nowakebtn.title = "Keep screen awake";
            this.nowakebtn.style.background = "var(--disabled-color)";
          } else {
            requestWakeLock();
            document.addEventListener(
              "visibilitychange",
              handleVisibilityChangeOnWakeLock
            );
            document.addEventListener(
              "fullscreenchange",
              handleVisibilityChangeOnWakeLock
            );
            this.nowakebtn.title = "Stop keeping screen awake";
            this.nowakebtn.style.background = "var(--primary-color)";
          }
          this.wake_lock = !this.wake_lock;
        }.bind(this);
        this.content.appendChild(this.nowakebtn);
      }

      /********************************************************
                                Zoom buttons
      ********************************************************/
      if (this.config.controls.includes('zoom') && css_zoom_supported) {
        this.zoom_level = 1.0;

        this.zoominbtn = document.createElement("button");
        this.zoominbtn.innerHTML = zoom_in_icon;
        this.zoominbtn.style.cssText = button_style;
        this.zoominbtn.title = "Zoom in";
        this.zoominbtn.getElementsByTagName("ha-icon")[0].style.cssText =
          getIconStyle(this.config.small_buttons);
        this.zoominbtn.onclick = function () {
          this.zoom_level = this.zoom_level + 0.1;
          document.body.style.zoom = this.zoom_level;
        }.bind(this);
        this.content.appendChild(this.zoominbtn);

        this.zoomoutbtn = document.createElement("button");
        this.zoomoutbtn.innerHTML = zoom_out_icon;
        this.zoomoutbtn.style.cssText = button_style;
        this.zoomoutbtn.title = "Zoom out";
        this.zoomoutbtn.getElementsByTagName("ha-icon")[0].style.cssText =
          getIconStyle(this.config.small_buttons);
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
      if (this.config.controls.includes('reload')) {
        this.refreshbtn = document.createElement("button");
        this.refreshbtn.innerHTML = refresh_icon;
        this.refreshbtn.style.cssText = button_style;
        this.refreshbtn.title = "Refresh page";
        this.refreshbtn.getElementsByTagName("ha-icon")[0].style.cssText =
          getIconStyle(this.config.small_buttons);
        this.refreshbtn.onclick = function () {
          document.location.reload();
        }.bind(this);
        this.content.appendChild(this.refreshbtn);
      }

      /********************************************************
                            Hide Navigation Bar
      ********************************************************/
      if (this.config.controls.includes('navbar')) {
        this.hidden_navbar = false;
        this.navbarbtn = document.createElement("button");
        this.navbarbtn.innerHTML = hide_navbar_icon;
        this.navbarbtn.style.cssText = button_style;
        this.navbarbtn.style.background = "var(--disabled-color)";
        this.navbarbtn.title = "Hide navigation bar";
        this.navbarbtn.getElementsByTagName("ha-icon")[0].style.cssText =
          getIconStyle(this.config.small_buttons);
        this.navbarbtn.onclick = function () {
          if (this.hidden_navbar) {
            hideNavbar(false);
            this.navbarbtn.title = "Hide navigation bar";
            this.navbarbtn.style.background = "var(--disabled-color)";
          } else {
            hideNavbar(true);
            this.navbarbtn.title = "Show navigation bar";
            this.navbarbtn.style.background = "var(--primary-color)";
          }
          this.hidden_navbar = !this.hidden_navbar;
        }.bind(this);
        this.content.appendChild(this.navbarbtn);
      }

      /********************************************************
                            Hide Sidebar
      ********************************************************/
      if (this.config.controls.includes('sidebar')) {
        this.hidden_sidebar = false;
        this.sidebarbtn = document.createElement("button");
        this.sidebarbtn.innerHTML = hide_sidebar_icon;
        this.sidebarbtn.style.cssText = button_style;
        this.sidebarbtn.style.background = "var(--disabled-color)";
        this.sidebarbtn.title = "Hide sidebar";
        this.sidebarbtn.getElementsByTagName("ha-icon")[0].style.cssText =
          getIconStyle(this.config.small_buttons);
        this.sidebarbtn.onclick = function () {
          if (this.hidden_sidebar) {
            hideSidebar(false);
            this.sidebarbtn.style.background = "var(--disabled-color)";
            this.sidebarbtn.title = "Hide sidebar";
          } else {
            hideSidebar(true);
            this.sidebarbtn.style.background = "var(--primary-color)";
            this.sidebarbtn.title = "Show sidebar";
          }
          this.hidden_sidebar = !this.hidden_sidebar;
        }.bind(this);
        this.content.appendChild(this.sidebarbtn);
      }

      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      this.appendChild(this.content);
    }
  }

  static getStubConfig() {
    return {
      controls: [
        "fullscreen",
        "wakelock",
        "zoom",
        "reload",
        "navbar",
        "sidebar",
      ],
      no_padding: false,
      small_buttons: false,
      layout: "center",
    };
  }

  getCardSize() {
    return 2;
  }

  static getConfigForm() {
    return {
      schema: [
        {
          type: "expandable",
          name: "",
          title: "Features",
          flatten: true,
          schema: [
            {
              name: "controls",
              required: true,
              selector: {
                select: {
                  options: [
                    { label: "Full screen", value: "fullscreen" },
                    { label: "Keep screen awake", value: "wakelock" },
                    { label: "Zoom in/out", value: "zoom" },
                    { label: "Reload page", value: "reload" },
                    { label: "Toggle navigation bar", value: "navbar" },
                    { label: "Toggle sidebar", value: "sidebar" },
                  ],
                  multiple: true,
                },
              },
            },
          ],
        },
        {
          type: "expandable",
          name: "",
          title: "Style",
          flatten: true,
          schema: [
            { name: "no_padding", selector: { boolean: {} } },
            { name: "small_buttons", selector: { boolean: {} } },
            {
              name: "layout",
              selector: {
                select: { options: ["center", "space-around", "left", "right"], multiple: false, mode: "dropdown"},
              },
            },
          ],
        },
      ],
      computeLabel: (schema) => {
        switch (schema.name) {
          case "controls":
            return "Available controls";
          case "layout":
            return "Horizontal layout"
        }
        return undefined;
      },
      computeHelper: (schema) => {
        switch (schema.name) {
          case "no_padding":
            return "Remove white space (padding) between buttons and card borders";
          case "controls":
            return "Select the controls to display. Some controls may be hidden if your current browser does not support the feature.";
          case "layout":
            return "Configure controls layout inside the card"
        }
        return undefined;
      },
    };
  }
}

customElements.define("browser-control-card", BrowserControlCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "browser-control-card",
  name: "Browser Control Card",
  preview: true,
  description:
    "Card to control browser settings: full-screen, wake lock, zoom...",
});
