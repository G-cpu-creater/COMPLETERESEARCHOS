#!/bin/bash
# Permanent fix for Fluxion scanner issues
# This script kills interfering processes before launching Fluxion

echo "🔧 Preparing system for Fluxion..."
echo ""

# Kill interfering processes that block scanning
echo "[1/2] Killing interfering processes..."
sudo systemctl stop avahi-daemon 2>/dev/null
sudo systemctl stop avahi-daemon.socket 2>/dev/null
sudo pkill -9 avahi-daemon 2>/dev/null
sudo airmon-ng check kill
sleep 2

echo "[2/2] Launching Fluxion..."
echo ""
cd /home/dcode/fluxion
sudo bash fluxion.sh

# When Fluxion exits, restore normal WiFi
echo ""
echo "🔄 Restoring normal WiFi..."
sudo systemctl restart NetworkManager
sleep 2
echo "✅ Done! Normal WiFi restored."
