import React, { ReactElement } from "react";
import { useSet, useSubscribe, useWorterbuchConnected } from "worterbuch-react";
import { DEFAULT_THEME, ThemeType } from "./Theme";

type ApplicationState = {
  home: {
    score: [number, (val: number) => void];
    set: [number, (val: number) => void];
    team: [string, (val: string) => void];
  };
  guest: {
    score: [number, (val: number) => void];
    set: [number, (val: number) => void];
    team: [string, (val: string) => void];
  };
  switched: [boolean, (val: boolean) => void];
  themeType: [ThemeType, (val: ThemeType) => void];
  connected: boolean;
  master: [boolean, (val: boolean) => void];
};

const storeKey = "net.bbmsoft.scoreboard";

const emptyScore: ApplicationState = {
  home: {
    score: [0, () => {}],
    set: [0, () => {}],
    team: ["", (val: string) => {}],
  },
  guest: {
    score: [0, () => {}],
    set: [0, () => {}],
    team: ["", (val: string) => {}],
  },
  switched: [false, () => {}],
  themeType: [DEFAULT_THEME, () => {}],
  connected: false,
  master: [false, () => {}],
};

const StateCtx = React.createContext<ApplicationState>(emptyScore);

const SCOREBOARD = "scoreboard";
const HOME = "home";
const GUEST = "guest";
const SCORE = "score";
const SET = "set";
const TEAM = "team";
const SWITCHED = "switched";
const THEME = "theme";

export default function State(props: {
  children: ReactElement | ReactElement[];
}) {
  const set = useSet();
  const [connected] = useWorterbuchConnected();
  const [wasConnectedBefore, setWasConnectedBefore] = React.useState(false);
  const [wasRecentlyConnected, setWasRecentlyConnected] = React.useState(false);
  const [needsSync, setNeedsSync] = React.useState(false);
  const [isSynced, setIsSynced] = React.useState(false);

  const persistedJson = window.localStorage?.getItem(storeKey);

  let initial: [
    number,
    number,
    string,
    number,
    number,
    string,
    boolean,
    ThemeType,
    boolean
  ] = [0, 0, "", 0, 0, "", false, DEFAULT_THEME, false];
  if (persistedJson) {
    try {
      initial = JSON.parse(persistedJson);
    } catch {}
  }

  const [localHomeScore, setLocalHomeScore] = React.useState(initial[0] || 0);
  const [localHomeSet, setLocalHomeSet] = React.useState(initial[1] || 0);
  const [localHomeTeam, setLocalHomeTeam] = React.useState(initial[2] || "");
  const [localGuestScore, setLocalGuestScore] = React.useState(initial[3] || 0);
  const [localGuestSet, setLocalGuestSet] = React.useState(initial[4] || 0);
  const [localGuestTeam, setLocalGuestTeam] = React.useState(initial[5] || "");
  const [localSwitched, setLocalSwitched] = React.useState(initial[6] || false);
  const [localTheme, setLocalTheme] = React.useState(
    initial[7] || DEFAULT_THEME
  );
  const [isMaster, setIsMaster] = React.useState(initial[8] || false);

  const remoteHomeScore = useSubscribe<number>(SCOREBOARD, HOME, SCORE);
  const remoteHomeSet = useSubscribe<number>(SCOREBOARD, HOME, SET);
  const remoteHomeTeam = useSubscribe<string>(SCOREBOARD, HOME, TEAM);
  const remoteGuestScore = useSubscribe<number>(SCOREBOARD, GUEST, SCORE);
  const remoteGuestSet = useSubscribe<number>(SCOREBOARD, GUEST, SET);
  const remoteGuestTeam = useSubscribe<string>(SCOREBOARD, GUEST, TEAM);
  const remoteSwitched = useSubscribe<boolean>(SCOREBOARD, SWITCHED);
  const remoteTheme = useSubscribe<ThemeType>(SCOREBOARD, THEME);

  console.log("isSynced", isSynced, "connected", connected);

  React.useEffect(() => {
    if (connected && isSynced) {
      console.log("Syncing to local");

      // Sync remote state to local
      if (remoteHomeScore !== undefined && remoteHomeScore !== localHomeScore)
        setLocalHomeScore(remoteHomeScore);
      if (remoteHomeSet !== undefined && remoteHomeSet !== localHomeSet)
        setLocalHomeSet(remoteHomeSet);
      if (remoteHomeTeam !== undefined && remoteHomeTeam !== localHomeTeam)
        setLocalHomeTeam(remoteHomeTeam);
      if (
        remoteGuestScore !== undefined &&
        remoteGuestScore !== localGuestScore
      )
        setLocalGuestScore(remoteGuestScore);
      if (remoteGuestSet !== undefined && remoteGuestSet !== localGuestSet)
        setLocalGuestSet(remoteGuestSet);
      if (remoteGuestTeam !== undefined && remoteGuestTeam !== localGuestTeam)
        setLocalGuestTeam(remoteGuestTeam);
      if (remoteSwitched !== undefined && remoteSwitched !== localSwitched)
        setLocalSwitched(remoteSwitched);
      if (remoteTheme !== undefined && remoteTheme !== localTheme)
        setLocalTheme(remoteTheme);
    }
  }, [
    connected,
    isSynced,
    localGuestScore,
    localGuestSet,
    localGuestTeam,
    localHomeScore,
    localHomeSet,
    localHomeTeam,
    localSwitched,
    localTheme,
    remoteGuestScore,
    remoteGuestSet,
    remoteGuestTeam,
    remoteHomeScore,
    remoteHomeSet,
    remoteHomeTeam,
    remoteSwitched,
    remoteTheme,
  ]);

  React.useEffect(() => {
    if (connected) {
      if (!wasConnectedBefore) {
        setWasConnectedBefore(true);
        setIsSynced(true);
      } else if (!wasRecentlyConnected) {
        setNeedsSync(true);
      }
    } else {
      setIsSynced(false);
    }

    if (connected !== wasRecentlyConnected) {
      setWasRecentlyConnected(connected);
    }
  }, [connected, isMaster, wasConnectedBefore, wasRecentlyConnected]);

  const setRemoteHomeScore = (val: number) =>
    set([SCOREBOARD, HOME, SCORE], val);
  const setRemoteHomeSet = (val: number) => set([SCOREBOARD, HOME, SET], val);
  const setRemoteHomeTeam = (val: string) => set([SCOREBOARD, HOME, TEAM], val);
  const setRemoteGuestScore = (val: number) =>
    set([SCOREBOARD, GUEST, SCORE], val);
  const setRemoteGuestSet = (val: number) => set([SCOREBOARD, GUEST, SET], val);
  const setRemoteGuestTeam = (val: string) =>
    set([SCOREBOARD, GUEST, TEAM], val);
  const setRemoteSwitched = (val: boolean) => set([SCOREBOARD, SWITCHED], val);
  const setRemoteTheme = (val: ThemeType) => set([SCOREBOARD, THEME], val);

  if (needsSync) {
    setNeedsSync(false);
    if (isMaster) {
      console.log("pushing to remote");
      setRemoteHomeScore(localHomeScore);
      setRemoteHomeSet(localHomeSet);
      setRemoteHomeTeam(localHomeTeam);
      setRemoteGuestScore(localGuestScore);
      setRemoteGuestSet(localGuestSet);
      setRemoteGuestTeam(localGuestTeam);
      setRemoteSwitched(localSwitched);
      setRemoteTheme(localTheme);
    }
    setIsSynced(true);
  }

  const setHomeScore = connected ? setRemoteHomeScore : setLocalHomeScore;
  const setHomeSet = connected ? setRemoteHomeSet : setLocalHomeSet;
  const setHomeTeam = connected ? setRemoteHomeTeam : setLocalHomeTeam;
  const setGuestScore = connected ? setRemoteGuestScore : setLocalGuestScore;
  const setGuestSet = connected ? setRemoteGuestSet : setLocalGuestSet;
  const setGuestTeam = connected ? setRemoteGuestTeam : setLocalGuestTeam;
  const setSwitched = connected ? setRemoteSwitched : setLocalSwitched;
  const setTheme = connected ? setRemoteTheme : setLocalTheme;

  const homeScore =
    connected && remoteHomeScore !== undefined
      ? remoteHomeScore
      : localHomeScore;
  const homeSet =
    connected && remoteHomeSet !== undefined ? remoteHomeSet : localHomeSet;
  const homeTeam =
    connected && remoteHomeTeam !== undefined ? remoteHomeTeam : localHomeTeam;

  const guestScore =
    connected && remoteGuestScore !== undefined
      ? remoteGuestScore
      : localGuestScore;
  const guestSet =
    connected && remoteGuestSet !== undefined ? remoteGuestSet : localGuestSet;
  const guestTeam =
    connected && remoteGuestTeam !== undefined
      ? remoteGuestTeam
      : localGuestTeam;

  const theme =
    connected && remoteTheme !== undefined ? remoteTheme : localTheme;

  const switched =
    connected && remoteSwitched !== undefined ? remoteSwitched : localSwitched;

  const state: ApplicationState = {
    home: {
      score: [homeScore, setHomeScore],
      set: [homeSet, setHomeSet],
      team: [homeTeam, setHomeTeam],
    },
    guest: {
      score: [guestScore, setGuestScore],
      set: [guestSet, setGuestSet],
      team: [guestTeam, setGuestTeam],
    },
    switched: [switched, setSwitched],
    themeType: [theme, setTheme],
    connected,
    master: [isMaster, setIsMaster],
  };

  const store = JSON.stringify([
    state.home.score[0],
    state.home.set[0],
    state.home.team[0],
    state.guest.score[0],
    state.guest.set[0],
    state.guest.team[0],
    state.switched[0],
    state.themeType[0],
    state.master[0],
  ]);

  window.localStorage?.setItem(storeKey, store);

  return <StateCtx.Provider value={state}>{props.children}</StateCtx.Provider>;
}

export function useHomeScore() {
  const state = React.useContext(StateCtx);
  return state.home.score;
}

export function useHomeSet() {
  const state = React.useContext(StateCtx);
  return state.home.set;
}

export function useGuestScore() {
  const state = React.useContext(StateCtx);
  return state.guest.score;
}

export function useGuestSet() {
  const state = React.useContext(StateCtx);
  return state.guest.set;
}

export function useHomeTeam() {
  const state = React.useContext(StateCtx);
  return state.home.team;
}

export function useGuestTeam() {
  const state = React.useContext(StateCtx);
  return state.guest.team;
}

export function useSwitched() {
  const state = React.useContext(StateCtx);
  return state.switched;
}

export function useConnected() {
  const state = React.useContext(StateCtx);
  return state.connected;
}

export function useThemeType() {
  const state = React.useContext(StateCtx);
  return state.themeType;
}

export function useMaster() {
  const state = React.useContext(StateCtx);
  return state.master;
}
