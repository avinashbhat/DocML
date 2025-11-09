"""
DocML Notebook Analyzer

Python-based notebook analysis for model card generation.
Replaces the previous Node.js subprocess implementation.
"""

from .model_card_generator import ModelCardGenerator

__all__ = ['ModelCardGenerator']
