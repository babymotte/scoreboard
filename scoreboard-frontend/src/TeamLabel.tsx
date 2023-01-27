import { Typography } from "@mui/material";
import { useGuestTeam, useHomeTeam } from "./Score";

export default function Teamlabel(props: { guest: boolean }) {
  const [homeTeam] = useHomeTeam();
  const [guestTeam] = useGuestTeam();

  const team = props.guest ? guestTeam || "Guest" : homeTeam || "Home";

  return (
    <Typography fontSize="10vh" align="center">
      {team}
    </Typography>
  );
}
