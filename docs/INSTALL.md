# DocML Installation Guide

## Prerequisites

- Python 3.7+
- Node.js v16+ (only required for building the frontend, not for runtime)

## Installation Steps

1. **Create and activate a virtual environment** (recommended)
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

2. **Install the extension**
```bash
cd docml
pip install -e .
pip install notebook
```

3. **Install JavaScript dependencies and build**
```bash
jlpm install
jlpm run build
```

4. **Link the extension to JupyterLab**
```bash
cd /path/to/env/share/jupyter/labextensions
ln -s /path/to/docml/docml/labextension docml
```

5. **Copy server extension config**
```bash
cp jupyter-config/jupyter_server_config.d/docml.json /path/to/env/etc/jupyter/jupyter_server_config.d/
```

## Verify Installation

```bash
jupyter labextension list  # Should show: docml v0.0.8 enabled OK
```

## Run JupyterLab

```bash
jupyter lab
```

The DocML extension should now appear in the extensions list and be ready to use.

## Troubleshooting

- **Node.js**: Only required for building the extension (frontend). The backend now uses pure Python.
- Use Chrome browser for best compatibility
- Check that all code cells in your notebook are executable before generating model cards

## What's New (v0.0.8+)

The backend has been refactored from Node.js to pure Python:
- ✅ Faster model card generation (no subprocess overhead)
- ✅ Simpler architecture (Python analyzing Python)
- ✅ No runtime Node.js dependency
- ✅ Better error handling and debugging

Node.js is still required for **building** the frontend extension during development.
