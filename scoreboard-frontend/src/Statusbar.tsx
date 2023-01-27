import { Stack } from "@mui/material";
import SetPanel from "./SetPanel";

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
      <SetPanel guest={!props.guestInverted} />
    </Stack>
  );
}
