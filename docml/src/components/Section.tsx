import { IDocumentManager } from "@jupyterlab/docmanager";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, Notebook } from "@jupyterlab/notebook";
import { Button, Row, Col, Space, Tooltip } from "antd";
import { enableMapSet } from "immer";
import React from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { stages } from "../constants";
import { useModelCardData } from "../hooks/useModelCardData";
import {
  ISchemaItem,
  ISchemaStageItem,
  IServerResponse,
  PanelCreateHandler
} from "../types";
import { jumpToCell } from "../util/notebook_private";
import { ExportButton } from "./ExportButton";
import HelpText from "./HelpText";
import QuickFix from "./QuickFix";

enableMapSet();

interface ISectionProps {
  notebook: Notebook;
  context: DocumentRegistry.IContext<INotebookModel>;
  docManager: IDocumentManager;
  ServerResponse: IServerResponse;
  handler: PanelCreateHandler;
}

interface ISectionContent {
  notebook: Notebook;
  sectionName: string;
  sectionContent: ISchemaItem | ISchemaStageItem;
  quickFix: React.ReactNode;
}

const getJumpIndex = (
  sectionName: string,
  sectionContent: ISchemaItem | ISchemaStageItem
): number => {
  if (sectionName === "author") {
    return 1;
  }
  // if it's a stage, jump to the top cell if existed
  const stageContent = sectionContent as ISchemaStageItem;
  if (stages.has(sectionName) && stageContent.cell_ids && stageContent.cell_ids.length > 0) {
    return stageContent.cell_ids[0];
  }
  // otherwise insert to top
  return 0;
};
const Bar = styled.div`
  position: relative;
  background: aliceblue;
  width: 40%;
  height: 40px;
  border-radius: 10px;
`;

const VerticalLine: any = styled.div`
  position: absolute;
  left: ${(props: any): string => props.left}%;
  height: 100%;
  width: 5px;
  background-color: lightskyblue;
  border-radius: 15px;
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    transform: scale(3, 1.5);
    background-color: #1890ff;
    z-index: 2;
    cursor: pointer;
  }
`;

/**
 * Memoized component for rendering individual model card sections
 */
const SectionContent: React.FC<ISectionContent> = React.memo(({
  notebook,
  sectionName,
  sectionContent,
  quickFix,
}: ISectionContent) => {
  if (typeof sectionContent !== "object") {
    return null;
  }
  return (
      <>
        <h1>
          <Tooltip title={sectionContent.tooltip} placement="rightTop">
            {sectionContent.title} {quickFix} 
            <HelpText toolTipContent={sectionContent.tooltip} helpUrl={sectionContent.helpurl}/>
          </Tooltip>
        </h1>
        <div style={{ display: "block" }}>
          <ReactMarkdown>{sectionContent.description}</ReactMarkdown>
        </div>
        
        <div style={{ display: "block" }}>
          {sectionName !== "modelname" &&
            "cell_ids" in sectionContent &&
            sectionContent.cell_ids.length > 0 &&
            notebook.model &&
            notebook.model.cells ? (
            <Bar>
              {sectionContent.cell_ids.map((cid: number, idx: number) => (
                <VerticalLine
                  key={idx}
                  left={(cid / notebook.model!.cells.length) * 100}
                  onClick={(): void => jumpToCell(notebook, cid - 1)}
                />
              ))}
            </Bar>
          ) : null}
        </div>
        {"figures" in sectionContent
          ? sectionContent.figures.map((src: string, idx: number) => {
            // console.log(sectionName + ' ' + sectionContent.figures.length);
            return (
              <img
                style={{ display: "block" }}
                key={idx}
                src={`data:image/png;base64,${src}`}
              />
            );
          })
          : null}
      </>
  );
});

SectionContent.displayName = 'SectionContent';

/**
 * Main Section component that displays the model card interface
 */
const Section: React.FC<ISectionProps> = React.memo(({
  notebook,
  context,
  docManager,
  ServerResponse,
  handler
}: ISectionProps) => {
  // Use custom hook for managing model card data and annotations
  const { data, annotMap, updateAnnotMap } = useModelCardData(notebook, ServerResponse);

  // TODO: let user decide the name of the output file
  // TODO: test for files in a subdirectory
  return (
    <>
      <Row style={{ position: "sticky", top: 10, float: "right" }}>
        <Space>
          <Col span={6}>
            <Button type="primary" onClick={handler}>
              Refresh
            </Button>
          </Col>
          <Col span={6}>
            <ExportButton
              context={context}
              docManager={docManager}
              data={data}
            />
          </Col>
        </Space>
      </Row>

      {Object.entries(data).map(
        ([sectionName, sectionContent], idx: number) => {
          if (sectionName === "miscellaneous" || !sectionContent) {
            return null;
          }
          const content = sectionContent as ISchemaItem | ISchemaStageItem;
          return (
            <SectionContent
              key={idx}
              notebook={notebook}
              sectionName={sectionName}
              sectionContent={content}
              quickFix={
                <QuickFix
                  sectionName={sectionName}
                  sectionTitle={content.title}
                  annotMap={annotMap}
                  updateAnnotMap={updateAnnotMap}
                  notebook={notebook}
                  idx={getJumpIndex(sectionName, content)}
                />
              }
            />
          );
        }
      )}
    </>
  );
});

Section.displayName = 'Section';

export default Section;
