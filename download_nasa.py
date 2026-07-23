import os
import urllib.request
import json
import time

target_dir = r"d:\Agy Workspace\ultra smart websites\diw\public\assets\stock"
os.makedirs(target_dir, exist_ok=True)

queries = ["galaxy", "nebula", "planet", "exoplanet", "spacecraft", "mars rover"]
downloaded = 0
max_downloads = 200
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for query in queries:
    if downloaded >= max_downloads:
        break
        
    url = f"https://images-api.nasa.gov/search?q={urllib.parse.quote(query)}&media_type=image"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            items = data.get("collection", {}).get("items", [])
            for item in items:
                if downloaded >= max_downloads:
                    break
                    
                links = item.get("links", [])
                if not links:
                    continue
                    
                image_url = links[0].get("href")
                if not image_url:
                    continue
                    
                # NASA API sometimes returns http, we should use https
                image_url = image_url.replace("http://", "https://")
                
                # Make a safe filename
                nasa_id = item.get("data", [{}])[0].get("nasa_id", f"nasa_{downloaded}")
                safe_name = "".join([c if c.isalnum() else "_" for c in nasa_id]) + ".jpg"
                filepath = os.path.join(target_dir, safe_name)
                
                if not os.path.exists(filepath):
                    try:
                        img_req = urllib.request.Request(image_url, headers=headers)
                        with urllib.request.urlopen(img_req) as img_resp, open(filepath, 'wb') as out_file:
                            out_file.write(img_resp.read())
                        downloaded += 1
                        print(f"Downloaded {downloaded}/{max_downloads}: {safe_name}")
                        time.sleep(0.1) # Be nice to the API
                    except Exception as e:
                        print(f"Failed to download {image_url}: {e}")
                        
    except Exception as e:
        print(f"Failed to search for {query}: {e}")

print(f"Finished. Downloaded {downloaded} images from NASA.")
