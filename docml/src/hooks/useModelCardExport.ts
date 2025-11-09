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

    const markdownContent = generateMarkdown(data);

    let mdFile = docManager.findWidget(filePath, "Editor") as any;
    if (mdFile === undefined) {
      mdFile = docManager.createNew(filePath, "Editor") as any;
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
          if ((model as any).sharedModel && typeof (model as any).sharedModel.setSource === 'function') {
            (model as any).sharedModel.setSource(markdownContent);
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
        } catch (error) {
          console.error('Export error:', error);
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
