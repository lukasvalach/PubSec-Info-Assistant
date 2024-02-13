// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Text } from "@fluentui/react";
import { Info24Regular } from "@fluentui/react-icons";
import styles from "./InfoButton.module.css";

interface Props {
    className?: string;
    onClick: () => void;
}

export const InfoButton = ({ className, onClick }: Props) => {
    return (
        <div className={`${styles.container} ${className ?? ""}`} onClick={onClick}>
            <Info24Regular primaryFill="rgba(115, 118, 225, 1)" />
            <Text>{"Info"}</Text>
        </div>
    );
};
