// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack, TextField } from "@fluentui/react";
import { Broom28Filled, Send24Regular } from "@fluentui/react-icons";
import { useState } from "react";
import { RAIPanel } from "../RAIPanel";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import styles from "./QuestionInput.module.css";

import { useTranslation } from "react-i18next";
import dpLogo from "../../assets/direct-logo.svg";
import v1Logo from "../../assets/viable-logo.svg";

interface Props {
    onSend: (question: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
    onAdjustClick?: () => void;
    onInfoClick?: () => void;
    showClearChat?: boolean;
    onClearClick?: () => void;
    onRegenerateClick?: () => void;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, onAdjustClick, showClearChat, onClearClick, onRegenerateClick }: Props) => {
    const [question, setQuestion] = useState<string>("");
    const { t } = useTranslation("common");

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }

        onSend(question);

        if (clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!newValue) {
            setQuestion("");
        } else if (newValue.length <= 1000) {
            setQuestion(newValue);
        }
    };

    const sendQuestionDisabled = disabled || !question.trim();

    const [clearChatTextEnabled, setClearChatTextEnable] = useState<boolean>(true);

    const onMouseEnter = () => {
        setClearChatTextEnable(false);
    };

    const onMouseLeave = () => {
        setClearChatTextEnable(true);
    };

    return (
        <Stack>
            <Stack.Item>
                <Stack horizontal className={styles.questionInputContainer}>
                    {showClearChat ? (
                        <div className={styles.questionClearButtonsContainer}>
                            <div
                                className={styles.questionClearChatButton}
                                aria-label="Clear chat button"
                                onClick={onClearClick}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                            >
                                <Broom28Filled
                                    primaryFill="rgba(113, 128, 150, 1)
"
                                />
                                <span id={"test"} hidden={clearChatTextEnabled}>
                                    {t("clearChat")}
                                </span>
                            </div>
                        </div>
                    ) : null}
                    <TextField
                        className={styles.questionInputTextArea}
                        placeholder={placeholder}
                        multiline
                        resizable={false}
                        autoAdjustHeight
                        borderless
                        value={question}
                        onChange={onQuestionChange}
                        onKeyDown={onEnterPress}
                    />
                    <div className={styles.questionInputButtonsContainer}>
                        <div
                            className={`${styles.questionInputSendButton} ${sendQuestionDisabled ? styles.questionInputSendButtonDisabled : ""}`}
                            aria-label="Ask question button"
                            onClick={sendQuestion}
                        >
                            <Send24Regular primaryFill="rgba(115, 118, 225, 1)" />
                        </div>
                    </div>
                </Stack>
            </Stack.Item>
            <Stack.Item align="center">
                <RAIPanel onAdjustClick={onAdjustClick} onRegenerateClick={onRegenerateClick} />
            </Stack.Item>
        </Stack>
    );
};
