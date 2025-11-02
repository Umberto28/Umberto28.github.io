import os
import json

PROJECTS_JSON = './assets/data/projects.json'
IMAGES_BASE_DIR = './images'
IMAGES_URL_BASE = '/images'

VALID_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}

def get_project_images(project_id):
    project_dir = os.path.join(IMAGES_BASE_DIR, project_id)
    
    if not os.path.exists(project_dir) or not os.path.isdir(project_dir):
        print(f"Cartella non trovata: {project_dir}")
        return []
    
    try:
        files = os.listdir(project_dir)
    except Exception as e:
        print(f"Errore leggendo {project_dir}: {e}")
        return []
    
    images = []
    for file in files:
        ext = os.path.splitext(file)[1].lower()
        if ext in VALID_EXTENSIONS:
            image_url = f"{IMAGES_URL_BASE}/{project_id}/{file}"
            images.append(image_url)
    
    images.sort()
    
    return images

def populate_screenshots():
    print("Caricamento projects.json...")
    
    # Leggi il JSON dei progetti
    try:
        with open(PROJECTS_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"File non trovato: {PROJECTS_JSON}")
        return
    except json.JSONDecodeError as e:
        print(f"Errore parsing JSON: {e}")
        return
    
    if 'projects' not in data:
        print("Campo 'projects' non trovato nel JSON")
        return
    
    projects = data['projects']
    print(f"Trovati {len(projects)} progetti\n")
    
    updated_count = 0
    for project in projects:
        project_id = project.get('id')
        
        if not project_id:
            print("Progetto senza ID, saltato")
            continue
        
        print(f"Processando: {project_id}")
        
        images = get_project_images(project_id)
        
        if len(images) == 0:
            print(f"Nessuna immagine trovata")
        else:
            print(f"Trovate {len(images)} immagini")
            
            project['gallery'] = images
            updated_count += 1
        
        print()
    
    print(f"Salvataggio {PROJECTS_JSON}...")
    
    try:
        with open(PROJECTS_JSON, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"JSON aggiornato con successo!")
        print(f"Progetti aggiornati: {updated_count}/{len(projects)}")
        
    except Exception as e:
        print(f"Errore salvando JSON: {e}")

if __name__ == '__main__':
    populate_screenshots()
