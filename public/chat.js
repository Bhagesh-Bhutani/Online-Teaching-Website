function updateScroll(){
    let ele=document.getElementById('chatmsgs');
    ele.scrollTop=ele.scrollHeight;
}

$(()=>{

    $(document).on('click',"#chatbtn",(e)=>{
        $('#chatwindow').toggle("slow");
    })

    $(document).on('click','.clickable',(e)=>{
        $('#chatwindow').toggle("slow");
    })

    $(document).on('submit','#myform',(e)=>{
        e.preventDefault();
        let date= new Date;
        let h=date.getHours();
        let m=date.getMinutes();
        if(m<=9){
            m = m.toString();
            m = "0" + m;
        }
        if(h<=9){
            h = h.toString();
            h = "0" + h;
        }
        $('#chatmsgs').append(`<div class='message-blue'><span style="font-weight : bold;color:black;font-size:medium;">You</span> : ${$('#message').val()} <div class="message-timestamp-right">${h}:${m}</div></div>`);
        socket.emit('message',{
            message : $('#message').val(),
            h : h,
            m : m
        });
        $('#message').val('');
        updateScroll();
    })

    socket.on('receivemsg',(data)=>{
        $('#chatmsgs').append(`<div class='message-orange'><span style="font-weight : bold;color:black;font-size:medium;">${data.name}</span> : ${data.message} <div class="message-timestamp-right">${data.h}:${data.m}</div></div>`);
        updateScroll();
    })
})