import { Grid } from "@mui/material";
import { Worterbuch } from "worterbuch-react";
import State from "./State";
import ScorePanel from "./ScorePanel";
import SetPanel from "./SetPanel";
import Teamlabel from "./TeamLabel";
import Theme from "./Theme";
import Toolbar from "./Toolbar";
import "./App.css";
import { config } from "./config";

function App() {
  const cfg = config();

  return (
    <Theme>
      <Worterbuch config={cfg} json>
        <State>
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
              <SetPanel guest={false} />
            </Grid>

            <Grid
              item
              xs={4}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Teamlabel guest={false} />
            </Grid>
            <Grid
              item
              xs={4}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Teamlabel guest={true} />
            </Grid>

            <Grid
              item
              xs={2}
              container
              alignItems="center"
              justifyContent="center"
            >
              <SetPanel guest={true} />
            </Grid>

            <Grid
              item
              xs={6}
              container
              alignItems="center"
              justifyContent="center"
            >
              <ScorePanel guest={false} />
            </Grid>

            <Grid
              item
              xs={6}
              container
              alignItems="center"
              justifyContent="center"
            >
              <ScorePanel guest={true} />
            </Grid>
          </Grid>

          <Toolbar />
        </State>
      </Worterbuch>
    </Theme>
  );
}

export default App;
