import React, { ReactElement } from "react";

type ScoreData = {
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
};

const storeKey = "net.bbmsoft.scoreboard";

const emptyScore: ScoreData = {
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
};

const ScoreCtx = React.createContext<ScoreData>(emptyScore);

export default function Score(props: {
  children: ReactElement | ReactElement[];
}) {
  const persistedJson = window.localStorage?.getItem(storeKey);
  let initial: [number, number, string, number, number, string] = [
    0,
    0,
    "",
    0,
    0,
    "",
  ];
  if (persistedJson) {
    try {
      initial = JSON.parse(persistedJson);
    } catch {}
  }

  const [homeScore, setHomeScore] = React.useState(initial[0]);
  const [homeSet, setHomeSet] = React.useState(initial[1]);
  const [homeTeam, setHomeTeam] = React.useState(initial[2]);
  const [guestScore, setGuestScore] = React.useState(initial[3]);
  const [guestSet, setGuestSet] = React.useState(initial[4]);
  const [guestTeam, setGuestTeam] = React.useState(initial[5]);

  const score: ScoreData = {
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
  };

  const store = JSON.stringify([
    score.home.score[0],
    score.home.set[0],
    score.home.team[0],
    score.guest.score[0],
    score.guest.set[0],
    score.guest.team[0],
  ]);

  window.localStorage?.setItem(storeKey, store);

  return <ScoreCtx.Provider value={score}>{props.children}</ScoreCtx.Provider>;
}

export function useHomeScore() {
  const score = React.useContext(ScoreCtx);
  return score.home.score;
}

export function useHomeSet() {
  const score = React.useContext(ScoreCtx);
  return score.home.set;
}

export function useGuestScore() {
  const score = React.useContext(ScoreCtx);
  return score.guest.score;
}

export function useGuestSet() {
  const score = React.useContext(ScoreCtx);
  return score.guest.set;
}

export function useHomeTeam() {
  const score = React.useContext(ScoreCtx);
  return score.home.team;
}

export function useGuestTeam() {
  const score = React.useContext(ScoreCtx);
  return score.guest.team;
}
