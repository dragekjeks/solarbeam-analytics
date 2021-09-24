import { green, red } from "@material-ui/core/colors";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

export const palette = {
  primary: {
    main: "#b93cf6",
  },
  positive: {
    main: green[500],
  },
  negative: {
    main: red[500],
  },
  seaweed: {
    main: "#050709",
  },
  rice: {
    main: "white",
  },
  filling: {
    main: red.A400,
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
};

const fontFamily = [
  "DM Sans",
  "Inter",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "Fira Sans",
  "Droid Sans",
  "Helvetica Neue",
  "sans-serif",
];

const overrides = {
  MuiTable: {
    root: {
      // "& > tbody > tr:last-child > *": { border: 0 },
      // "& > thead > tr > *": { border: 0 },
    },
  },
  MuiInputBase: {
    root: {
      backgroundColor: "#fff",
    },
  },
  MuiTableCell: {
    head: {
      fontWeight: 400,
      whiteSpace: "nowrap",
    },
  },
  MuiAvatarGroup: {
    avatar: {
      border: 0,
    },
  },
  MuiAvatar: {
    fallback: {},
  },
};

export const darkTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: "dark",
      text: {
        primary: "#fff",
        secondary: "rgba(255, 255, 255, 0.7)",
        disabled: "rgba(255, 255, 255, 0.5)",
      },
      action: {
        active: "#fff",
        hover: "rgba(255, 255, 255, 0.08)",
        selected: "rgba(255, 255, 255, 0.16)",
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
      },
      background: {
        default: "#080808",
        paper: "#080808",
      },
      divider: "rgba(255, 255, 255, 0.12)",
      ...palette,
    },
    typography: {
      fontFamily,
    },
    overrides,
  })
);

export const lightTheme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      type: "light",
      background: {
        default: "#FEFEFE",
        paper: "#FFFFFF",
      },
      text: {
        primary: "#050709",
        secondary: "rgba(5, 7, 9, 0.7)",
        disabled: "rgba(5, 7, 9, 0.5)",
      },
      ...palette,
    },
    typography: {
      fontFamily,
    },
    overrides,
  })
);
