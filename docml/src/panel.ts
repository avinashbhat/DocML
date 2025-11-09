import { JupyterFrontEnd } from "@jupyterlab/application";
import { IDocumentManager } from "@jupyterlab/docmanager";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, NotebookPanel } from "@jupyterlab/notebook";
import { Popup } from "@jupyterlab/statusbar";
import { DisposableDelegate, IDisposable } from "@lumino/disposable";
import { StackedPanel } from "@lumino/widgets";
import { IServerResponse, PanelCreateHandler } from "./types";
import { ModelCardWidget } from "./components/ModelCardWidget";
import { PopupWidget } from "./components/PopupWidget";
import { requestAPI } from "./handler";

export class ModelCardPanel extends StackedPanel
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  private _view: ModelCardWidget | null = null;
  private _popup: PopupWidget | null = null;
  private _panel: NotebookPanel | null = null;
  private _context: DocumentRegistry.IContext<INotebookModel> | null = null;
  readonly _app: JupyterFrontEnd;
  readonly _docManager: IDocumentManager;
  private readonly _createPanelHandler: PanelCreateHandler;

  constructor(
    app: JupyterFrontEnd,
    docManager: IDocumentManager,
    modelCardId: string,
    modelCardTitle: string,
    parent: PanelCreateHandler
  ) {
    super();
    this._app = app;
    this._docManager = docManager;
    this.id = modelCardId;
    this.title.label = modelCardTitle;
    this.title.closable = true;
    this._createPanelHandler = parent;
  }

  onUpdateRequest(): void {
    if (!this._context) {
      console.error('Context not initialized');
      return;
    }

    if (this._view) {
      void this.updateView(this._context.localPath);
    } else {
      void this.createView(this._context.localPath);
    }
  }

  setContext(context: DocumentRegistry.IContext<INotebookModel>) {
    this._context = context;
  }

  setPanel(panel: NotebookPanel) {
    this._panel = panel;
  }

  getPopup() {
    return this._popup;
  }

  async getData(path: string): Promise<IServerResponse> {
    const dataToSend = {
      path: path,
    };

    try {
      const reply = await requestAPI<IServerResponse>("hello", {
        body: JSON.stringify(dataToSend),
        method: "POST",
      });
      return reply;
    } catch (reason) {
      console.error(`Error on POST /docml/hello ${dataToSend}.\n${reason}`);
      alert("DocML ran into errors. Generation Failed.");
      throw new Error(`Model card generation failed: ${String(reason)}`);
    }
  }

  async updateView(path: string): Promise<void> {
    if (!this._panel) {
      console.error('Panel not initialized');
      return;
    }

    try {
      const reply = await this.getData(path);
      this._view = new ModelCardWidget(
        this._panel,
        this._docManager,
        reply,
        this._createPanelHandler
      );
      this._view.updateModel(this._panel);
      this._view.update();
      this._popup = new PopupWidget(this._panel);
      this._popup.updateModel(this._panel);
    } catch (error) {
      console.error('Failed to update view:', error);
    }
  }

  launchPanel(): void {
    if (!this._popup || !this._panel) {
      console.error('Popup or panel not initialized');
      return;
    }

    const activeCell = this._panel.content.activeCell;
    if (!activeCell) {
      console.warn('No active cell');
      return;
    }

    this._popup.updateModel(this._panel);
    const popup = new Popup({
      body: this._popup,
      anchor: activeCell,
      align: "right",
    });
    popup.launch();
  }

  async createView(path: string): Promise<void> {
    if (!this._panel) {
      console.error('Panel not initialized');
      return;
    }

    try {
      const reply = await this.getData(path);
      this._view = new ModelCardWidget(
        this._panel,
        this._docManager,
        reply,
        this._createPanelHandler
      );
      this.addWidget(this._view);
      this._popup = new PopupWidget(this._panel);
      this._view.updateModel(this._panel);
      this._popup.updateModel(this._panel);
    } catch (error) {
      console.error('Failed to create view:', error);
    }
  }

  createNew(): IDisposable {
    return new DisposableDelegate(() => {
      if (this.widgets) {
        this.widgets.forEach((widget) => {
          if (!widget.isDisposed) {
            widget.dispose();
          }
        });
      }
      if (this._popup && !this._popup.isDisposed) {
        this._popup.dispose();
      }
    });
  }
}
