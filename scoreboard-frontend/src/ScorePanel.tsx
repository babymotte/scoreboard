import { Typography, useTheme } from "@mui/material";
import React from "react";
import { useGuestScore, useHomeScore } from "./Score";

export default function ScorePanel(props: { guest: boolean }) {
  const homeScore = useHomeScore();
  const guestScore = useGuestScore();

  const [score, setScore] = props.guest ? guestScore : homeScore;

  const theme = useTheme();

  return (
    <Typography
      sx={{
        cursor: "pointer",
        userSelect: "none",
        color: props.guest
          ? theme.palette.error.main
          : theme.palette.success.main,
      }}
      onClick={() => setScore(score + 1)}
      fontSize="55vh"
      align="center"
    >
      {score}
    </Typography>
  );
}
