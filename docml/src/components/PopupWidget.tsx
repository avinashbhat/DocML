import { DownOutlined } from '@ant-design/icons';
import { ReactWidget } from '@jupyterlab/apputils';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { Button, Dropdown, Menu } from 'antd';
import clone from 'lodash/clone';
import React, { useCallback, useMemo } from 'react';
import { stages } from '../constants';

interface IStageDropdownProps {
  notebook: Notebook;
}

/**
 * Pattern to match model card stage comments in notebook cells
 * Format: # [model card] stage: <stage name>
 * TODO: Improve regex pattern for better fuzzy matching
 */
const STAGE_PATTERN = /(\[model card\] stage: )[\w ]*(.*)/;

/**
 * Dropdown component for selecting model card stages
 */
const StageDropdown: React.FC<IStageDropdownProps> = React.memo(({ notebook }: IStageDropdownProps) => {
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
          `# [model card] stage: ${stageName}\n`
        );
      }
    }
  }, [notebook]);

  const menu = useMemo(() => (
    <Menu>
      {Array.from(stages.entries()).map(([stageId, stageName], idx) => (
        <Menu.Item
          key={idx}
          onClick={() => handleStageSelect(stageId, stageName)}
        >
          {stageName}
        </Menu.Item>
      ))}
    </Menu>
  ), [handleStageSelect]);

  return (
    <Dropdown overlay={menu}>
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

  constructor(panel: NotebookPanel) {
    super();
    this._notebook = panel.content;
  }

  /**
   * Update the notebook reference
   */
  updateModel(panel: NotebookPanel): void {
    this._notebook = clone(panel.content);
  }

  /**
   * Render the stage dropdown component
   */
  render(): JSX.Element {
    return <StageDropdown notebook={this._notebook} />;
  }
}
