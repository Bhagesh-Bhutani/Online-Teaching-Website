$(()=>{
    $(document).ready(function(){
        $('.sidenav').sidenav();
    });

    $(document).on('click','#mute_self',(e)=>{
        let state=localStream.getAudioTracks()[0].enabled;
        if(state===true){
            $('#mute_self').text("Unmute Self");
        } else {
            $('#mute_self').text("Mute Self");
        }
        localStream.getAudioTracks()[0].enabled=!localStream.getAudioTracks()[0].enabled;
    })

    $(document).on('click','#hide_vid',(e)=>{
        let state=localStream.getVideoTracks()[0].enabled;
        if(state===true){
            $('#hide_vid').text("Show Your Video");
        } else {
            $('#hide_vid').text("Hide Your Video");
        }
        localStream.getVideoTracks()[0].enabled=!localStream.getVideoTracks()[0].enabled;
    })

    $(document).on('click','#mute_all',(e)=>{
        socket.emit('mute_all');
    })

    $(document).on('click','#unmute_all',(e)=>{
        socket.emit('unmute_all');
    })

    socket.on('get_mute_all',()=>{
        let state=localStream.getAudioTracks()[0].enabled;
        if(state===true){
            localStream.getAudioTracks()[0].enabled=!localStream.getAudioTracks()[0].enabled;
            $('#mute_self').text("Unmute Self");
        }
    })

    socket.on('get_unmute_all',()=>{
        let state=localStream.getAudioTracks()[0].enabled;
        if(state===false){
            localStream.getAudioTracks()[0].enabled=!localStream.getAudioTracks()[0].enabled;
            $('#mute_self').text("Mute Self");
        }
    })
})