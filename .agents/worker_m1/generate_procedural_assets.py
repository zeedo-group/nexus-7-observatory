import math
import random
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageFont
import numpy as np

OUTPUT_DIR = r"d:\Agy Workspace\ultra smart websites\diw\public\assets"
WIDTH, HEIGHT = 1024, 1024

def create_base_canvas(bg_color=(10, 10, 25)):
    return Image.new("RGB", (WIDTH, HEIGHT), bg_color)

def add_glow(image, radius=15):
    blurred = image.filter(ImageFilter.GaussianBlur(radius))
    return Image.blend(image, blurred, 0.4)

def generate_landscape_6():
    # Floating Sky Islands & Neon Cloud Strata
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    # Sky Gradient
    for y in range(HEIGHT):
        r = int(15 + (120 - 15) * (y / HEIGHT))
        g = int(10 + (40 - 10) * (y / HEIGHT))
        b = int(40 + (140 - 40) * (y / HEIGHT))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Sun / Gas Giant in sky
    cx, cy = 700, 300
    for r in range(160, 0, -2):
        alpha_g = int(255 * (1 - r / 160))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 120 + r // 2, 80 + r // 3))
    
    # Rings for Gas Giant
    for r in range(220, 170, -2):
        draw.ellipse([cx - r*1.8, cy - r*0.4, cx + r*1.8, cy + r*0.4], outline=(200, 180, 255), width=2)
        
    # Floating islands
    islands = [
        ([(150, 500), (350, 480), (450, 520), (400, 600), (250, 650), (120, 580)], (30, 25, 45)),
        ([(550, 420), (800, 400), (850, 460), (750, 530), (600, 520)], (20, 20, 35)),
        ([(50, 700), (500, 650), (600, 750), (450, 950), (100, 900)], (15, 15, 25)),
        ([(520, 720), (950, 680), (1000, 850), (800, 1000), (600, 920)], (10, 12, 20))
    ]
    
    for pts, color in islands:
        draw.polygon(pts, fill=color)
        # Highlight top edges with neon flora glow
        for i in range(len(pts) - 1):
            if pts[i][1] < pts[i+1][1] + 50 and pts[i][1] < 750:
                draw.line([pts[i], pts[i+1]], fill=(0, 255, 200), width=4)

    # Neon Waterfalls
    draw.line([(300, 490), (300, 650)], fill=(0, 220, 255), width=8)
    draw.line([(305, 490), (305, 670)], fill=(180, 255, 255), width=4)
    draw.line([(700, 410), (700, 520)], fill=(0, 255, 180), width=6)

    # Glow particles & cloud mist
    img = add_glow(img, 8)
    img.save(os.path.join(OUTPUT_DIR, "alien_landscape_6.jpg"), quality=95)
    print("Saved alien_landscape_6.jpg")

def generate_landscape_7():
    # Subterranean Crystal Cavern
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    # Dark background
    for y in range(HEIGHT):
        val = int(10 + 20 * (y / HEIGHT))
        draw.line([(0, y), (WIDTH, y)], fill=(val, val // 2, val + 15))
        
    # Magma lake at bottom
    for y in range(800, HEIGHT):
        fy = (y - 800) / 224
        r = int(200 + 55 * fy)
        g = int(60 + 80 * fy)
        b = int(10)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Giant Crystalline Monoliths
    crystals = [
        ([(200, 900), (250, 400), (320, 350), (380, 450), (330, 920)], (140, 50, 225)),
        ([(400, 850), (480, 250), (540, 200), (600, 300), (520, 880)], (0, 200, 255)),
        ([(650, 920), (720, 480), (780, 450), (840, 520), (790, 950)], (230, 40, 180)),
        ([(100, 880), (140, 550), (180, 600), (150, 900)], (80, 100, 240))
    ]
    
    for pts, color in crystals:
        draw.polygon(pts, fill=color)
        # Facet reflections
        mid_x = (pts[1][0] + pts[2][0]) // 2
        mid_y = (pts[1][1] + pts[2][1]) // 2
        facet_pts = [pts[0], (mid_x, mid_y), pts[-1]]
        draw.polygon(facet_pts, fill=(min(255, color[0] + 60), min(255, color[1] + 60), min(255, color[2] + 60)))
        draw.line([pts[1], pts[0]], fill=(255, 255, 255), width=3)

    img = add_glow(img, 10)
    img.save(os.path.join(OUTPUT_DIR, "alien_landscape_7.jpg"), quality=95)
    print("Saved alien_landscape_7.jpg")

def generate_landscape_8():
    # Bioluminescent Tidal Trench
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    for y in range(HEIGHT):
        r = int(5 + 15 * (1 - y/HEIGHT))
        g = int(20 + 80 * (y/HEIGHT))
        b = int(40 + 120 * (y/HEIGHT))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))
        
    # Coral spires
    for i in range(12):
        cx = random.randint(50, 970)
        h = random.randint(300, 700)
        w = random.randint(30, 80)
        pts = [(cx - w, 1024), (cx - w//3, 1024 - h), (cx + w//3, 1024 - h - 40), (cx + w, 1024)]
        color = random.choice([(0, 255, 200), (255, 0, 180), (0, 180, 255), (180, 255, 0)])
        draw.polygon(pts, fill=(color[0]//3, color[1]//3, color[2]//3))
        draw.line([(cx, 1024), (cx, 1024 - h)], fill=color, width=4)

    # Floating glowing organisms
    for _ in range(50):
        ox = random.randint(100, 920)
        oy = random.randint(100, 800)
        orad = random.randint(6, 20)
        draw.ellipse([ox-orad, oy-orad, ox+orad, oy+orad], fill=(0, 255, 230))
        for _ in range(4):
            tx = ox + random.randint(-30, 30)
            ty = oy + random.randint(20, 60)
            draw.line([(ox, oy), (tx, ty)], fill=(150, 255, 255), width=2)

    img = add_glow(img, 12)
    img.save(os.path.join(OUTPUT_DIR, "alien_landscape_8.jpg"), quality=95)
    print("Saved alien_landscape_8.jpg")

def generate_species_5():
    # Chrono-Phantasm (Energy Entity)
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 5, 25))
    draw = ImageDraw.Draw(img)
    
    cx, cy = 512, 512
    # Concentric aura rings
    for r in range(400, 50, -10):
        col = (int(100 + 155 * (r/400)), int(50 + 150 * math.sin(r/20)), int(255 * (1 - r/400)))
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=3)
        
    # Entity core silhouette
    pts = []
    num_pts = 36
    for i in range(num_pts):
        angle = i * (2 * math.pi / num_pts)
        r = 180 + 60 * math.sin(6 * angle) + random.randint(-20, 20)
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)
        pts.append((x, y))
    draw.polygon(pts, fill=(240, 220, 255))
    
    # Glowing energy eyes
    draw.ellipse([cx - 50, cy - 40, cx - 20, cy - 20], fill=(0, 255, 255))
    draw.ellipse([cx + 20, cy - 40, cx + 50, cy - 20], fill=(0, 255, 255))

    img = add_glow(img, 15)
    img.save(os.path.join(OUTPUT_DIR, "alien_species_5.jpg"), quality=95)
    print("Saved alien_species_5.jpg")

def generate_species_6():
    # Xeno-Apex Leviathan
    img = Image.new("RGB", (WIDTH, HEIGHT), (5, 15, 10))
    draw = ImageDraw.Draw(img)
    
    cx, cy = 512, 512
    # Chitinous body structure
    draw.polygon([(250, 800), (512, 200), (774, 800), (512, 950)], fill=(20, 40, 30))
    draw.polygon([(300, 750), (512, 250), (724, 750), (512, 900)], fill=(35, 70, 50))
    
    # Glowing emerald eye clusters
    eyes = [(450, 400), (480, 380), (512, 360), (544, 380), (574, 400)]
    for ex, ey in eyes:
        draw.ellipse([ex-12, ey-12, ex+12, ey+12], fill=(0, 255, 120))
        
    # Crystalline mandibles
    draw.line([(400, 450), (320, 600), (450, 550)], fill=(0, 255, 200), width=6)
    draw.line([(624, 450), (704, 600), (574, 550)], fill=(0, 255, 200), width=6)

    img = add_glow(img, 10)
    img.save(os.path.join(OUTPUT_DIR, "alien_species_6.jpg"), quality=95)
    print("Saved alien_species_6.jpg")

def generate_species_7():
    # Crystalline Sybils
    img = Image.new("RGB", (WIDTH, HEIGHT), (20, 10, 30))
    draw = ImageDraw.Draw(img)
    
    cx, cy = 512, 450
    # Sacred geometry crystals
    colors = [(255, 0, 200), (0, 220, 255), (180, 50, 255), (255, 200, 0)]
    for i in range(8):
        angle = i * (math.pi / 4)
        r = 250
        x = cx + r * math.cos(angle)
        y = cy + r * math.sin(angle)
        draw.polygon([(cx, cy), (x - 40, y - 40), (x, y), (x + 40, y + 40)], fill=colors[i % 4])
        draw.line([(cx, cy), (x, y)], fill=(255, 255, 255), width=3)
        
    draw.ellipse([cx-70, cy-70, cx+70, cy+70], fill=(255, 255, 255))
    
    img = add_glow(img, 12)
    img.save(os.path.join(OUTPUT_DIR, "alien_species_7.jpg"), quality=95)
    print("Saved alien_species_7.jpg")

def generate_species_8():
    # Aether-Winged Sentinel
    img = Image.new("RGB", (WIDTH, HEIGHT), (15, 15, 35))
    draw = ImageDraw.Draw(img)
    
    cx, cy = 512, 512
    # Light Wings
    for side in [-1, 1]:
        for i in range(7):
            w_pts = [
                (cx, cy),
                (cx + side * (150 + i*40), cy - 100 - i*30),
                (cx + side * (250 + i*40), cy + 50 + i*20),
                (cx + side * 50, cy + 150)
            ]
            draw.polygon(w_pts, fill=(255, 200 - i*20, 50 + i*30))
            
    # Sentinel core
    draw.polygon([(cx, cy - 180), (cx - 50, cy), (cx, cy + 200), (cx + 50, cy)], fill=(255, 255, 240))
    draw.ellipse([cx - 25, cy - 140, cx + 25, cy - 90], fill=(0, 240, 255))

    img = add_glow(img, 14)
    img.save(os.path.join(OUTPUT_DIR, "alien_species_8.jpg"), quality=95)
    print("Saved alien_species_8.jpg")

def generate_tech_4():
    # Quantum Matrix Core (Tesseract)
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 20, 35))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512
    
    # Outer ring
    for r in range(380, 360, -2):
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(0, 240, 255), width=2)
        
    # Tesseract projection
    cube1 = [(cx-150, cy-150), (cx+150, cy-150), (cx+150, cy+150), (cx-150, cy+150)]
    cube2 = [(cx-80, cy-80), (cx+80, cy-80), (cx+80, cy+80), (cx-80, cy+80)]
    
    draw.polygon(cube1, outline=(0, 255, 200), width=4)
    draw.polygon(cube2, outline=(255, 0, 220), width=4)
    for p1, p2 in zip(cube1, cube2):
        draw.line([p1, p2], fill=(255, 255, 255), width=3)
        
    # Circuit traces
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        x1 = cx + 200 * math.cos(rad)
        y1 = cy + 200 * math.sin(rad)
        x2 = cx + 360 * math.cos(rad)
        y2 = cy + 360 * math.sin(rad)
        draw.line([(x1, y1), (x2, y2)], fill=(0, 180, 255), width=3)
        draw.ellipse([x2-8, y2-8, x2+8, y2+8], fill=(0, 255, 200))

    img = add_glow(img, 10)
    img.save(os.path.join(OUTPUT_DIR, "alien_tech_4.jpg"), quality=95)
    print("Saved alien_tech_4.jpg")

def generate_tech_5():
    # Neural Resonance Relic
    img = Image.new("RGB", (WIDTH, HEIGHT), (20, 10, 25))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512
    
    # Glowing Obelisk
    pts = [(cx - 60, cy + 350), (cx - 40, cy - 300), (cx, cy - 380), (cx + 40, cy - 300), (cx + 60, cy + 350)]
    draw.polygon(pts, fill=(40, 30, 60))
    draw.line([(cx, cy - 380), (cx, cy + 350)], fill=(200, 100, 255), width=4)
    
    # Synaptic arcs
    for _ in range(30):
        y_pos = random.randint(cy - 280, cy + 300)
        x_start = cx + (random.choice([-1, 1]) * random.randint(40, 60))
        x_end = x_start + (random.choice([-1, 1]) * random.randint(80, 220))
        y_end = y_pos + random.randint(-40, 40)
        draw.line([(x_start, y_pos), (x_end, y_end)], fill=(0, 240, 255), width=3)
        draw.ellipse([x_end-6, y_end-6, x_end+6, y_end+6], fill=(255, 0, 200))

    img = add_glow(img, 10)
    img.save(os.path.join(OUTPUT_DIR, "alien_tech_5.jpg"), quality=95)
    print("Saved alien_tech_5.jpg")

def generate_tech_6():
    # Hyper-Drive Singularity Monolith
    img = Image.new("RGB", (WIDTH, HEIGHT), (5, 5, 15))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512
    
    # Black hole accretion disk
    for r in range(350, 120, -4):
        col = (int(255 * (r/350)), int(140 * (1 - r/350)), int(20))
        draw.ellipse([cx - r*1.5, cy - r*0.5, cx + r*1.5, cy + r*0.5], outline=col, width=3)
        
    # Singularity core
    draw.ellipse([cx-100, cy-100, cx+100, cy+100], fill=(0, 0, 0))
    draw.ellipse([cx-108, cy-108, cx+108, cy+108], outline=(255, 255, 255), width=4)
    
    # Chrome Monolith
    draw.polygon([(cx-40, cy-450), (cx+40, cy-450), (cx+40, cy+450), (cx-40, cy+450)], fill=(180, 200, 220))
    draw.line([(cx, cy-450), (cx, cy+450)], fill=(255, 255, 255), width=4)

    img = add_glow(img, 12)
    img.save(os.path.join(OUTPUT_DIR, "alien_tech_6.jpg"), quality=95)
    print("Saved alien_tech_6.jpg")

def generate_tech_7():
    # Chronos Dial
    img = Image.new("RGB", (WIDTH, HEIGHT), (25, 20, 10))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512
    
    # Multi-tiered rotatable bronze rings
    radii = [420, 360, 300, 240, 180, 120]
    colors = [(220, 160, 60), (0, 200, 220), (180, 120, 40), (0, 255, 180), (240, 180, 80), (255, 255, 255)]
    
    for r, col in zip(radii, colors):
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=col, width=6)
        # Notch marks
        for a in range(0, 360, 15):
            rad = math.radians(a)
            x1 = cx + (r - 12) * math.cos(rad)
            y1 = cy + (r - 12) * math.sin(rad)
            x2 = cx + r * math.cos(rad)
            y2 = cy + r * math.sin(rad)
            draw.line([(x1, y1), (x2, y2)], fill=col, width=3)
            
    # Central temporal gem
    draw.polygon([(cx, cy-50), (cx+50, cy), (cx, cy+50), (cx-50, cy)], fill=(0, 240, 255))

    img = add_glow(img, 10)
    img.save(os.path.join(OUTPUT_DIR, "alien_tech_7.jpg"), quality=95)
    print("Saved alien_tech_7.jpg")

def generate_agent_coder():
    # Agent Coder Avatar: Matrix Architect Glyph
    img = Image.new("RGB", (WIDTH, HEIGHT), (5, 15, 25))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512
    
    # Outer Tech Frame
    draw.ellipse([cx-420, cy-420, cx+420, cy+420], outline=(0, 220, 255), width=8)
    draw.ellipse([cx-390, cy-390, cx+390, cy+390], outline=(0, 140, 200), width=4)
    
    # Matrix hex grid pattern
    for r in range(250, 450, 40):
        for a in range(0, 360, 30):
            rad = math.radians(a)
            x = cx + r * math.cos(rad)
            y = cy + r * math.sin(rad)
            draw.rectangle([x-10, y-10, x+10, y+10], outline=(0, 255, 180), width=2)
            
    # Central Visor Helmet Silhouette
    draw.polygon([(cx-120, cy-150), (cx+120, cy-150), (cx+180, cy+50), (cx, cy+220), (cx-180, cy+50)], fill=(15, 35, 55))
    draw.polygon([(cx-100, cy-80), (cx+100, cy-80), (cx+140, cy+20), (cx, cy+140), (cx-140, cy+20)], fill=(0, 240, 255))
    
    # Code glyph </ >
    draw.line([(cx-60, cy-40), (cx-120, cy), (cx-60, cy+40)], fill=(255, 255, 255), width=6)
    draw.line([(cx+60, cy-40), (cx+120, cy), (cx+60, cy+40)], fill=(255, 255, 255), width=6)
    draw.line([(cx+20, cy-50), (cx-20, cy+50)], fill=(0, 255, 180), width=6)

    img = add_glow(img, 10)
    img.save(os.path.join(OUTPUT_DIR, "agent_coder.jpg"), quality=95)
    print("Saved agent_coder.jpg")

def generate_agent_artist():
    # Agent Artist Avatar: Chromatic Synthesis Artisan
    img = Image.new("RGB", (WIDTH, HEIGHT), (20, 5, 25))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512
    
    # Swirling color palette ring
    for r in range(420, 300, -5):
        for a in range(0, 360, 5):
            rad = math.radians(a)
            x = cx + r * math.cos(rad)
            y = cy + r * math.sin(rad)
            cr = int(127 + 127 * math.sin(rad))
            cg = int(127 + 127 * math.sin(rad + 2))
            cb = int(127 + 127 * math.sin(rad + 4))
            draw.ellipse([x-6, y-6, x+6, y+6], fill=(cr, cg, cb))
            
    # Stylus Energy Flare
    draw.line([(cx-200, cy+200), (cx+150, cy-150)], fill=(255, 255, 255), width=12)
    draw.ellipse([cx+130, cy-170, cx+170, cy-130], fill=(255, 0, 220))
    draw.ellipse([cx-220, cy+180, cx-180, cy+220], fill=(0, 240, 255))

    img = add_glow(img, 12)
    img.save(os.path.join(OUTPUT_DIR, "agent_artist.jpg"), quality=95)
    print("Saved agent_artist.jpg")

def generate_agent_planner():
    # Agent Planner Avatar: Tactical Constellation Strategist
    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 15, 30))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512
    
    # Radar reticle
    for r in [400, 300, 200, 100]:
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(255, 180, 0), width=3)
    draw.line([(cx-420, cy), (cx+420, cy)], fill=(255, 180, 0), width=2)
    draw.line([(cx, cy-420), (cx, cy+420)], fill=(255, 180, 0), width=2)
    
    # Strategic Nodes
    nodes = [(cx-180, cy-120), (cx+150, cy-200), (cx+220, cy+140), (cx-120, cy+180), (cx, cy-80)]
    for n1 in nodes:
        for n2 in nodes:
            draw.line([n1, n2], fill=(0, 220, 255), width=2)
            
    for nx, ny in nodes:
        draw.ellipse([nx-14, ny-14, nx+14, ny+14], fill=(255, 220, 0))
        draw.ellipse([nx-6, ny-6, nx+6, ny+6], fill=(255, 255, 255))

    img = add_glow(img, 10)
    img.save(os.path.join(OUTPUT_DIR, "agent_planner.jpg"), quality=95)
    print("Saved agent_planner.jpg")

def generate_starmap_1():
    # Nexus Star Map: Sector 7 Celestial Chart
    img = Image.new("RGB", (WIDTH, HEIGHT), (5, 5, 20))
    draw = ImageDraw.Draw(img)
    cx, cy = 512, 512
    
    # Polar Grid
    for r in range(100, 480, 60):
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=(0, 140, 220), width=2)
    for a in range(0, 360, 30):
        rad = math.radians(a)
        draw.line([(cx, cy), (cx + 460 * math.cos(rad), cy + 460 * math.sin(rad))], fill=(0, 100, 180), width=1)
        
    # Star Systems & Constellations
    random.seed(42)
    stars = []
    for _ in range(120):
        r = random.randint(30, 450)
        a = random.uniform(0, 2 * math.pi)
        sx = cx + r * math.cos(a)
        sy = cy + r * math.sin(a)
        stars.append((sx, sy))
        draw.ellipse([sx-3, sy-3, sx+3, sy+3], fill=(255, 255, 255))
        
    for i in range(len(stars)-1):
        if random.random() > 0.7:
            draw.line([stars[i], stars[i+1]], fill=(0, 255, 200), width=1)

    img = add_glow(img, 8)
    img.save(os.path.join(OUTPUT_DIR, "alien_starmap_1.jpg"), quality=95)
    print("Saved alien_starmap_1.jpg")

if __name__ == "__main__":
    generate_landscape_6()
    generate_landscape_7()
    generate_landscape_8()
    generate_species_5()
    generate_species_6()
    generate_species_7()
    generate_species_8()
    generate_tech_4()
    generate_tech_5()
    generate_tech_6()
    generate_tech_7()
    generate_agent_coder()
    generate_agent_artist()
    generate_agent_planner()
    generate_starmap_1()
    print("All procedural alien assets generated successfully!")
