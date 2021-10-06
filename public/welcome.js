$(()=>{
    if(cat==='teacher'){
        $.getJSON('extra_students.json',(data)=>{
            for(let i=0;i<data.students.length;i++){
                $('#student_list').append(`<option value="${data.students[i].username}">${data.students[i].username}</option>`)
            }
        })
    }

    $(document).on('click','#addstudent',(e)=>{
        let selected_student_name=$('#student_list').val();
        console.log(selected_student_name);
        $.getJSON('extra_students.json',(data)=>{
            let tosendobj=data.students.find((student)=>{
                return selected_student_name===student.username;
            })
            console.log(tosendobj);
            $.post('/addstudent',{currentclass : currentclass , username : tosendobj.username, password : tosendobj.password},(d)=>{
            })
        })
        alert("Added!");
    })

    // **** For Localhost testing, uncomment the line below |  ELSE for deployment of website live, COMMENT THE LINE BELOW****

    // document.querySelector('#wbtn').href=`http://localhost:3000/board?name=${displayname}&cclass=${currentclass}&category=${cat}`;

    // **** For deployment to heroku or making the website live, uncomment the line below ****

    document.querySelector('#wbtn').href=`https://jdmr-jitsi.herokuapp.com/board?name=${displayname}&cclass=${currentclass}&category=${cat}`;
})