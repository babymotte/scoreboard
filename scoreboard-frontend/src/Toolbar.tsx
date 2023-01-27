import { Button, Fab, Paper, Stack, TextField, useTheme } from "@mui/material";
import {
  useGuestScore,
  useGuestSet,
  useGuestTeam,
  useHomeScore,
  useHomeSet,
  useHomeTeam,
} from "./Score";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import * as React from "react";

function ScoreControls(props: { state: [number, (val: number) => void] }) {
  const [val, setVal] = props.state;
  return (
    <Stack direction="row" spacing={1}>
      <Button
        color="inherit"
        variant="outlined"
        onClick={() => setVal(Math.max(0, val - 1))}
      >
        -
      </Button>
      <Button color="inherit" variant="outlined" onClick={() => setVal(0)}>
        Reset
      </Button>
      <Button
        color="inherit"
        variant="outlined"
        onClick={() => setVal(val + 1)}
      >
        +
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

  const [homeTeam, setHomeTeam] = useHomeTeam();
  const [guestTeam, setGuestTeam] = useGuestTeam();

  const setLeftTeam = guestInverted ? setGuestTeam : setHomeTeam;
  const setRightTeam = guestInverted ? setHomeTeam : setGuestTeam;

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
        padding={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <ScoreControls state={guestInverted ? guestSetState : homeSetState} />
        <ScoreControls
          state={guestInverted ? guestScoreState : homeScoreState}
        />
        <TextField
          label={guestInverted ? "Guest" : "Home"}
          variant="outlined"
          defaultValue={guestInverted ? guestTeam : homeTeam}
          onChange={(e) => setLeftTeam(e.target.value)}
        />
        <Button
          color="inherit"
          variant="outlined"
          onClick={() => setGuestInverted(!guestInverted)}
        >
          Switch
        </Button>
        <TextField
          label={guestInverted ? "Home" : "Guest"}
          variant="outlined"
          defaultValue={guestInverted ? homeTeam : guestTeam}
          onChange={(e) => setRightTeam(e.target.value)}
        />
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
