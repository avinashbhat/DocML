import { Notebook } from '@jupyterlab/notebook';
import { each } from '@lumino/algorithm';

const start = /<!--\s*@md-(\w*)\s*-->/;
const content = /<!--\s*@md-\w*\s*-->([\s\S]*)<!--\s*\/md-\w*\s*-->/;

export type AnnotContent = {
  idx: number;
  content: string;
};

export type AnnotMap = Map<string, AnnotContent>;

export const getAnnotMap = (nb: Notebook): AnnotMap => {
  const annotMap = new Map<string, AnnotContent>();

  if (!nb.model || !nb.model.cells) {
    return annotMap;
  }

  each(nb.model.cells, (cell, idx) => {
    if (cell.type === 'markdown') {
      const cellModel = cell as any;
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
