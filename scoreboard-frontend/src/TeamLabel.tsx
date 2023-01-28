import { TextField, Typography } from "@mui/material";
import React from "react";
import { useGuestTeam, useHomeTeam, useSwitched } from "./State";

export default function Teamlabel(props: { guest: boolean }) {
  const [homeTeam, setHomeTeam] = useHomeTeam();
  const [guestTeam, setGuestTeam] = useGuestTeam();

  const [guestInverted] = useSwitched();
  const guest = props.guest !== guestInverted;

  const rawTeam = guest ? guestTeam : homeTeam;
  const team = guest ? guestTeam || "Guest" : homeTeam || "Home";
  const setTeam = guest ? setGuestTeam : setHomeTeam;

  const [editing, setEditing] = React.useState(false);

  const label = (
    <Typography fontSize="10vh" align="center" onClick={() => setEditing(true)}>
      {team}
    </Typography>
  );

  const editor = (
    <TextField
      size="medium"
      autoFocus
      defaultValue={rawTeam}
      sx={{ cursor: "pointer" }}
      onChange={(e) => setTeam(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setEditing(false);
        }
      }}
      onBlur={() => setEditing(false)}
      inputProps={{ min: 0, style: { textAlign: "center", fontSize: "5vh" } }}
    ></TextField>
  );

  return <>{editing ? editor : label}</>;
}
