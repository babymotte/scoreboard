import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import { useGuestScore, useHomeScore } from "./Score";
import Teamlabel from "./TeamLabel";

export default function ScorePanel(props: { guest: boolean }) {
  const homeScore = useHomeScore();
  const guestScore = useGuestScore();

  const [score, setScore] = props.guest ? guestScore : homeScore;

  const theme = useTheme();

  return (
    <Stack
      sx={{ flexGrow: 1, width: "50%" }}
      alignItems="center"
      justifyContent="flex-start"
    >
      <Teamlabel guest={props.guest} />
      <Typography
        sx={{
          cursor: "pointer",
          userSelect: "none",
          color: props.guest
            ? theme.palette.error.main
            : theme.palette.success.main,
          marginTop: theme.spacing(-8),
        }}
        onClick={() => setScore(score + 1)}
        fontSize="80vh"
        align="center"
      >
        {score}
      </Typography>
    </Stack>
  );
}
