import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Button, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room({leaveRoomCallback}) {
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState({});
    const {roomCode} = useParams();
    const navigate = useNavigate();

    const getRoomDetails = () => {
        fetch("/api/get-room" + "?code=" + roomCode)
            .then((response) => {
                if(!response.ok) {
                    leaveRoomCallback();
                    navigate("/");
                }
                return response.json();
            })
            .then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
                if(data.is_host) {
                    authenticateSpotify();
                }
            });
    };

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated')
        .then((response) => response.json())
        .then((data) => {
            setSpotifyAuthenticated(data.status);
            if(!data.status){
                fetch('/spotify/get-auth-url')
                .then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url);
                })
            }
        });
    };

    const getCurrentSong = () => {
        fetch('/spotify/current-song')
        .then((response) => {
            if(!response.ok) {
                return {};
            } else {
                return response.json();
            }
        })
        .then((data) => {
            setSong(data);
            console.log(data);
        });
    };

    const leaveButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        };
        fetch("/api/leave-room", requestOptions).then((response) => {
            leaveRoomCallback();
            navigate("/");
        })
    };

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage 
                        update={true} 
                        votesToSkipProp={votesToSkip} 
                        guestCanPauseProp={guestCanPause} 
                        roomCode={roomCode} 
                        updateCallback={getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    };

    useEffect(() => {
        getRoomDetails();
    }, []);

    useEffect(() => {
        const interval = setInterval(getCurrentSong, 1000);
        return () => clearInterval(interval);
    }, []);


    if(showSettings) {
        return(renderSettings());
    } else {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer 
                    image_url={song.image_url} 
                    title={song.title} 
                    artist={song.artist} 
                    is_playing={song.is_playing} 
                    time={song.time} 
                    duration={song.duration} 
                    votes={song.votes}
                    votes_required={song.votes_required}
                />
                {isHost ? renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default Room;
