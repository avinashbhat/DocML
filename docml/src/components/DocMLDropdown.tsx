import { ReactWidget } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { INotebookModel, NotebookPanel } from '@jupyterlab/notebook';
import { Button, Dropdown } from 'antd';
import { DownOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import React, { useState, useCallback } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ConfigEditor } from './ConfigEditor';

interface IDocMLDropdownContentProps {
  panel: NotebookPanel;
  onCreateModelCard: () => void;
  onOpenConfig: () => void;
}

/**
 * React component for the DocML dropdown button
 */
const DocMLDropdownContent: React.FC<IDocMLDropdownContentProps> = ({
  onCreateModelCard,
  onOpenConfig
}) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'create',
      label: 'Create',
      icon: <FileTextOutlined />,
      onClick: onCreateModelCard,
    },
    {
      key: 'config',
      label: 'Config',
      icon: <SettingOutlined />,
      onClick: onOpenConfig,
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
      <Button
        size="small"
        type="text"
        style={{
          padding: '0 8px',
          height: '24px',
          fontSize: '13px',
          fontFamily: 'var(--jp-ui-font-family)',
          color: 'var(--jp-ui-font-color1)',
          border: 'none',
        }}
        className="jp-ToolbarButtonComponent"
      >
        DocML <DownOutlined style={{ fontSize: '10px', marginLeft: '2px' }} />
      </Button>
    </Dropdown>
  );
};

/**
 * ReactWidget for the DocML dropdown toolbar button
 */
export class DocMLDropdown extends ReactWidget {
  private _panel: NotebookPanel;
  private _context: DocumentRegistry.IContext<INotebookModel>;
  private _onCreateModelCard: () => void;
  private _root: Root | null = null;
  private _modalVisible: boolean = false;

  constructor(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>,
    onCreateModelCard: () => void
  ) {
    super();
    this._panel = panel;
    this._context = context;
    this._onCreateModelCard = onCreateModelCard;
    this.addClass('jp-docml-dropdown-button');
  }

  /**
   * Handle opening the config modal
   */
  private handleOpenConfig = () => {
    this._modalVisible = true;
    this.update();
  };

  /**
   * Handle closing the config modal
   */
  private handleCloseConfig = () => {
    this._modalVisible = false;
    this.update();
  };

  /**
   * Render the dropdown button
   */
  render(): JSX.Element {
    return (
      <div>
        <DocMLDropdownContent
          panel={this._panel}
          onCreateModelCard={this._onCreateModelCard}
          onOpenConfig={this.handleOpenConfig}
        />
        {this._modalVisible && (
          <ConfigEditorModal
            notebookPath={this._context.path}
            visible={this._modalVisible}
            onClose={this.handleCloseConfig}
          />
        )}
      </div>
    );
  }

  /**
   * Update the widget
   */
  onUpdateRequest(): void {
    if (!this._root) {
      this._root = createRoot(this.node);
    }
    this._root.render(this.render());
  }
}

/**
 * Wrapper component for the config editor modal
 */
interface IConfigEditorModalProps {
  notebookPath: string;
  visible: boolean;
  onClose: () => void;
}

interface IConfigSection {
  section: string;
  description: string;
  example: string[];
}

const ConfigEditorModal: React.FC<IConfigEditorModalProps> = ({
  notebookPath,
  visible,
  onClose
}) => {
  const [initialSections, setInitialSections] = useState<IConfigSection[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const { requestAPI } = await import('../handler');
      const response = await requestAPI<{ sections: IConfigSection[] }>('config?path=' + encodeURIComponent(notebookPath), {
        method: 'GET'
      });

      // If no sections exist, start with an empty array
      setInitialSections(response.sections || []);
    } catch (error) {
      console.error('Failed to load config:', error);
      // On error, start with empty sections
      setInitialSections([]);
    } finally {
      setLoading(false);
    }
  }, [notebookPath]);

  // Load existing config when modal opens
  React.useEffect(() => {
    if (visible) {
      loadConfig();
    }
  }, [visible, loadConfig]);

  const saveConfig = useCallback(async (sections: any[]) => {
    const { requestAPI } = await import('../handler');
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

  return (
    <ConfigEditor
      visible={visible}
      onClose={onClose}
      notebookPath={notebookPath}
      onSave={saveConfig}
      initialSections={initialSections}
    />
  );
};
