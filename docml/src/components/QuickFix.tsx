import { EditTwoTone } from '@ant-design/icons';
import { MarkdownCellModel } from '@jupyterlab/cells';
import { Notebook } from '@jupyterlab/notebook';
import { Popconfirm } from 'antd';
import React, { useCallback } from 'react';
import { Updater } from 'use-immer';
import { stages } from '../constants';
import { AnnotMap } from '../util/mdExtractor';
import { jumpToCell } from '../util/notebook_private';

export interface IQuickFixProps {
  /** Section identifier */
  sectionName: string;
  /** Display title for the section */
  sectionTitle: string;
  /** Map of existing annotations */
  annotMap: AnnotMap;
  /** Function to update annotation map */
  updateAnnotMap: Updater<AnnotMap>;
  /** Notebook instance */
  notebook: Notebook;
  /** Cell index for insertion */
  idx: number;
}

/**
 * Generate markdown content for a new annotation cell
 */
const generateAnnotationContent = (name: string, title: string): string => {
  return `# ${title}\n<!-- @md-${name} -->\n<!-- /md-${name} -->`;
};

/**
 * QuickFix component for adding or editing model card sections
 */
const QuickFix: React.FC<IQuickFixProps> = React.memo(({
  sectionName,
  sectionTitle,
  annotMap,
  updateAnnotMap,
  notebook,
  idx
}: IQuickFixProps) => {
  const annotation = annotMap.get(sectionName);
  const existed = annotation !== undefined;

  const handleEditClick = useCallback(() => {
    if (annotation) {
      jumpToCell(notebook, annotation.idx);
    }
  }, [annotation, notebook]);

  const handleAddSection = useCallback(() => {
    if (!notebook.model) {
      console.error('Notebook model not initialized');
      return;
    }

    const content = generateAnnotationContent(sectionName, sectionTitle);

    // JupyterLab 4.x API: Use sharedModel.insertCell with plain cell data
    if ((notebook.model as any).sharedModel && typeof (notebook.model as any).sharedModel.insertCell === 'function') {
      // Create plain cell data object for JupyterLab 4.x
      const cellData = {
        cell_type: 'markdown',
        source: content,
        metadata: {}
      };
      (notebook.model as any).sharedModel.insertCell(idx, cellData);
    }
    // Fallback for JupyterLab 3.x: Use model.cells.insert
    else if ((notebook.model.cells as any).insert && typeof (notebook.model.cells as any).insert === 'function') {
      const mdCell = new MarkdownCellModel();
      (notebook.model.cells as any).insert(idx, mdCell);
      // Set content after insertion
      if ((mdCell as any).value && typeof (mdCell as any).value.insert === 'function') {
        (mdCell as any).value.insert(0, content);
      }
    }
    else {
      console.error('Unable to insert cell - no compatible API found');
      return;
    }

    updateAnnotMap(draft => {
      draft.set(sectionName, { idx, content: '' });
    });

    jumpToCell(notebook, idx);
  }, [notebook, idx, sectionName, sectionTitle, updateAnnotMap]);

  if (existed) {
    return (
      <EditTwoTone
        style={{ fontSize: "65%", paddingRight: "1px" }}
        onClick={handleEditClick}
      />
    );
  }

  return (
    <Popconfirm
      title={`Add a ${
        stages.has(sectionName) ? 'description' : 'new cell'
      } for ${sectionTitle}?`}
      onConfirm={handleAddSection}
      okText="Yes"
      cancelText="No"
    >
      <EditTwoTone style={{ fontSize: "65%", paddingRight: "1px" }} />
    </Popconfirm>
  );
});

QuickFix.displayName = 'QuickFix';

export default QuickFix;
