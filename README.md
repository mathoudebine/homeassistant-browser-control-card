# Browser Control card
[![hacs_badge](https://img.shields.io/badge/integrated%20in-HACS-%2303a9f4.svg?style=flat-square&logo=homeassistant&logoColor=white)](https://hacs.xyz/) ![hacs_badge](https://img.shields.io/github/languages/top/mathoudebine/homeassistant-browser-control-card?style=flat-square) ![hacs_badge](https://img.shields.io/github/license/mathoudebine/homeassistant-browser-control-card?style=flat-square) ![hacs_badge](https://img.shields.io/github/issues/mathoudebine/homeassistant-browser-control-card?style=flat-square) 

* [Available browser controls](#available-browser-controls)
  * [What is my browser?](#what-is-my-browser)
* [Install the card](#install-the-card)
  * [Using HACS (recommended)](#using-hacs-recommended)
  * [Manual install](#manual-install)

Based on [KTibow/fullscreen-card](https://github.com/KTibow/fullscreen-card) for card design and full screen  
Wake lock part from https://web.dev/wake-lock/

![Browser Control card](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/browser-control-card.png)

Control your browser from a Home Assistant lovelace card: full screen, disable screen lock, zoom...  
This card is intended for:
* mobile devices
* devices with "locked" browser (browser in kiosk mode, without user menu/commands...) like the Facebook/Meta Portal

Also available: show/hide HomeAssistant navigation bar & sidebar  
Changes are not persisted: just reload the page to revert to initial settings

## Available browser controls
| Icon                                                                                                                                                                                                                                                     | Control                                                   | Config. option                | Availability                                                                                                                                                                                                    |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![Full-screen](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/fullscreen.png)                                                                                                                        | Enter / exit full-screen                                  | `controls: [fullscreen]` | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_element_requestfullscreen)       |
| ![Wake lock](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/wake_mode.png)                                                                                                                           | Enable / disable screen wake lock (keep screen always on) | `controls: [wakelock]` | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/wake-lock)                               |
| ![Zoom In](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/zoom_in.png) ![Zoom out](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master//resources/zoom_out.png) | Zoom in / zoom out (using CSS)                            | `controls: [zoom]`       | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/css-zoom)                                |
| ![Reload](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/reload.png)                                                                                                                                 | Reload page                                               | `controls: [reload]`    | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_location_reload)                 |
| ![Hide navigation bar](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/hide_navbar.png)                                                                                                               | Hide navigation bar                                       | `controls: [navbar]`     | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_cssstyledeclaration_setproperty) |
| ![Hide sidebar](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/hide_sidebar.png)                                                                                                                     | Hide sidebar                                              | `controls: [sidebar]`    | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_cssstyledeclaration_setproperty) |


> [!NOTE]
> Some features may be disabled if your browser does not support them  

### What is my browser?
If you cannot identify the browser your device is using, browse the following website https://www.whatsmyua.info/  
Search the result for a string like `Chrome/92.0`

## Card configuration
The card supports configuration through Home Assistant UI:

![Configuration UI](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/card_configuration_ui.png)

YAML configuration is also supported:
```yaml
type: custom:browser-control-card
controls:
  - fullscreen
  - wakelock
  - zoom
  - reload
  - navbar
  - sidebar
no_padding: false
small_buttons: false
```

> [!NOTE]
> Old configuration keys beginning with `hide_` are still supported but will be ignored as soon as you configure the card using graphical editor.

## Install the card
### Using HACS (recommended)
1. Make sure [HACS](https://hacs.xyz/) is installed.  
2. Go to HACS > Frontend > Explore & download repositories  
3. Search and install "Browser Control Card" that appeared in your Frontend tab  
4. Add the card to your dashboard  

### Manual install
1. Copy `browser-control-card.js` from this repository to your HomeAssistant configuration folder `config/www/`  
2. Go to HomeAssistant configuration page > Dashboards > Resources tab
3. Add resource `/local/browser-control-card.js` (Resource type: JavaScript module)
4. Reload the web UI by flushing cache (Ctrl + F5)
5. Add the card to your dashboard
