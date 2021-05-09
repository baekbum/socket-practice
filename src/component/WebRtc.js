import React, { memo, useCallback, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import '../css/WebRtc.css';

const WebRtc = memo(() => {
    const roomId = 9999;
    const socket= io.connect("http://localhost:3001/");
    const myPeer = new Peer();
    const peers = {};
    const myVideo = document.createElement('video');
    const videoGrid = useRef();

    const openMediaDevices = useCallback(async () => {
        return await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    }, []);

    const addVideoStream = useCallback((video, stream) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
        videoGrid.current.append(video);
    }, []);   

    const connectToNewUser = useCallback((userId, stream) => {
        const call = myPeer.call(userId, stream); // 새로 입장한 유저에게 내 스트림 정보를 보냄 (1)
        const video = document.createElement('video');

        call.on('stream', (userVideoStream) => { // 상대방에게 전달 받은 내 화면에 video 추가 (4)
            addVideoStream(video, userVideoStream);
        });
        call.on('close', () => {
            video.remove();
        });

        peers[userId] = call;
    }, []);

    useEffect(() => {
        let stream = null;
        const init = async () => {
            stream = await openMediaDevices();
            addVideoStream(myVideo, stream);
        }

        init();

        myPeer.on('open', (userId) => {
            socket.emit('join-room', roomId, userId);
        });

        myPeer.on('call', (call) => {
            call.answer(stream); // 상대방에게 내 스트림 전달 (3)
            const video = document.createElement('video');

            call.on('stream', (userVideoStream) => { // 상대방이 보내준 스트림 정보를 받아서 내 화면에 video 추가 (2)
              addVideoStream(video, userVideoStream);
            });
        });

        socket.on('user-join', (roomId, userId) => {
            console.log(`${roomId}방에 ${userId}님이 입장하셨습니다.`);
            connectToNewUser(userId, stream);
        });

        socket.on('user-out', (userId) => {
            if (peers[userId]) {
                peers[userId].close();
            }
        });
    },[]); 

    return (
        <div ref={videoGrid} id='video-grid'></div>
    )
});

export default WebRtc;