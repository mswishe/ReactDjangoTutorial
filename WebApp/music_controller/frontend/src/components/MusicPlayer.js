import React, { useState, useEffect } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

function MusicPlayer({image_url, title, artist, is_playing, time, duration, votes, votes_required}) {
    const songProgress = (time / duration) * 100;

    const skipeSong = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        };
        fetch("/spotify/skip", requestOptions);
    }

    const pauseSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type": "application/json"}
        };
        fetch("/spotify/pause", requestOptions);
    };

    const playSong = () => {
        const requestOptions = {
            method: "PUT",
            headers: {"Content-Type": "application/json"}
        };
        fetch("/spotify/play", requestOptions);
    };

    if(title == null) {
        return (<div></div>);
    }
    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src={image_url} height="100%" width="100%" />
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {artist}
                    </Typography>
                    <div>
                        <IconButton onClick={() => {
                            is_playing ? pauseSong() : playSong();
                        }}>
                            {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton onClick={() => {skipeSong()}}>
                            {votes} / {" "}{votes_required} <SkipNextIcon /> 
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    );
}

export default MusicPlayer;