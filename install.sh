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

echo "Setting up autostart …"
setupAutostart

echo "Setup complete. For correct autostart behavior, run 'sudo raspi-config' and under 'System Options' set 'Boot / Auto Login' mode to 'Console Autologin' and reboot!"
