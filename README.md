# draw.io for Orca

Opens draw.io diagrams in an Orca editor tab, next to Source:

- `.drawio` files
- editable `.drawio.svg` files (SVGs that carry their diagram, as draw.io saves them)

It is a **viewer**: zoom, layers and pages, no editing. Edit diagrams in draw.io (desktop, VS Code
or app.diagrams.net); the open tab follows the file when it changes on disk.

Orca plugin frames have no network, so the draw.io viewer and its image libraries ship inside the
plugin (`editor/drawio/`). Azure, Microsoft, IBM, SAP, Atlassian and the other image icons render
offline.

## Install

```sh
orca plugin install RossiAlexis/orca-drawio-plugin
```

Orca asks you to approve it, because it runs code: the only access it asks for is showing its own
editor, which reads the files you open with it.

## Not supported yet

- Shapes drawn from draw.io stencils (AWS, GCP, Cisco, Kubernetes, BPMN and similar libraries whose
  style is `shape=mxgraph.…`) show as plain boxes. The stencil files are 41 MB, which with the
  rest does not fit Orca's 50 MiB plugin limit.
- Math formulas (`math=1` diagrams).
- `.drawio.png` files.

## Develop

```sh
orca plugin test .         # editor/diagram.test.ts in Node
orca plugin check .        # validates the manifest and every file the editor loads
orca plugin dev watch .    # loads this folder into Orca, streams logs, reloads on save
orca plugin shot local.drawio --editor path/to/diagram.drawio --out shot.png
```

| File | What it does |
| --- | --- |
| `orca-plugin.json` | Registers the editor for `.drawio` and `.drawio.svg` |
| `editor/index.html` | Loads the path setup, the draw.io viewer and `main.ts`, in that order |
| `editor/drawio-paths.js` | Points the viewer at the bundled files instead of viewer.diagrams.net |
| `editor/diagram.ts` | Reads the diagram XML out of a `.drawio` or `.drawio.svg` file |
| `editor/main.ts` | Renders it, and re-renders when the file changes |
| `editor/drawio/` | draw.io's viewer and image libraries (Apache 2.0, see `LICENSE` and `SOURCE.txt` there) |

To move to another draw.io release, run `scripts/update-drawio.sh <tag>` (for example
`v29.7.12`), then the three checks above.
