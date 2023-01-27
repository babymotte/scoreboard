import { Typography, useTheme } from "@mui/material";
import React from "react";
import { useGuestScore, useHomeScore } from "./Score";
import useSwipe from "./touchHandlers";

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
      {...useSwipe(
        () => setScore(score + 1),
        () => setScore(Math.max(0, score - 1))
      )}
    >
      {score}
    </Typography>
  );
}
