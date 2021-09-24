import {
  Box,
  Container,
  Drawer,
  Hidden,
  IconButton,
  AppBar as MuiAppBar,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  Brightness4Outlined,
  Brightness7Outlined,
  CloseOutlined,
  Menu,
} from "@material-ui/icons";
import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import clsx from "clsx";
import { darkModeVar } from "app/core";
import useDetect from "../core/hooks/useDetect";
import { useReactiveVar } from "@apollo/client";
import { useRouter } from "next/router";
import Image from "next/image";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up("sm")]: {
      // width: `calc(100% - ${drawerWidth}px)`,
      // marginLeft: drawerWidth,
    },
    borderBottom:
      theme.palette.type === "light"
        ? "1px solid rgba(5, 7, 9, 0.12)"
        : "1px solid rgba(255, 255, 255, 0.12)",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    justifyContent: "flex-start",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "start",
    },
  },

  logoCentered: {
    justifyContent: "center",
  },

  menuButton: {},
}));

export default function AppBar({
  children,
  onToggleSidebar,
  open,
  mobileOpen,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const darkMode = useReactiveVar(darkModeVar);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  function onToggleDarkMode() {
    const value = !darkModeVar();
    darkModeVar(value);
    if (!value) {
      document.documentElement.classList.remove(["dark-theme"]);
      document.documentElement.style.color = "rgba(0, 0, 0, 0.87)";
    } else {
      document.documentElement.classList.add(["dark-theme"]);
      document.documentElement.style.color = "#FFFFFF";
    }
    // Last
    localStorage.setItem("darkMode", value);
  }

  const page =
    router.pathname === "/" ? "Dashboard" : router.pathname.split("/")[1];
  const { isDesktop } = useDetect();
  return (
    <MuiAppBar
      position="fixed"
      color="transparent"
      color="inherit"
      elevation={0}
      className={classes.root}
    >
      <Toolbar>
        <div className={clsx(classes.logo)}>
          <Hidden xsDown implementation="css">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-around"
            >
              <div style={{ marginRight: 10, display: "flex" }}>
                <Image
                  layout={"fixed"}
                  src="/logo.png"
                  width={36}
                  height={36}
                />
              </div>
              <Typography variant="subtitle1" color="textPrimary" noWrap>
                Solarbeam Analytics
              </Typography>
            </Box>
          </Hidden>

          <Hidden xsDown implementation="css">
            <Typography
              variant="h6"
              color="textPrimary"
              noWrap
              style={{ marginLeft: 8, marginRight: 8 }}
            >
              /
            </Typography>
          </Hidden>
          <Typography variant="subtitle1" color="textPrimary" noWrap>
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </Typography>
        </div>
        <Tooltip title="Toggle theme" enterDelay={300}>
          <IconButton
            color="default"
            aria-label="open drawer"
            edge="end"
            onClick={onToggleSidebar}
            className={classes.menuButton}
          >
            {(open && isDesktop) || (mobileOpen && !matches) ? (
              <CloseOutlined />
            ) : (
              <Menu />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </MuiAppBar>
  );
}
