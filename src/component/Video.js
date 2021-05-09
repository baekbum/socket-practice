import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

const Video = ({ stream }) => {
    const myVideo = document.createElement('video');
    const videoGrid = useRef();

    const openMediaDevices = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        setStream(stream);
    }
    
    const addVideoStream = useCallback((video, stream) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        videoGrid.current.append(video);
    }, []);
    
    useEffect(() => {
        openMediaDevices();
        //addVideoStream(myVideo, stream);
    },[]);

    return (
        <div ref={videoGrid} style={{display: 'flex', height: '400px', width: 'inherit'}}></div>
    )
};

export default Video;