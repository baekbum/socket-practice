import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import io from 'socket.io-client';

const WebRtc = () => {
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');

    const onChange = (event) => {
        const {target : {value}} = event;

        setMessage(value);
    };

    const onSend = (event) => {
        socket.emit('send-message', roomId, userId, message);
    };

    useEffect(() => {
        const uid = uuid();
        const rId = 9999;
        const socket = io.connect("http://localhost:3001/");
        
        setUserId(uid);
        setRoomId(rId);
        setSocket(socket);

        socket.emit('join-room', rId, uid);

        socket.on('user-join', (roomId, uid) => {
            alert(`${roomId}방에 ${uid}님이 입장하셨습니다.`);
        });

        socket.on('broadcast-message', (uid, msg) => {
            alert(`${uid}님의 메세지 : ${msg}`);
        });
    },[]); 

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <span>{userId}</span>
            <input type="text" name="message" onChange={onChange} />
            <button onClick={onSend}>보내기</button>
        </div>
    )
};

export default WebRtc;