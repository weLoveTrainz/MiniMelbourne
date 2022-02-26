import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import trainIcon from "../../assets/Train.png";
import trainStationIcon from "../../assets/TrainStation.png";
import Box from "@mui/material/Box";

export const cardType = {
  TRAIN: "TRAIN",
  STATION: "STATION",
};

const useStyles = makeStyles({
  root: {
    position: "absolute",
    width: "380px",
    height: "160px",
    left: "0px",
    top: "0px",

    /* /Gray / White */

    background: "#FFFFFF",
    /* Stroke/light */

    border: "1px solid #DEE2E6",
    /* Shadow / Small */

    boxShadow:
      "0px 0px 2px rgba(0, 0, 0, 0.12), 0px 20px 20px rgba(0, 0, 0, 0.08)",
  },
  title: {
    fontFamily: "Helvetica Neue",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: "20px",
    lineHeight: "24px",

    /* Secondary/Dark Color */
    color: "#54595E",

    /* Inside auto layout */
    flex: "none",
    order: "0",
    flexGrow: "0",
  },
  subtitle: {
    fontWeight: "400",
  },
});

const Dialog = (props) => {
  const classes = useStyles();
  return (
    <Card
      className={classes.root}
      raised={true}
      sx={{
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 56, margin: 2, alignSelf: "start"}}
        image={props.type === cardType.TRAIN ? trainIcon : trainStationIcon}
        alt="Live from space album cover"
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography
            variant="h5"
            component="div"
            className={classes.title}
            sx={{ marginBottom: "10px" }}
          >
            {props.title}
          </Typography>

          {props.cardType === cardType.STATION && (
            <div>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                <span className={classes.subtitle}>Next Station:</span>{" "}
                {props.nextStation}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                <span className={classes.subtitle}>ETA:</span> {props.etaTime}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                <span className={classes.subtitle}>Train Occupancy:</span>{" "}
                {props.occupancy}
              </Typography>
            </div>
          )}

          {props.cardType === cardType.TRAIN && (
            <div>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                <span className={classes.subtitle}>Car Park Occupancy:</span>{" "}
                {props.carParkOccupancy}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                <span className={classes.subtitle}>Expected Occupancy:</span>{" "}
                {props.carParkOccupancy}
              </Typography>
            </div>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export default Dialog;
