#!/bin/bash

function updateSystem() {
    sudo apt-get update && sudo apt-get -y upgrade
}

function installDocker() {
    # Uninstall all conflicting packages:
    for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done

    # Add Docker's official GPG key:
    sudo apt-get update || exit 1
    sudo apt-get install -y ca-certificates curl gnupg --fix-missing || exit 1
    sudo install -m 0755 -d /etc/apt/keyrings || exit 1
    curl -fsSL https://download.docker.com/linux/raspbian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg || exit 1
    sudo chmod a+r /etc/apt/keyrings/docker.gpg || exit 1

    # Set up Docker's apt repository:
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/raspbian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |
        sudo tee /etc/apt/sources.list.d/docker.list >/dev/null || exit 1
    sudo apt-get update || exit 1

    # Install the latest version from apt repository:
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin --fix-missing || exit 1
}

function installScoreboard() {
    [[ -d "$HOME/.config/scoreboard" ]] || mkdir "$HOME/.config/scoreboard"
    echo 'window.globalConfig = { backendScheme: "ws", backendHost: "scoreboard", backendPort: 80, backendPath: "/ws" };' >"$HOME/.config/scoreboard/config.js" || exit 1
    sudo docker run --name scoreboard -d --restart always -p 80:80 -v "$HOME/.config/scoreboard/config.js":"/html/__config__.js" babymotte/scoreboard:1.1.0 || exit 1
}

function installNodeRed() {
    DIR=$(pwd)
    curl -sL https://raw.githubusercontent.com/node-red/linux-installers/master/deb/update-nodejs-and-nodered >node-setup.sh || exit 1
    bash node-setup.sh --confirm-install --confirm-pi --restart --update-nodes || exit 1
    rm node-setup.sh || exit 1
    cd $HOME/.node-red
    npm install @babymotte/node-red-worterbuch || exit 1
    npm install node-red-dashboard || exit 1
    npm install node-red-node-pi-gpio || exit 1
    mkdir projects && cd projects && git clone https://github.com/babymotte/scoreboard-flow.git || exit 1
    sudo systemctl enable nodered || exit 1
    cd "$DIR"
}

function setupAutostart() {
    sudo apt-get install -y chromium fonts-noto-color-emoji matchbox-window-manager xautomation unclutter --fix-missing || exit 1
    echo '#!/bin/sh
        xset -dpms
        xset s off
        xset s noblank
        matchbox-window-manager -use_titlebar no &
        unclutter &
        sudo -u "$(cat /tmp/sb-user)" chromium --kiosk --window-position=0,0 http://scoreboard' >"$HOME/.config/scoreboard/kiosk.sh" || exit 1
    echo 'export DISPLAY=:0 && id -un > /tmp/sb-user && [[ -n "$SSH_CLIENT" ]] || [[ -n "$SSH_TTY" ]] || sudo xinit "$HOME/.config/scoreboard/kiosk.sh" -- vt$(sudo fgconsole)' >"$HOME/.config/scoreboard/xinit.sh" || exit 1
    chmod a+x "$HOME/.config/scoreboard/kiosk.sh" || exit 1
    chmod a+x "$HOME/.config/scoreboard/xinit.sh" || exit 1
    echo '"$HOME/.config/scoreboard/xinit.sh"' >>"$HOME/.bashrc" || exit 1
}

function setupHotSpot() {

    # Install required packages
    sudo apt-get install -y hostapd dnsmasq --fix-missing || exit 1
    sudo systemctl unmask hostapd || exit 1
    sudo systemctl unmask dnsmasq || exit 1
    sudo systemctl enable hostapd || exit 1
    sudo systemctl enable dnsmasq || exit 1
    sudo systemctl stop hostapd || exit 1
    sudo systemctl stop dnsmasq || exit 1

    # Configure static IP address
    echo "interface wlan0
    static ip_address=192.168.0.10/24
    nohook wpa_supplicant
    denyinterfaces eth0
    denyinterfaces wlan0" | sudo tee -a /etc/dhcpcd.conf || exit 1

    # Configure DHCP
    sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig || exit 1
    echo "interface=wlan0
  dhcp-range=192.168.0.11,192.168.0.100,255.255.255.0,24h" | sudo tee /etc/dnsmasq.conf || exit 1

    # Configure hotspot
    echo 'country_code=DE
interface=wlan0
hw_mode=g
channel=9
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP CCMP
rsn_pairwise=CCMP
ssid=ScoreBoard
wpa_passphrase=!Score!Board!' | sudo tee /etc/hostapd/hostapd.conf || exit 1
    echo 'DAEMON_CONF="/etc/hostapd/hostapd.conf"' | sudo tee /etc/default/hostapd || exit 1
    echo '127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

192.168.0.10       scoreboard' | sudo tee /etc/hosts || exit 1
}

function disableDesktop() {
    sudo systemctl disable lightdm || exit 1
}

function cleanUp() {
    sudo apt-get autoremove -y || exit 1
}

echo "Updating system …"
updateSystem || {
    echo "Error updating system."
    exit 1
}

echo "Installing docker …"
installDocker || {
    echo "Error installing docker."
    exit 1
}

echo "Installing scoreboard …"
installScoreboard || {
    echo "Error installing scoreboard."
    exit 1
}

echo "Installing node-red …"
installNodeRed || {
    echo "Error installing node-red."
    exit 1
}

echo "Setting up autostart …"
setupAutostart || {
    echo "Error setting up scoreboard autostrart."
    exit 1
}

echo "Disabling desktop …"
disableDesktop || {
    echo "Error disabling desktop."
    exit 1
}

echo "Setting up Wifi hotspot …"
setupHotSpot || {
    echo "Error setting up hotspot."
    exit 1
}

echo "Cleaning up …"
cleanUp || {
    echo "Error cleaning up."
    exit 1
}
