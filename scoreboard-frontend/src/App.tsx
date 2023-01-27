import { Divider, Stack } from "@mui/material";
import React from "react";
import Score from "./Score";
import ScorePanel from "./ScorePanel";
import Statusbar from "./Statusbar";
import Theme from "./Theme";
import Toolbar from "./Toolbar";

function App() {
  const [guestInverted, setGuestInverted] = React.useState(false);

  return (
    <Theme>
      <Score>
        <Statusbar guestInverted={guestInverted} />
        <Stack
          sx={{ width: "100vw", height: "100vh" }}
          direction="row"
          alignItems="stretch"
          overflow="clip"
        >
          <ScorePanel guest={guestInverted} />
          <Divider orientation="vertical" />
          <ScorePanel guest={!guestInverted} />
        </Stack>
        <Toolbar homeGuest={[guestInverted, setGuestInverted]} />
      </Score>
    </Theme>
  );
}

export default App;
