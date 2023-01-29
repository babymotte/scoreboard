import {
  Box,
  Button,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  useTheme,
} from "@mui/material";
import {
  useConnected,
  useGuestScore,
  useGuestSet,
  useGuestTeam,
  useHomeScore,
  useHomeSet,
  useHomeTeam,
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

  const resetAll = () => {
    setHomeScore(0);
    setGuestScore(0);
    setHomeSet(0);
    setGuestSet(0);
    setGuestInverted(false);
  };

  const setForHome = () => {
    setHomeSet(homeSet + 1);
    setHomeScore(0);
    setGuestScore(0);
    setTimeout(switchTeams, 1000);
  };

  const setForGuest = () => {
    setGuestSet(guestSet + 1);
    setHomeScore(0);
    setGuestScore(0);
    setTimeout(switchTeams, 1000);
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
          sx={{ width: "33%" }}
          justifyContent="flex-start"
        >
          {guestInverted ? setForGuestButton : setForHomeButton}
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: "33%" }}
          justifyContent="center"
        >
          <Button variant="outlined" onClick={resetAll} color="inherit">
            Reset All
          </Button>
          <Button variant="outlined" onClick={switchTeams} color="inherit">
            Switch
          </Button>
        </Stack>
        <Stack direction="row" sx={{ width: "33%" }} justifyContent="flex-end">
          {guestInverted ? setForHomeButton : setForGuestButton}
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
