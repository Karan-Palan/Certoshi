import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Box, Typography } from "@material-ui/core";
import ErrorImage from "../Images/error_image.png";
import NotFoundImage from "../Images/qns_image.png";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    },
    paper: {
        textAlign: "center",
        padding: "30px",
        margin: "30px",
        width: "100%",
        maxWidth: "600px",
    },
    image: {
        width: "100%",
    },
    button: {
        marginTop: theme.spacing(3),
    },
}));

export function Error({ message, notFound, label, buttonText }) {
    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Paper className={classes.paper} elevation={3}>
                <Typography variant="h5" color="primary">
                    {message}
                </Typography>

                {/* Conditional image rendering */}
                <img
                    src={notFound ? NotFoundImage : ErrorImage}
                    alt={notFound ? "Not Found" : "Error"}
                    className={classes.image}
                />

                <Typography variant="subtitle1">{label}</Typography>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => window.location.reload()}
                >
                    {buttonText}
                </Button>
            </Paper>
        </Box>
    );
}
