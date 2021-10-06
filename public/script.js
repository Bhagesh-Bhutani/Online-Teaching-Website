$(()=>{
    $(document).on('click','#getclasses',(e)=>{
        $.post('/teacher',{username: $('#username').val(), password: $('#pass').val()},(data)=>{
            // console.log(data.classes);
            data.classes.forEach((c)=>{
                $('#myclass').append(`<option value=${c}>${c}</option>`)
            })
        })
    })

    $(document).on('input','.req',()=>{
        $('#myclass').empty();
    })
})