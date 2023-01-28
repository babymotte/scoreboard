import { CssBaseline, ThemeProvider } from "@mui/material";
import { blue, grey, yellow } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { ReactNode } from "react";
import { useThemeType } from "./State";

export type ThemeType = "Red/Green" | "Blue/Yellow";
export const DEFAULT_THEME: ThemeType = "Red/Green";

const RedGreen = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: grey["300"],
    },
  },
});

const BlueYellow = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: grey["300"],
    },
    success: {
      main: blue["600"],
    },
    error: {
      main: yellow["600"],
    },
  },
});

const themes = new Map([
  ["Red/Green", RedGreen],
  ["Blue/Yellow", BlueYellow],
]);

export default function Theme(props: { children: ReactNode | ReactNode[] }) {
  const [themeType] = useThemeType();
  const theme = themes.get(themeType) || RedGreen;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}
