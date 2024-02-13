// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Text } from "@fluentui/react";
import { Label } from "@fluentui/react/lib/Label";
import { Separator } from "@fluentui/react/lib/Separator";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetInfoResponse, getInfoData } from "../../api";
import styles from "./InfoContent.module.css";

interface Props {
    className?: string;
}

export const InfoContent = ({ className }: Props) => {
    const { t } = useTranslation("common");
    const [infoData, setInfoData] = useState<GetInfoResponse | null>({
        AZURE_OPENAI_CHATGPT_DEPLOYMENT: "gpt-35-turbo-16k",
        AZURE_OPENAI_MODEL_NAME: "gpt-35-turbo-16k",
        AZURE_OPENAI_MODEL_VERSION: "0613",
        AZURE_OPENAI_SERVICE: "infoasst-aoai-lycpr",
        AZURE_SEARCH_INDEX: "vector-index",
        AZURE_SEARCH_SERVICE: "infoasst-search-lycpr",
        EMBEDDINGS_DEPLOYMENT: "text-embedding-ada-002",
        EMBEDDINGS_MODEL_NAME: "text-embedding-ada-002",
        EMBEDDINGS_MODEL_VERSION: "2",
        TARGET_LANGUAGE: "Czech",
        USE_AZURE_OPENAI_EMBEDDINGS: true
    });

    async function fetchInfoData() {
        console.log("InfoContent 1");
        try {
            const fetchedInfoData = await getInfoData();
            setInfoData(fetchedInfoData);
        } catch (error) {
            // Handle the error here
            console.log(error);
        }
    }

    useEffect(() => {
        fetchInfoData();
    }, []);

    return (
        <div className={styles.infoContentContainer}>
            <Separator></Separator>
            <Typography component={"h5"} fontSize={20} paddingBottom={1} fontWeight={600}>
                {t("info.azureOpenAI.title")}
            </Typography>
            <Label>{t("info.azureOpenAI.instance")}</Label>
            <Text>{infoData?.AZURE_OPENAI_SERVICE}</Text>
            <Label>{t("info.azureOpenAI.gptDeploymentName")}</Label>
            <Text>{infoData?.AZURE_OPENAI_CHATGPT_DEPLOYMENT}</Text>
            <Label>{t("info.azureOpenAI.gptModelName")}</Label>
            <Text>{infoData?.AZURE_OPENAI_MODEL_NAME}</Text>
            <Label>{t("info.azureOpenAI.gptModelVersion")}</Label>
            <Text>{infoData?.AZURE_OPENAI_MODEL_VERSION}</Text>
            {infoData?.USE_AZURE_OPENAI_EMBEDDINGS ? (
                <div>
                    <Label>{t("info.azureOpenAI.embeddingsDeploymentName")}</Label>
                    <Text>{infoData?.EMBEDDINGS_DEPLOYMENT}</Text>
                    <Label>{t("info.azureOpenAI.embeddingsModelName")}</Label>
                    <Text>{infoData?.EMBEDDINGS_MODEL_NAME}</Text>
                    <Label>{t("info.azureOpenAI.embeddingsModelVersion")}</Label>
                    <Text>{infoData?.EMBEDDINGS_MODEL_VERSION}</Text>
                </div>
            ) : (
                <div>
                    <Separator>{t("info.azureOpenAI.openSourceEmbeddings")}</Separator>
                    <Label>{t("info.azureOpenAI.embeddingsModel")}</Label>
                    <Text>{infoData?.EMBEDDINGS_DEPLOYMENT}</Text>
                </div>
            )}
            <Separator></Separator>
            <Typography component={"h5"} fontSize={20} paddingBottom={1} fontWeight={600}>
                {t("info.azureAISearch.title")}
            </Typography>
            <Label>{t("info.azureAISearch.serviceName")}</Label>
            <Text>{infoData?.AZURE_SEARCH_SERVICE}</Text>
            <Label>{t("info.azureAISearch.indexName")}</Label>
            <Text>{infoData?.AZURE_SEARCH_INDEX}</Text>
            <Separator></Separator>
            <Typography component={"h5"} fontSize={20} paddingBottom={1} fontWeight={600}>
                {t("info.systemConfiguration.title")}
            </Typography>
            <Label>{t("info.systemConfiguration.systemLanguage")}</Label>
            <Text>{infoData?.TARGET_LANGUAGE}</Text>
        </div>
    );
};
