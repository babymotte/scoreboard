import { Stack, Typography } from "@mui/material";
import SetPanel from "./SetPanel";

function HomeGuestLabel(props: { guest: boolean }) {
  return (
    <Typography fontSize="10vh" align="center">
      {props.guest ? "Guest" : "Home"}
    </Typography>
  );
}

export default function Statusbar(props: { guestInverted: boolean }) {
  return (
    <Stack
      direction="row"
      sx={{
        position: "absolute",
        top: "-2vh",
        left: "1vw",
        right: "1vw",
      }}
      alignItems="center"
      justifyContent="space-between"
    >
      <SetPanel guest={props.guestInverted} />
      <HomeGuestLabel guest={props.guestInverted} />
      <HomeGuestLabel guest={!props.guestInverted} />
      <SetPanel guest={!props.guestInverted} />
    </Stack>
  );
}
