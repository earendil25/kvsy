from PIL import Image, ImageDraw, ImageFont
import os

def create_directory_if_not_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

def generate_logo(filename, text, color, size=(200, 200)):
    # Create a new image with a white background
    image = Image.new('RGB', size, 'white')
    draw = ImageDraw.Draw(image)
    
    # Draw a colored circle
    circle_radius = min(size) // 2 - 10
    circle_center = (size[0] // 2, size[1] // 2)
    draw.ellipse(
        (
            circle_center[0] - circle_radius,
            circle_center[1] - circle_radius,
            circle_center[0] + circle_radius,
            circle_center[1] + circle_radius
        ),
        fill=color
    )
    
    # Add text
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except IOError:
        font = ImageFont.load_default()
    
    text_width, text_height = draw.textsize(text, font=font) if hasattr(draw, 'textsize') else (50, 20)
    text_position = (
        (size[0] - text_width) // 2,
        (size[1] - text_height) // 2
    )
    draw.text(text_position, text, fill='white', font=font)
    
    # Save the image
    image.save(filename)
    print(f"Generated {filename}")

def generate_ad_image(filename, size=(400, 200)):
    # Create a new image with a gradient background
    image = Image.new('RGB', size, 'white')
    draw = ImageDraw.Draw(image)
    
    # Draw a gradient background
    for y in range(size[1]):
        r = int(255 * (1 - y / size[1]))
        g = int(200 * (y / size[1]))
        b = int(100 + 155 * (y / size[1]))
        for x in range(size[0]):
            draw.point((x, y), fill=(r, g, b))
    
    # Add text
    try:
        font = ImageFont.truetype("arial.ttf", 36)
        small_font = ImageFont.truetype("arial.ttf", 24)
    except IOError:
        font = ImageFont.load_default()
        small_font = ImageFont.load_default()
    
    # Title
    title = "대학생 필수 앱!"
    title_width, title_height = draw.textsize(title, font=font) if hasattr(draw, 'textsize') else (100, 30)
    title_position = ((size[0] - title_width) // 2, 30)
    draw.text(title_position, title, fill='white', font=font)
    
    # Subtitle
    subtitle = "지금 다운로드 받으세요!"
    subtitle_width, subtitle_height = draw.textsize(subtitle, font=small_font) if hasattr(draw, 'textsize') else (80, 20)
    subtitle_position = ((size[0] - subtitle_width) // 2, 80)
    draw.text(subtitle_position, subtitle, fill='white', font=small_font)
    
    # Save the image
    image.save(filename)
    print(f"Generated {filename}")

def main():
    # Create images directory if it doesn't exist
    images_dir = 'static/images'
    create_directory_if_not_exists(images_dir)
    
    # Generate logo images
    generate_logo(os.path.join(images_dir, 'yonsei_logo.png'), 'YU', '#00135c')
    generate_logo(os.path.join(images_dir, 'korea_logo.png'), 'KU', '#8b0029')
    
    # Generate ad image
    generate_ad_image(os.path.join(images_dir, 'ad_image.png'))
    
    print("All images generated successfully!")

if __name__ == "__main__":
    main() 