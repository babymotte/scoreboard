import { CssBaseline, ThemeProvider } from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { ReactNode } from "react";

const DarkTheme = createTheme({
  palette: {
    mode: "dark",
    text: {
      primary: grey["300"],
    },
  },
});

export default function Theme(props: { children: ReactNode | ReactNode[] }) {
  return (
    <ThemeProvider theme={DarkTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}
