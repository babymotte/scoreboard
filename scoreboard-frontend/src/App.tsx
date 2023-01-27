import { Grid } from "@mui/material";
import React from "react";
import Score from "./Score";
import ScorePanel from "./ScorePanel";
import SetPanel from "./SetPanel";
import Teamlabel from "./TeamLabel";
import Theme from "./Theme";
import Toolbar from "./Toolbar";
import "./App.css";

function App() {
  const [guestInverted, setGuestInverted] = React.useState(false);

  return (
    <Theme>
      <Score>
        <Grid
          container
          sx={{ width: "100vw", height: "100vh", overflow: "clip" }}
          direction="row"
        >
          <Grid
            item
            xs={2}
            container
            alignItems="center"
            justifyContent="center"
          >
            <SetPanel guest={guestInverted} />
          </Grid>

          <Grid
            item
            xs={4}
            container
            alignItems="center"
            justifyContent="center"
          >
            <Teamlabel guest={guestInverted} />
          </Grid>
          <Grid
            item
            xs={4}
            container
            alignItems="center"
            justifyContent="center"
          >
            <Teamlabel guest={!guestInverted} />
          </Grid>

          <Grid
            item
            xs={2}
            container
            alignItems="center"
            justifyContent="center"
          >
            <SetPanel guest={!guestInverted} />
          </Grid>

          <Grid
            item
            xs={6}
            container
            alignItems="center"
            justifyContent="center"
          >
            <ScorePanel guest={guestInverted} />
          </Grid>

          <Grid
            item
            xs={6}
            container
            alignItems="center"
            justifyContent="center"
          >
            <ScorePanel guest={!guestInverted} />
          </Grid>
        </Grid>

        <Toolbar homeGuest={[guestInverted, setGuestInverted]} />
      </Score>
    </Theme>
  );
}

export default App;
