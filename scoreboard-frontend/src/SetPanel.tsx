import { Box, Typography, useTheme } from "@mui/material";
import React, { CSSProperties } from "react";
import { useGuestSet, useHomeSet, useSwitched } from "./State";
import useSwipe from "./touchHandlers";

export default function SetPanel(props: {
  guest: boolean;
  sx?: CSSProperties;
}) {
  const theme = useTheme();

  const homeScore = useHomeSet();
  const guestScore = useGuestSet();

  const [guestInverted] = useSwitched();
  const guest = props.guest !== guestInverted;

  const [set, setSet] = guest ? guestScore : homeScore;

  return (
    <Box
      sx={{
        ...props.sx,
        cursor: "pointer",
        userSelect: "none",
        color: theme.palette.text.primary,
        touchAction: "none",
      }}
      onClick={() => setSet(set + 1)}
      {...useSwipe(
        () => setSet(set + 1),
        () => setSet(Math.max(0, set - 1))
      )}
    >
      <Typography fontSize="20vh" align="center">
        {set}
      </Typography>
    </Box>
  );
}
