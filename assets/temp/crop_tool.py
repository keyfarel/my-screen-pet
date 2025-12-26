from PIL import Image
import os

# Konfigurasi Folder
input_folder = "assets"
output_folder = "assets_cropped"

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

# Cara Lebih Simpel (Get Bounding Box dari Alpha Channel)
def crop_transparency(path, save_path):
    img = Image.open(path)
    img = img.convert("RGBA")
    
    # Dapatkan kotak pembatas area yang TIDAK transparan
    bbox = img.getbbox()
    
    if bbox:
        cropped_img = img.crop(bbox)
        cropped_img.save(save_path)
        print(f"✅ Cropped: {path} -> {bbox}")
    else:
        print(f"⚠️ Skipped (Empty): {path}")

# Loop semua file png
for filename in os.listdir(input_folder):
    if filename.endswith(".png"):
        crop_transparency(
            os.path.join(input_folder, filename),
            os.path.join(output_folder, filename)
        )

print("Selesai! Cek folder assets_cropped.")