# Browser Control card

[![hacs_badge](https://img.shields.io/badge/integrated%20in-HACS-%2303a9f4.svg?style=flat-square&logo=homeassistant&logoColor=white)](https://hacs.xyz/) ![hacs_badge](https://img.shields.io/github/languages/top/mathoudebine/homeassistant-browser-control-card?style=flat-square) ![hacs_badge](https://img.shields.io/github/license/mathoudebine/homeassistant-browser-control-card?style=flat-square) ![hacs_badge](https://img.shields.io/github/issues/mathoudebine/homeassistant-browser-control-card?style=flat-square)

Control your web browser from a [Home Assistant dashboard card](https://www.home-assistant.io/dashboards/cards/): full screen, disable screen lock, zoom...

![Browser Control card](resources/browser-control-card.png)

This card is compatible with all web browsers and is particularly useful for:

* mobile devices
* devices with "locked" browser (browser in kiosk mode, without user menu/commands...) like the Facebook/Meta Portal

HomeAssistant controls also available: show/hide navigation bar & sidebar  
Changes are not persisted: reload the page to revert to initial settings

## Available controls

> [!NOTE]
> Some controls may be hidden if your browser does not support them

| Icon                                                                   | Control                                                   | Config. option           | Availability                                                                                                                                                                                                    |
|------------------------------------------------------------------------|-----------------------------------------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![Full-screen](resources/fullscreen.png)                               | Enter / exit full-screen                                  | `controls: [fullscreen]` | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_element_requestfullscreen)       |
| ![Wake lock](resources/wake_mode.png)                                  | Enable / disable screen wake lock (keep screen always on) | `controls: [wakelock]`   | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/wake-lock)                               |
| ![Zoom In](resources/zoom_in.png) ![Zoom out](/resources/zoom_out.png) | Zoom in / zoom out (using CSS)                            | `controls: [zoom]`       | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/css-zoom)                                |
| ![Reload](resources/reload.png)                                        | Reload page                                               | `controls: [reload]`     | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_location_reload)                 |
| ![Hide navigation bar](resources/hide_navbar.png)                      | Hide navigation bar                                       | `controls: [navbar]`     | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_cssstyledeclaration_setproperty) |
| ![Hide sidebar](resources/hide_sidebar.png)                            | Hide sidebar                                              | `controls: [sidebar]`    | [![check_browser_support](https://img.shields.io/badge/check-browser%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_cssstyledeclaration_setproperty) |

### What is my browser?

If you cannot identify the browser your device is using, browse the following website <https://www.whatsmyua.info/>  
Search the result for a string like `Chrome/92.0`

## Styling options

* **Layout**: buttons horizontal alignment and spacing. Select between `center` (default), `space-around`, `left` and `right`

| ![Centered layout](resources/layout-center.png) | ![Centered layout](resources/layout-space-around.png) |
|-------------------------------------------------|-------------------------------------------------------|
| `center` layout                                 | `space-around` layout                                 |

* **No Padding**: remove space between buttons and card border
* **Small buttons** (button size is based on theme font size)

## Card configuration

The card can be configured directly from Home Assistant UI:

![Configuration UI](resources/card_configuration_ui.png)

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
layout: center
```

> [!NOTE]
> Old configuration keys beginning with `hide_` are still supported but will be ignored as soon as the card is configured using UI.

## Install the card

### Using HACS (recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed.
2. On HACS interface, search and install "Browser Control Card"
3. Add the card to your dashboard and configure it

### Manual install

1. Copy `browser-control-card.js` from this repository to your HomeAssistant configuration folder `config/www/`  
2. Go to HomeAssistant configuration page > Dashboards > Three-dots "Resources" option in upper-right corner
3. Add resource `/local/browser-control-card.js` (Resource type: JavaScript module)
4. Reload the HomeAssistant UI by flushing cache (Ctrl + F5)
5. Add the card to your dashboard and configure it

## Sources

Based on [KTibow/fullscreen-card](https://github.com/KTibow/fullscreen-card) for card design and full screen  
Wake lock part from <https://web.dev/wakelock>
