// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ArrowSync16Filled, Options16Filled } from "@fluentui/react-icons";

import styles from "./RAIPanel.module.css";
import { useTranslation } from "react-i18next";

interface Props {
    onAdjustClick?: () => void;
    onRegenerateClick?: () => void;
}

export const RAIPanel = ({ onAdjustClick, onRegenerateClick }: Props) => {
    const { t } = useTranslation("common");
    return (
        <div className={styles.adjustInputContainer}>
            <div className={styles.adjustInput} onClick={onAdjustClick}>
                <Options16Filled primaryFill="rgba(115, 118, 225, 1)" />
                <span className={styles.adjustInputText}>{t("raiPanel.customize")}</span>
            </div>
            <div className={styles.adjustInput} onClick={onRegenerateClick}>
                <ArrowSync16Filled primaryFill="rgba(115, 118, 225, 1)" />
                <span className={styles.adjustInputText}>{t("raiPanel.update")}</span>
            </div>
        </div>
    );
};
