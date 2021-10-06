$(()=>{
    $.getJSON('users.json',(data)=>{
        Object.keys(data).forEach((name)=>{
            $('#class_list').append(`<option value=${name}>${name}</option>`)
        })
    })

    $(document).on('submit','#data_form',(e)=>{
        e.preventDefault();
        $('#teacher_name').empty();
        $('#student_name').empty();
        $('#student_password').empty();
        $.getJSON('users.json',(data)=>{
            chosen_class=$('#class_list').val();
            $('#teacher_name').append(data[chosen_class].teacher);
            data[chosen_class].students.forEach((student)=>{
                $('#student_name').append(`<div>${student.username}</div>`);
                $('#student_password').append(`<div>${student.password}</div>`);
            })
        })
    })
})