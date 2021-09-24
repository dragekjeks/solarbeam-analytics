import Box from "@material-ui/core/Box";
import MuiLink from "@material-ui/core/Link";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(4, 0),
  },
}));

export default function AppFooter() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box component="footer">
        <Box>
          <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <MuiLink color="inherit" href="/">
              Solarbeam
            </MuiLink>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
