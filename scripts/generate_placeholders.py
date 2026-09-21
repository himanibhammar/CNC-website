import os
from PIL import Image, ImageDraw, ImageFont

images = [
    # Flagships
    ("public/images/flagships/hacksummit/01.jpg", "01 // HACKSUMMIT", "MAIN ARENA STAGE // CODE SPRINT", "#0b101e", "#1e293b", "#38bdf8"),
    ("public/images/flagships/hacksummit/02.jpg", "01 // HACKSUMMIT", "COLLABORATIVE PROTOTYPING // TEAMS", "#090d18", "#172554", "#60a5fa"),
    ("public/images/flagships/hacksummit/03.jpg", "01 // HACKSUMMIT", "SYSTEM DEMO & HARDWARE PITCH", "#0c1322", "#1e3a8a", "#93c5fd"),

    ("public/images/flagships/turbodrift/01.jpg", "02 // TURBODRIFT", "HIGH SPEED TRACK TELEMETRY // RC DRIFT", "#140e1a", "#3b1747", "#e879f9"),
    ("public/images/flagships/turbodrift/02.jpg", "02 // TURBODRIFT", "PADDOCK TUNING & SENSOR CALIBRATION", "#110a17", "#2e1065", "#c084fc"),
    ("public/images/flagships/turbodrift/03.jpg", "02 // TURBODRIFT", "CHICANE OVERTAKE & LAP TELEMETRY", "#180a22", "#4c1d95", "#a855f7"),

    ("public/images/flagships/quadcopter/01.jpg", "03 // QUADCOPTER", "AUTONOMOUS OBSTACLE NAV // FLIGHT DECK", "#06131a", "#0e3b43", "#2dd4bf"),
    ("public/images/flagships/quadcopter/02.jpg", "03 // QUADCOPTER", "PAYLOAD DROP & AERO SPEED PASS", "#071620", "#134e4a", "#34d399"),
    ("public/images/flagships/quadcopter/03.jpg", "03 // QUADCOPTER", "TELEMETRY GCS & ROTOR LAB", "#051118", "#064e3b", "#10b981"),

    ("public/images/flagships/nasa-space-apps/01.jpg", "04 // NASA SPACE APPS CHALLENGE", "GLOBAL DATA HACKATHON // EARTH ORBIT", "#070c1d", "#1e1b4b", "#818cf8"),
    ("public/images/flagships/nasa-space-apps/02.jpg", "04 // NASA SPACE APPS CHALLENGE", "SATELLITE TELEMETRY ANALYSIS ROOM", "#050916", "#241952", "#a5b4fc"),
    ("public/images/flagships/nasa-space-apps/03.jpg", "04 // NASA SPACE APPS CHALLENGE", "PLANETARY VISUALIZATION LAB", "#080e24", "#312e81", "#c7d2fe"),

    # Archive
    ("public/images/events/robowars.jpg", "PAST // ROBOWARS", "COMBAT ROBOTICS ARENA", "#130909", "#450a0a", "#f87171"),
    ("public/images/events/ai-odyssey.jpg", "PAST // AI ODYSSEY", "NEURAL NETWORK SPRINT", "#0b1329", "#1e3a8a", "#60a5fa"),
    ("public/images/events/codeforge.jpg", "PAST // CODEFORGE", "ALGORITHMIC MARATHON", "#0a1818", "#115e59", "#2dd4bf"),
    ("public/images/events/aerodesign.jpg", "PAST // AERODESIGN", "WING PROFILING & AIRFOIL TEST", "#131313", "#27272a", "#a1a1aa"),
    ("public/images/events/cybershield.jpg", "PAST // CYBERSHIELD", "DEFENSE CTF WARGAME", "#130e06", "#451a03", "#fb923c"),
    ("public/images/events/iot-summit.jpg", "PAST // IOT SUMMIT", "EMBEDDED HARDWARE SHOWCASE", "#081512", "#064e3b", "#34d399"),
]

W, H = 1280, 720

for filepath, title, subtitle, bg_color, grad_color, accent in images:
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    img = Image.new("RGB", (W, H), bg_color)
    draw = ImageDraw.Draw(img)

    # Subtle horizontal line grid
    for y in range(0, H, 60):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, 6), width=1)
    for x in range(0, W, 80):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 6), width=1)

    # Corner framing marks (viewfinder style)
    L = 30
    M = 40
    # Top-left
    draw.line([(M, M), (M + L, M)], fill=accent, width=2)
    draw.line([(M, M), (M, M + L)], fill=accent, width=2)
    # Top-right
    draw.line([(W - M - L, M), (W - M, M)], fill=accent, width=2)
    draw.line([(W - M, M), (W - M, M + L)], fill=accent, width=2)
    # Bottom-left
    draw.line([(M, H - M), (M + L, H - M)], fill=accent, width=2)
    draw.line([(M, H - M), (M, H - M - L)], fill=accent, width=2)
    # Bottom-right
    draw.line([(W - M - L, H - M), (W - M, H - M)], fill=accent, width=2)
    draw.line([(W - M, H - M), (W - M, H - M - L)], fill=accent, width=2)

    # Center focal crosshairs
    cx, cy = W // 2, H // 2
    draw.line([(cx - 20, cy), (cx + 20, cy)], fill=(255, 255, 255, 40), width=1)
    draw.line([(cx, cy - 20), (cx, cy + 20)], fill=(255, 255, 255, 40), width=1)

    # Watermark text
    draw.text((M + 10, M + 15), "[ DEVELOPMENT PLACEHOLDER // 16:9 ]", fill=(148, 163, 184), spacing=4)
    draw.text((M + 10, cy - 30), title, fill=accent)
    draw.text((M + 10, cy + 10), subtitle, fill=(241, 245, 249))
    draw.text((M + 10, H - M - 30), "REPLACE WITH OFFICIAL EVENT PHOTOGRAPHY", fill=(100, 116, 139))
    draw.text((W - M - 160, H - M - 30), "C&C ARCHIVE", fill=(100, 116, 139))

    img.save(filepath, "JPEG", quality=90)

print(f"Generated {len(images)} placeholder images successfully.")
