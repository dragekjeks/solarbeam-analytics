import { Container, Drawer, Hidden, useMediaQuery } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import AppBar from "./AppBar";
import AppFooter from "./AppFooter";
import AppNavigation from "./AppNavigation";
import clsx from "clsx";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaperMobile: {
    width: drawerWidth,
    border: 0,
  },
  content: {
    padding: theme.spacing(3, 0),
    flexGrow: 1,
    width: "100%",
    marginRight: 0,
  },
  contentShift: {
    marginLeft: 0,
    marginRight: drawerWidth,
  },
}));

function AppShell(props) {
  const { window, children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true);

  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const onToggleSidebar = () => {
    if (!matches) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  return (
    <div className={classes.root}>
      <AppBar
        onToggleSidebar={onToggleSidebar}
        open={open}
        mobileOpen={mobileOpen}
      />
      <nav className={classes.drawer} aria-label="navigation">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="js">
          <Drawer
            container={container}
            variant="temporary"
            anchor={"right"}
            open={mobileOpen}
            onClose={onToggleSidebar}
            classes={{
              paper: classes.drawerPaperMobile,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <AppNavigation />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={open}
            transitionDuration={0}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <AppNavigation />
          </Drawer>
        </Hidden>
      </nav>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open || !matches,
        })}
      >
        <div className={classes.toolbar} />
        {children && <Container maxWidth="xl">{children}</Container>}
        {/* <AppFooter /> */}
      </main>
    </div>
  );
}

export default AppShell;
