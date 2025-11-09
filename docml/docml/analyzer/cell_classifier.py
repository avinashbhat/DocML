"""
Cell Classifier

Classifies notebook code cells into ML workflow stages.
"""

import re
from typing import Dict, Optional
from .notebook_parser import CodeCell
from .patterns import MLPatterns


class CellClassifier:
    """
    Classifies code cells into ML workflow stages.

    Classification priority:
    1. User-defined metadata (cell.metadata.stage)
    2. User annotations in code comments (# [model card] stage: ...)
    3. Pattern matching using MLPatterns

    Possible stages:
    - plotting
    - datacleaning
    - preprocessing
    - hyperparameters
    - modeltraining
    - modelevaluation
    - miscellaneous (ignore)
    """

    # Valid stage names
    VALID_STAGES = {
        'plotting',
        'datacleaning',
        'preprocessing',
        'hyperparameters',
        'modeltraining',
        'modelevaluation',
        'miscellaneous',
    }

    # Mapping from user-friendly names to internal stage names
    STAGE_NAME_MAPPING = {
        'Plotting': 'plotting',
        'Data Cleaning': 'datacleaning',
        'Preprocessing': 'preprocessing',
        'Hyperparameters': 'hyperparameters',
        'Model Training': 'modeltraining',
        'Model Evaluation': 'modelevaluation',
        'Ignore': 'miscellaneous',
    }

    def __init__(self):
        self.pattern_matcher = MLPatterns()

    def classify_cell(self, cell: CodeCell) -> str:
        """
        Classify a code cell into a stage.

        Returns the stage name as a string.
        """

        # Priority 1: Check cell metadata
        if 'stage' in cell.metadata:
            metadata_stage = cell.metadata['stage']
            if metadata_stage in self.VALID_STAGES:
                return metadata_stage

        # Priority 2: Check for user annotations in code comments
        annotation_stage = self._check_annotation(cell.source_text)
        if annotation_stage:
            return annotation_stage

        # Priority 3: Pattern matching
        pattern_stage = self.pattern_matcher.classify_by_patterns(cell.source_text)
        return pattern_stage

    def _check_annotation(self, source_code: str) -> Optional[str]:
        """
        Check for user annotations in code comments.

        Format: # [model card] stage: Preprocessing
        """
        # Pattern to match: # [model card] stage: StageName
        pattern = r'#\s*\[model card\]\s*stage:\s*(.+)'

        for line in source_code.split('\n'):
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                stage_name = match.group(1).strip()
                # Map user-friendly name to internal name
                if stage_name in self.STAGE_NAME_MAPPING:
                    return self.STAGE_NAME_MAPPING[stage_name]

        return None

    @staticmethod
    def normalize_stage_name(stage: str) -> str:
        """
        Normalize stage name to internal format.

        Handles various input formats.
        """
        stage_lower = stage.lower().strip()

        # Direct mapping
        mapping = {
            'plotting': 'plotting',
            'data cleaning': 'datacleaning',
            'datacleaning': 'datacleaning',
            'preprocessing': 'preprocessing',
            'feature engineering': 'preprocessing',
            'hyperparameters': 'hyperparameters',
            'model training': 'modeltraining',
            'modeltraining': 'modeltraining',
            'training': 'modeltraining',
            'model evaluation': 'modelevaluation',
            'modelevaluation': 'modelevaluation',
            'evaluation': 'modelevaluation',
            'ignore': 'miscellaneous',
            'miscellaneous': 'miscellaneous',
        }

        return mapping.get(stage_lower, 'miscellaneous')
