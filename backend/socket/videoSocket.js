const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = require('wrtc');

module.exports = (socket, io) => {
    const peers = {};

    socket.on("setup", (token) => {
        const user = verifyToken(token); 
        if (!user) {
            return socket.disconnect();
        }
        console.log('User connected:', socket.id, user.id);
    });

    const createPeerConnection = () => {
        const peer = new RTCPeerConnection();
        
        peer.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('candidate', socket.id, event.candidate);
            }
        };

        return peer;
    };

    socket.on('offer', async (id, description) => {
        if (!description || typeof description !== 'object') {
            return socket.emit('error', { message: 'Invalid offer description' });
        }

        const peer = createPeerConnection();
        peers[socket.id] = peer;

        try {
            await peer.setRemoteDescription(new RTCSessionDescription(description));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit('answer', id, peer.localDescription);
        } catch (error) {
            console.error('Error handling offer:', error);
            socket.emit('error', { message: 'Failed to process offer' });
        }
    });

    socket.on('answer', async (id, description) => {
        if (!description || typeof description !== 'object') {
            return socket.emit('error', { message: 'Invalid answer description' });
        }

        const peer = peers[id];
        if (!peer) {
            return socket.emit('error', { message: 'Peer not found' });
        }

        try {
            await peer.setRemoteDescription(new RTCSessionDescription(description));
        } catch (error) {
            console.error('Error handling answer:', error);
            socket.emit('error', { message: 'Failed to process answer' });
        }
    });

    socket.on('candidate', async (id, candidate) => {
        if (!candidate || typeof candidate !== 'object') {
            return socket.emit('error', { message: 'Invalid ICE candidate' });
        }

        const peer = peers[id];
        if (!peer) {
            return socket.emit('error', { message: 'Peer not found' });
        }

        try {
            await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            socket.emit('error', { message: 'Failed to add ICE candidate' });
        }
    });

    socket.on("disconnect", () => {
        const peer = peers[socket.id];
        if (peer) {
            peer.close(); 
            delete peers[socket.id];
        }
        console.log("User disconnected:", socket.id);
    });
};