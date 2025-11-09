import { DownOutlined } from '@ant-design/icons';
import { ReactWidget } from '@jupyterlab/apputils';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { Button, Dropdown } from 'antd';
import clone from 'lodash/clone';
import React, { useCallback, useMemo } from 'react';
import { IServerResponse } from '../types';

interface IStageDropdownProps {
  notebook: Notebook;
  sections: Map<string, string>;
}

/**
 * Pattern to match DocML stage comments in notebook cells
 * Format: # [docml] stage: <stage name>
 * TODO: Improve regex pattern for better fuzzy matching
 */
const STAGE_PATTERN = /(\[docml\] stage: )[\w ]*(.*)/;

/**
 * Dropdown component for selecting DocML stages
 */
const StageDropdown: React.FC<IStageDropdownProps> = React.memo(({ notebook, sections }: IStageDropdownProps) => {
  const handleStageSelect = useCallback((stageId: string, stageName: string) => {
    if (!notebook.activeCell) {
      console.warn('No active cell');
      return;
    }

    const cellModel = notebook.activeCell.model as any;

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
        cellModel.value.text = text.replace(
          STAGE_PATTERN,
          `$1${stageName}$2`
        );
      } else {
        // Add new stage comment
        cellModel.value.insert(
          0,
          `# [docml] stage: ${stageName}\n`
        );
      }
    }
  }, [notebook]);

  const menuItems = useMemo(() =>
    Array.from(sections.entries()).map(([stageId, stageName], idx) => ({
      key: idx.toString(),
      label: stageName,
      onClick: () => handleStageSelect(stageId, stageName)
    }))
  , [handleStageSelect, sections]);

  return (
    <Dropdown menu={{ items: menuItems }}>
      <Button>
        Select stage <DownOutlined />
      </Button>
    </Dropdown>
  );
});

StageDropdown.displayName = 'StageDropdown';

/**
 * ReactWidget wrapper for the stage dropdown component
 * Used in JupyterLab's popup system
 */
export class PopupWidget extends ReactWidget {
  /** Reference to the notebook */
  private _notebook: Notebook;
  /** Available sections from model card data */
  private _sections: Map<string, string>;

  constructor(panel: NotebookPanel, serverResponse?: IServerResponse) {
    super();
    this._notebook = panel.content;
    this._sections = this._extractSections(serverResponse);
  }

  /**
   * Extract sections from server response to populate dropdown
   */
  private _extractSections(serverResponse?: IServerResponse): Map<string, string> {
    const sections = new Map<string, string>();

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
  updateModel(panel: NotebookPanel, serverResponse?: IServerResponse): void {
    this._notebook = clone(panel.content);
    if (serverResponse) {
      this._sections = this._extractSections(serverResponse);
    }
  }

  /**
   * Render the stage dropdown component
   */
  render(): JSX.Element {
    return <StageDropdown notebook={this._notebook} sections={this._sections} />;
  }
}
