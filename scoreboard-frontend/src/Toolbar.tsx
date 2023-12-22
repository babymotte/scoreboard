import {
  Box,
  Button,
  Fab,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  useTheme,
} from "@mui/material";
import {
  useConnected,
  useFlipped,
  useGuestScore,
  useGuestSet,
  useGuestTeam,
  useHomeScore,
  useHomeSet,
  useHomeTeam,
  useMaster,
  useSwitched,
  useThemeType,
} from "./State";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import * as React from "react";
import { THEMES, ThemeType } from "./Theme";

export default function Toolbar(props: {}) {
  const [guestInverted, setGuestInverted] = useSwitched();

  const [controlBarOpen, setControlBarOpen] = React.useState(false);
  const [menuBarOpen, setMenuBarOpen] = React.useState(false);

  const setHomeScore = useHomeScore()[1];
  const [homeSet, setHomeSet] = useHomeSet();
  const setGuestScore = useGuestScore()[1];
  const [guestSet, setGuestSet] = useGuestSet();
  const [homeTeam] = useHomeTeam();
  const [guestTeam] = useGuestTeam();

  const theme = useTheme();

  const connected = useConnected();

  const [themeType, setThemeType] = useThemeType();

  const resetScore = () => {
    setHomeScore(0);
    setGuestScore(0);
  };

  const resetAll = () => {
    resetScore();
    setHomeSet(0);
    setGuestSet(0);
    setGuestInverted(false);
  };

  const nextSet = () => {
    setHomeScore(0);
    setGuestScore(0);
    setTimeout(switchTeams, 1000);
  };

  const setForHome = () => {
    setHomeSet(homeSet + 1);
    nextSet();
  };

  const setForGuest = () => {
    setGuestSet(guestSet + 1);
    nextSet();
  };

  const setForHomeButton = (
    <Button variant="outlined" onClick={setForHome} color="inherit">
      Set for {homeTeam || "Home"}
    </Button>
  );

  const setForGuestButton = (
    <Button variant="outlined" onClick={setForGuest} color="inherit">
      Set for {guestTeam || "Guest"}
    </Button>
  );

  const switchTeams = () => setGuestInverted(!guestInverted);

  const [master, setMaster] = useMaster();
  const [flipped, setFlipped] = useFlipped();

  const controlBar = (
    <Paper>
      <Stack
        padding={2}
        paddingLeft={6}
        paddingRight={6}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          sx={{ width: "25%" }}
          justifyContent="flex-start"
        >
          {guestInverted === flipped ? setForHomeButton : setForGuestButton}
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: "50%" }}
          justifyContent="center"
        >
          <Button variant="outlined" onClick={resetScore} color="inherit">
            Reset Score
          </Button>
          <Button variant="outlined" onClick={resetAll} color="inherit">
            Reset All
          </Button>
          <Button variant="outlined" onClick={switchTeams} color="inherit">
            Switch
          </Button>
        </Stack>
        <Stack direction="row" sx={{ width: "25%" }} justifyContent="flex-end">
          {guestInverted === flipped ? setForGuestButton : setForHomeButton}
        </Stack>
      </Stack>
    </Paper>
  );

  const menuBar = (
    <Paper>
      <Stack
        padding={2}
        paddingLeft={6}
        paddingRight={6}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Button color="inherit" variant="outlined">
          Backend:
          <Box width={theme.spacing(2)} />
          {connected ? (
            <CheckCircleIcon color="success" />
          ) : (
            <CancelIcon color="error" />
          )}
        </Button>

        <FormControlLabel
          control={
            <Switch
              checked={master}
              onChange={(e) => setMaster(e.target.checked)}
            />
          }
          label="Master"
        />
        <FormControlLabel
          control={
            <Switch
              checked={flipped}
              onChange={(e) => setFlipped(e.target.checked)}
            />
          }
          label="Flip"
        />

        <FormControl>
          <InputLabel id="theme-select-label">Theme</InputLabel>
          <Select
            labelId="theme-select-label"
            label="Theme"
            value={themeType}
            onChange={(e) => setThemeType(e.target.value as ThemeType)}
          >
            <MenuItem value={THEMES.RedGreen}>{THEMES.RedGreen}</MenuItem>
            <MenuItem value={THEMES.BlueYellow}>{THEMES.BlueYellow}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );

  return (
    <Stack
      spacing={1}
      sx={{
        position: "fixed",
        left: 0,
        rigth: 0,
        bottom: 0,
        width: "100vw",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        paddingBottom={1}
        paddingLeft={2}
        paddingRight={2}
      >
        <Fab
          onClick={() => setMenuBarOpen(!menuBarOpen)}
          size="small"
          sx={{ opacity: 0.1 }}
        >
          {menuBarOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </Fab>

        <Fab
          onClick={() => setControlBarOpen(!controlBarOpen)}
          size="small"
          sx={{ opacity: 0.1 }}
        >
          {controlBarOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </Fab>
      </Stack>
      {controlBarOpen ? controlBar : null}
      {menuBarOpen ? menuBar : null}
    </Stack>
  );
}
