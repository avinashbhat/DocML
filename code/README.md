# MLDoc

Interactive documentation tool for machine learning code in JupyterLab.

----
## Installation

**The minimum Python version requirement is Python 3.7 and above.**

**The extension works best in Chrome, there might be few features missing if you are using any other browser. See [Troubleshooting](#troubleshooting) below if you are facing any issue with the usage.**

Due to dependency on few `npm` packages, this library needs to have Node installed on the machine.
You can download Node by following [the official page](https://nodejs.org/en/download/). Try to have the latest version; the plugin works on Node v16.12.0, but might have bugs in the previous versions.

Once Node is installed the package can be installed from PyPI. 

Simply running this command installs all the python dependencies for the project. [JupyterLab](https://github.com/jupyterlab/jupyterlab) is the primary requirement that is installed. 

----
## Usage
All the features of the tool are described in the tutorial video here.

## Model Documentation
Most of the predefined sections are taken from the <i>Model Cards for Model Reporting</i> [[1]](#1) paper.
As mentioned in the paper, each of these sections are to be used as follows.
 - **Basic information**
    
    Basic details about the model, including details like person or the organization developing the model, date, version, type, information about training algorithms, parameters, fairness constraints, features, citations, licences and contact information.

- **Intended Use**

    Use cases envisioned for the model during development, including primary intended uses and users, out of scope use cases

- **Factors**

    Demographic or phenotypic groups, environmental conditions, technical attributes.

- **Metrics/Evaluation Procedure and Data<sup>*</sup>**

    Real world impacts of the model including the performance measures, decison thresholds, variation approaches.

- **Evaluation Data/Evaluation Procedure and Data<sup>*</sup>**

    Datasets used by the model, motivation of the use case, preprocessing information.

- **Training Data/Training Procedure and Data<sup>*</sup>**

    Similar to evaluation data, the dataset used to train the model. Can contain the hyperparameters that are used while training the model as well.

- **Quantitative Analysis**

    Unitary results and the intersecctional results.

- **Ethical Considerations**
- **Caveats and Recommendations**
- **Libraries<sup>*</sup>**

    The libraries that are imported into the notebook.

- **Plotting<sup>*</sup>**

    Any plots present in the notebook.

The sections with * superscript, such as Plotting<sup>*</sup>, contain contents mapped to the the source code cells. The mapping is automatically detected but the user can change the mapping of the source code cell for an existing notebook. 

----
## Caution

This package is still under development, and can have usage issues. Make sure to take frequent backups of your work. We recommend you to have a separate `python` environment created for installing the package in, not only because it is a good practise to do so, but also so that in case of any dependency issues it is easy to fix it. Check out [venv](https://docs.python.org/3/library/venv.html) for instructions on how to setup a python virtual environment.

----
## Troubleshooting
1) Model card is blank.
 
    Check if Node is installed on your machine.
    Check if your config file has the required sections listed.
    Make sure all the code cells are executable. Since the automated document marker functionality picks up all the code cells, all the code cells should be working.

2) Model card refresh is failing.

    Close the model card. Click on the `model card` button in the panel. It should generate the model card. 
    
    Note: The `Refresh` tab currently only works on Chrome. If you are using Safari, you should close the modelcard panel and regenerate it to refresh the contents.

----
## References
<a id="1">[1]</a> 
Margaret Mitchell, Simone Wu, Andrew Zaldivar, Parker Barnes, Lucy Vasserman, Ben Hutchinson, Elena Spitzer, Inioluwa Deborah Raji, and Timnit Gebru. 2019. Model Cards for Model Reporting. In Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT* '19). Association for Computing Machinery, New York, NY, USA, 220–229. DOI:https://doi.org/10.1145/3287560.3287596

----
## Development Installation
If you want to contribute and make this extension better, here are the steps to install the extension locally to code on it.

Create a `conda` environment if you do not have an environment already.
```bash
conda create -n [environment-name] --override-channels --strict-channel-priority -c conda-forge -c anaconda jupyterlab cookiecutter nodejs git
```
Activate the environment.
```bash
conda activate [environment-name]
```

Since there is only one python dependeny, there is no `environment.yml` file. You can install the `jupyterlab` package.
```bash
# for JupyterLab 3.x 
conda install -c conda-forge jupyterlab
```

Once you install `jupyterlab`, you can access `jlpm` which is JupyterLab's pinned version of [yarn](https://yarnpkg.com/).
```bash
# Install dependencies
jlpm install
```

You can install the extension without building as well.
```bash
jupyter labextension install . --no-build
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

Once you make any changes to the code, you can rebuild the extension.
```bash
jlpm run build
```
----
