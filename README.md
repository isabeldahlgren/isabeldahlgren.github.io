# Isabel Dahlgren’s website

Run `hugo server` and open http://localhost:1313.

The irreality section is a white, walkable gallery at `/irreality/`. Use WASD to
walk and the arrow keys to look around. The on-screen keys also work with
mouse. On phones and tablets, the viewpoint stays in the centre: swipe to look
around and tap a work to enlarge it. Walking keys are hidden and disabled on
touch devices. Click an image or a text work’s “read” link to open its reading
view. On touch devices, works open at `/irreality/view/` with a single image
limited to 1600 pixels, keeping the enlarged image separate from the 3D room.
The gallery remembers your viewing direction when you return. Desktop uses
the in-room viewer. If more series are added, their names switch rooms.

## Adding a series

Create a folder in `content/irreality/`, such as `content/irreality/new-series/`.
Put the image files and an `index.md` in that folder. Each series holds 1–10
works; a work can be an image, text, poetry, or a combination.

```yaml
---
title: New series
weight: 3
prints:
  - file: first-print.jpg
    title: First print
    artist:
      name: Your invented artist
      years: "1948–2011"
      bio: |
        The artist’s biography goes here.
    text: |
      A separate paragraph about the work. **Markdown** is supported.

      Add a blank line for another paragraph.
    poem: |
      A line of poetry
      and another line.

      A new stanza.

  - file: second-print.jpg
    title: An image with just a caption

  - title: A text-only work
    text: |
      Omit file to hang this text on the wall without an image.

  - title: A poem on its own
    poem: |
      Line breaks and indentation
      are preserved here.
---
An optional series description for the non-interactive page.
```

- `file`: image filename in the same folder. Omit for a text-only work.
- `title`: the work’s caption.
- `wall`: optional `front`, `left`, `right`, or `rear` to choose a wall.
  `rear` is behind the entrance view. Omit for automatic placement.
- `artist`: optional name, dates (`years`), and biography (`bio`, with Markdown).
  Omit the whole artist block when no artist label is wanted. To add a biography
  later, copy the `artist` block from the example into any work.
- `text`: optional prose, including long passages and Markdown formatting.
- `poem`: optional plain text that preserves line breaks and stanza spacing.

The artist label and writing appear beside the image. Text-only works need
`text` or `poem`, and can also have an artist. Empty or omitted text fields leave
no empty label. The room expands to fit the works, and the reading view lets
visitors read long passages at normal size without cutting them off.

`weight` orders the series; the `prints` list orders the works. You can omit
`prints` to use all images in filename order with captions derived from their
filenames. Hugo creates web-sized images without changing the source files.
Each series has a page at `/irreality/new-series/`.

Edit `content/irreality/series1/index.md` for the current room. Series 1 contains
seven football-themed images, with an artist biography, selected wall notes,
and poems. The Lineup and biography face the entrance; works occupy all four
walls. Unused source images remain outside the displayed selection.

The photography page is `/reality/`, with images in `content/reality/` and its
layout in `layouts/_default/reality.html`. The chronological view is `/time/`,
configured by `content/time.md` and `layouts/_default/time.html`.
