"use strict";
(self["webpackChunkdocml"] = self["webpackChunkdocml"] || []).push([["lib_index_js"],{

/***/ "./lib/components/ConfigEditor.js":
/*!****************************************!*\
  !*** ./lib/components/ConfigEditor.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfigEditor: () => (/* binding */ ConfigEditor)
/* harmony export */ });
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/DeleteOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/PlusOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/SaveOutlined.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! antd */ "webpack/sharing/consume/default/antd/antd");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);



/**
 * Component for editing modelcard.config sections
 */
const ConfigEditor = ({ visible, onClose, notebookPath, onSave, initialSections }) => {
    const [sections, setSections] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(initialSections);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
    const handleAddSection = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(() => {
        setSections([...sections, { section: 'New Section', description: '', example: [] }]);
    }, [sections]);
    const handleRemoveSection = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)((index) => {
        setSections(sections.filter((_, i) => i !== index));
    }, [sections]);
    const handleFieldChange = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)((index, field, value) => {
        const newSections = [...sections];
        if (field === 'example') {
            newSections[index][field] = value ? [value] : [];
        }
        else {
            newSections[index][field] = value;
        }
        setSections(newSections);
    }, [sections]);
    const handleSave = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(async () => {
        setLoading(true);
        try {
            await onSave(sections);
            antd__WEBPACK_IMPORTED_MODULE_3__.message.success('Configuration saved successfully! Refresh to see changes.');
            onClose();
        }
        catch (error) {
            antd__WEBPACK_IMPORTED_MODULE_3__.message.error('Failed to save configuration');
            console.error('Save error:', error);
        }
        finally {
            setLoading(false);
        }
    }, [sections, onSave, onClose]);
    const columns = [
        {
            title: 'Section Name',
            dataIndex: 'section',
            key: 'section',
            width: '30%',
            render: (text, record, index) => (react__WEBPACK_IMPORTED_MODULE_4___default().createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Input, { value: text, onChange: (e) => handleFieldChange(index, 'section', e.target.value), placeholder: "e.g., Data Cleaning, Model Training" }),
                react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Button, { type: "text", danger: true, size: "small", icon: react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_0__["default"], null), onClick: () => handleRemoveSection(index), title: "Delete section" }))),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (text, record, index) => (react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Input.TextArea, { value: text, onChange: (e) => handleFieldChange(index, 'description', e.target.value), placeholder: "Describe what this section should contain", rows: 2, autoSize: { minRows: 2, maxRows: 4 } })),
        },
        {
            title: 'Example URL',
            dataIndex: 'example',
            key: 'example',
            width: '30%',
            render: (examples, record, index) => (react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Input, { value: examples[0] || '', onChange: (e) => handleFieldChange(index, 'example', e.target.value), placeholder: "https://example.com" })),
        },
    ];
    const dataSource = sections.map((section, index) => ({
        ...section,
        key: index,
    }));
    return (react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Modal, { title: "Configure DocML Sections", open: visible, onCancel: onClose, width: 1000, footer: [
            react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Button, { key: "cancel", onClick: onClose }, "Cancel"),
            react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Button, { key: "add", type: "dashed", icon: react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_1__["default"], null), onClick: handleAddSection }, "Add Section"),
            react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Button, { key: "save", type: "primary", icon: react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_2__["default"], null), loading: loading, onClick: handleSave }, "Save Configuration"),
        ] },
        react__WEBPACK_IMPORTED_MODULE_4___default().createElement("div", { style: { marginBottom: 16 } },
            react__WEBPACK_IMPORTED_MODULE_4___default().createElement("p", null,
                "Configure sections for your DocML documentation. Changes will be saved to ",
                react__WEBPACK_IMPORTED_MODULE_4___default().createElement("code", null, "modelcard.config"),
                ".")),
        react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_3__.Table, { columns: columns, dataSource: dataSource, pagination: false, bordered: true, size: "small", scroll: { y: 400 } })));
};


/***/ }),

/***/ "./lib/components/DocMLDropdown.js":
/*!*****************************************!*\
  !*** ./lib/components/DocMLDropdown.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocMLDropdown: () => (/* binding */ DocMLDropdown)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! antd */ "webpack/sharing/consume/default/antd/antd");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/DownOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/FileTextOutlined.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/SettingOutlined.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _ConfigEditor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ConfigEditor */ "./lib/components/ConfigEditor.js");






/**
 * React component for the DocML dropdown button
 */
const DocMLDropdownContent = ({ onCreateModelCard, onOpenConfig }) => {
    const menuItems = [
        {
            key: 'create',
            label: 'Create',
            icon: react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_3__["default"], null),
            onClick: onCreateModelCard,
        },
        {
            key: 'config',
            label: 'Config',
            icon: react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_4__["default"], null),
            onClick: onOpenConfig,
        },
    ];
    return (react__WEBPACK_IMPORTED_MODULE_5___default().createElement(antd__WEBPACK_IMPORTED_MODULE_1__.Dropdown, { menu: { items: menuItems }, trigger: ['click'] },
        react__WEBPACK_IMPORTED_MODULE_5___default().createElement(antd__WEBPACK_IMPORTED_MODULE_1__.Button, { size: "small", type: "text", style: {
                padding: '0 8px',
                height: '24px',
                fontSize: '13px',
                fontFamily: 'var(--jp-ui-font-family)',
                color: 'var(--jp-ui-font-color1)',
                border: 'none',
            }, className: "jp-ToolbarButtonComponent" },
            "DocML ",
            react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_2__["default"], { style: { fontSize: '10px', marginLeft: '2px' } }))));
};
/**
 * ReactWidget for the DocML dropdown toolbar button
 */
class DocMLDropdown extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ReactWidget {
    constructor(panel, context, onCreateModelCard) {
        super();
        this._root = null;
        this._modalVisible = false;
        /**
         * Handle opening the config modal
         */
        this.handleOpenConfig = () => {
            this._modalVisible = true;
            this.update();
        };
        /**
         * Handle closing the config modal
         */
        this.handleCloseConfig = () => {
            this._modalVisible = false;
            this.update();
        };
        this._panel = panel;
        this._context = context;
        this._onCreateModelCard = onCreateModelCard;
        this.addClass('jp-docml-dropdown-button');
    }
    /**
     * Render the dropdown button
     */
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_5___default().createElement(DocMLDropdownContent, { panel: this._panel, onCreateModelCard: this._onCreateModelCard, onOpenConfig: this.handleOpenConfig }),
            this._modalVisible && (react__WEBPACK_IMPORTED_MODULE_5___default().createElement(ConfigEditorModal, { notebookPath: this._context.path, visible: this._modalVisible, onClose: this.handleCloseConfig }))));
    }
    /**
     * Update the widget
     */
    onUpdateRequest() {
        if (!this._root) {
            this._root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_6__.createRoot)(this.node);
        }
        this._root.render(this.render());
    }
}
const ConfigEditorModal = ({ notebookPath, visible, onClose }) => {
    const [initialSections, setInitialSections] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(true);
    const loadConfig = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(async () => {
        try {
            setLoading(true);
            const { requestAPI } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../handler */ "./lib/handler.js"));
            const response = await requestAPI('config?path=' + encodeURIComponent(notebookPath), {
                method: 'GET'
            });
            // If no sections exist, start with an empty array
            setInitialSections(response.sections || []);
        }
        catch (error) {
            console.error('Failed to load config:', error);
            // On error, start with empty sections
            setInitialSections([]);
        }
        finally {
            setLoading(false);
        }
    }, [notebookPath]);
    // Load existing config when modal opens
    react__WEBPACK_IMPORTED_MODULE_5___default().useEffect(() => {
        if (visible) {
            loadConfig();
        }
    }, [visible, loadConfig]);
    const saveConfig = (0,react__WEBPACK_IMPORTED_MODULE_5__.useCallback)(async (sections) => {
        const { requestAPI } = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../handler */ "./lib/handler.js"));
        await requestAPI('config', {
            body: JSON.stringify({
                path: notebookPath,
                config: { sections }
            }),
            method: 'POST'
        });
    }, [notebookPath]);
    // Don't render until config is loaded
    if (loading) {
        return null;
    }
    return (react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_ConfigEditor__WEBPACK_IMPORTED_MODULE_7__.ConfigEditor, { visible: visible, onClose: onClose, notebookPath: notebookPath, onSave: saveConfig, initialSections: initialSections }));
};


/***/ }),

/***/ "./lib/components/ExportButton.js":
/*!****************************************!*\
  !*** ./lib/components/ExportButton.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExportButton: () => (/* binding */ ExportButton)
/* harmony export */ });
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/ExclamationCircleOutlined.js");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! antd */ "webpack/sharing/consume/default/antd/antd");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks_useModelCardExport__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useModelCardExport */ "./lib/hooks/useModelCardExport.js");




/**
 * Button component for exporting model card to Markdown
 */
const ExportButton = react__WEBPACK_IMPORTED_MODULE_2___default().memo(({ context, docManager, data, }) => {
    const { exportToMarkdown, getEmptySections } = (0,_hooks_useModelCardExport__WEBPACK_IMPORTED_MODULE_3__.useModelCardExport)(context, docManager, data);
    const handleExport = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(() => {
        const emptySections = getEmptySections();
        if (emptySections.length > 0) {
            antd__WEBPACK_IMPORTED_MODULE_1__.Modal.confirm({
                title: 'The following sections are still empty!',
                icon: react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_0__["default"], null),
                content: [
                    emptySections.join(', '),
                    'Would you like to add the documentation before exporting?'
                ].join('.\n'),
                okText: 'Yes',
                cancelText: 'No (Proceed with exporting)',
                onOk() {
                    // User wants to go back and add documentation
                },
                onCancel() {
                    exportToMarkdown();
                },
            });
        }
        else {
            exportToMarkdown();
        }
    }, [exportToMarkdown, getEmptySections]);
    return (react__WEBPACK_IMPORTED_MODULE_2___default().createElement(antd__WEBPACK_IMPORTED_MODULE_1__.Button, { type: "primary", onClick: handleExport }, "Export to MD"));
});
ExportButton.displayName = 'ExportButton';


/***/ }),

/***/ "./lib/components/HelpText.js":
/*!************************************!*\
  !*** ./lib/components/HelpText.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! antd */ "webpack/sharing/consume/default/antd/antd");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Component for displaying example links for model card sections
 */
const HelpText = react__WEBPACK_IMPORTED_MODULE_1___default().memo(({ helpUrl }) => {
    const handleOpenUrl = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);
    const urls = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
        // Normalize helpUrl to array
        const urlArray = Array.isArray(helpUrl) ? helpUrl : [helpUrl];
        // Filter out empty strings and invalid URLs
        const validUrls = urlArray.filter(url => url && url.trim().length > 0);
        if (validUrls.length === 0) {
            return null;
        }
        return validUrls.map((url, idx) => (react__WEBPACK_IMPORTED_MODULE_1___default().createElement(antd__WEBPACK_IMPORTED_MODULE_0__.Button, { key: url, type: "link", style: { padding: "1px" }, onClick: () => handleOpenUrl(url), "aria-label": `Open example ${idx + 1}` },
            "[Example ",
            idx + 1,
            "]")));
    }, [helpUrl, handleOpenUrl]);
    return urls ? react__WEBPACK_IMPORTED_MODULE_1___default().createElement((react__WEBPACK_IMPORTED_MODULE_1___default().Fragment), null, urls) : null;
});
HelpText.displayName = 'HelpText';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HelpText);


/***/ }),

/***/ "./lib/components/ModelCardWidget.js":
/*!*******************************************!*\
  !*** ./lib/components/ModelCardWidget.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModelCardWidget: () => (/* binding */ ModelCardWidget)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_clone__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/clone */ "./node_modules/lodash/clone.js");
/* harmony import */ var lodash_clone__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_clone__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _Section__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Section */ "./lib/components/Section.js");





/**
 * ReactWidget that displays the model card interface in JupyterLab
 */
class ModelCardWidget extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ReactWidget {
    constructor(panel, docManager, response, createPanelHandler) {
        super();
        /** React root for rendering */
        this._root = null;
        this._notebook = panel.content;
        this._context = panel.context;
        this._docManager = docManager;
        this.serverResponse = response;
        this.createPanelHandler = createPanelHandler;
        this.addClass('jp-ReactWidget');
    }
    /**
     * Re-render the component every time an update is requested
     */
    onUpdateRequest() {
        if (!this._root) {
            this._root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_3__.createRoot)(this.node);
        }
        this._root.render(react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_Section__WEBPACK_IMPORTED_MODULE_4__["default"], { notebook: this._notebook, context: this._context, docManager: this._docManager, ServerResponse: this.serverResponse, handler: this.createPanelHandler }));
    }
    /**
     * Update the notebook reference
     */
    updateModel(panel) {
        this._notebook = lodash_clone__WEBPACK_IMPORTED_MODULE_1___default()(panel.content);
    }
    /**
     * Render the model card section component
     */
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_Section__WEBPACK_IMPORTED_MODULE_4__["default"], { notebook: this._notebook, context: this._context, docManager: this._docManager, ServerResponse: this.serverResponse, handler: this.createPanelHandler }));
    }
}


/***/ }),

/***/ "./lib/components/PopupWidget.js":
/*!***************************************!*\
  !*** ./lib/components/PopupWidget.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopupWidget: () => (/* binding */ PopupWidget)
/* harmony export */ });
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/DownOutlined.js");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! antd */ "webpack/sharing/consume/default/antd/antd");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_clone__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/clone */ "./node_modules/lodash/clone.js");
/* harmony import */ var lodash_clone__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_clone__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Pattern to match DocML stage comments in notebook cells
 * Format: # [docml] stage: <stage name>
 * TODO: Improve regex pattern for better fuzzy matching
 */
const STAGE_PATTERN = /(\[docml\] stage: )[\w ]*(.*)/;
/**
 * Dropdown component for selecting DocML stages
 */
const StageDropdown = react__WEBPACK_IMPORTED_MODULE_4___default().memo(({ notebook, sections }) => {
    const handleStageSelect = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)((stageId, stageName) => {
        if (!notebook.activeCell) {
            console.warn('No active cell');
            return;
        }
        const cellModel = notebook.activeCell.model;
        // Set stage metadata
        if (cellModel.metadata) {
            cellModel.metadata.set('stage', stageId);
        }
        // Add or update stage comment as visual hint
        if (cellModel.value && cellModel.value.text !== undefined) {
            const text = cellModel.value.text;
            const match = text.match(STAGE_PATTERN);
            if (match) {
                // Update existing stage comment
                cellModel.value.text = text.replace(STAGE_PATTERN, `$1${stageName}$2`);
            }
            else {
                // Add new stage comment
                cellModel.value.insert(0, `# [docml] stage: ${stageName}\n`);
            }
        }
    }, [notebook]);
    const menuItems = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => Array.from(sections.entries()).map(([stageId, stageName], idx) => ({
        key: idx.toString(),
        label: stageName,
        onClick: () => handleStageSelect(stageId, stageName)
    })), [handleStageSelect, sections]);
    return (react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_2__.Dropdown, { menu: { items: menuItems } },
        react__WEBPACK_IMPORTED_MODULE_4___default().createElement(antd__WEBPACK_IMPORTED_MODULE_2__.Button, null,
            "Select stage ",
            react__WEBPACK_IMPORTED_MODULE_4___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_0__["default"], null))));
});
StageDropdown.displayName = 'StageDropdown';
/**
 * ReactWidget wrapper for the stage dropdown component
 * Used in JupyterLab's popup system
 */
class PopupWidget extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ReactWidget {
    constructor(panel, serverResponse) {
        super();
        this._notebook = panel.content;
        this._sections = this._extractSections(serverResponse);
    }
    /**
     * Extract sections from server response to populate dropdown
     */
    _extractSections(serverResponse) {
        const sections = new Map();
        if (!serverResponse) {
            return sections;
        }
        // Extract all sections from the model card data
        Object.entries(serverResponse).forEach(([key, value]) => {
            // Skip special keys and ensure it's a section object
            if (key !== 'modelname' && key !== 'miscellaneous' && value && typeof value === 'object' && 'title' in value) {
                sections.set(key, value.title);
            }
        });
        // Add miscellaneous/ignore option
        sections.set('miscellaneous', 'Ignore');
        return sections;
    }
    /**
     * Update the notebook reference and sections
     */
    updateModel(panel, serverResponse) {
        this._notebook = lodash_clone__WEBPACK_IMPORTED_MODULE_3___default()(panel.content);
        if (serverResponse) {
            this._sections = this._extractSections(serverResponse);
        }
    }
    /**
     * Render the stage dropdown component
     */
    render() {
        return react__WEBPACK_IMPORTED_MODULE_4___default().createElement(StageDropdown, { notebook: this._notebook, sections: this._sections });
    }
}


/***/ }),

/***/ "./lib/components/QuickFix.js":
/*!************************************!*\
  !*** ./lib/components/QuickFix.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/icons/EditTwoTone.js");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/cells */ "webpack/sharing/consume/default/@jupyterlab/cells");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_cells__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! antd */ "webpack/sharing/consume/default/antd/antd");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "./lib/constants.js");
/* harmony import */ var _util_notebook_private__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/notebook_private */ "./lib/util/notebook_private.js");






/**
 * Generate markdown content for a new annotation cell
 */
const generateAnnotationContent = (name, title) => {
    return `# ${title}\n<!-- @md-${name} -->\n<!-- /md-${name} -->`;
};
/**
 * QuickFix component for adding or editing model card sections
 */
const QuickFix = react__WEBPACK_IMPORTED_MODULE_3___default().memo(({ sectionName, sectionTitle, annotMap, updateAnnotMap, notebook, idx }) => {
    const annotation = annotMap.get(sectionName);
    const existed = annotation !== undefined;
    const handleEditClick = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(() => {
        if (annotation) {
            (0,_util_notebook_private__WEBPACK_IMPORTED_MODULE_5__.jumpToCell)(notebook, annotation.idx);
        }
    }, [annotation, notebook]);
    const handleAddSection = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(() => {
        if (!notebook.model) {
            console.error('Notebook model not initialized');
            return;
        }
        const content = generateAnnotationContent(sectionName, sectionTitle);
        // JupyterLab 4.x API: Use sharedModel.insertCell with plain cell data
        if (notebook.model.sharedModel && typeof notebook.model.sharedModel.insertCell === 'function') {
            // Create plain cell data object for JupyterLab 4.x
            const cellData = {
                cell_type: 'markdown',
                source: content,
                metadata: {}
            };
            notebook.model.sharedModel.insertCell(idx, cellData);
        }
        // Fallback for JupyterLab 3.x: Use model.cells.insert
        else if (notebook.model.cells.insert && typeof notebook.model.cells.insert === 'function') {
            const mdCell = new _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_1__.MarkdownCellModel();
            notebook.model.cells.insert(idx, mdCell);
            // Set content after insertion
            if (mdCell.value && typeof mdCell.value.insert === 'function') {
                mdCell.value.insert(0, content);
            }
        }
        else {
            console.error('Unable to insert cell - no compatible API found');
            return;
        }
        updateAnnotMap(draft => {
            draft.set(sectionName, { idx, content: '' });
        });
        (0,_util_notebook_private__WEBPACK_IMPORTED_MODULE_5__.jumpToCell)(notebook, idx);
    }, [notebook, idx, sectionName, sectionTitle, updateAnnotMap]);
    if (existed) {
        return (react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_0__["default"], { style: { fontSize: "65%", paddingRight: "1px" }, onClick: handleEditClick }));
    }
    return (react__WEBPACK_IMPORTED_MODULE_3___default().createElement(antd__WEBPACK_IMPORTED_MODULE_2__.Popconfirm, { title: `Add a ${_constants__WEBPACK_IMPORTED_MODULE_4__.stages.has(sectionName) ? 'description' : 'new cell'} for ${sectionTitle}?`, onConfirm: handleAddSection, okText: "Yes", cancelText: "No" },
        react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_ant_design_icons__WEBPACK_IMPORTED_MODULE_0__["default"], { style: { fontSize: "65%", paddingRight: "1px" } })));
});
QuickFix.displayName = 'QuickFix';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QuickFix);


/***/ }),

/***/ "./lib/components/Section.js":
/*!***********************************!*\
  !*** ./lib/components/Section.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! antd */ "webpack/sharing/consume/default/antd/antd");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(antd__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! immer */ "webpack/sharing/consume/default/immer/immer?be30");
/* harmony import */ var immer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(immer__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-markdown */ "webpack/sharing/consume/default/react-markdown/react-markdown");
/* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_markdown__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! styled-components */ "webpack/sharing/consume/default/styled-components/styled-components");
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(styled_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants */ "./lib/constants.js");
/* harmony import */ var _hooks_useModelCardData__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/useModelCardData */ "./lib/hooks/useModelCardData.js");
/* harmony import */ var _util_notebook_private__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../util/notebook_private */ "./lib/util/notebook_private.js");
/* harmony import */ var _ExportButton__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ExportButton */ "./lib/components/ExportButton.js");
/* harmony import */ var _HelpText__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./HelpText */ "./lib/components/HelpText.js");
/* harmony import */ var _QuickFix__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./QuickFix */ "./lib/components/QuickFix.js");











(0,immer__WEBPACK_IMPORTED_MODULE_1__.enableMapSet)();
const getJumpIndex = (sectionName, sectionContent) => {
    if (sectionName === "author") {
        return 1;
    }
    // if it's a stage, jump to the top cell if existed
    const stageContent = sectionContent;
    if (_constants__WEBPACK_IMPORTED_MODULE_5__.stages.has(sectionName) && stageContent.cell_ids && stageContent.cell_ids.length > 0) {
        return stageContent.cell_ids[0];
    }
    // otherwise insert to top
    return 0;
};
const Bar = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().div) `
  position: relative;
  background: aliceblue;
  width: 40%;
  height: 20px;
  border-radius: 5px;
`;
const VerticalLine = (styled_components__WEBPACK_IMPORTED_MODULE_4___default().div) `
  position: absolute;
  left: ${(props) => props.left}%;
  height: 100%;
  width: 2px;
  background-color: lightskyblue;
  border-radius: 5px;
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    transform: scale(2, 1.5);
    background-color: #1890ff;
    z-index: 2;
    cursor: pointer;
  }
`;
/**
 * Memoized component for rendering individual model card sections
 */
const SectionContent = react__WEBPACK_IMPORTED_MODULE_2___default().memo(({ notebook, sectionName, sectionContent, quickFix, }) => {
    if (typeof sectionContent !== "object") {
        return null;
    }
    return (react__WEBPACK_IMPORTED_MODULE_2___default().createElement((react__WEBPACK_IMPORTED_MODULE_2___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_2___default().createElement("h1", null,
            react__WEBPACK_IMPORTED_MODULE_2___default().createElement(antd__WEBPACK_IMPORTED_MODULE_0__.Tooltip, { title: sectionContent.tooltip, placement: "rightTop" },
                sectionContent.title,
                " ",
                quickFix,
                react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_HelpText__WEBPACK_IMPORTED_MODULE_9__["default"], { toolTipContent: sectionContent.tooltip, helpUrl: sectionContent.helpurl }))),
        react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", { style: { display: "block" } },
            react__WEBPACK_IMPORTED_MODULE_2___default().createElement((react_markdown__WEBPACK_IMPORTED_MODULE_3___default()), null, sectionContent.description)),
        react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", { style: { display: "block" } }, sectionName !== "modelname" &&
            "cell_ids" in sectionContent &&
            sectionContent.cell_ids.length > 0 &&
            notebook.model &&
            notebook.model.cells ? (react__WEBPACK_IMPORTED_MODULE_2___default().createElement(Bar, null, sectionContent.cell_ids.map((cid, idx) => (react__WEBPACK_IMPORTED_MODULE_2___default().createElement(VerticalLine, { key: idx, left: (cid / notebook.model.cells.length) * 100, onClick: () => (0,_util_notebook_private__WEBPACK_IMPORTED_MODULE_7__.jumpToCell)(notebook, cid - 1) }))))) : null),
        "figures" in sectionContent
            ? sectionContent.figures.map((src, idx) => {
                // console.log(sectionName + ' ' + sectionContent.figures.length);
                return (react__WEBPACK_IMPORTED_MODULE_2___default().createElement("img", { style: { display: "block" }, key: idx, src: `data:image/png;base64,${src}` }));
            })
            : null));
});
SectionContent.displayName = 'SectionContent';
/**
 * Main Section component that displays the model card interface
 */
const Section = react__WEBPACK_IMPORTED_MODULE_2___default().memo(({ notebook, context, docManager, ServerResponse, handler }) => {
    // Use custom hook for managing model card data and annotations
    const { data, annotMap, updateAnnotMap } = (0,_hooks_useModelCardData__WEBPACK_IMPORTED_MODULE_6__.useModelCardData)(notebook, ServerResponse);
    // TODO: let user decide the name of the output file
    // TODO: test for files in a subdirectory
    return (react__WEBPACK_IMPORTED_MODULE_2___default().createElement((react__WEBPACK_IMPORTED_MODULE_2___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_2___default().createElement(antd__WEBPACK_IMPORTED_MODULE_0__.Row, { style: { position: "sticky", top: 10, float: "right" } },
            react__WEBPACK_IMPORTED_MODULE_2___default().createElement(antd__WEBPACK_IMPORTED_MODULE_0__.Space, null,
                react__WEBPACK_IMPORTED_MODULE_2___default().createElement(antd__WEBPACK_IMPORTED_MODULE_0__.Col, { span: 6 },
                    react__WEBPACK_IMPORTED_MODULE_2___default().createElement(antd__WEBPACK_IMPORTED_MODULE_0__.Button, { type: "primary", onClick: handler }, "Refresh")),
                react__WEBPACK_IMPORTED_MODULE_2___default().createElement(antd__WEBPACK_IMPORTED_MODULE_0__.Col, { span: 6 },
                    react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_ExportButton__WEBPACK_IMPORTED_MODULE_8__.ExportButton, { context: context, docManager: docManager, data: data })))),
        Object.entries(data).map(([sectionName, sectionContent], idx) => {
            if (sectionName === "miscellaneous" || !sectionContent) {
                return null;
            }
            const content = sectionContent;
            return (react__WEBPACK_IMPORTED_MODULE_2___default().createElement(SectionContent, { key: idx, notebook: notebook, sectionName: sectionName, sectionContent: content, quickFix: react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_QuickFix__WEBPACK_IMPORTED_MODULE_10__["default"], { sectionName: sectionName, sectionTitle: content.title, annotMap: annotMap, updateAnnotMap: updateAnnotMap, notebook: notebook, idx: getJumpIndex(sectionName, content) }) }));
        })));
});
Section.displayName = 'Section';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Section);


/***/ }),

/***/ "./lib/constants.js":
/*!**************************!*\
  !*** ./lib/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   commandModifyStage: () => (/* binding */ commandModifyStage),
/* harmony export */   commandShowModelCard: () => (/* binding */ commandShowModelCard),
/* harmony export */   createModelCard: () => (/* binding */ createModelCard),
/* harmony export */   endTag: () => (/* binding */ endTag),
/* harmony export */   extensionCaption: () => (/* binding */ extensionCaption),
/* harmony export */   extensionCategory: () => (/* binding */ extensionCategory),
/* harmony export */   modelCardExtensionID: () => (/* binding */ modelCardExtensionID),
/* harmony export */   modelCardNotebookId: () => (/* binding */ modelCardNotebookId),
/* harmony export */   modelCardWidgetID: () => (/* binding */ modelCardWidgetID),
/* harmony export */   stages: () => (/* binding */ stages),
/* harmony export */   startTag: () => (/* binding */ startTag)
/* harmony export */ });
const modelCardExtensionID = 'model-card-extension';
const modelCardWidgetID = 'model-card-extension:widget';
const modelCardNotebookId = 'model-card-extension:notebook';
const extensionCategory = 'DocML';
const extensionCaption = 'DocML';
const createModelCard = 'create-model-card';
const commandShowModelCard = 'show-model-card';
const commandModifyStage = 'modify-model-card-stage';
/** Stage keys for quickfix */
const stages = new Map([
    ['plotting', 'Plotting'],
    ['datacleaning', 'Data Cleaning'],
    ['preprocessing', 'Preprocessing'],
    ['hyperparameters', 'Hyperparameters'],
    ['modeltraining', 'Model Training'],
    ['modelevaluation', 'Model Evaluation'],
    ['miscellaneous', 'Ignore']
]);
const startTag = (name) => `<!-- @md-${name} -->`;
const endTag = (name) => `<!-- /md-${name} -->`;


/***/ }),

/***/ "./lib/handler.js":
/*!************************!*\
  !*** ./lib/handler.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   requestAPI: () => (/* binding */ requestAPI)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
async function requestAPI(endPoint = '', init = {}) {
    // Make request to Jupyter API
    const settings = _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeSettings();
    const requestUrl = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.URLExt.join(settings.baseUrl, 'docml', endPoint);
    let response;
    try {
        response = await _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.makeRequest(requestUrl, init, settings);
    }
    catch (error) {
        throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.NetworkError(error);
    }
    const data = await response.json();
    if (!response.ok) {
        throw new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_1__.ServerConnection.ResponseError(response, data.message);
    }
    return data;
}


/***/ }),

/***/ "./lib/hooks/useModelCardData.js":
/*!***************************************!*\
  !*** ./lib/hooks/useModelCardData.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useModelCardData: () => (/* binding */ useModelCardData)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var use_immer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! use-immer */ "webpack/sharing/consume/default/use-immer/use-immer");
/* harmony import */ var use_immer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(use_immer__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "./lib/constants.js");
/* harmony import */ var _util_mdExtractor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/mdExtractor */ "./lib/util/mdExtractor.js");




/**
 * Custom hook for managing model card data and annotations
 */
const useModelCardData = (notebook, serverResponse) => {
    const [annotMap, updateAnnotMap] = (0,use_immer__WEBPACK_IMPORTED_MODULE_1__.useImmer)(new Map());
    const [data, updateData] = (0,use_immer__WEBPACK_IMPORTED_MODULE_1__.useImmer)({});
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const amap = (0,_util_mdExtractor__WEBPACK_IMPORTED_MODULE_3__.getAnnotMap)(notebook);
        const modelCard = JSON.parse(JSON.stringify(serverResponse));
        // Update descriptions from annotation map
        amap.forEach((value, key) => {
            if (key in modelCard) {
                const section = modelCard[key];
                if (section && 'description' in section) {
                    section.description = value.content;
                }
            }
        });
        updateData(() => modelCard);
        // Add tag for title field
        const titleKey = "modelname";
        const modelnameSection = modelCard[titleKey];
        if (modelnameSection &&
            'description' in modelnameSection &&
            modelnameSection.description !== undefined &&
            !amap.has(titleKey)) {
            const firstCell = notebook.model?.cells.get(0);
            if (firstCell) {
                const titleCell = firstCell.value;
                if (titleCell && typeof titleCell.insert === 'function') {
                    titleCell.insert(0, `${(0,_constants__WEBPACK_IMPORTED_MODULE_2__.startTag)(titleKey)}\n`);
                    titleCell.insert(titleCell.text.length, `\n${(0,_constants__WEBPACK_IMPORTED_MODULE_2__.endTag)(titleKey)}`);
                    amap.set(titleKey, {
                        idx: 0,
                        content: modelnameSection.description,
                    });
                }
            }
        }
        updateAnnotMap(() => amap);
    }, [notebook, serverResponse, updateAnnotMap, updateData]);
    return {
        data,
        annotMap,
        updateAnnotMap,
    };
};


/***/ }),

/***/ "./lib/hooks/useModelCardExport.js":
/*!*****************************************!*\
  !*** ./lib/hooks/useModelCardExport.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useModelCardExport: () => (/* binding */ useModelCardExport)
/* harmony export */ });
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util */ "./lib/util/index.js");



/**
 * Custom hook for handling model card export functionality
 */
const useModelCardExport = (context, docManager, data) => {
    const exportToMarkdown = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
        const dirname = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PathExt.dirname(context.path);
        let fileName = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PathExt.basename(context.path);
        fileName = fileName.split(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PathExt.extname(fileName))[0];
        fileName = fileName.split(" ").join("_");
        fileName = "card_" + fileName + ".md";
        const filePath = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_0__.PathExt.join(dirname, fileName);
        const markdownContent = (0,_util__WEBPACK_IMPORTED_MODULE_2__.generateMarkdown)(data);
        let mdFile = docManager.findWidget(filePath, "Editor");
        if (mdFile === undefined) {
            mdFile = docManager.createNew(filePath, "Editor");
        }
        if (mdFile && mdFile.context) {
            void mdFile.context.ready.then(() => {
                try {
                    // Try multiple APIs for JupyterLab 4.x compatibility
                    const model = mdFile.content?.model;
                    if (!model) {
                        console.error('Export failed: Model not found');
                        return;
                    }
                    // JupyterLab 4.x: Try sharedModel first
                    if (model.sharedModel && typeof model.sharedModel.setSource === 'function') {
                        model.sharedModel.setSource(markdownContent);
                    }
                    // JupyterLab 3.x/4.x: Try value.text
                    else if (model.value && typeof model.value.insert === 'function') {
                        // Clear existing content first
                        if (model.value.text && model.value.text.length > 0) {
                            model.value.remove(0, model.value.text.length);
                        }
                        model.value.insert(0, markdownContent);
                    }
                    // Fallback: Try direct assignment
                    else if (model.value) {
                        model.value.text = markdownContent;
                    }
                    else {
                        console.error('Export failed: Unable to set content - no compatible API found');
                    }
                }
                catch (error) {
                    console.error('Export error:', error);
                }
            });
        }
        void docManager.openOrReveal(filePath, 'Markdown Preview');
    }, [context.path, docManager, data]);
    const getEmptySections = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
        const emptySections = [];
        Object.entries(data).forEach(([, sectionContent]) => {
            if (sectionContent &&
                typeof sectionContent === 'object' &&
                'description' in sectionContent &&
                'title' in sectionContent) {
                if (!sectionContent.description) {
                    if (!['#', 'Miscellaneous'].includes(sectionContent.title)) {
                        emptySections.push(sectionContent.title);
                    }
                }
            }
        });
        return emptySections;
    }, [data]);
    return {
        exportToMarkdown,
        getEmptySections,
    };
};


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./lib/constants.js");
/* harmony import */ var _panel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./panel */ "./lib/panel.js");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_DocMLDropdown__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/DocMLDropdown */ "./lib/components/DocMLDropdown.js");







function makeid(length) {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/**
 * A notebook widget extension that adds a DocML dropdown button to the toolbar.
 */
class ModelCardButton {
    constructor(app, docManager) {
        this._app = app;
        this._docManager = docManager;
    }
    /**
     * Register the context menu command for changing stages
     */
    registerStageCommand() {
        if (!this._app.commands.hasCommand(_constants__WEBPACK_IMPORTED_MODULE_3__.commandModifyStage)) {
            this._app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_3__.commandModifyStage, {
                label: "[DocML] Change stage to...",
                execute: () => {
                    this._modelCardPanel?.launchPanel();
                },
            });
            this._app.contextMenu.addItem({
                command: _constants__WEBPACK_IMPORTED_MODULE_3__.commandModifyStage,
                selector: ".jp-CodeCell",
            });
        }
    }
    /**
     * Create and configure a new ModelCardPanel
     */
    createModelCardPanel(panel, modelCardTitle, createPanel) {
        const modelCardPanel = new _panel__WEBPACK_IMPORTED_MODULE_4__.ModelCardPanel(this._app, this._docManager, makeid(10), modelCardTitle, createPanel);
        modelCardPanel.setContext(this._context);
        modelCardPanel.setPanel(panel);
        this.registerStageCommand();
        this._app.docRegistry.addWidgetExtension("Notebook", modelCardPanel);
        return modelCardPanel;
    }
    /**
     * Show the model card panel in the shell
     */
    showPanel(modelCardPanel) {
        this._app.shell.add(modelCardPanel, "main", { mode: "split-right" });
        this._app.shell.activateById(modelCardPanel.id);
        modelCardPanel.update();
    }
    /**
     * Update panel context and refresh
     */
    updatePanelContext(modelCardPanel, panel) {
        modelCardPanel.setContext(this._context);
        modelCardPanel.setPanel(panel);
        modelCardPanel.update();
    }
    /**
     * Create a new extension object.
     */
    createNew(panel, context) {
        let modelCardPanel;
        const createPanel = () => {
            context.ready.then(() => {
                this._context = context;
                // Generate model card title from notebook path
                let modelCardTitle = _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_5__.PathExt.basename(context.path);
                modelCardTitle = modelCardTitle.split(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_5__.PathExt.extname(modelCardTitle))[0];
                modelCardTitle = modelCardTitle.split(" ").join("_") + ".modelcard";
                // Handle different panel states
                if (!modelCardPanel) {
                    // Create new panel
                    modelCardPanel = this.createModelCardPanel(panel, modelCardTitle, createPanel);
                    this._modelCardPanel = modelCardPanel;
                    this.showPanel(modelCardPanel);
                }
                else if (!modelCardPanel.isAttached) {
                    // Reattach detached panel
                    this.updatePanelContext(modelCardPanel, panel);
                    this._modelCardPanel = modelCardPanel;
                    this.showPanel(modelCardPanel);
                }
                else if (!modelCardPanel.isVisible) {
                    // Show hidden panel
                    this.updatePanelContext(modelCardPanel, panel);
                    this._modelCardPanel = modelCardPanel;
                    this._app.shell.activateById(modelCardPanel.id);
                }
                else if (this._app.shell.currentWidget === modelCardPanel) {
                    // Recreate panel if it's the current widget (toggle behavior)
                    this._app.shell.currentWidget.dispose();
                    modelCardPanel = this.createModelCardPanel(panel, modelCardTitle, createPanel);
                    this._modelCardPanel = modelCardPanel;
                    this.showPanel(modelCardPanel);
                }
                else {
                    // Update existing visible panel
                    this.updatePanelContext(modelCardPanel, panel);
                }
            });
        };
        // Add DocML dropdown button
        const dropdownButton = new _components_DocMLDropdown__WEBPACK_IMPORTED_MODULE_6__.DocMLDropdown(panel, context, createPanel);
        dropdownButton.update();
        panel.toolbar.insertItem(0, "docmlDropdown", dropdownButton);
        if (!this._app.commands.hasCommand(_constants__WEBPACK_IMPORTED_MODULE_3__.createModelCard)) {
            this._app.commands.addCommand(_constants__WEBPACK_IMPORTED_MODULE_3__.createModelCard, {
                label: _constants__WEBPACK_IMPORTED_MODULE_3__.extensionCategory,
                caption: _constants__WEBPACK_IMPORTED_MODULE_3__.extensionCaption,
                isVisible: () => false,
                execute: createPanel,
            });
        }
        return dropdownButton;
    }
}
/**
 * Initialization data for the docml extension.
 */
const extension = {
    id: _constants__WEBPACK_IMPORTED_MODULE_3__.modelCardExtensionID,
    autoStart: true,
    requires: [_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_2__.IDocumentManager, _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILayoutRestorer],
    activate: (app, docManager, restorer) => {
        console.log("JupyterLab extension jlcards is activated!");
        const tracker = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.WidgetTracker({
            namespace: "model-card",
        });
        restorer.restore(tracker, {
            command: _constants__WEBPACK_IMPORTED_MODULE_3__.createModelCard,
            name: () => "model-card",
        });
        const modelCardButton = new ModelCardButton(app, docManager);
        app.docRegistry.addWidgetExtension("Notebook", modelCardButton);
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (extension);


/***/ }),

/***/ "./lib/panel.js":
/*!**********************!*\
  !*** ./lib/panel.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModelCardPanel: () => (/* binding */ ModelCardPanel)
/* harmony export */ });
/* harmony import */ var _jupyterlab_statusbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/statusbar */ "webpack/sharing/consume/default/@jupyterlab/statusbar");
/* harmony import */ var _jupyterlab_statusbar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statusbar__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_disposable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/disposable */ "webpack/sharing/consume/default/@lumino/disposable");
/* harmony import */ var _lumino_disposable__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_disposable__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_ModelCardWidget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/ModelCardWidget */ "./lib/components/ModelCardWidget.js");
/* harmony import */ var _components_PopupWidget__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/PopupWidget */ "./lib/components/PopupWidget.js");
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./handler */ "./lib/handler.js");






class ModelCardPanel extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.StackedPanel {
    constructor(app, docManager, modelCardId, modelCardTitle, parent) {
        super();
        this._view = null;
        this._popup = null;
        this._panel = null;
        this._context = null;
        this._serverResponse = null;
        this._app = app;
        this._docManager = docManager;
        this.id = modelCardId;
        this.title.label = modelCardTitle;
        this.title.closable = true;
        this._createPanelHandler = parent;
    }
    onUpdateRequest() {
        if (!this._context) {
            console.error('Context not initialized');
            return;
        }
        if (this._view) {
            void this.updateView(this._context.localPath);
        }
        else {
            void this.createView(this._context.localPath);
        }
    }
    setContext(context) {
        this._context = context;
    }
    setPanel(panel) {
        this._panel = panel;
    }
    getPopup() {
        return this._popup;
    }
    async getData(path) {
        const dataToSend = {
            path: path,
        };
        try {
            const reply = await (0,_handler__WEBPACK_IMPORTED_MODULE_5__.requestAPI)("hello", {
                body: JSON.stringify(dataToSend),
                method: "POST",
            });
            return reply;
        }
        catch (reason) {
            console.error(`Error on POST /docml/hello ${dataToSend}.\n${reason}`);
            alert("DocML ran into errors. Generation Failed.");
            throw new Error(`Model card generation failed: ${String(reason)}`);
        }
    }
    async updateView(path) {
        if (!this._panel) {
            console.error('Panel not initialized');
            return;
        }
        try {
            const reply = await this.getData(path);
            this._serverResponse = reply;
            this._view = new _components_ModelCardWidget__WEBPACK_IMPORTED_MODULE_3__.ModelCardWidget(this._panel, this._docManager, reply, this._createPanelHandler);
            this._view.updateModel(this._panel);
            this._view.update();
            this._popup = new _components_PopupWidget__WEBPACK_IMPORTED_MODULE_4__.PopupWidget(this._panel, reply);
            this._popup.updateModel(this._panel, reply);
        }
        catch (error) {
            console.error('Failed to update view:', error);
        }
    }
    launchPanel() {
        if (!this._popup || !this._panel) {
            console.error('Popup or panel not initialized');
            return;
        }
        const activeCell = this._panel.content.activeCell;
        if (!activeCell) {
            console.warn('No active cell');
            return;
        }
        this._popup.updateModel(this._panel, this._serverResponse || undefined);
        const popup = new _jupyterlab_statusbar__WEBPACK_IMPORTED_MODULE_0__.Popup({
            body: this._popup,
            anchor: activeCell,
            align: "right",
        });
        popup.launch();
    }
    async createView(path) {
        if (!this._panel) {
            console.error('Panel not initialized');
            return;
        }
        try {
            const reply = await this.getData(path);
            this._serverResponse = reply;
            this._view = new _components_ModelCardWidget__WEBPACK_IMPORTED_MODULE_3__.ModelCardWidget(this._panel, this._docManager, reply, this._createPanelHandler);
            this.addWidget(this._view);
            this._popup = new _components_PopupWidget__WEBPACK_IMPORTED_MODULE_4__.PopupWidget(this._panel, reply);
            this._view.updateModel(this._panel);
            this._popup.updateModel(this._panel, reply);
        }
        catch (error) {
            console.error('Failed to create view:', error);
        }
    }
    createNew() {
        return new _lumino_disposable__WEBPACK_IMPORTED_MODULE_1__.DisposableDelegate(() => {
            if (this.widgets) {
                this.widgets.forEach((widget) => {
                    if (!widget.isDisposed) {
                        widget.dispose();
                    }
                });
            }
            if (this._popup && !this._popup.isDisposed) {
                this._popup.dispose();
            }
        });
    }
}


/***/ }),

/***/ "./lib/util/index.js":
/*!***************************!*\
  !*** ./lib/util/index.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateMarkdown: () => (/* binding */ generateMarkdown)
/* harmony export */ });
/**
 * Generate Markdown for a given model card
 */
const generateMarkdown = (data) => {
    let result = '';
    Object.entries(data).forEach(([sectionName, sectionContent]) => {
        if (sectionName === 'miscellaneous') {
            return;
        }
        if (sectionName === 'modelname') {
            result += `${sectionContent.description}\n`;
            return;
        }
        const hasDescription = sectionContent.description && typeof sectionContent.description === 'string' && sectionContent.description.trim();
        const hasFigure = sectionContent.figures && sectionContent.figures.length;
        if (hasDescription || hasFigure) {
            result += `## ${sectionContent.title}\n`;
        }
        if (hasDescription) {
            result += `${sectionContent.description}\n`;
        }
        if (hasFigure) {
            sectionContent.figures.forEach((figure, idx) => 
            // (result += `![figure${idx}](data:image/png;base64,${figure}`)
            (result += `<img alt="figure${idx}" src="data:image/png;base64, ${figure}">\n`));
        }
    });
    return result;
};


/***/ }),

/***/ "./lib/util/mdExtractor.js":
/*!*********************************!*\
  !*** ./lib/util/mdExtractor.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAnnotMap: () => (/* binding */ getAnnotMap)
/* harmony export */ });
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/algorithm */ "webpack/sharing/consume/default/@lumino/algorithm");
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_algorithm__WEBPACK_IMPORTED_MODULE_0__);

const start = /<!--\s*@md-(\w*)\s*-->/;
const content = /<!--\s*@md-\w*\s*-->([\s\S]*)<!--\s*\/md-\w*\s*-->/;
const getAnnotMap = (nb) => {
    const annotMap = new Map();
    if (!nb.model || !nb.model.cells) {
        return annotMap;
    }
    (0,_lumino_algorithm__WEBPACK_IMPORTED_MODULE_0__.each)(nb.model.cells, (cell, idx) => {
        if (cell.type === 'markdown') {
            const cellModel = cell;
            if (cellModel.value && cellModel.value.text) {
                const m = cellModel.value.text.match(start);
                const contentMatch = cellModel.value.text.match(content);
                if (m && contentMatch) {
                    annotMap.set(m[1], { idx, content: contentMatch[1] });
                }
            }
        }
    });
    return annotMap;
};


/***/ }),

/***/ "./lib/util/notebook_private.js":
/*!**************************************!*\
  !*** ./lib/util/notebook_private.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _ensureFocus: () => (/* binding */ _ensureFocus),
/* harmony export */   _findCell: () => (/* binding */ _findCell),
/* harmony export */   jumpToCell: () => (/* binding */ jumpToCell),
/* harmony export */   scrollToCell: () => (/* binding */ scrollToCell)
/* harmony export */ });
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/algorithm */ "webpack/sharing/consume/default/@lumino/algorithm");
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_algorithm__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_domutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/domutils */ "webpack/sharing/consume/default/@lumino/domutils");
/* harmony import */ var _lumino_domutils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_domutils__WEBPACK_IMPORTED_MODULE_1__);
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.


/**
 * Ensure that the notebook has proper focus.
 */
function _ensureFocus(notebook, force = false) {
    const activeCell = notebook.activeCell;
    if (notebook.mode === 'edit' && activeCell && activeCell.editor) {
        if (!activeCell.editor.hasFocus()) {
            activeCell.editor.focus();
        }
    }
    if (force && !notebook.node.contains(document.activeElement)) {
        notebook.node.focus();
    }
}
/**
 * The class name added to notebook widget cells.
 */
const NB_CELL_CLASS = 'jp-Notebook-cell';
/**
 * Find the cell index containing the target html element.
 *
 * #### Notes
 * Returns -1 if the cell is not found.
 */
function _findCell(notebook, node) {
    // Trace up the DOM hierarchy to find the root cell node.
    // Then find the corresponding child and select it.
    while (node && node !== notebook.node) {
        if (node.classList.contains(NB_CELL_CLASS)) {
            const i = _lumino_algorithm__WEBPACK_IMPORTED_MODULE_0__.ArrayExt.findFirstIndex(notebook.widgets, widget => widget.node === node);
            if (i !== -1) {
                return i;
            }
            break;
        }
        node = node.parentElement;
    }
    return -1;
}
function scrollToCell(notebook, cell) {
    // use Phosphor to scroll
    _lumino_domutils__WEBPACK_IMPORTED_MODULE_1__.ElementExt.scrollIntoViewIfNeeded(notebook.node, cell.node);
    // change selection and active cell:
    notebook.deselectAll();
    notebook.select(cell);
    cell.activate();
}
const jumpToCell = (notebook, idx) => {
    setTimeout(() => {
        notebook.deselectAll();
        notebook.activeCellIndex = idx;
        _ensureFocus(notebook);
        notebook.mode = 'edit';
        if (notebook.activeCell) {
            scrollToCell(notebook, notebook.activeCell);
        }
    }, 0);
};



/***/ })

}]);
//# sourceMappingURL=lib_index_js.fa7a0390d16e6edb767b.js.map