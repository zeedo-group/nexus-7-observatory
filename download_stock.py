import os
import urllib.request

target_dir = r"d:\Agy Workspace\ultra smart websites\diw\public\assets\stock"
os.makedirs(target_dir, exist_ok=True)

images = {
    "sci_fi_astronaut_structure.jpg": "https://plus.unsplash.com/premium_photo-1682124752476-40db22034a58?w=1920",
    "alien_planet_forest.jpg": "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=1920",
    "cyberpunk_city_night.jpg": "https://images.unsplash.com/photo-1665602878676-219e01293b51?w=1920",
    "futuristic_building_interior.jpg": "https://images.unsplash.com/photo-1543083115-638c32cd3d58?w=1920",
    "foggy_dystopian_building.jpg": "https://images.unsplash.com/photo-1728289306599-399d47b9cb43?w=1920",
    "sci_fi_base_tent.jpg": "https://images.unsplash.com/photo-1543831973-481fbf6dc4a8?w=1920",
    "dark_alien_room.jpg": "https://images.unsplash.com/photo-1687191591471-e3b46d40a0e9?w=1920",
    "cyberpunk_river_city.jpg": "https://images.unsplash.com/photo-1566262258598-53deb7089bf8?w=1920",
    "space_station_orbit.jpg": "https://images.unsplash.com/photo-1687985826611-80b714011d0b?w=1920",
    "wormhole_cosmic_grid.jpg": "https://plus.unsplash.com/premium_photo-1681426558755-71090cebadff?w=1920",
    "space_explorer_helmet.jpg": "https://images.unsplash.com/photo-1628026552437-59305f353694?w=1920",
    "futuristic_space_station.jpg": "https://plus.unsplash.com/premium_photo-1682124758854-e6e372888b85?w=1920",
    "night_city_street.jpg": "https://images.unsplash.com/photo-1631044176346-804c33ade61c?w=1920",
    "alien_planet_sunset.jpg": "https://images.unsplash.com/photo-1622819584099-e04ccb14e8a7?w=1920",
    "sci_fi_tunnel.jpg": "https://images.unsplash.com/photo-1533637041618-f0e4c869801e?w=1920",
    "neon_cyberpunk_signs.jpg": "https://images.unsplash.com/photo-1633164227069-df58d5f183df?w=1920",
    "abandoned_space_room.jpg": "https://images.unsplash.com/photo-1518610424324-79ca316bd290?w=1920",
    "astronaut_on_rock.jpg": "https://images.unsplash.com/photo-1693495430456-25c0a37ec5dc?w=1920",
    "astronaut_neon_city.jpg": "https://plus.unsplash.com/premium_photo-1682124865982-86f0aa859b01?w=1920",
    "blue_geometric_tech.jpg": "https://plus.unsplash.com/premium_photo-1661817214148-2d4cf768a7c3?w=1920"
}

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

for name, url in images.items():
    filepath = os.path.join(target_dir, name)
    print(f"Downloading {name}...")
    try:
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
    except Exception as e:
        print(f"Failed to download {name}: {e}")

print("All images downloaded and placed in the target directory.")
