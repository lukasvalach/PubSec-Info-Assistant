// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from "@fluentui/react";
import { ArrowClockwise24Filled } from "@fluentui/react-icons";
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from "@fluentui/react/lib/Dropdown";
import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";
import { FileState, FileUploadBasicStatus, GetUploadStatusRequest, getAllUploadStatus } from "../../api";
import { DocumentsDetailList, IDocument } from "./DocumentsDetailList";

import { useTranslation } from "react-i18next";
import styles from "./FileStatus.module.css";

const dropdownTimespanStyles: Partial<IDropdownStyles> = { dropdown: { width: 250, marginRight: 30 } };
const dropdownFileStateStyles: Partial<IDropdownStyles> = { dropdown: { width: 250, marginRight: 30 } };

interface Props {
    className?: string;
}

export const FileStatus = ({ className }: Props) => {
    const { t } = useTranslation("common");
    const [selectedTimeFrameItem, setSelectedTimeFrameItem] = useState<IDropdownOption>();
    const [selectedFileStateItem, setSelectedFileStateItem] = useState<IDropdownOption>();
    const [files, setFiles] = useState<IDocument[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dropdownTimespanOptions = [
        { key: "Time Range", text: t("timeRange"), itemType: DropdownMenuItemType.Header },
        { key: "4hours", text: t("4hours") },
        { key: "12hours", text: t("12hours") },
        { key: "24hours", text: t("24hours") },
        { key: "7days", text: t("7days") },
        { key: "30days", text: t("30days") }
    ];

    const dropdownFileStateOptions = [
        { key: "FileStates", text: t("fileStates"), itemType: DropdownMenuItemType.Header },
        { key: FileState.All, text: t("all") },
        { key: FileState.Complete, text: t("complete") },
        { key: FileState.Error, text: t("error") },
        { key: FileState.Processing, text: t("processing") },
        { key: FileState.Queued, text: t("queued") },
        { key: FileState.Skipped, text: t("skipped") }
    ];

    const onTimeSpanChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedTimeFrameItem(item);
    };

    const onFileStateChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption<any> | undefined): void => {
        setSelectedFileStateItem(item);
    };

    const onFilesSorted = (items: IDocument[]): void => {
        setFiles(items);
    };

    const onGetStatusClick = async () => {
        setIsLoading(true);
        var timeframe = 4;
        switch (selectedTimeFrameItem?.key as string) {
            case "4hours":
                timeframe = 4;
                break;
            case "12hours":
                timeframe = 12;
                break;
            case "24hours":
                timeframe = 24;
                break;
            case "7days":
                timeframe = 10080;
                break;
            case "30days":
                timeframe = 43200;
                break;
            default:
                timeframe = 4;
                break;
        }

        const request: GetUploadStatusRequest = {
            timeframe: timeframe,
            state: selectedFileStateItem?.key == undefined ? FileState.All : (selectedFileStateItem?.key as FileState)
        };
        const response = await getAllUploadStatus(request);
        const list = convertStatusToItems(response.statuses);
        setIsLoading(false);
        setFiles(list);
    };

    function convertStatusToItems(fileList: FileUploadBasicStatus[]) {
        const items: IDocument[] = [];
        for (let i = 0; i < fileList.length; i++) {
            let fileExtension = fileList[i].file_name.split(".").pop();
            fileExtension = fileExtension == undefined ? "Folder" : fileExtension.toUpperCase();
            try {
                items.push({
                    key: fileList[i].id,
                    name: fileList[i].file_name,
                    iconName: FILE_ICONS[fileExtension.toLowerCase()],
                    fileType: fileExtension,
                    state: fileList[i].state,
                    state_description: fileList[i].state_description,
                    upload_timestamp: fileList[i].start_timestamp,
                    modified_timestamp: fileList[i].state_timestamp,
                    value: fileList[i].id
                });
            } catch (e) {
                console.log(e);
            }
        }
        return items;
    }

    const FILE_ICONS: { [id: string]: string } = {
        csv: "csv",
        docx: "docx",
        pdf: "pdf",
        pptx: "pptx",
        txt: "txt",
        html: "xsn"
    };

    const animatedStyles = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 }
    });

    return (
        <div className={styles.container}>
            <div className={`${styles.options} ${className ?? ""}`}>
                <Dropdown
                    label={t("uploadDrop")}
                    defaultSelectedKey="4hours"
                    onChange={onTimeSpanChange}
                    placeholder="Select a time range"
                    options={dropdownTimespanOptions}
                    styles={dropdownTimespanStyles}
                    aria-label="timespan options for file statuses to be displayed"
                />
                <Dropdown
                    label={t("fileStates")}
                    defaultSelectedKey={"ALL"}
                    onChange={onFileStateChange}
                    placeholder="Select file states"
                    options={dropdownFileStateOptions}
                    styles={dropdownFileStateStyles}
                    aria-label="file state options for file statuses to be displayed"
                />
                <div className={styles.refresharea} onClick={onGetStatusClick} aria-label="Refresh displayed file statuses">
                    <ArrowClockwise24Filled className={styles.refreshicon} />
                    <span className={styles.refreshtext}>{t("refresh")}</span>
                </div>
            </div>
            {isLoading ? (
                <animated.div style={{ ...animatedStyles }}>
                    <Stack className={styles.loadingContainer} verticalAlign="space-between">
                        <Stack.Item grow>
                            <p className={styles.loadingText}>
                                {t("refresh")}
                                <span className={styles.loadingdots} />
                            </p>
                        </Stack.Item>
                    </Stack>
                </animated.div>
            ) : (
                <div className={styles.resultspanel}>
                    <DocumentsDetailList items={files == undefined ? [] : files} onFilesSorted={onFilesSorted} />
                </div>
            )}
        </div>
    );
};
