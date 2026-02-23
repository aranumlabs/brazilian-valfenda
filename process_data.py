
import json
import re

file_path = r'c:\Users\jaime\OneDrive\Desktop\chapada-veadeiros\data.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

content = "".join(lines)

# Find the ATTRACTIONS array content
start_marker = 'const ATTRACTIONS = ['
end_marker = '];'

start_index = content.find(start_marker) + len(start_marker)
# Find the correctly matching closing bracket for the array
depth = 1
end_index = -1
for i in range(start_index, len(content)):
    if content[i] == '[':
        depth += 1
    elif content[i] == ']':
        depth -= 1
        if depth == 0:
            end_index = i
            break

if start_index == -1 or end_index == -1:
    print("Could not find ATTRACTIONS array")
    exit(1)

attractions_str = content[start_index:end_index]

# Function to parse the JS-like objects into Python dicts
# Since it's almost JSON but maybe with trailing commas or unquoted keys (though here they seem quoted)
# Let's try to clean it up for json.loads
def clean_js_to_json(js_str):
    # Remove trailing commas in arrays/objects
    js_str = re.sub(r',\s*([\]}])', r'\1', js_str)
    # Ensure all keys are double-quoted (already seems to be the case)
    return "[" + js_str + "]"

try:
    attractions = json.loads(clean_js_to_json(attractions_str))
except Exception as e:
    print(f"Error parsing attractions: {e}")
    # Fallback: manually parse if necessary, but the data looks like valid JSON objects
    exit(1)

# 1. Unify Macaquinhos
# We want to keep one version in Alto Paraíso
macaquinhos_merged = {
    "id": "macaquinhos",
    "name": "Complexo Cataratas dos Macaquinhos",
    "region": "Alto Paraíso",
    "type": "complexo",
    "description": "Complexo deslumbrante com 10 cachoeiras, incluindo a Cachoeira da Caverna, Banho dos Macacos e a majestosa Cachoeira da Luz (187m).",
    "trailLength": 7,
    "duration": "Dia inteiro",
    "durationSlots": "full",
    "difficulty": "Moderada-Difícil",
    "entranceFee": 60,
    "guideRequired": False,
    "guideCost": 0,
    "guideGroupSize": 0,
    "fourWheelRequired": True,
    "bestTime": "Estação seca (maio-setembro)",
    "tips": "A última queda (Cachoeira da Luz) é imperdível. Últimos 30km de estrada de terra exigem atenção.",
    "lat": -14.23,
    "lng": -47.45,
    "images": [
        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596700813958-382a988d5e1b?q=80&w=600&auto=format&fit=crop"
    ],
    "distances": {
        "altoParaiso": 43,
        "saoJorge": 75,
        "cavalcante": 132
    },
    "googlePhotosUrl": "https://www.google.com/search?q=Complexo+Cataratas+dos+Macaquinhos+fotos&tbm=isch"
}

# Remove all existing macaquinhos entries
attractions = [a for a in attractions if a['id'] != 'macaquinhos']
# Add the merged one
attractions.append(macaquinhos_merged)

# 2. Add Trilha Amarela (replace saltos-rio-preto)
trilha_amarela = {
    "id": "trilha-amarela",
    "name": "Trilha Amarela (Saltos, Carrossel e Corredeiras)",
    "region": "São Jorge",
    "type": "complexo",
    "description": "A trilha mais icônica do Parque Nacional. Inclui o Salto de 120m, o Salto de 80m (Garimpão), o incrível mirante do Carrossel e as Corredeiras do Rio Preto.",
    "trailLength": 11,
    "duration": "Dia inteiro",
    "durationSlots": "full",
    "difficulty": "Moderada-Difícil",
    "entranceFee": 47,
    "guideRequired": False,
    "guideCost": 0,
    "guideGroupSize": 0,
    "fourWheelRequired": False,
    "bestTime": "Manhã (saída cedo)",
    "tips": "Combine os Saltos com o banho nas Corredeiras. Requer fôlego para a subida de volta.",
    "lat": -14.15,
    "lng": -47.62,
    "images": [
        "https://images.unsplash.com/photo-1682687220199-d0124f48f95b?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1547432098-8ec01bc09355?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518182170546-076616fd46d3?q=80&w=600&auto=format&fit=crop"
    ],
    "distances": {
        "altoParaiso": 38,
        "saoJorge": 1,
        "cavalcante": 120
    },
    "googlePhotosUrl": "https://www.google.com/search?q=Trilha+Amarela+Saltos+Parque+Nacional+Chapada+dos+Veadeiros+fotos&tbm=isch"
}

# Find and replace or just add
found_saltos = False
for i, a in enumerate(attractions):
    if a['id'] == 'saltos-rio-preto':
        attractions[i] = trilha_amarela
        found_saltos = True
        break
if not found_saltos:
    attractions.append(trilha_amarela)

# 3. Add Bar do Mirante do Pôr do Sol
bar_sunset = {
    "id": "bar-mirante-sunset",
    "name": "Bar do Mirante do Pôr do Sol",
    "region": "São Jorge",
    "type": "experiencia",
    "description": "O melhor ponto de encontro em São Jorge para apreciar o pôr do sol com drinks, música ao vivo e uma vista privilegiada da Chapada.",
    "trailLength": 0,
    "duration": "2-3h",
    "durationSlots": "half",
    "difficulty": "Fácil",
    "entranceFee": 0,
    "guideRequired": False,
    "guideCost": 0,
    "guideGroupSize": 0,
    "fourWheelRequired": False,
    "bestTime": "17h-19h",
    "tips": "Chegue cedo para garantir mesa. Ótimo para relaxar após as trilhas.",
    "lat": -14.172,
    "lng": -47.653,
    "images": [
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=600&auto=format&fit=crop"
    ],
    "distances": {
        "altoParaiso": 36,
        "saoJorge": 0,
        "cavalcante": 126
    },
    "googlePhotosUrl": "https://www.google.com/search?q=Bar+do+Mirante+do+Pôr+do+Sol+São+Jorge+fotos&tbm=isch"
}
# Only add if not exists
if not any(a['id'] == 'bar-mirante-sunset' for a in attractions):
    attractions.append(bar_sunset)

# 4. Sorting: complexo first, then by name
complexos = [a for a in attractions if a.get('type') == 'complexo']
others = [a for a in attractions if a.get('type') != 'complexo']

# Sort both lists by name
complexos.sort(key=lambda x: x['name'])
others.sort(key=lambda x: x['name'])

sorted_attractions = complexos + others

# Format back to JS
# We'll use json.dumps with indent 4 and then fix the Booleans and maybe add a leading tab
def to_js_obj(obj):
    s = json.dumps(obj, indent=8, ensure_ascii=False)
    # Json to JS: null->null, true->true, false->false (actually json uses lowercase too)
    # Wait, json.dumps uses true/false/null which is valid JS
    return s

# Build the final string
final_attractions_str = " [\n"
for i, a in enumerate(sorted_attractions):
    obj_str = json.dumps(a, indent=8, ensure_ascii=False)
    # Remove the first 8 spaces of the first line
    obj_str = obj_str.strip()
    # Add leading indentation
    indented_obj = "    " + obj_str.replace("\n", "\n    ")
    final_attractions_str += indented_obj
    if i < len(sorted_attractions) - 1:
        final_attractions_str += ",\n"
    else:
        final_attractions_str += "\n"
final_attractions_str += "]"

# Replace in original content
# We need to be careful with EXACT match for the array to avoid issues
# Let's just use the markers we found
final_content = content[:start_index-len(' [')] + final_attractions_str + content[end_index+1:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("SUCCESS")
