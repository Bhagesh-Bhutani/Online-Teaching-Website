$(()=>{
    // recorder variable is initialized later to a WebRTC mediarecorder object
    let recorder;
    // Recorded data is saved in chunks array, initially empty
    let chunks=[];

    // Just a download function by which we can download our recorded chunks(NOT USED, JUST A UTILITY)
    function download(recordedChunks) {
        console.log("Final:"+recordedChunks)
        var blob = new Blob(recordedChunks, {
            type: "video/webm"
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "test.webm";
        a.click();
        window.URL.revokeObjectURL(url);
    }


    // Mixes two streams
    function mixer(stream1,stream2){
        const ctx=new AudioContext();
        const dest=ctx.createMediaStreamDestination();
        if(stream1.getAudioTracks().length > 0){
            ctx.createMediaStreamSource(stream1).connect(dest);
        }
        if(stream2.getAudioTracks().length > 0){
            ctx.createMediaStreamSource(stream2).connect(dest);
        }
        let tracks=dest.stream.getTracks();
        tracks=tracks.concat(stream1.getVideoTracks()).concat(stream2.getVideoTracks());
        return new MediaStream(tracks);
    }

    // Returns a recorder object wrapped in a promise, KINDLY NOTE, USE "ASYNC AWAIT" TO HANDLE PROMISES OR ".then()   .catch()...etc" syntax
    async function s(recorder){
        let screen_stream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
        let user_audio= await navigator.mediaDevices.getUserMedia({audio: true});
        let stream=mixer(screen_stream,user_audio);
        console.log(stream);
        recorder=new MediaRecorder(stream);
        return new Promise(resolve=>{
            resolve(recorder);
        })
    }

    // ************ NOTE : TO CHANGE YOUR FIREBASE DATABASE AND STORAGE, JUST CHANGE THE BELOW FIREBASE CONFIG **************
    // var firebaseConfig = {
    //   };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
    let database=firebase.database();
    let storageRef=firebase.storage().ref();

    // render recordings list
    database.ref("rec").once('value').then((snapshot)=>{
        let obj=snapshot.val();
        Object.keys(obj).forEach((k)=>{
            if(obj[k].room===currentclass){
                $('#rec_list').append(`<option value="${obj[k].link}">${obj[k].date}</option>`)
            }
        })
    })
    
    // Start recording event handler
    $(document).on('click','#startrec',async (e)=>{
        recorder=await s();
        console.log(recorder)
        recorder.start();
    })

    // Stop recording handler, when triggered, saves the recording in firebase config and store details of user in firebase realtime database 
    $(document).on('click','#stoprec',(e)=>{
        recorder.stop();
        recorder.ondataavailable=(e)=>{
            console.log(e.data.size);
            chunks.push(e.data);
            console.log(chunks);
            // download(chunks);
            console.log("Final:"+chunks)
            var blob = new Blob(chunks, {
                type: "video/webm"
            });
            chunks=[];
            let d=new Date()
            d=d.toString();
            fname=d;
            // var url = URL.createObjectURL(blob);
            // console.log(url);
            let uploadTask=storageRef.child(`${currentclass}/${fname}`).put(blob);
            uploadTask.on('state_changed', function(snapshot){
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                }
              }, function(error) {
                  console.log(error)
                // Handle unsuccessful uploads
              }, function() {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                  console.log('File available at', downloadURL);
                  database.ref("rec").push({
                    name : displayname,
                    room : currentclass,
                    date : d,
                    link : downloadURL
                })
                $('#rec_list').empty();
                database.ref("rec").once('value').then((snapshot)=>{
                    let obj=snapshot.val();
                    Object.keys(obj).forEach((k)=>{
                        if(obj[k].room===currentclass){
                            $('#rec_list').append(`<option value="${obj[k].link}">${obj[k].date}</option>`)
                        }
                    })
                })
                });
              });
        }
    })

    // Redirect(in new tab) to selected recording on pressing download recording button
    $(document).on('submit',"#rec_download_form",(e)=>{
        e.preventDefault();
        let myurl=$('#rec_list').find(":selected").val();
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = myurl;
        a.target='_blank';
        a.click();
        window.URL.revokeObjectURL(myurl);
    })
})