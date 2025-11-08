import { PathExt } from "@jupyterlab/coreutils";
import { IDocumentManager } from "@jupyterlab/docmanager";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel } from "@jupyterlab/notebook";
import { useCallback } from "react";
import { IModelCardSchema } from "../types";
import { generateMarkdown } from "../util";

/**
 * Custom hook for handling model card export functionality
 */
export const useModelCardExport = (
  context: DocumentRegistry.IContext<INotebookModel>,
  docManager: IDocumentManager,
  data: IModelCardSchema
) => {
  const exportToMarkdown = useCallback(() => {
    const dirname = PathExt.dirname(context.path);
    let fileName = PathExt.basename(context.path);
    fileName = fileName.split(PathExt.extname(fileName))[0];
    fileName = fileName.split(" ").join("_");
    fileName = "card_" + fileName + ".md";
    const filePath = PathExt.join(dirname, fileName);

    let mdFile = docManager.findWidget(filePath, "Editor") as any;
    if (mdFile === undefined) {
      mdFile = docManager.createNew(filePath, "Editor") as any;
    }

    if (mdFile && mdFile.context) {
      void mdFile.context.ready.then(() => {
        // Access the editor content - this is specific to JupyterLab's editor widget
        if (mdFile.content?.model?.value) {
          mdFile.content.model.value.text = generateMarkdown(data);
        }
      });
    }

    void docManager.openOrReveal(filePath, 'Markdown Preview');
  }, [context.path, docManager, data]);

  const getEmptySections = useCallback(() => {
    const emptySections: string[] = [];
    Object.entries(data).forEach(([, sectionContent]) => {
      if (
        sectionContent &&
        typeof sectionContent === 'object' &&
        'description' in sectionContent &&
        'title' in sectionContent
      ) {
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
