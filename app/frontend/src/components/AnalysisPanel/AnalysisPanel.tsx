// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Pivot, PivotItem, Text } from "@fluentui/react";
import { Label } from "@fluentui/react/lib/Label";
import { Separator } from "@fluentui/react/lib/Separator";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

import styles from "./AnalysisPanel.module.css";

import { Box } from "@mui/material";
import { ActiveCitation, AskResponse, getCitationObj } from "../../api";
import { SupportingContent } from "../SupportingContent";
import { AnalysisPanelTabs } from "./AnalysisPanelTabs";
import { useTranslation } from "react-i18next";

interface Props {
    className: string;
    activeTab: AnalysisPanelTabs;
    onActiveTabChanged: (tab: AnalysisPanelTabs) => void;
    activeCitation: string | undefined;
    sourceFile: string | undefined;
    pageNumber: string | undefined;
    citationHeight: string;
    answer: AskResponse;
}

const pivotItemDisabledStyle = { disabled: true, style: { color: "grey" } };

export const AnalysisPanel = ({ answer, activeTab, activeCitation, sourceFile, pageNumber, citationHeight, className, onActiveTabChanged }: Props) => {
    const [activeCitationObj, setActiveCitationObj] = useState<ActiveCitation>();

    const { t } = useTranslation("common");

    const isDisabledThoughtProcessTab: boolean = !answer.thoughts;
    const isDisabledSupportingContentTab: boolean = !answer.data_points.length;
    const isDisabledCitationTab: boolean = !activeCitation;
    // the first split on ? separates the file from the sas token, then the second split on . separates the file extension
    const sourceFileExt: any = sourceFile?.split("?")[0].split(".").pop();
    const sanitizedThoughts = DOMPurify.sanitize(answer.thoughts!);

    async function fetchActiveCitationObj() {
        try {
            const citationObj = await getCitationObj(activeCitation as string);
            setActiveCitationObj(citationObj);
            console.log(citationObj);
        } catch (error) {
            // Handle the error here
            console.log(error);
        }
    }

    useEffect(() => {
        fetchActiveCitationObj();
    }, [activeCitation]);

    const pivotStyles = {
        linkIsSelected: {
            selectors: {
                ":before": {
                    backgroundColor: "rgba(67, 24, 255, 1)"
                }
            },
            color: "rgba(67, 24, 255, 1)",
            fontFamily: "Montserrat"
        }
    };
    return (
        <Pivot
            className={className}
            selectedKey={activeTab}
            onLinkClick={pivotItem => pivotItem && onActiveTabChanged(pivotItem.props.itemKey! as AnalysisPanelTabs)}
            styles={pivotStyles}
        >
            <PivotItem
                itemKey={AnalysisPanelTabs.ThoughtProcessTab}
                headerText={t("analysisPanel.thoughtProcess")}
                headerButtonProps={isDisabledThoughtProcessTab ? pivotItemDisabledStyle : undefined}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        backgroundColor: "white",
                        padding: 7,
                        outline: "none",
                        overflowY: "auto",
                        height: "100%"
                    }}
                >
                    <Box
                        sx={{
                            wordBreak: "break-word"
                        }}
                        className={styles.thoughtProcess}
                        dangerouslySetInnerHTML={{ __html: sanitizedThoughts }}
                    ></Box>
                </Box>

                {/*  */}
            </PivotItem>
            <PivotItem
                itemKey={AnalysisPanelTabs.SupportingContentTab}
                headerText={t("analysisPanel.supportingContent")}
                headerButtonProps={isDisabledSupportingContentTab ? pivotItemDisabledStyle : { styles: { root: { fontFamily: "Montserrat" } } }}
            >
                <SupportingContent supportingContent={answer.data_points} />
            </PivotItem>
            <PivotItem
                itemKey={AnalysisPanelTabs.CitationTab}
                headerText={t("analysisPanel.citation")}
                headerButtonProps={isDisabledCitationTab ? pivotItemDisabledStyle : undefined}
            >
                <Pivot className={className} styles={pivotStyles}>
                    <PivotItem itemKey="indexedFile" headerText={t("analysisPanel.documentSection")}>
                        {activeCitationObj === undefined ? (
                            <Text>{t("analysisPanel.loading")}</Text>
                        ) : (
                            <div className={styles.analysisText}>
                                <Separator className={styles.analysisSeparator}>Metadata</Separator>
                                <Label className={styles.analysisLabel}>{t("analysisPanel.fileName")}</Label>
                                <Text>{activeCitationObj.file_name}</Text>
                                <Label className={styles.analysisLabel}>{t("analysisPanel.fileUri")}</Label>
                                <Text>{activeCitationObj.file_uri}</Text>
                                <Label className={styles.analysisLabel}>{t("analysisPanel.title")}</Label>
                                <Text>{activeCitationObj.title}</Text>
                                <Label className={styles.analysisLabel}>{t("analysisPanel.section")}</Label>
                                <Text>{activeCitationObj.section}</Text>
                                <Label className={styles.analysisLabel}>{t("analysisPanel.pageNumbers")}</Label>
                                <Text>{activeCitationObj.pages?.join(",")}</Text>
                                <Label className={styles.analysisLabel}>{t("analysisPanel.tokenCount")}</Label>
                                <Text>{activeCitationObj.token_count}</Text>
                                <Separator className={styles.analysisSeparator}>{t("analysisPanel.content")}</Separator>
                                <Label className={styles.analysisLabel}>{t("analysisPanel.content")}</Label>
                                <Text>{activeCitationObj.content}</Text>
                            </div>
                        )}
                    </PivotItem>
                    <PivotItem itemKey="rawFile" headerText="Document">
                        {sourceFileExt === "pdf" ? (
                            //use object tag for pdfs because iframe does not support page numbers
                            <object data={sourceFile + "#page=" + pageNumber} type="application/pdf" width="100%" height={citationHeight} />
                        ) : sourceFileExt === "docx" ? (
                            <iframe
                                title="Source File"
                                src={
                                    "https://view.officeapps.live.com/op/view.aspx?src=" +
                                    encodeURIComponent(sourceFile as string) +
                                    "&action=embedview&wdStartOn=" +
                                    pageNumber
                                }
                                width="100%"
                                height={citationHeight}
                            />
                        ) : (
                            <iframe title="Source File" src={sourceFile} width="100%" height={citationHeight} />
                        )}
                    </PivotItem>
                </Pivot>
            </PivotItem>
        </Pivot>
    );
};
