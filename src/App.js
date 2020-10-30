import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Dashboard from "./components/DashboardPage";

const useStyles = makeStyles((theme) => ({
  app: {
    display: "flex",
    flexDirection: "column"
  },
  toolBar: {
    justifyContent: "center"
  },
  main: {
    padding: theme.spacing(3)
  },
  subtitle: {
    fontWeight: 500,
    margin: "0px 0px 16px 0px"
  }
}));

function App() {
  const classes = useStyles();
  return (
    <Fragment>
      <CssBaseline />
      <div className={classes.app}>
        <AppBar position="static">
          <Toolbar className={classes.toolBar}>
            <Typography variant="h6" className={classes.title}>
              Personal Task Manager
            </Typography>
          </Toolbar>
        </AppBar>
        <main className={classes.main}>
          <Typography variant="h5" className={classes.subtitle}>
            Board
          </Typography>
          <section>
            <Dashboard />
          </section>
        </main>
      </div>
    </Fragment>
  );
}

export default App;
