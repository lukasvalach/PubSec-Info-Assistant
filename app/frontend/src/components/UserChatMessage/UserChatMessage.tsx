// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Box } from "@mui/system";
import styles from "./UserChatMessage.module.css";
import { useTranslation } from "react-i18next";

interface Props {
    message: string;
}

export const UserChatMessage = ({ message }: Props) => {
    const { t } = useTranslation("common");
    return (
        <div className={styles.container}>
            <Box sx={{ borderRadius: 16, display: "block" }}>
                <Box sx={{textAlign: 'right', fontWeight: '600', fontSize: 14}}>{t("you")}</Box>
                <div className={styles.message}>{message}</div>
            </Box>
        </div>
    );
};
