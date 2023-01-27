import { Button, Fab, Paper, Stack, useTheme } from "@mui/material";
import { useGuestScore, useGuestSet, useHomeScore, useHomeSet } from "./Score";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import * as React from "react";

function ScoreControls(props: { state: [number, (val: number) => void] }) {
  const setVal = props.state[1];
  return (
    <Stack direction="row" spacing={1}>
      <Button color="inherit" variant="outlined" onClick={() => setVal(0)}>
        Reset
      </Button>
    </Stack>
  );
}

export default function Toolbar(props: {
  homeGuest: [boolean, (inverted: boolean) => void];
}) {
  const [guestInverted, setGuestInverted] = props.homeGuest;

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const guestSetState = useGuestSet();
  const guestScoreState = useGuestScore();
  const homeScoreState = useHomeScore();
  const homeSetState = useHomeSet();

  const theme = useTheme();

  const bar = (
    <Paper
      sx={{
        position: "absolute",
        left: 0,
        rigth: 0,
        bottom: 0,
        width: "100vw",
      }}
    >
      <Stack
        padding={2}
        paddingLeft={6}
        paddingRight={6}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <ScoreControls state={guestInverted ? guestSetState : homeSetState} />
        <ScoreControls
          state={guestInverted ? guestScoreState : homeScoreState}
        />

        <Button
          color="inherit"
          variant="outlined"
          onClick={() => setGuestInverted(!guestInverted)}
        >
          Switch
        </Button>

        <ScoreControls
          state={guestInverted ? homeScoreState : guestScoreState}
        />
        <ScoreControls state={guestInverted ? homeSetState : guestSetState} />
      </Stack>
    </Paper>
  );

  return (
    <>
      <Fab
        onClick={() => setDrawerOpen(!drawerOpen)}
        size="small"
        sx={{
          position: "absolute",
          right: theme.spacing(2),
          bottom: theme.spacing(drawerOpen ? 10 : 2),
          opacity: 0.2,
        }}
      >
        {drawerOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      </Fab>
      {drawerOpen ? bar : null}
    </>
  );
}
