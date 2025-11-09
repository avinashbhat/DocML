"""
Notebook Parser

Handles parsing of Jupyter notebook (.ipynb) JSON files.
"""

import json
from pathlib import Path
from typing import Dict, List, Any, Optional


class Cell:
    """Base class for notebook cells"""

    def __init__(self, cell_data: Dict[str, Any], cell_id: int):
        self.cell_id = cell_id
        self.cell_type = cell_data.get('cell_type', 'code')
        self.metadata = cell_data.get('metadata', {})
        self.source = cell_data.get('source', [])

        # Join source if it's a list
        if isinstance(self.source, list):
            self.source_text = ''.join(self.source)
        else:
            self.source_text = self.source

    def __repr__(self):
        return f"<{self.__class__.__name__} id={self.cell_id} type={self.cell_type}>"


class CodeCell(Cell):
    """Represents a code cell in the notebook"""

    def __init__(self, cell_data: Dict[str, Any], cell_id: int):
        super().__init__(cell_data, cell_id)
        self.execution_count = cell_data.get('execution_count')
        self.outputs = cell_data.get('outputs', [])

        # Handle cells with null execution count (assign sequential IDs)
        if self.execution_count is None:
            self.execution_count = cell_id


class MarkdownCell(Cell):
    """Represents a markdown cell in the notebook"""

    def __init__(self, cell_data: Dict[str, Any], cell_id: int):
        super().__init__(cell_data, cell_id)


class NotebookParser:
    """
    Parses Jupyter notebook (.ipynb) JSON files.

    Extracts cells, metadata, and prepares data for analysis.
    """

    def __init__(self, notebook_path: str):
        self.notebook_path = Path(notebook_path)
        self.notebook_data: Optional[Dict[str, Any]] = None
        self.cells: List[Cell] = []
        self.code_cells: List[CodeCell] = []
        self.markdown_cells: List[MarkdownCell] = []

    def load_notebook(self) -> Dict[str, Any]:
        """Load and parse the notebook JSON file"""
        if not self.notebook_path.exists():
            raise FileNotFoundError(f"Notebook not found: {self.notebook_path}")

        if not self.notebook_path.suffix == '.ipynb':
            raise ValueError(f"File must be a .ipynb file: {self.notebook_path}")

        with open(self.notebook_path, 'r', encoding='utf-8') as f:
            self.notebook_data = json.load(f)

        return self.notebook_data

    def parse_cells(self) -> None:
        """Parse all cells from the notebook"""
        if not self.notebook_data:
            self.load_notebook()

        cells_data = self.notebook_data.get('cells', [])

        # Track last execution count for cells without one
        last_execution_count = -1

        for idx, cell_data in enumerate(cells_data):
            cell_type = cell_data.get('cell_type', 'code')

            if cell_type == 'code':
                # Handle null execution counts
                if cell_data.get('execution_count') is None:
                    cell_data['execution_count'] = last_execution_count + 1
                last_execution_count = cell_data['execution_count']

                code_cell = CodeCell(cell_data, idx)
                self.cells.append(code_cell)
                self.code_cells.append(code_cell)

            elif cell_type == 'markdown':
                markdown_cell = MarkdownCell(cell_data, idx)
                self.cells.append(markdown_cell)
                self.markdown_cells.append(markdown_cell)

    def get_code_cells(self) -> List[CodeCell]:
        """Get all code cells"""
        if not self.cells:
            self.parse_cells()
        return self.code_cells

    def get_markdown_cells(self) -> List[MarkdownCell]:
        """Get all markdown cells"""
        if not self.cells:
            self.parse_cells()
        return self.markdown_cells

    def get_all_cells(self) -> List[Cell]:
        """Get all cells"""
        if not self.cells:
            self.parse_cells()
        return self.cells

    def get_model_name(self) -> str:
        """
        Extract model name from the first markdown cell.
        Looks for the first heading (# Title)
        """
        if not self.cells:
            self.parse_cells()

        for cell in self.markdown_cells:
            if cell.cell_id == 0:  # First cell
                # Extract first line and remove markdown heading markers
                first_line = cell.source_text.split('\n')[0]
                # Remove # markers
                title = first_line.lstrip('#').strip()
                return title

        return ""

    def get_notebook_filename(self) -> str:
        """Get the notebook filename without extension"""
        return self.notebook_path.stem
