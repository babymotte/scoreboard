#!/bin/bash

echo "Before running this script, please make sure Raspberry Pi OS Bullseye 32Bit has been installed on your Raspberry Pi and the Raspberry Pi is running, connected to your local network and reachable under the hostname 'scoreboard'!"
echo "Please Note that this script assumes that the operating system is freshly installed and will make no attempts whatsoever to preserve any modifications previously done to it."
echo "Press enter to continue …"
read DUMMY

scp setup.sh scoreboard:.

# TODO copy and install node-red flow
# scp flow.json scoreboard:.

ssh scoreboard ./setup.sh || {
    echo "Setup failed."
    exit 1
}

echo "Setup complete. For correct autostart behavior, raspi-config will be run next. Under 'System Options' set 'Boot / Auto Login' mode to 'Console Autologin' and save!"
echo "Press enter to continue …"
read DUMMY
ssh scoreboard sudo raspi-config

echo "Done. The Raspberry Pi will now be rebooted. After reboot, log into Wifi 'ScoreBoard' (password is '!Score!Board!') and navigate to 'http://score.board'."
echo "Press enter to continue …"
read DUMMY
ssh scoreboard sudo reboot
