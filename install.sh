#!/bin/bash

function installDocker() {
    # Uninstall all conflicting packages:
    for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
    sudo apt-get autoremove -y

    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg --fix-missing
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/raspbian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    # Set up Docker's apt repository:
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/raspbian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |
        sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
    sudo apt-get update

    # Install the latest version from apt repository:
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin --fix-missing
}

function installScoreboard() {
    [[ -d "$HOME/.config/scoreboard" ]] || mkdir "$HOME/.config/scoreboard"
    echo 'window.globalConfig = { backendScheme: "ws", backendHost: "scoreboard.local", backendPort: 80, backendPath: "/ws" };' >"$HOME/.config/scoreboard/config.js"
    sudo docker run --name scoreboard -d --restart always -p 80:80 -v "$HOME/.config/scoreboard/config.js":"/html/__config__.js" babymotte/scoreboard:1.0.0
}

function setupHotSpot() {

    # Install required packages
    sudo apt-get install -y hostapd dnsmasq --fix-missing
    sudo systemctl unmask hostapd
    sudo systemctl unmask dnsmasq
    sudo systemctl enable hostapd
    sudo systemctl enable dnsmasq
    sudo systemctl start hostapd
    sudo systemctl start dnsmasq

    # Configure static IP address
    echo "interface wlan0
    static ip_address=192.168.0.10/24
    nohook wpa_supplicant
    denyinterfaces eth0
    denyinterfaces wlan0" | sudo tee -a /etc/dhcpcd.conf

    # Configure DHCP
    sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
    echo "interface=wlan0
  dhcp-range=192.168.0.11,192.168.0.100,255.255.255.0,24h" | sudo tee /etc/dnsmasq.conf

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
wpa_passphrase=volleyball' | sudo tee /etc/hostapd/hostapd.conf
    echo 'DAEMON_CONF="/etc/hostapd/hostapd.conf"' | sudo tee /etc/default/hostapd
    echo '127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

192.168.0.10       scoreboard
192.168.0.10       scoreboard.local' | sudo tee /etc/hosts
}

function setupAutostart() {
    sudo apt-get install -y chromium xterm fonts-noto-color-emoji matchbox-window-manager xautomation unclutter --fix-missing
    echo '#!/bin/sh
        xset -dpms
        xset s off
        xset s noblank
        matchbox-window-manager -use_titlebar no &
        unclutter &
        sudo -u "$(cat /tmp/sb-user)" chromium --kiosk --window-position=0,0 http://scoreboard.local' >"$HOME/.config/scoreboard/kiosk.sh"
    echo 'export DISPLAY=:0 && id -un > /tmp/sb-user && [[ -n "$SSH_CLIENT" ]] || [[ -n "$SSH_TTY" ]] || sudo xinit "$HOME/.config/scoreboard/kiosk.sh" -- vt$(sudo fgconsole)' >"$HOME/.config/scoreboard/xinit.sh"
    chmod a+x "$HOME/.config/scoreboard/kiosk.sh"
    chmod a+x "$HOME/.config/scoreboard/xinit.sh"
    echo '"$HOME/.config/scoreboard/xinit.sh"' >>"$HOME/.bashrc"
    sudo gpasswd -a $USER video

    # TODO set up wifi hotspot + dhcp + dns
}

echo "Installing docker …"
installDocker

echo "Installing scoreboard …"
installScoreboard

echo "Setting up Wifi hotspot …"
setupHotSpot

echo "Setting up autostart …"
setupAutostart

echo "Setup complete. For correct autostart behavior, run 'sudo raspi-config' and under 'System Options' set 'Boot / Auto Login' mode to 'Console Autologin' and reboot!"
echo "After reboot, log into Wifi 'ScoreBoard' (password is '!Score!Board!') and navigate to 'http://scoreboard.local'"
