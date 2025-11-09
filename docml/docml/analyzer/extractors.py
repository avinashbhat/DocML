"""
Extractors

Extract various components from notebook cells:
- Figures (base64 PNG images)
- URLs from markdown
- Imports and categorize by library
- Functions
"""

import ast
import re
from typing import List, Dict, Set, Any
from .notebook_parser import CodeCell, MarkdownCell
from .patterns import MLPatterns, LIBRARY_INFO


class FigureExtractor:
    """Extract figures from cell outputs"""

    @staticmethod
    def extract_figures(cell: CodeCell) -> List[str]:
        """
        Extract base64-encoded PNG images from cell outputs.

        Returns list of base64 strings.
        """
        figures = []

        for output in cell.outputs:
            output_type = output.get('output_type')

            if output_type == 'display_data':
                # Check for image/png data
                if 'data' in output and 'image/png' in output['data']:
                    png_data = output['data']['image/png']
                    figures.append(png_data)

        return figures

    @staticmethod
    def extract_outputs(cell: CodeCell) -> List[str]:
        """
        Extract text outputs from cell execution.

        Returns list of output strings.
        """
        outputs = []

        for output in cell.outputs:
            output_type = output.get('output_type')

            if output_type == 'stream':
                # Stream output (stdout/stderr)
                text = output.get('text', [])
                if isinstance(text, list):
                    text = ''.join(text)
                outputs.append(text)

        return outputs


class URLExtractor:
    """Extract URLs from markdown cells"""

    @staticmethod
    def extract_urls(markdown_text: str) -> List[str]:
        """
        Extract URLs from markdown text using regex.

        Matches http:// and https:// URLs.
        """
        # Pattern to match http/https URLs
        url_pattern = r'\bhttps?://[\S][^)]+'
        matches = re.findall(url_pattern, markdown_text, re.IGNORECASE)
        return matches if matches else []


class ImportExtractor:
    """Extract and analyze import statements"""

    def __init__(self):
        self.imports_by_category: Dict[str, List[str]] = {
            'pandas': [],
            'numpy': [],
            'matplotlib': [],
            'sklearn': [],
            'tensorflow': [],
            'pytorch': [],
            'OTHER': [],
        }

    def extract_imports(self, code: str) -> List[str]:
        """
        Extract import statements from Python code using AST.

        Returns list of import statement strings.
        """
        imports = []

        try:
            tree = ast.parse(code)

            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    # import foo, bar
                    for alias in node.names:
                        import_str = f"import {alias.name}"
                        if alias.asname:
                            import_str += f" as {alias.asname}"
                        imports.append(import_str)

                elif isinstance(node, ast.ImportFrom):
                    # from foo import bar
                    module = node.module or ''
                    for alias in node.names:
                        import_str = f"from {module} import {alias.name}"
                        if alias.asname:
                            import_str += f" as {alias.asname}"
                        imports.append(import_str)

        except SyntaxError:
            # If code has syntax errors, try to extract imports with regex
            imports = self._extract_imports_regex(code)

        return imports

    def _extract_imports_regex(self, code: str) -> List[str]:
        """Fallback: extract imports using regex if AST fails"""
        imports = []

        # Match 'import ...' and 'from ... import ...'
        import_pattern = r'^\s*(import\s+[\w.]+(?:\s+as\s+\w+)?|from\s+[\w.]+\s+import\s+[\w, *]+(?:\s+as\s+\w+)?)'

        for line in code.split('\n'):
            match = re.match(import_pattern, line.strip())
            if match:
                imports.append(match.group(1).strip())

        return imports

    def categorize_imports(self, imports: List[str]) -> Dict[str, List[str]]:
        """
        Categorize imports by library type.

        Returns dict with categories as keys.
        """
        categorized = {
            'pandas': [],
            'numpy': [],
            'matplotlib': [],
            'sklearn': [],
            'tensorflow': [],
            'pytorch': [],
            'OTHER': [],
        }

        for import_stmt in imports:
            category = MLPatterns.get_library_category(import_stmt)
            categorized[category].append(import_stmt)

        return categorized


class FunctionExtractor:
    """Extract function definitions from code"""

    @staticmethod
    def extract_functions(code: str) -> List[str]:
        """
        Extract function definitions from Python code.

        Returns list of function definition strings.
        """
        functions = []

        try:
            tree = ast.parse(code)

            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef) or isinstance(node, ast.AsyncFunctionDef):
                    # Get function source (simplified version)
                    func_name = node.name
                    args = []

                    for arg in node.args.args:
                        args.append(arg.arg)

                    func_signature = f"def {func_name}({', '.join(args)})"
                    functions.append(func_signature)

        except SyntaxError:
            # If code has syntax errors, skip function extraction
            pass

        return functions


class DatasetExtractor:
    """Extract dataset-related information"""

    @staticmethod
    def is_dataset_import(import_stmt: str) -> bool:
        """Check if import is dataset-related (e.g., sklearn.datasets)"""
        return 'sklearn.datasets' in import_stmt.lower()


class ModelCardExtractor:
    """
    High-level extractor that coordinates all extraction operations.
    """

    def __init__(self):
        self.figure_extractor = FigureExtractor()
        self.url_extractor = URLExtractor()
        self.import_extractor = ImportExtractor()
        self.function_extractor = FunctionExtractor()
        self.dataset_extractor = DatasetExtractor()

    def extract_all_from_cell(self, cell: CodeCell) -> Dict[str, Any]:
        """
        Extract all relevant information from a code cell.

        Returns dict with:
        - imports: List of import statements
        - functions: List of function definitions
        - figures: List of base64 PNG strings
        - outputs: List of text outputs
        """
        return {
            'imports': self.import_extractor.extract_imports(cell.source_text),
            'functions': self.function_extractor.extract_functions(cell.source_text),
            'figures': self.figure_extractor.extract_figures(cell),
            'outputs': self.figure_extractor.extract_outputs(cell),
        }

    def extract_urls_from_markdown(self, cell: MarkdownCell) -> List[str]:
        """Extract URLs from a markdown cell"""
        return self.url_extractor.extract_urls(cell.source_text)

    def get_library_info(self) -> Dict[str, Dict[str, str]]:
        """Get library information dictionary"""
        return LIBRARY_INFO
