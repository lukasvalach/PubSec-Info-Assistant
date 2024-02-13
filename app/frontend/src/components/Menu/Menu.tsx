import { SparkleFilled } from "@fluentui/react-icons";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import dpLogo from "../../assets/direct-logo.svg";
import v1Logo from "../../assets/viable-logo.svg";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import styles from "./Menu.module.css";

const drawerWidth = 260;

const Menu = () => {
    const { t } = useTranslation("common");
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        borderRight: "none"
                    }
                }}
            >
                <Box
                    sx={{
                        boxShadow: "0px 4px 10px 2px rgba(19, 80, 124, 0.06)",
                        margin: 1.5,
                        height: "100%",
                        position: "relative"
                    }}
                >
                    <Toolbar sx={{ display: "block", paddingTop: 5 }}>
                        <Typography component="div">
                            <Box fontWeight="fontWeightBold" display="inline">
                                Databot
                            </Box>
                        </Typography>

                        <img src={dpLogo} alt="Azure OpenAI" />
                        <Typography component="span" sx={{ fontSize: 11, m: 0.5, color: "red" }}>
                            &
                        </Typography>
                        <img src={v1Logo} alt="Azure OpenAI" />
                    </Toolbar>
                    <Box sx={{ overflow: "auto", flexGrow: 1, paddingTop: 5 }}>
                        <List>
                            {[
                                { text: "Chat UI", to: "/" },
                                { text: t("agents"), to: "/content" }
                            ].map((item, index) => (
                                <ListItem key={item.text} disablePadding>
                                    <NavLink to={item.to} className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                {index % 2 === 0 ? (
                                                    <SparkleFilled fontSize={"24px"} primaryFill="#1976d2" aria-hidden="true" aria-label="Chat logo" />
                                                ) : (
                                                    <LayersRoundedIcon color="primary" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </ListItemButton>
                                    </NavLink>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <LanguageSwitcher />
                </Box>
            </Drawer>
        </Box>
    );
};

export default Menu;
