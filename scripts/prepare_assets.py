#!/usr/bin/env python3
"""Export the manuscript's existing figures; requires Poppler and Pillow."""

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manuscript", type=Path, help="Directory containing main.pdf and figures/")
    args = parser.parse_args()
    source = args.manuscript.resolve()
    root = Path(__file__).resolve().parents[1]
    images = root / "assets" / "images"
    papers = root / "assets" / "paper"
    images.mkdir(parents=True, exist_ok=True)
    papers.mkdir(parents=True, exist_ok=True)
    manifest = {}

    def save(image, name, provenance, width=None, lossless=False):
        image = image.convert("RGB")
        if width and image.width > width:
            image = image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
        path = images / name
        if path.suffix == ".webp":
            image.save(path, "WEBP", quality=92, method=6, lossless=lossless)
        else:
            image.save(path, "JPEG", quality=92, optimize=True)
        manifest[name] = {"source": provenance, "width": image.width, "height": image.height}

    with tempfile.TemporaryDirectory(prefix="controlscene-assets-") as tmpdir:
        tmp = Path(tmpdir)

        def render(name, size=2600):
            output = tmp / name
            subprocess.run(["pdftoppm", "-singlefile", "-scale-to", str(size), "-png",
                            str(source / "figures" / (name + ".pdf")), str(output)], check=True)
            return Image.open(str(output) + ".png").convert("RGB")

        def extract(name):
            output = tmp / (name + "-embedded")
            subprocess.run(["pdfimages", "-png", "-j", str(source / "figures" / (name + ".pdf")),
                            str(output)], check=True)
            return output

        for name, slug in [("FIG1", "dataset"), ("FIG2", "method"),
                           ("FIG3", "self-correction-chart"), ("FIG4", "prompt-tuning-chart"),
                           ("FIG5", "scene-results"), ("3-6", "layout-correction")]:
            figure = render(name)
            save(figure, slug + "-full.webp", "figures/" + name + ".pdf", lossless=True)
            save(figure, slug + ".webp", "figures/" + name + ".pdf", width=1440)

        embedded = extract("FIG2")
        hero = Image.open(str(embedded) + "-324.jpg")
        save(hero, "hero.webp", "figures/FIG2.pdf, high-resolution panorama (image 324)")
        save(hero, "hero-small.webp", "figures/FIG2.pdf, high-resolution panorama (image 324)", width=1100)
        save(hero, "social-preview.jpg", "figures/FIG2.pdf, high-resolution panorama (image 324)", width=1200)

        # Crop rendered panels rather than embedded photos to retain the paper's
        # colored object annotations. Coordinates refer to the 1200 x 675 figure.
        gallery = render("FIG5", 2400)
        cases = {
            "guest-room": [(18, 88, 313, 220), (330, 88, 581, 220),
                           (599, 88, 918, 220), (932, 88, 1170, 220)],
            "family-room": [(18, 295, 313, 441), (330, 295, 553, 441),
                            (564, 295, 887, 441), (900, 295, 1184, 441)],
            "nursery": [(18, 517, 315, 665), (327, 517, 562, 665),
                        (587, 517, 843, 665), (861, 517, 1186, 665)],
        }
        for name, bounds in cases.items():
            for index, box in enumerate(bounds):
                crop = gallery.crop(tuple(round(x * gallery.width / 1200) for x in box))
                label = "panorama" if index == 0 else "view-" + str(index)
                save(crop, name + "-" + label + ".webp", "figures/FIG5.pdf, " + name + ", " + label)

        comparison_prefix = extract("3-7")
        comparison = Image.open(str(comparison_prefix) + "-000.png")
        split = comparison.height // 2
        for label, box in [("baseline", (0, 0, comparison.width, split)),
                           ("corrected", (0, split, comparison.width, comparison.height))]:
            crop = comparison.crop(box)
            save(crop, "panorama-" + label + "-full.webp", "figures/3-7.pdf, " + label, width=2200)
            save(crop, "panorama-" + label + ".webp", "figures/3-7.pdf, " + label, width=1100)

    shutil.copy2(source / "main.pdf", papers / "controlscene-accepted-manuscript.pdf")
    (images / "sources.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print("Exported {} images and the accepted manuscript.".format(len(manifest)))
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
