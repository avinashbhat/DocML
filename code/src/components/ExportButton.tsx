import { IDocumentManager } from "@jupyterlab/docmanager";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel } from "@jupyterlab/notebook";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from "antd";
import React, { useCallback } from "react";
import { useModelCardExport } from "../hooks/useModelCardExport";
import { IModelCardSchema } from "../types";

interface IExportButtonProps {
  context: DocumentRegistry.IContext<INotebookModel>;
  docManager: IDocumentManager;
  data: IModelCardSchema;
}

/**
 * Button component for exporting model card to Markdown
 */
export const ExportButton: React.FC<IExportButtonProps> = React.memo(({
  context,
  docManager,
  data,
}) => {
  const { exportToMarkdown, getEmptySections } = useModelCardExport(
    context,
    docManager,
    data
  );

  const handleExport = useCallback(() => {
    const emptySections = getEmptySections();

    if (emptySections.length > 0) {
      Modal.confirm({
        title: 'The following sections are still empty!',
        icon: <ExclamationCircleOutlined />,
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
    } else {
      exportToMarkdown();
    }
  }, [exportToMarkdown, getEmptySections]);

  return (
    <Button type="primary" onClick={handleExport}>
      Export to MD
    </Button>
  );
});

ExportButton.displayName = 'ExportButton';
