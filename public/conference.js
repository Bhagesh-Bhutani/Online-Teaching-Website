// ************** Paste firebaseConfig below **********

// var firebaseConfig = {
//   };


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database=firebase.database();

// Utility function to update the List of Participants
function util(){
    $('#slide-out').empty();
    $('#slide-out').append(`<li><div class="user-view">
                                <div class="background teal lighten-2">
                                
                                </div>
                                List of Participants
                            </div></li>`);
}

// Socket
window.socket=io.connect('',{query : `name=${name}&myclass=${myclass}&category=${category}`})
let config={
    'iceServers': [{'urls': ['stun:stun.l.google.com:19302'
                            ]}]
}
// Media stream constraints for the local user
let mediaStreamConstraints = {
    video: false,
    audio:true,
    'iceServers': [{'urls': ['stun:stun.l.google.com:19302'
                            ]}]
};

let displayStreamConstraints = {
    video : true,
    audio : true,
    'iceServers': [{'urls': ['stun:stun.l.google.com:19302'
                            ]}]
}

if(category.localeCompare('teacher')===0){
    mediaStreamConstraints={
        video: true,
        audio:true,
        'iceServers': [{'urls': ['stun:stun.l.google.com:19302'
                            ]}]
    }
    $('body').append('<a href="#" id="unmute_all" class="waves-effect waves-light btn-large" style="position: fixed;bottom:40%;right:1%;z-index:0;">Unmute All</a>')
    $('body').append('<a href="#" id="mute_all" class="waves-effect waves-light btn-large" style="position: fixed;bottom:30%;right:1%;z-index:0;">Mute All</a>')
    $('body').append('<a href="#" id="hide_vid" class="waves-effect waves-light btn-large" style="position: fixed;bottom:20%;right:1%;z-index:0;">Hide Video</a>')
}
const offerOptions = {
    offerToReceiveVideo: 1,
};
let localVideo;
if(category.localeCompare('teacher')===0){
    localVideo=document.createElement('video');
    localVideo.setAttribute('zoom','out');
    localVideo.setAttribute('data-toggle','tooltip');
    localVideo.setAttribute('data-placement','top');
    localVideo.setAttribute('title','Click to zoom in/out');
} else {
    localVideo=document.createElement('audio');
}
localVideo.autoplay=true;
localVideo.playsinline=true;
localVideo.muted=true;
document.getElementsByClassName('videos')[0].appendChild(localVideo);
let localStream;
let localUserId;
let connections = [];
let local_screen_stream;
let local_stream_video;

// Function to handle the received remote streams of fellow peers
function gotRemoteStream(event, userId, isScreen) {
    console.log("Got remote stream called")
    // var remoteVideo;
    // let prev_a=$(`video[data-socket=${userId}]`);
    // let prev_v=$(`audio[data-socket=${userId}]`);
    // console.log(prev_a);
    // console.log(prev_v);
    // if(prev_a!==undefined){
    //     prev_a.remove();
    // }
    
    // if(prev_v!==undefined){
    //     prev_v.remove();
    //     console.log("vid removed")
    // }
    // // console.log(prev);
    
    if(event.stream.getVideoTracks().length===0){
        remoteVideo=document.createElement('audio');
    } else {
        console.log("creating vid")
        remoteVideo=document.createElement('video');
        remoteVideo.setAttribute('data-toggle','tooltip');
        remoteVideo.setAttribute('data-placement','top');
        remoteVideo.setAttribute('class','materialboxed');
        $('.materialboxed').materialbox();
    }
    console.log("R o:",remoteVideo)
    remoteVideo.setAttribute('data-socket', userId);
    remoteVideo.srcObject   = event.stream;
    console.log(event.stream.getVideoTracks().length);
    remoteVideo.autoplay    = true;
    remoteVideo.muted       = false;
    remoteVideo.playsinline = true;
    document.querySelector('.videos').appendChild(remoteVideo);
}

// Function called after getting ICE Candidate
function gotIceCandidate(fromId, candidate) {
    connections[fromId].addIceCandidate(new RTCIceCandidate(candidate)).catch(handleError);
}

// Basically the function which calls other utility functions in a promisified manner
function startLocalStream() {
    $('.videos').empty();
    navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    .then(getUserMediaSuccess)
    .then(connectSocketToSignaling).then(()=>{console.log(socket)}).catch(handleError);
}

function startScreenShare(){
    socket.disconnect();
    connections=[]
    socket.connect();
    mediaStreamConstraints.video=true;
    $('.videos').empty();
    navigator.mediaDevices.getDisplayMedia(mediaStreamConstraints)
    .then(getUserMediaSuccess)
    .then(connectSocketToSignaling).then(()=>{console.log(socket)}).catch(handleError);
}

// Function to connect the socket to signalling
function connectSocketToSignaling() {
    localUserId = socket.id;
    console.log('localUser', localUserId);
    socket.emit('get_users');
    socket.on('user-joined', (data) => {
        console.log(data);
        let obj=data.obj;
        console.log(obj);
        util();
        obj.forEach((p)=>{
            $('#slide-out').append(`<li> ${p.name}</li>`);
        })
        const clients = data.clients;
        console.log(clients);
        const joinedUserId = data.joinedUserId;
        console.log(joinedUserId, ' joined');
        if (Array.isArray(clients) && clients.length > 0) {
            clients.forEach((userId) => {
                if (!connections[userId]) {
                    connections[userId] = new RTCPeerConnection(mediaStreamConstraints);
                    connections[userId].onicecandidate = () => {
                        if (event.candidate) {
                            console.log(socket.id, ' Send candidate to ', userId);
                            socket.emit('signaling', { type: 'candidate', candidate: event.candidate, toId: userId });
                        }
                    };
                    connections[userId].onaddstream = (event) => {
                        gotRemoteStream(event, userId);
                    };
                    connections[userId].addStream(localStream);
                }
            });

            if (data.count >= 2) {
                connections[joinedUserId].createOffer(offerOptions).then((description) => {
                    connections[joinedUserId].setLocalDescription(description).then(() => {
                        console.log(socket.id, ' Send offer to ', joinedUserId);
                        socket.emit('signaling', {
                            toId: joinedUserId,
                            description: connections[joinedUserId].localDescription,
                            type: 'sdp'
                        });
                    }).catch(handleError);
                });
            }
        }
    });
    //   When user leaves
    socket.on('user-left', (data) => {
        let obj=data.obj;
        console.log(obj);
        util();
        obj.forEach((p)=>{
            $('#slide-out').append(`<li> ${p.name}</li>`);
        })
        let video = document.querySelector('[data-socket="'+ data.userId +'"]');
        video.parentNode.removeChild(video);
        console.log(data.userId+" left")
    });
    //   Signalling
    socket.on('signaling', (data) => {
        gotMessageFromSignaling(socket, data);
    });

}

function gotMessageFromSignaling(socket, data) {
    const fromId = data.fromId;
    if (fromId !== localUserId) {
        switch (data.type) {
            case 'candidate':
                console.log(socket.id, ' Receive Candidate from ', fromId);
                if (data.candidate) {
                    gotIceCandidate(fromId, data.candidate);
                }
                break;

            case 'sdp':
                if (data.description) {
                    console.log(socket.id, ' Receive sdp from ', fromId);
                    connections[fromId].setRemoteDescription(new RTCSessionDescription(data.description))
                        .then(() => {
                            if (data.description.type === 'offer') {
                                connections[fromId].createAnswer()
                                    .then((description) => {
                                        connections[fromId].setLocalDescription(description).then(() => {
                                            console.log(socket.id, ' Send answer to ', fromId);
                                            socket.emit('signaling', {
                                                type: 'sdp',
                                                toId: fromId,
                                                description: connections[fromId].localDescription
                                            });
                                        });
                                    })
                                    .catch(handleError);
                            }
                        })
                        .catch(handleError);
                }
                break;

        }
    }
}

// When we get user media, we display it with the below function
function getUserMediaSuccess(mediaStream) {
    localStream = mediaStream;
    console.log(localStream);
    localVideo.srcObject = mediaStream;
    document.getElementsByClassName('videos')[0].appendChild(localVideo);
}

function getDisplayMediaSuccess(displayStream){
    if(category==='student'){
        $(localVideo).remove();
        console.log(localVideo);
        localVideo=document.createElement('video');
        document.getElementsByClassName('videos')[0].appendChild(localVideo);
    }
    localStream = displayStream;
    console.log(localStream);
    localVideo.srcObject=localStream;
    // local_stream_video=document.createElement('video');

    // local_stream_video.srcObject=local_screen_stream;
    // document.getElementById('shared_screen').appendChild(local_stream_video);
}

function handleError(e) {
    console.log(e);
    // alert('Something went wrong');
}

// Starts the whole process
startLocalStream();

// // Function to handle screen sharing
// async function get_screen(){
//     try{
//         let screen = await navigator.mediaDevices.getDisplayMedia({video:true,audio:true});

//     } catch(e){
//         console.log(e);
//     }
    
// }
$(()=>{
    // Screen Share button even handler
    $(document).on('click','#share_screen',(e)=>{
        startScreenShare();  
    })
})
    