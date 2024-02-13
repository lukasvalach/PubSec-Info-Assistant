import { Switch, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    const [isEnSelected, setIsEnSelected] = useState(false);
    const { i18n } = useTranslation("common");
    const handleLanguageChange = () => {
        setIsEnSelected(prev => !prev);
        if (!isEnSelected) {
            i18n.changeLanguage("en");
        } else {
            i18n.changeLanguage("cs");
        }
    };

    return (
        <Toolbar
            sx={{
                justifyContent: "center",
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                marginTop: "auto"
            }}
        >
            <Typography component="span" sx={{ fontSize: 14, m: 0.5 }}>
                CZ
            </Typography>
            <Switch size="medium" checked={isEnSelected} onChange={handleLanguageChange} />
            <Typography component="span" sx={{ fontSize: 14, m: 0.5 }}>
                EN
            </Typography>
        </Toolbar>
    );
};

export default LanguageSwitcher;
