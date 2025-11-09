# Code and artifacts for the paper "Aspirations and Practice of Model Documentation: Moving the Needle with Nudging and Traceability"

The repository contains the source code for the discussed tool in the paper and the relevant artifacts that were used for the creation of the rubric and the user study.

## Repository Structure

### `docml/` - Extension Source Code
The main JupyterLab extension source code. See [docs/README.md](docs/README.md) for installation instructions and [docs/INSTALL.md](docs/INSTALL.md) for detailed setup from source.

### `docs/` - Documentation and Paper Artifacts
- **[README.md](docs/README.md)** - Installation and usage guide
- **[INSTALL.md](docs/INSTALL.md)** - Detailed installation instructions
- **images/** - Documentation images and usage demos
- **paper-artifacts/** - Research artifacts from the paper:
  - `Rubric.pdf` - The final rubric for evaluation of model cards
  - `all-cards.xlsx` - Data containing the evaluation of several existing model cards which was used to develop the rubric
  - `User Study/Advertisement.pdf` - Advertisement for recruiting participants for the user study
  - `User Study/Demographic Survey.pdf` - Questions asked to the participants during the recruitment
  - `User Study/MLDoc.mp4` - Tutorial video for the tool shared with the participants prior to the user study
  - `User Study/Task Statement.pdf` - Task statement given to the participants during the user study
  - `User Study/Post-Study Survey Interview` - Questions asked to the participants at the end of user study
  - `User Study/input-control` - Notebook, corresponding data, partially completed documentation given to the control group participants
  - `User Study/input-experimental` - Notebook, corresponding data, partially completed documentation given to the experimental group participants

### `examples/` - Example Notebooks
Test notebooks and examples for trying out the extension (gitignored)
