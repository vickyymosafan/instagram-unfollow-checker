from PIL import Image
from pathlib import Path
img = Image.open(Path('logo.webp')).convert('RGBA')
img.save('app/favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])
img.resize((180,180)).save('public/apple-icon.png')
img.resize((512,512)).save('public/icon-512.png')
