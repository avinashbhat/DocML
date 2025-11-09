import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
} from "@jupyterlab/application";
import { WidgetTracker } from "@jupyterlab/apputils";
import { IDocumentManager } from "@jupyterlab/docmanager";
import { NotebookPanel, INotebookModel } from "@jupyterlab/notebook";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { IDisposable } from "@lumino/disposable";
import {
  modelCardExtensionID,
  commandModifyStage,
  createModelCard,
  extensionCategory,
  extensionCaption,
} from "./constants";
import { ModelCardPanel } from "./panel";
import { PathExt } from "@jupyterlab/coreutils";
import { DocMLDropdown } from "./components/DocMLDropdown";

function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * A notebook widget extension that adds a DocML dropdown button to the toolbar.
 */
class ModelCardButton
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  private _app: JupyterFrontEnd;
  private _docManager: IDocumentManager;
  private _modelCardPanel!: ModelCardPanel;
  private _context!: DocumentRegistry.IContext<INotebookModel>;

  constructor(app: JupyterFrontEnd, docManager: IDocumentManager) {
    this._app = app;
    this._docManager = docManager;
  }

  /**
   * Register the context menu command for changing stages
   */
  private registerStageCommand(): void {
    if (!this._app.commands.hasCommand(commandModifyStage)) {
      this._app.commands.addCommand(commandModifyStage, {
        label: "[DocML] Change stage to...",
        execute: () => {
          this._modelCardPanel?.launchPanel();
        },
      });
      this._app.contextMenu.addItem({
        command: commandModifyStage,
        selector: ".jp-CodeCell",
      });
    }
  }

  /**
   * Create and configure a new ModelCardPanel
   */
  private createModelCardPanel(
    panel: NotebookPanel,
    modelCardTitle: string,
    createPanel: () => void
  ): ModelCardPanel {
    const modelCardPanel = new ModelCardPanel(
      this._app,
      this._docManager,
      makeid(10),
      modelCardTitle,
      createPanel
    );

    modelCardPanel.setContext(this._context);
    modelCardPanel.setPanel(panel);
    this.registerStageCommand();
    this._app.docRegistry.addWidgetExtension("Notebook", modelCardPanel);

    return modelCardPanel;
  }

  /**
   * Show the model card panel in the shell
   */
  private showPanel(modelCardPanel: ModelCardPanel): void {
    this._app.shell.add(modelCardPanel, "main", { mode: "split-right" });
    this._app.shell.activateById(modelCardPanel.id);
    modelCardPanel.update();
  }

  /**
   * Update panel context and refresh
   */
  private updatePanelContext(modelCardPanel: ModelCardPanel, panel: NotebookPanel): void {
    modelCardPanel.setContext(this._context);
    modelCardPanel.setPanel(panel);
    modelCardPanel.update();
  }

  /**
   * Create a new extension object.
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    let modelCardPanel: ModelCardPanel;

    const createPanel = () => {
      context.ready.then(() => {
        this._context = context;

        // Generate model card title from notebook path
        let modelCardTitle = PathExt.basename(context.path);
        modelCardTitle = modelCardTitle.split(PathExt.extname(modelCardTitle))[0];
        modelCardTitle = modelCardTitle.split(" ").join("_") + ".modelcard";

        // Handle different panel states
        if (!modelCardPanel) {
          // Create new panel
          modelCardPanel = this.createModelCardPanel(panel, modelCardTitle, createPanel);
          this._modelCardPanel = modelCardPanel;
          this.showPanel(modelCardPanel);
        } else if (!modelCardPanel.isAttached) {
          // Reattach detached panel
          this.updatePanelContext(modelCardPanel, panel);
          this._modelCardPanel = modelCardPanel;
          this.showPanel(modelCardPanel);
        } else if (!modelCardPanel.isVisible) {
          // Show hidden panel
          this.updatePanelContext(modelCardPanel, panel);
          this._modelCardPanel = modelCardPanel;
          this._app.shell.activateById(modelCardPanel.id);
        } else if (this._app.shell.currentWidget === modelCardPanel) {
          // Recreate panel if it's the current widget (toggle behavior)
          this._app.shell.currentWidget.dispose();
          modelCardPanel = this.createModelCardPanel(panel, modelCardTitle, createPanel);
          this._modelCardPanel = modelCardPanel;
          this.showPanel(modelCardPanel);
        } else {
          // Update existing visible panel
          this.updatePanelContext(modelCardPanel, panel);
        }
      });
    };

    // Add DocML dropdown button
    const dropdownButton = new DocMLDropdown(panel, context, createPanel);
    dropdownButton.update();

    panel.toolbar.insertItem(0, "docmlDropdown", dropdownButton);

    if (!this._app.commands.hasCommand(createModelCard)) {
      this._app.commands.addCommand(createModelCard, {
        label: extensionCategory,
        caption: extensionCaption,
        isVisible: () => false,
        execute: createPanel,
      });
    }

    return dropdownButton;
  }
}

/**
 * Initialization data for the docml extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: modelCardExtensionID,
  autoStart: true,
  requires: [IDocumentManager, ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    docManager: IDocumentManager,
    restorer: ILayoutRestorer
  ) => {
    console.log("JupyterLab extension jlcards is activated!");
    const tracker = new WidgetTracker<ModelCardPanel>({
      namespace: "model-card",
    });
    restorer.restore(tracker, {
      command: createModelCard,
      name: () => "model-card",
    });
    const modelCardButton = new ModelCardButton(app, docManager);
    app.docRegistry.addWidgetExtension("Notebook", modelCardButton);
  },
};

export default extension;
