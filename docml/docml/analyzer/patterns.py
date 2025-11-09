"""
ML Library Patterns

Pattern matching rules for classifying code cells into ML workflow stages.
Based on common sklearn, pandas, matplotlib, and other ML library patterns.
"""

from typing import Dict, List


class MLPatterns:
    """
    Pattern matching for ML code classification.

    Maps specific function calls and patterns to ML workflow stages:
    - Data Collection
    - Data Cleaning
    - Data Labeling
    - Feature Engineering (Preprocessing)
    - Training
    - Evaluation
    - Plotting
    - Hyperparameters
    """

    # Patterns that indicate plotting code
    PLOTTING_PATTERNS = [
        'import matplotlib.pyplot',
        'import matplotlib',
        'import seaborn',
        'import plotly',
        'import bokeh',
        '.plot(',
        '.show(',
        'plt.',
    ]

    # Patterns for data collection
    DATA_COLLECTION_PATTERNS = [
        'read_csv',
        'read_table',
        'read_excel',
        'read_sql',
        'read_json',
        'read_html',
        'read_clipboard',
        'fetch_lfw_people',
        'fetch_20newsgroups',
        'fetch_california_housing',
        'load_iris',
        'load_digits',
        'load_breast_cancer',
        'make_classification',
        '.DataFrame(',
        '.DatetimeIndex(',
    ]

    # Patterns for data cleaning
    DATA_CLEANING_PATTERNS = [
        'SimpleImputer',
        '.columns',
        '.isnull(',
        '.notnull(',
        '.dropna(',
        '.fillna(',
        '.astype(',
        '.rename(',
        '.set_index(',
    ]

    # Patterns for data labeling/splitting
    DATA_LABELING_PATTERNS = [
        'train_test_split',
        'make_blobs',
    ]

    # Patterns for feature engineering/preprocessing
    FEATURE_ENGINEERING_PATTERNS = [
        'StandardScaler',
        'scale(',
        'scaler.fit',
        'OrdinalEncoder',
        'PCA',
        'CountVectorizer',
        'HashingVectorizer',
        'TfidfVectorizer',
        'TfidfTransformer',
        'OneHotEncoder',
        'LabelEncoder',
        'LabelBinarizer',
        'QuantileTransformer',
        'PolynomialFeatures',
        'make_column_transformer',
        'ColumnTransformer',
        'DictVectorizer',
        'SelectFromModel',
        'RFECV',
    ]

    # Patterns for model training
    TRAINING_PATTERNS = [
        'LinearRegression',
        'LogisticRegression',
        'LogisticRegressionCV',
        'RandomForestClassifier',
        'RandomForestRegressor',
        'GradientBoostingClassifier',
        'GradientBoostingRegressor',
        'HistGradientBoostingRegressor',
        'XGBRegressor',
        'DecisionTreeClassifier',
        'DecisionTreeRegressor',
        'SVC(',
        'LinearSVC',
        'KNeighborsClassifier',
        'KNeighborsRegressor',
        'SGDClassifier',
        'MLPClassifier',
        'GaussianNB',
        'MultinomialNB',
        'BernoulliNB',
        'ComplementNB',
        'Perceptron',
        'DBSCAN',
        'KMeans',
        'MiniBatchKMeans',
        'Birch',
        'AgglomerativeClustering',
        'FeatureAgglomeration',
        'BaggingClassifier',
        'BaggingRegressor',
        'predict_proba',
        'decision_function',
        'calibration_curve',
        'CalibratedClassifierCV',
        'RandomizedSearchCV',
        'GridSearchCV',
        'ParameterSampler',
        'ParameterGrid',
        'RBFSampler',
        'BernoulliRBM',
        'TransformedTargetRegressor',
        'make_pipeline',
        'enable_hist_gradient_boosting',
        'BaseEstimator',
        'TransformerMixin',
        'clone(',
    ]

    # Patterns for model evaluation
    EVALUATION_PATTERNS = [
        'accuracy_score',
        'classification_report',
        'confusion_matrix',
        'f1_score',
        'permutation_importance',
        'cross_val_score',
        'brier_score_loss',
        'log_loss',
        'mean_squared_error',
        'roc_auc_score',
        'roc_curve',
        'auc(',
        'precision_recall_curve',
        'recall_score',
        'normalized_mutual_info_score',
        'adjusted_rand_score',
        'silhouette_score',
        'plot_partial_dependence',
        'learning_curve',
        'validation_curve',
        'feature_importances_',
        'KFold',
        'StratifiedKFold',
        'LeaveOneOut',
        'ShuffleSplit',
        'make_scorer',
        'predict(',
        'fit_predict',
    ]

    # Data exploration patterns (can be treated as data cleaning or separate)
    DATA_EXPLORATION_PATTERNS = [
        '.head(',
        '.tail(',
        '.shape',
        '.info(',
        '.describe(',
        '.value_counts(',
        '.apply(',
        '.loc[',
        '.iloc[',
        '.sort_values(',
        '.groupby(',
        '.pivot_table(',
        'pd.concat',
    ]

    @classmethod
    def classify_by_patterns(cls, code: str) -> str:
        """
        Classify code by pattern matching.

        Returns one of:
        - 'plotting'
        - 'datacleaning'
        - 'preprocessing'
        - 'modeltraining'
        - 'modelevaluation'
        - 'hyperparameters'
        - 'miscellaneous' (if no match)

        Priority order matters - we check in specific order to avoid misclassification.
        """

        code_lower = code.lower()

        # Check plotting first (high priority)
        for pattern in cls.PLOTTING_PATTERNS:
            if pattern.lower() in code:
                return 'plotting'

        # Check data collection
        for pattern in cls.DATA_COLLECTION_PATTERNS:
            if pattern.lower() in code_lower:
                return 'datacleaning'  # Treat as part of data cleaning stage

        # Check feature engineering (before evaluation to avoid fit_predict misclassification)
        for pattern in cls.FEATURE_ENGINEERING_PATTERNS:
            if pattern.lower() in code_lower:
                return 'preprocessing'

        # Check training patterns
        for pattern in cls.TRAINING_PATTERNS:
            if pattern.lower() in code_lower:
                return 'modeltraining'

        # Check evaluation patterns
        for pattern in cls.EVALUATION_PATTERNS:
            if pattern.lower() in code_lower:
                return 'modelevaluation'

        # Check data cleaning
        for pattern in cls.DATA_CLEANING_PATTERNS:
            if pattern.lower() in code_lower:
                return 'datacleaning'

        # Check data labeling
        for pattern in cls.DATA_LABELING_PATTERNS:
            if pattern.lower() in code_lower:
                return 'datacleaning'  # Treat as part of data cleaning

        # Check data exploration
        for pattern in cls.DATA_EXPLORATION_PATTERNS:
            if pattern.lower() in code_lower:
                return 'datacleaning'  # Treat exploration as part of cleaning

        return 'miscellaneous'

    @classmethod
    def get_library_category(cls, import_statement: str) -> str:
        """
        Categorize an import statement into library groups.

        Returns: 'pandas', 'numpy', 'matplotlib', 'sklearn', 'tensorflow', 'pytorch', or 'OTHER'
        """
        import_lower = import_statement.lower()

        if 'pandas' in import_lower or 'pd' in import_lower:
            return 'pandas'
        elif 'numpy' in import_lower or 'np' in import_lower:
            return 'numpy'
        elif 'matplotlib' in import_lower or 'plt' in import_lower:
            return 'matplotlib'
        elif 'sklearn' in import_lower or 'scikit-learn' in import_lower:
            return 'sklearn'
        elif 'tensorflow' in import_lower or 'tf' in import_lower:
            return 'tensorflow'
        elif 'pytorch' in import_lower or 'torch' in import_lower:
            return 'pytorch'
        else:
            return 'OTHER'


# Library information for the Libraries section
LIBRARY_INFO = {
    'numpy': {
        'description': 'Library numerical computation and N-dimensional arrays, mostly used in preprocessing.',
        'link': 'https://numpy.org/doc/1.19/',
    },
    'pandas': {
        'description': 'Library for data analysis and manipulation, mostly used in preprocessing to create dataframes.',
        'link': 'https://pandas.pydata.org/docs/',
    },
    'matplotlib': {
        'description': 'Library to create visualizations of data, mostly used for graphing.',
        'link': 'https://matplotlib.org/contents.html',
    },
    'sklearn': {
        'description': 'Machine learning framework, built on NumPy, mostly used for model training and evaluation.',
        'link': 'https://scikit-learn.org/stable/user_guide.html',
    },
    'tensorflow': {
        'description': 'Machine learning framework based on tensors, mostly used for model training and evaluation.',
        'link': 'https://www.tensorflow.org/api_docs',
    },
    'pytorch': {
        'description': 'Machine learning framework based on tensors, mostly used for model training and evaluation.',
        'link': 'https://pytorch.org/docs/stable/index.html',
    },
    'OTHER': {
        'description': '',
    },
}
