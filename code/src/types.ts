/**
 * TypeScript type definitions for MLDoc model card generation
 */

/** Base schema item for documentation sections */
export interface ISchemaItem {
  /** Title of the section */
  title: string;
  /** Custom description provided by the user */
  description: string;
  /** Tooltip text for the section */
  tooltip: string;
  /** URL to example model cards */
  helpurl: string | string[];
}

/** Schema item for sections mapped to code stages */
export interface ISchemaStageItem extends ISchemaItem {
  /** Cell IDs that map to this stage */
  cell_ids: number[];
  /** Base64 encoded figures from notebook outputs */
  figures: string[];
  /** Source code for this stage */
  source?: string;
  /** Markdown content for this stage */
  markdown?: string;
  /** Imported libraries */
  imports?: string[];
  /** Function definitions */
  functions?: string[];
  /** Line numbers in the notebook */
  lineNumbers?: number[];
  /** Cell objects */
  cells?: unknown[];
  /** Output data */
  outputs?: unknown[];
  /** Links found in markdown */
  links?: string[];
}

/** Model name section */
export interface IModelNameSection {
  title: string;
  Filename?: string;
  cell_ids: number | number[];
  description?: string;
}

/** Complete model card schema returned from server */
export interface IModelCardSchema {
  modelname: IModelNameSection;
  basicinformation?: ISchemaItem;
  intendeduse?: ISchemaItem;
  factors?: ISchemaItem;
  ethicalconsiderations?: ISchemaItem;
  caveatsandrecommendations?: ISchemaItem;
  author?: ISchemaItem;
  datasets?: ISchemaItem;
  references?: ISchemaStageItem;
  disaggregatedevaluationresult?: ISchemaStageItem;
  libraries?: ISchemaItem;
  plotting?: ISchemaStageItem;
  datacleaning?: ISchemaStageItem;
  preprocessing?: ISchemaStageItem;
  hyperparameters?: ISchemaStageItem;
  modeltraining?: ISchemaStageItem;
  modelevaluation?: ISchemaStageItem;
  miscellaneous?: ISchemaStageItem;
  [key: string]: ISchemaItem | ISchemaStageItem | IModelNameSection | undefined;
}

/** Annotation map for tracking markdown annotations */
export interface IAnnotation {
  /** Index/position of the annotation */
  idx: number;
  /** Content of the annotation */
  content: string;
}

/** Handler function type for panel creation */
export type PanelCreateHandler = () => void;

/** Server response from model card generation */
export interface IServerResponse extends IModelCardSchema {
  /** Optional error message */
  msg?: string;
}
