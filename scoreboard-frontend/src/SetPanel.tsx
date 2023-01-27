import { Box, Typography, useTheme } from "@mui/material";
import React, { CSSProperties } from "react";
import { useGuestSet, useHomeSet } from "./Score";
import useSwipe from "./touchHandlers";

export default function SetPanel(props: {
  guest: boolean;
  sx?: CSSProperties;
}) {
  const theme = useTheme();

  const homeScore = useHomeSet();
  const guestScore = useGuestSet();

  const [set, setSet] = props.guest ? guestScore : homeScore;

  return (
    <Box
      sx={{
        ...props.sx,
        cursor: "pointer",
        userSelect: "none",
        color: theme.palette.text.primary,
      }}
      onClick={() => setSet(set + 1)}
      {...useSwipe(
        () => setSet(set + 1),
        () => setSet(Math.max(set - 1))
      )}
    >
      <Typography fontSize="20vh" align="center">
        {set}
      </Typography>
    </Box>
  );
}
