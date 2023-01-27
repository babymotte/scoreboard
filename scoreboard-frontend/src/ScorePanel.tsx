import { Grid, Typography, useTheme } from "@mui/material";
import React from "react";

export default function ScorePanel(props: { guest: boolean }) {
  const [score, setScore] = React.useState<number>(0);

  const theme = useTheme();

  return (
    <Grid
      item
      paddingTop={5}
      xs={11}
      sx={{
        cursor: "pointer",
        userSelect: "none",
        color: props.guest
          ? theme.palette.error.main
          : theme.palette.success.main,
      }}
      onClick={() => setScore(score + 1)}
    >
      <Typography fontSize="80vh" align="center">
        {score}
      </Typography>
    </Grid>
  );
}
