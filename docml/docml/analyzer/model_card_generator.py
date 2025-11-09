"""
Model Card Generator

Main orchestrator for generating model card JSON from Jupyter notebooks.
Replaces the Node.js main.js implementation.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from collections import defaultdict

from .notebook_parser import NotebookParser, CodeCell, MarkdownCell
from .cell_classifier import CellClassifier
from .extractors import ModelCardExtractor


logger = logging.getLogger(__name__)


# Default section definitions (matches the Node.js implementation)
DEFAULT_SECTIONS = [
    {
        "section": "Basic information",
        "description": "Basic details about the model, including details like person or the organization developing the model, date, version, type, information about training algorithms, parameters, fairness constraints, features, citations, licences and contact information.",
        "example": "https://github.com/salesforce/CodeT5/blob/main/CodeT5_model_card.pdf"
    },
    {
        "section": "Intended Use",
        "description": "Use cases envisioned for the model during development, including primary intended uses and users, out of scope use cases.",
        "example": "https://github.com/salesforce/CodeT5/blob/main/CodeT5_model_card.pdf"
    },
    {
        "section": "Factors",
        "description": "Demographic or phenotypic groups, environmental conditions, technical attributes.",
        "example": "https://github.com/Kaggle/learntools/blob/master/notebooks/ethics/pdfs/smiling_in_images_model_card.pdf"
    },
    {
        "section": "Ethical Considerations",
        "description": "Any form of bias or issues relating to the model's impact.",
        "example": "https://github.com/salesforce/ctrl/blob/master/ModelCard.pdf"
    },
    {
        "section": "Caveats and Recommendations",
        "description": "Any shortcomings of the model or prescribed steps while using the model.",
        "example": "https://github.com/salesforce/ctrl/blob/master/ModelCard.pdf"
    },
    {
        "section": "Libraries",
        "description": "The libraries that are imported into the notebook.",
        "example": ""
    },
    {
        "section": "Datasets",
        "description": "Information about construction of transformation of the datasets used.",
        "example": "https://github.com/salesforce/CodeT5/blob/main/CodeT5_model_card.pdf"
    },
    {
        "section": "References",
        "description": "Any references or citations to external sources.",
        "example": ""
    },
    {
        "section": "Data Cleaning",
        "description": "Steps performed to clean the required data.",
        "example": ""
    },
    {
        "section": "Preprocessing",
        "description": "Steps performed to change the dataset to a form required by the model.",
        "example": ""
    },
    {
        "section": "Training Procedure and Data",
        "description": "Similar to evaluation data, the dataset used to train the model. Can contain the hyperparameters that are used while training the model as well.",
        "example": "https://metamind.readme.io/docs/einstein-ocr-model-card#section-training-and-evaluation-data"
    },
    {
        "section": "Evaluation Procedure and Data",
        "description": "Datasets used by the model, motivation of the use case, preprocessing information.",
        "example": "https://modelcards.withgoogle.com/face-detection"
    },
    {
        "section": "Hyperparameters",
        "description": "Hyperparameter tuning for the model.",
        "example": ""
    },
    {
        "section": "Plotting",
        "description": "Any plots present in the notebook.",
        "example": ""
    },
    {
        "section": "Disaggregated Evaluation Result",
        "description": "A description of the evaluation and the results.",
        "example": ""
    },
    {
        "section": "Miscellaneous",
        "description": "Code lines that can be ignored.",
        "example": ""
    },
]


class ModelCardGenerator:
    """
    Main generator for model cards from Jupyter notebooks.

    Usage:
        generator = ModelCardGenerator(notebook_path)
        model_card_json = generator.generate()
    """

    def __init__(self, notebook_path: str):
        self.notebook_path = Path(notebook_path)
        self.parser = NotebookParser(str(self.notebook_path))
        self.classifier = CellClassifier()
        self.extractor = ModelCardExtractor()

        self.schema: Dict[str, Any] = {}
        self.line_to_cell: Dict[int, int] = {}
        self.current_line = 1

        # Load custom sections if config file exists
        self.sections = self._load_sections_config()

    def generate(self) -> Dict[str, Any]:
        """
        Generate the complete model card JSON.

        Returns a dictionary matching the format expected by the frontend.
        """
        logger.info(f"Generating model card for: {self.notebook_path}")

        # Initialize schema
        self._initialize_schema()

        # Parse notebook
        self.parser.load_notebook()
        self.parser.parse_cells()

        # Extract model name
        self._extract_model_name()

        # Process all cells
        self._process_cells()

        # Generate library information
        self._generate_library_info()

        logger.info("Model card generation complete")
        return self.schema

    def _load_sections_config(self) -> List[Dict[str, Any]]:
        """
        Load custom sections from modelcard.config file if it exists.
        Falls back to DEFAULT_SECTIONS if not found.
        """
        config_path = self.notebook_path.parent / "modelcard.config"

        if config_path.exists():
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    config_data = json.load(f)
                    if "sections" in config_data:
                        logger.info(f"Loaded custom sections from: {config_path}")
                        return config_data["sections"]
            except (json.JSONDecodeError, KeyError) as e:
                logger.warning(f"Failed to load config from {config_path}: {e}")
                logger.info("Using default sections")

        return DEFAULT_SECTIONS

    def _initialize_schema(self) -> None:
        """Initialize the JSON schema structure"""
        self.schema = {
            "modelname": {
                "title": "",
                "Filename": self.notebook_path.stem,
                "cell_ids": []
            },
            "miscellaneous": self._create_section_schema("Miscellaneous", "", "")
        }

        # Add all sections (from config or defaults)
        for section_def in self.sections:
            section_name = section_def["section"]
            key_name = self._section_to_key(section_name)

            # Handle example field which can be a list or string
            example = section_def.get("example", "")
            if isinstance(example, list):
                example = example[0] if example else ""

            self.schema[key_name] = self._create_section_schema(
                section_name,
                section_def.get("description", ""),
                example
            )

        # Initialize references with links field
        if "references" in self.schema:
            self.schema["references"]["links"] = []

    def _create_section_schema(self, title: str, description: str, example: str) -> Dict[str, Any]:
        """Create a section schema dictionary"""
        return {
            "title": title,
            "cell_ids": [],
            "cells": [],
            "lineNumbers": [],
            "source": "",
            "markdown": "",
            "imports": [],
            "functions": [],
            "figures": [],
            "description": description,
            "outputs": [],
            "tooltip": description,
            "helpurl": example,
        }

    def _section_to_key(self, section_name: str) -> str:
        """
        Convert section name to schema key.

        Examples:
        - "Basic information" -> "basicinformation"
        - "Training Procedure and Data" -> "modeltraining"
        """
        key = section_name.lower().replace(" ", "")

        # Special mappings
        if key == "trainingprocedureanddata":
            return "modeltraining"
        elif key == "evaluationprocedureanddata":
            return "modelevaluation"
        elif key == "disaggregatedevaluationresult":
            return "disaggregatedevaluationresult"

        return key

    def _extract_model_name(self) -> None:
        """Extract model name from first markdown cell"""
        model_name = self.parser.get_model_name()
        if model_name:
            self.schema["modelname"]["title"] = model_name
            self.schema["modelname"]["cell_ids"] = [0]

    def _process_cells(self) -> None:
        """Process all cells in the notebook"""
        all_cells = self.parser.get_all_cells()

        for cell in all_cells:
            if isinstance(cell, MarkdownCell):
                self._process_markdown_cell(cell)
            elif isinstance(cell, CodeCell):
                self._process_code_cell(cell)

    def _process_markdown_cell(self, cell: MarkdownCell) -> None:
        """Process a markdown cell"""
        # Extract URLs for references section
        urls = self.extractor.extract_urls_from_markdown(cell)

        if urls and "references" in self.schema:
            self.schema["references"]["cell_ids"].append(cell.cell_id)
            self.schema["references"]["links"].extend(urls)

    def _process_code_cell(self, cell: CodeCell) -> None:
        """Process a code cell"""
        # Classify the cell
        stage = self.classifier.classify_cell(cell)

        # Extract all information from the cell
        extracted = self.extractor.extract_all_from_cell(cell)

        # Store in appropriate section
        if stage in self.schema:
            section = self.schema[stage]

            # Add cell ID
            section["cell_ids"].append(cell.cell_id)

            # Add source code
            section["source"] += cell.source_text + "\n"

            # Add cell info (for compatibility)
            section["cells"] = section.get("cells", [])
            if isinstance(section["cells"], str):
                section["cells"] += json.dumps(cell.source_text, indent=2)
            else:
                section["cells"].append(cell.source_text)

            # Add imports
            section["imports"].extend(extracted["imports"])

            # Add functions
            section["functions"].extend(extracted["functions"])

            # Add figures
            section["figures"].extend(extracted["figures"])

            # Add outputs
            section["outputs"].extend(extracted["outputs"])

            # Track line numbers
            lines_in_cell = cell.source_text.count('\n') + 1
            line_numbers = list(range(self.current_line, self.current_line + lines_in_cell))
            section["lineNumbers"].extend(line_numbers)

            # Map line numbers to cell IDs
            for line_num in line_numbers:
                self.line_to_cell[line_num] = cell.cell_id

            self.current_line += lines_in_cell

        # Special handling for dataset imports
        for import_stmt in extracted["imports"]:
            if 'sklearn.datasets' in import_stmt and "datasets" in self.schema:
                self.schema["datasets"]["source"] += import_stmt + "\n"
                if cell.cell_id not in self.schema["datasets"]["cell_ids"]:
                    self.schema["datasets"]["cell_ids"].append(cell.cell_id)

    def _generate_library_info(self) -> None:
        """Generate library information for the Libraries section"""
        if "libraries" not in self.schema:
            return

        # Collect all imports from all sections
        all_imports = []
        for section_key, section in self.schema.items():
            if isinstance(section, dict) and "imports" in section:
                all_imports.extend(section["imports"])

        # Categorize imports
        categorized = self.extractor.import_extractor.categorize_imports(all_imports)

        # Store in schema
        self.schema["libraries"]["lib"] = categorized
        self.schema["libraries"]["info"] = self.extractor.get_library_info()


def generate_model_card(notebook_path: str) -> Dict[str, Any]:
    """
    Convenience function to generate a model card.

    Args:
        notebook_path: Path to the .ipynb file

    Returns:
        Model card JSON dictionary
    """
    generator = ModelCardGenerator(notebook_path)
    return generator.generate()
