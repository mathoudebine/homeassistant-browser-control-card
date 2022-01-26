# homeassistant-browser-control-card
[![hacs_badge](https://img.shields.io/badge/custom%20repository%20for-HACS-%2303a9f4.svg?style=flat-square&logo=homeassistant&logoColor=white)](https://hacs.xyz/) [![hacs_badge](https://img.shields.io/github/languages/top/mathoudebine/homeassistant-browser-control-card?style=flat-square)](https://hacs.xyz/)



Based on [KTibow/fullscreen-card](https://github.com/KTibow/fullscreen-card) for card design and full screen  
Wake lock part from https://web.dev/wake-lock/

![Screenshot](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master/resources/browser-control-card.png)

Control your browser from a Home Assistant lovelace card: full screen, disable screen lock, zoom...  
This card is intended for devices like:
* mobile devices
* devices with "locked" browser (browser in kiosk mode, without user menu/commands...)

## Browser controls available
| Icon                                                                                                                                                                                                                                                           | Control                                  | Availability                                                                                                                                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![Screenshot](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master//resources/fullscreen.png)                                                                                                                              | Enter / exit full-screen                 | [![check_browser_support](https://img.shields.io/badge/check-brower%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_element_requestfullscreen) |
| ![Screenshot](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master//resources/wake_mode.png)                                                                                                                               | Enable / disable screen lock (Wake Lock) | [![check_browser_support](https://img.shields.io/badge/check-brower%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/wake-lock)                         |
| ![Screenshot](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master//resources/zoom_in.png) ![Screenshot](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master//resources/zoom_out.png) | Zoom in / zoom out (using CSS)           | [![check_browser_support](https://img.shields.io/badge/check-brower%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/css-zoom)                          |
| ![Screenshot](https://raw.githubusercontent.com/mathoudebine/homeassistant-browser-control-card/master//resources/reload.png)                                                                                                                                  | Reload page                              | [![check_browser_support](https://img.shields.io/badge/check-brower%20support-%2339b54a.svg?style=flat-square&logo=googlechrome&logoColor=white)](https://caniuse.com/mdn-api_location_reload)           |

Note: some features may be disabled if your browser does not support them  

### What is my browser?
If you cannot identify the browser your device is using, browse the following website https://www.whatsmyua.info/  
Search the result for a string like `Chrome/92.0`

## Install the card
1. Make sure [HACS](https://hacs.xyz/) is installed.  
2. Go to HACS > Frontend > Three dots > Custom repositories  
3. Add `https://github.com/mathoudebine/homeassistant-browser-control-card` as a custom repository (category: Lovelace)  
4. Install "Browser Control Card" that appeared in your Frontend tab  
5. Add the card to your dashboard  

