
import json
import math
import re

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    return 2 * R * math.asin(math.sqrt(a))

# Coordinates
BASES = {
    "altoParaiso": (-14.1311, -47.5147),
    "saoJorge": (-14.1722, -47.8183),
    "cavalcante": (-13.7915, -47.4578)
}

def calculate_road_distance(lat1, lon1, lat2, lon2):
    # For Chapada, road distance is roughly 1.3x to 1.8x the straight line distance
    # especially for dirt roads.
    d = haversine(lat1, lon1, lat2, lon2)
    return round(d * 1.5) # Average multiplier for mountain roads

def get_google_photos_url(name):
    query = f"{name} Chapada dos Veadeiros".replace(" ", "+")
    return f"https://www.google.com/search?q={query}+fotos&tbm=isch"

def process_file():
    path = r'c:\Users\jaime\OneDrive\Desktop\aranumlabs-estetica\chapada-veadeiros\data.js'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract ATTRACTIONS array using regex (very basic)
    match = re.search(r'const ATTRACTIONS = (\[.*\]);', content, re.DOTALL)
    if not match:
        print("Could not find ATTRACTIONS array")
        return

    attractions_str = match.group(1)
    
    # We need to handle the fact that it might not be perfect JSON (it's JS)
    # But for our current data.js, it's mostly JSON-like after my previous refactor.
    try:
        # Pre-process to make it JSON-compatible if needed (replace single quotes etc)
        # Actually our current data.js is quite clean JSON-like inside the array.
        attractions = json.loads(attractions_str)
    except json.JSONDecodeError as e:
        print(f"Error parsing ATTRACTIONS: {e}")
        return

    for attr in attractions:
        lat = attr.get('lat')
        lng = attr.get('lng')
        
        if lat and lng:
            attr['distances'] = {
                "altoParaiso": calculate_road_distance(lat, lng, *BASES["altoParaiso"]),
                "saoJorge": calculate_road_distance(lat, lng, *BASES["saoJorge"]),
                "cavalcante": calculate_road_distance(lat, lng, *BASES["cavalcante"])
            }
        
        # Ensure googlePhotosUrl is set
        attr['googlePhotosUrl'] = get_google_photos_url(attr['name'])
        
        # Special case for Jardim de Maytrea as per user data
        if attr['id'] == 'jardim-maytrea':
            attr['distances'] = {
                "altoParaiso": 22,
                "saoJorge": 17,
                "cavalcante": 109
            }

    # Replace the array in the original content
    new_attractions_str = json.dumps(attractions, indent=4, ensure_ascii=False)
    new_content = re.sub(r'const ATTRACTIONS = \[.*\];', f'const ATTRACTIONS = {new_attractions_str};', content, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully updated distancing and photo links for all attractions.")

if __name__ == "__main__":
    process_file()
