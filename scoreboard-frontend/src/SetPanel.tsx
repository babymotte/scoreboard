import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

export default function SetPanel(props: { guest: boolean }) {
  const theme = useTheme();

  const pos = props.guest ? { right: "3vw" } : { left: "3vw" };

  const [set, setSet] = React.useState(0);

  return (
    <Box
      sx={{
        cursor: "pointer",
        userSelect: "none",
        color: theme.palette.text.primary,
        position: "absolute",
        top: "-1vh",
        ...pos,
      }}
      onClick={() => setSet(set + 1)}
    >
      <Typography fontSize="20vh" align="center">
        {set}
      </Typography>
    </Box>
  );
}
