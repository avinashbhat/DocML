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

    const mdCell = new MarkdownCellModel();
    (mdCell as any).value.text = generateAnnotationContent(sectionName, sectionTitle);

    (notebook.model.cells as any).insert(idx, mdCell);

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
