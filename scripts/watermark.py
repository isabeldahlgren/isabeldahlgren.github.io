# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow"]
# ///
"""Resize, watermark and copy photos into content/photos/.

Usage: uv run scripts/watermark.py ~/Downloads/DSC_*.jpg [--move]
"""

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

TEXT = "@Isabel Dahlgren"
FONT = "/System/Library/Fonts/Helvetica.ttc"
MAX_SIDE = 2048     # long side of the published image, in px
FONT_SCALE = 0.02   # font size relative to image width
BOTTOM_MARGIN = 0.03  # gap between text bottom and image bottom, relative to height
OPACITY = 170       # 0-255

OUT_DIR = Path(__file__).resolve().parent.parent / "content" / "photos"


def watermark(src: Path, dst: Path) -> None:
    img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    w, h = img.size

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    font = ImageFont.truetype(FONT, round(min(w, h * 1.5) * FONT_SCALE))
    x0, y0, x1, y1 = draw.textbbox((0, 0), TEXT, font=font)
    x = (w - (x1 - x0)) / 2 - x0
    y = h - h * BOTTOM_MARGIN - y1
    draw.text((x, y), TEXT, font=font, fill=(255, 255, 255, OPACITY))

    out = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    out.save(dst, "JPEG", quality=90, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("images", nargs="+", type=Path)
    parser.add_argument("--move", action="store_true", help="delete originals after processing")
    parser.add_argument("--out", type=Path, default=OUT_DIR)
    args = parser.parse_args()

    for src in args.images:
        dst = args.out / (src.stem + ".jpg")
        if dst.exists():
            print(f"skip {src.name}: {dst.name} already exists")
            continue
        watermark(src, dst)
        if args.move:
            src.unlink()
        print(f"{src.name} -> {dst}")


if __name__ == "__main__":
    main()
