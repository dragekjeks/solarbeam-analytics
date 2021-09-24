import { ExpandLess, ExpandMore } from "@material-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Hidden,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { useRouter } from "next/router";
import Image from "next/image";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {},
  list: {
    // "& > *": {
    //   paddingLeft: theme.spacing(3),
    // },
  },
  nested: {
    paddingLeft: theme.spacing(3),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

export default function AppNavigation() {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openPair, setOpenPair] = useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [address, setAddress] = React.useState("");

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <div classes={classes.root}>
      <div className={classes.toolbar}>
        <Hidden smUp implementation="css">
          <Box display="flex" alignItems="center" justifyContent="center">
            <div style={{ marginRight: 3, display: "flex", padding: 8 }}>
              <Image layout={"fixed"} src="/logo.png" width={36} height={36} />
            </div>
            <Typography variant="subtitle1" color="textPrimary" noWrap>
              Solarbeam Analytics
            </Typography>
          </Box>
        </Hidden>
      </div>
      <List className={classes.list} direction="horizontal">
        <ListItem
          key="/"
          button
          selected={router.pathname === "/"}
          onClick={() => router.push("/")}
        >
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* <ListItem button onClick={() => setOpen(!open)}>
          <ListItemText primary="Pools" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              selected={router.pathname === "/pools/recent"}
              onClick={() => router.push("/pools/recent")}
              className={classes.nested}
            >
              <ListItemText primary="Recent" />
            </ListItem>
            <ListItem
              button
              selected={router.pathname === "/pools"}
              onClick={() => router.push("/pools")}
              className={classes.nested}
            >
              <ListItemText primary="All" />
            </ListItem>
          </List>
        </Collapse> */}

        <ListItem button onClick={() => setOpenPair(!openPair)}>
          <ListItemText primary="Pairs" />
          {openPair ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openPair} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              selected={router.pathname === "/pairs/recent"}
              onClick={() => router.push("/pairs/recent")}
              className={classes.nested}
            >
              <ListItemText primary="Recent" />
            </ListItem>
            <ListItem
              button
              selected={router.pathname === "/pairs"}
              onClick={() => router.push("/pairs")}
              className={classes.nested}
            >
              <ListItemText primary="All" />
            </ListItem>

            <ListItem
              button
              selected={router.pathname === "/pairs/gainers"}
              onClick={() => router.push("/pairs/gainers")}
              className={classes.nested}
            >
              <ListItemText primary="Gainers" />
            </ListItem>
            <ListItem
              button
              selected={router.pathname === "/pairs/losers"}
              onClick={() => router.push("/pairs/losers")}
              className={classes.nested}
            >
              <ListItemText primary="Losers" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem
          key="/tokens"
          button
          selected={router.pathname.includes("tokens")}
          onClick={() => router.push("/tokens")}
        >
          <ListItemText primary="Tokens" />
        </ListItem>
        {/* <ListItem
          button
          key="/portfolio"
          selected={router.pathname.includes("/portfolio")}
          onClick={() => {
            const defaultAddress = localStorage.getItem("defaultAddress");
            if (defaultAddress) {
              router.push("/users/" + defaultAddress);
            } else {
              handleClickOpen();
            }
          }}
        >
          <ListItemText primary="Portfolio" />
        </ListItem> */}
      </List>
      <Dialog
        maxWidth="sm"
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter an address and click load.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            onChange={(event) => {
              setAddress(event.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("defaultAddress", address);
              router.push("/users/" + address);
              handleClose();
            }}
            color="primary"
          >
            Load
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
