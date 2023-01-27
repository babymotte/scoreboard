import { Divider, Grid } from "@mui/material";
import React from "react";
import ScorePanel from "./ScorePanel";
import SetPanel from "./SetPanel";
import Theme from "./Theme";

function App() {
  const [guestInverted, setGuestInverted] = React.useState(false);

  return (
    <Theme>
      <Grid
        sx={{ width: "100vw", height: "100vh" }}
        container
        direction="row"
        columns={{ xs: 25 }}
        alignItems="stretch"
        overflow="clip"
      >
        <ScorePanel guest={guestInverted} />
        <Grid
          item
          xs={1}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Divider orientation="vertical" />
        </Grid>
        <ScorePanel guest={!guestInverted} />
      </Grid>
      <SetPanel guest={guestInverted} />
      <SetPanel guest={!guestInverted} />
    </Theme>
  );
}

export default App;
