import { ReactWidget } from '@jupyterlab/apputils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { INotebookModel, Notebook, NotebookPanel } from '@jupyterlab/notebook';
import clone from 'lodash/clone';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { IServerResponse, PanelCreateHandler } from '../types';
import Section from './Section';

/**
 * ReactWidget that displays the model card interface in JupyterLab
 */
export class ModelCardWidget extends ReactWidget {
  /** Reference to the notebook */
  private _notebook: Notebook;
  /** Document context for the notebook */
  private _context: DocumentRegistry.IContext<INotebookModel>;
  /** JupyterLab document manager */
  private _docManager: IDocumentManager;
  /** Server response containing model card data */
  private readonly serverResponse: IServerResponse;
  /** Handler to recreate the panel */
  private readonly createPanelHandler: PanelCreateHandler;
  /** React root for rendering */
  private _root: Root | null = null;

  constructor(
    panel: NotebookPanel,
    docManager: IDocumentManager,
    response: IServerResponse,
    createPanelHandler: PanelCreateHandler
  ) {
    super();
    this._notebook = panel.content;
    this._context = panel.context;
    this._docManager = docManager;
    this.serverResponse = response;
    this.createPanelHandler = createPanelHandler;
    this.addClass('jp-ReactWidget');
  }

  /**
   * Re-render the component every time an update is requested
   */
  onUpdateRequest(): void {
    if (!this._root) {
      this._root = createRoot(this.node);
    }
    this._root.render(
      <Section
        notebook={this._notebook}
        context={this._context}
        docManager={this._docManager}
        ServerResponse={this.serverResponse}
        handler={this.createPanelHandler}
      />
    );
  }

  /**
   * Update the notebook reference
   */
  updateModel(panel: NotebookPanel): void {
    this._notebook = clone(panel.content);
  }

  /**
   * Render the model card section component
   */
  render(): JSX.Element {
    return (
      <Section
        notebook={this._notebook}
        context={this._context}
        docManager={this._docManager}
        ServerResponse={this.serverResponse}
        handler={this.createPanelHandler}
      />
    );
  }
}
