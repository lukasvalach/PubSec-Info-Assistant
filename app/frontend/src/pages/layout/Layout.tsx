// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";
import Menu from "../../components/Menu/Menu";
import { WarningBanner } from "../../components/WarningBanner/WarningBanner";
import Chat from "../chat/Chat";
import styles from "./Layout.module.css";

const Layout = () => {
    return (
        <div className={styles.layout}>
            <Outlet />
        </div>
    );
};

export default Layout;
