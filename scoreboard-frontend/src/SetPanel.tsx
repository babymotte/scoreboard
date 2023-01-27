import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { useGuestSet, useHomeSet } from "./Score";

export default function SetPanel(props: { guest: boolean }) {
  const theme = useTheme();

  const homeScore = useHomeSet();
  const guestScore = useGuestSet();

  const [set, setSet] = props.guest ? guestScore : homeScore;

  return (
    <Box
      sx={{
        cursor: "pointer",
        userSelect: "none",
        color: theme.palette.text.primary,
      }}
      onClick={() => setSet(set + 1)}
    >
      <Typography fontSize="20vh" align="center">
        {set}
      </Typography>
    </Box>
  );
}
