// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Pivot, PivotItem } from "@fluentui/react";
import { ITag } from "@fluentui/react/lib/Pickers";
import { useState } from "react";
import { FileStatus } from "../../components/FileStatus/FileStatus";
import { FolderPicker } from "../../components/FolderPicker/FolderPicker";
import { TagPickerInline } from "../../components/TagPicker/TagPicker";
import { FilePicker } from "../../components/filepicker/file-picker";

import Box from "@mui/material/Box";
import Menu from "../../components/Menu/Menu";
import styles from "./Content.module.css";
import { useTranslation } from "react-i18next";

export interface IButtonExampleProps {
    // These are set based on the toggles shown above the examples (not needed in real code)
    disabled?: boolean;
    checked?: boolean;
}

const Content = () => {
    const { t } = useTranslation("common");
    const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
    const [selectedTags, setSelectedTags] = useState<string[] | undefined>(undefined);

    const onSelectedKeyChanged = (selectedFolder: string[]) => {
        setSelectedKey(selectedFolder[0]);
    };

    const onSelectedTagsChanged = (selectedTags: ITag[]) => {
        setSelectedTags(selectedTags.map(tag => tag.name));
    };

    const handleLinkClick = (item?: PivotItem) => {
        setSelectedKey(undefined);
    };
    const pivotStyles = {
        linkIsSelected: {
            selectors: {
                ":before": {
                    backgroundColor: "rgba(67, 24, 255, 1)"
                }
            },
            color: "rgba(67, 24, 255, 1)"
        },
        root: { display: "flex", justifyContent: "center" }
    };

    return (
        <Box display="flex" minHeight="100vh">
            <Menu />
            <div className={styles.contentArea}>
                <Pivot linkSize={"large"} styles={pivotStyles} aria-label="Upload Files Section" className={styles.topPivot} onLinkClick={handleLinkClick}>
                    <PivotItem headerText={t("agentManagement")} aria-label="Upload Files Tab">
                        <div className={styles.App}>
                            <FolderPicker allowFolderCreation={true} onSelectedKeyChange={onSelectedKeyChanged} />
                            <TagPickerInline allowNewTags={true} onSelectedTagsChange={onSelectedTagsChanged} />
                            <FilePicker folderPath={selectedKey || ""} tags={selectedTags || []} />
                        </div>
                    </PivotItem>
                    <PivotItem headerText={t("uploadStatus")} aria-label="Upload Status Tab">
                        <FileStatus className="" />
                    </PivotItem>
                </Pivot>
            </div>
        </Box>
    );
};

export default Content;
