/* Wake Lock part from https://web.dev/wake-lock/ (sources: https://glitch.com/edit/#!/wake-lock-demo?path=script.js%3A1%3A0 ) */
var wake_lock_supported;
let wakeLock = null;

if ('wakeLock' in navigator && 'request' in navigator.wakeLock) {
  wake_lock_supported = true;
}
else {
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


/* Fullscreen part & card design from https://github.com/KTibow/fullscreen-card */
var the_card;

const fullscreen_icon = "<ha-icon icon=\"mdi:fullscreen\"></ha-icon>";
const fullscreen_exit_icon = "<ha-icon icon=\"mdi:fullscreen-exit\"></ha-icon>";
const wake_lock_icon = "<ha-icon icon=\"mdi:sleep\"></ha-icon>";
const wake_unlock_icon = "<ha-icon icon=\"mdi:sleep-off\"></ha-icon>";

class BrowserControlCard extends HTMLElement {
  set hass(hass) {
    if (!this.content && this.config) {
      this.content = document.createElement("ha-card");
      this.content.style.padding = "15px";

      this.fullscreen = false;
      this.fullscreenbtn = document.createElement("a");
      this.fullscreenbtn.innerHTML = fullscreen_icon;
      this.fullscreenbtn.style.border = "2px solid var(--primary-color)";
      this.fullscreenbtn.style.fontSize = "2em";
      this.fullscreenbtn.style.padding = "0.5em";
      this.fullscreenbtn.style.display = "inline-block";
      this.fullscreenbtn.style.background = "var(--primary-color)";
      this.fullscreenbtn.style.color = "var(--primary-background-color)";
      this.fullscreenbtn.style.textAlign = "center";
      this.fullscreenbtn.style.borderRadius = "var(--ha-card-border-radius, 4px)";
      this.fullscreenbtn.style.cursor = "pointer";
      this.fullscreenbtn.style.marginRight = "5px";
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

      if (wake_lock_supported) {
          this.wake_lock = false;
          this.nowakebtn = document.createElement("a");
          this.nowakebtn.innerHTML = wake_lock_icon;
          this.nowakebtn.style.border = "2px solid var(--primary-color)";
          this.nowakebtn.style.fontSize = "2em";
          this.nowakebtn.style.padding = "0.5em";
          this.nowakebtn.style.display = "inline-block";
          this.nowakebtn.style.background = "var(--primary-color)";
          this.nowakebtn.style.color = "var(--primary-background-color)";
          this.nowakebtn.style.textAlign = "center";
          this.nowakebtn.style.borderRadius = "var(--ha-card-border-radius, 4px)";
          this.nowakebtn.style.cursor = "pointer";
          this.nowakebtn.style.marginRight = "5px";
          this.nowakebtn.onclick = function () {
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
