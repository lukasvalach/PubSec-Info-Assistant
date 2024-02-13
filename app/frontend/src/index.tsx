// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { initializeIcons } from "@fluentui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";

import "./index.css";

import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import NoPage from "./pages/NoPage";
import Chat from "./pages/chat/Chat";
import Content from "./pages/content/Content";
import Layout from "./pages/layout/Layout";
import common_cs from "./translations/cs/common.json";
import common_en from "./translations/en/common.json";

initializeIcons();

const customTheme: ThemeOptions = createTheme({
    typography: palette => ({
        fontFamily: `'Poppins', sans-serif`,
        allVariants: {
            color: "rgba(27, 37, 89, 1)"
        }
    })
});

i18next.init({
    interpolation: { escapeValue: false },
    lng: "cs", // language to use
    resources: {
        en: {
            common: common_en
        },
        cs: {
            common: common_cs
        }
    }
});

export default function App() {
    return (
        <HashRouter>
            <ThemeProvider theme={customTheme}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Chat />} />
                        <Route path="content" element={<Content />} />
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </ThemeProvider>
        </HashRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <App />
        </I18nextProvider>
    </React.StrictMode>
);
