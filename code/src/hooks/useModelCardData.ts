import { Notebook } from "@jupyterlab/notebook";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { endTag, startTag } from "../constants";
import { IModelCardSchema, IServerResponse } from "../types";
import { AnnotMap, getAnnotMap } from "../util/mdExtractor";

/**
 * Custom hook for managing model card data and annotations
 */
export const useModelCardData = (
  notebook: Notebook,
  serverResponse: IServerResponse
) => {
  const [annotMap, updateAnnotMap] = useImmer<AnnotMap>(new Map());
  const [data, updateData] = useImmer<IModelCardSchema>({} as IModelCardSchema);

  useEffect(() => {
    const amap = getAnnotMap(notebook);
    const modelCard: IModelCardSchema = JSON.parse(
      JSON.stringify(serverResponse)
    ) as IModelCardSchema;

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
    if (
      modelnameSection &&
      'description' in modelnameSection &&
      modelnameSection.description !== undefined &&
      !amap.has(titleKey)
    ) {
      const titleCell = notebook.model?.cells.get(0)?.value;
      if (titleCell) {
        titleCell.insert(0, `${startTag(titleKey)}\n`);
        titleCell.insert(titleCell.text.length, `\n${endTag(titleKey)}`);
        amap.set(titleKey, {
          idx: 0,
          content: modelnameSection.description,
        });
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
