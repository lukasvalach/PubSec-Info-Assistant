import { BlobServiceClient } from "@azure/storage-blob";
import {
    ActionButton,
    ComboBox,
    DirectionalHint,
    IComboBox,
    IComboBoxOption,
    IComboBoxStyles,
    IIconProps,
    ITooltipHostStyles,
    SelectableOptionMenuItemType,
    TooltipHost
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { Info16Regular } from "@fluentui/react-icons";
import { IButtonProps } from "@fluentui/react/lib/Button";
import { ILabelStyleProps, ILabelStyles } from "@fluentui/react/lib/Label";
import { ITeachingBubbleStyles, TeachingBubble } from "@fluentui/react/lib/TeachingBubble";
import { ITextFieldStyleProps, ITextFieldStyles, TextField } from "@fluentui/react/lib/TextField";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import styles from "./FolderPicker.module.css";

var allowNewFolders = false;

interface Props {
    allowFolderCreation?: boolean;
    onSelectedKeyChange: (selectedFolders: string[]) => void;
    preSelectedKeys?: string[];
    width?: number;
}

export const FolderPicker = ({ allowFolderCreation, onSelectedKeyChange, preSelectedKeys, width }: Props) => {
    const buttonId = useId("targetButton");
    const tooltipId = useId("folderpicker-tooltip");
    const textFieldId = useId("textField");
    const { t } = useTranslation("common");

    const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [options, setOptions] = useState<IComboBoxOption[]>([]);
    const selectableOptions = options.filter(
        option => (option.itemType === SelectableOptionMenuItemType.Normal || option.itemType === undefined) && !option.disabled
    );
    const comboBoxStyles: Partial<IComboBoxStyles> = { root: { width: width ?? 450 }, label: { paddingBottom: "1rem" } };
    const hostStyles: Partial<ITooltipHostStyles> = { root: { display: "inline-block" } };
    const addFolderIcon: IIconProps = { iconName: "Add" };

    allowNewFolders = allowFolderCreation as boolean;

    const teachingBubbleStyles: Partial<ITeachingBubbleStyles> = {
        content: {
            background: "#d3d3d3",
            borderColor: "#696969"
        },
        headline: {
            color: "#696969"
        }
    };

    const teachingBubblePrimaryButtonClick = () => {
        const textField = document.getElementById(textFieldId) as HTMLInputElement;
        if (!textField.defaultValue || textField.defaultValue.trim() === "") {
            alert(t("emptyFolderName"));
        } else {
            // add the folder to the dropdown list and select it
            // This will be passed to the file-picker component to determine the folder to upload to
            const trimVal = textField.defaultValue.trim();
            const currentOptions = options;
            currentOptions.push({ key: trimVal, text: trimVal });
            setOptions(currentOptions);
            setSelectedKeys([trimVal]);
            onSelectedKeyChange([trimVal]);
            toggleTeachingBubbleVisible();
        }
    };

    const examplePrimaryButtonProps: IButtonProps = {
        children: t("createFolder"),
        onClick: teachingBubblePrimaryButtonClick
    };

    async function fetchBlobFolderData() {
        try {
            // const blobClientUrl = await getBlobClientUrl();
            const blobClientUrl =
                "https://infoasststorelycpr.blob.core.windows.net/?se=2024-02-02T09%3A26%3A43Z&sp=rwlacu&sv=2022-11-02&ss=b&srt=sco&sig=J6yp9ZFUrEkxTOV6UScyoCWbqonitbwsJf3AX5fRVTU%3D";
            const blobServiceClient = new BlobServiceClient(blobClientUrl);
            var containerClient = blobServiceClient.getContainerClient("upload");
            const delimiter = "/";
            const prefix = "";
            var newOptions: IComboBoxOption[] = allowNewFolders
                ? []
                : [
                      { key: "selectAll", text: t("customize.panel.selectAll"), itemType: SelectableOptionMenuItemType.SelectAll },
                      { key: "FolderHeader", text: t("customize.panel.folder"), itemType: SelectableOptionMenuItemType.Header }
                  ];
            for await (const item of containerClient.listBlobsByHierarchy(delimiter, {
                prefix
            })) {
                // Check if the item is a folder
                if (item.kind === "prefix") {
                    // Get the folder name and add to the dropdown list
                    var folderName = item.name.slice(0, -1);

                    newOptions.push({ key: folderName, text: folderName });
                    setOptions(newOptions);
                }
            }
            if (!allowNewFolders) {
                var filteredOptions = newOptions.filter(
                    option => (option.itemType === SelectableOptionMenuItemType.Normal || option.itemType === undefined) && !option.disabled
                );
                if (preSelectedKeys !== undefined && preSelectedKeys.length > 0) {
                    setSelectedKeys(preSelectedKeys);
                    onSelectedKeyChange(preSelectedKeys);
                } else {
                    setSelectedKeys(["selectAll", ...filteredOptions.map(o => o.key as string)]);
                    onSelectedKeyChange(["selectAll", ...filteredOptions.map(o => o.key as string)]);
                }
            }
        } catch (error) {
            // Handle the error here
            console.log(error);
        }
    }

    useEffect(() => {
        fetchBlobFolderData();
    }, []);

    function getStyles(props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
        const { required } = props;
        return {
            fieldGroup: [
                { width: 300 },
                required && {
                    borderColor: "#F8f8ff"
                }
            ],
            subComponentStyles: {
                label: getLabelStyles
            }
        };
    }

    function getLabelStyles(props: ILabelStyleProps): ILabelStyles {
        const { required } = props;
        return {
            root: required && {
                color: "#696969"
            }
        };
    }

    const onChange = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
        const selected = option?.selected;
        const currentSelectedOptionKeys = selectedKeys.filter(key => key !== "selectAll");
        const selectAllState = currentSelectedOptionKeys.length === selectableOptions.length;
        if (!allowNewFolders) {
            if (option) {
                if (option?.itemType === SelectableOptionMenuItemType.SelectAll) {
                    if (selectAllState) {
                        setSelectedKeys([]);
                        onSelectedKeyChange([]);
                    } else {
                        setSelectedKeys(["selectAll", ...selectableOptions.map(o => o.key as string)]);
                        onSelectedKeyChange(["selectAll", ...selectableOptions.map(o => o.key as string)]);
                    }
                } else {
                    const updatedKeys = selected
                        ? [...currentSelectedOptionKeys, option!.key as string]
                        : currentSelectedOptionKeys.filter(k => k !== option.key);
                    if (updatedKeys.length === selectableOptions.length) {
                        updatedKeys.push("selectAll");
                    }
                    setSelectedKeys(updatedKeys);
                    onSelectedKeyChange(updatedKeys);
                }
            }
        } else {
            setSelectedKeys([option!.key as string]);
            onSelectedKeyChange([option!.key as string]);
        }
    };

    return (
        <div className={styles.folderArea}>
            <div className={styles.folderSelection}>
                <ComboBox
                    multiSelect={allowNewFolders ? false : true}
                    selectedKey={selectedKeys}
                    label={allowNewFolders ? t("customize.panel.agentSelection") : t("customize.panel.agentSelectionMultiple")}
                    options={options}
                    onChange={onChange}
                    styles={comboBoxStyles}
                    dropdownWidth={600}
                />
                <TooltipHost content={allowNewFolders ? t("customize.panel.upload") : t("customize.panel.uploadMultiple")} styles={hostStyles} id={tooltipId}>
                    <Info16Regular></Info16Regular>
                </TooltipHost>
            </div>
            {allowNewFolders ? (
                <div className={styles.actionButton}>
                    <ActionButton iconProps={addFolderIcon} allowDisabledFocus onClick={toggleTeachingBubbleVisible} id={buttonId}>
                        {t("customize.panel.newFolder")}
                    </ActionButton>
                    {teachingBubbleVisible && (
                        <TeachingBubble
                            target={`#${buttonId}`}
                            primaryButtonProps={examplePrimaryButtonProps}
                            onDismiss={toggleTeachingBubbleVisible}
                            headline={t("customize.panel.newFolder")}
                            calloutProps={{ directionalHint: DirectionalHint.topCenter }}
                            styles={teachingBubbleStyles}
                            hasCloseButton={true}
                        >
                            <TextField id={textFieldId} label={t("folderName")} required={true} styles={getStyles} />
                        </TeachingBubble>
                    )}
                </div>
            ) : (
                ""
            )}
        </div>
    );
};
