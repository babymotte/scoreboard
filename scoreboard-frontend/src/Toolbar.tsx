import { Button, Paper, Stack } from "@mui/material";
import { useGuestScore, useGuestSet, useHomeScore, useHomeSet } from "./Score";

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

  const guestSetState = useGuestSet();
  const guestScoreState = useGuestScore();
  const homeScoreState = useHomeScore();
  const homeSetState = useHomeSet();

  return (
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
}
