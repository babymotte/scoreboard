import { Typography, useTheme } from "@mui/material";
import React from "react";
import { useFlipped, useGuestScore, useHomeScore, useSwitched } from "./State";
import useSwipe from "./touchHandlers";

export default function ScorePanel(props: { guest: boolean }) {
  const homeScore = useHomeScore();
  const guestScore = useGuestScore();

  const [guestInverted] = useSwitched();
  const [guestFlipped] = useFlipped();
  const guest = (props.guest !== guestInverted) !== guestFlipped;

  const [score, setScore] = guest ? guestScore : homeScore;

  const theme = useTheme();

  return (
    <Typography
      sx={{
        cursor: "pointer",
        userSelect: "none",
        color: guest ? theme.palette.error.main : theme.palette.success.main,
        touchAction: "none",
      }}
      onClick={() => setScore(score + 1)}
      fontSize="50vh"
      align="center"
      marginTop={-10}
      {...useSwipe(
        () => setScore(score + 1),
        () => setScore(Math.max(0, score - 1))
      )}
    >
      {score}
    </Typography>
  );
}
