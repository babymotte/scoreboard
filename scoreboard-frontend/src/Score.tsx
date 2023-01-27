import React, { ReactElement } from "react";

type ScoreData = {
  home: {
    score: [number, (val: number) => void];
    set: [number, (val: number) => void];
  };
  guest: {
    score: [number, (val: number) => void];
    set: [number, (val: number) => void];
  };
};

const emptyScore: ScoreData = {
  home: {
    score: [0, () => {}],
    set: [0, () => {}],
  },
  guest: {
    score: [0, () => {}],
    set: [0, () => {}],
  },
};

const ScoreCtx = React.createContext<ScoreData>(emptyScore);

export default function Score(props: {
  children: ReactElement | ReactElement[];
}) {
  const [homeScore, setHomeScore] = React.useState(0);
  const [homeSet, setHomeSet] = React.useState(0);
  const [guestScore, setGuestScore] = React.useState(0);
  const [guestSet, setGuestSet] = React.useState(0);

  const score: ScoreData = {
    home: {
      score: [homeScore, setHomeScore],
      set: [homeSet, setHomeSet],
    },
    guest: {
      score: [guestScore, setGuestScore],
      set: [guestSet, setGuestSet],
    },
  };

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
