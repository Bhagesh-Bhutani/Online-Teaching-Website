const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');
const users_route=require('./routes/users_route');
const mongoose = require('mongoose');
const http=require('http').createServer(app);
const io=require('socket.io')(http);
let teacher_id=undefined;
let firebase=require('firebase');

// **** ADD YOUR firebaseConfig Below ****
// var firebaseConfig = {
//   };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database=firebase.database();


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');


let port= process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/users',{useNewUrlParser:true, useUnifiedTopology: true});

app.use('/users',users_route);

app.get('/board',(req,res)=>{
    console.log(req.query.name);
    console.log(req.query.cclass);
    res.render('board',{name : req.query.name , myclass: req.query.cclass,category:req.query.category});
})

app.get('/symbols',(req,res)=>{
    res.render('symbols');
})

app.get('/admin',(req,res)=>{
    res.render('admin_panel');
})

io.on('connection',(socket)=>{
    console.log("Name: "+socket.handshake.query.name);
    console.log("Class: "+socket.handshake.query.myclass);
    console.log("Category: "+socket.handshake.query.category);
    
    let name=socket.handshake.query.name;
    let room=socket.handshake.query.myclass;
    let category=socket.handshake.query.category;
    if(category==='teacher'){
        teacher_id=socket.id;
    }
    socket.join(room)
    database.ref(`${room}`).push({
        name : name,
        uid : socket.id
    })
    socket.on('get_users',()=>{
        console.log("Emitting get_users event in class : "+room)
        let clients=io.sockets.adapter.rooms[room].sockets;
        let clients_array=[];
        for (key of Object.keys(clients)){
            clients_array.push(key);
        }
        console.log("Clients: "+clients_array);
        console.log("Of Class : "+room);
        console.log(io.sockets.adapter.rooms[room].length)
        let obj;
        database.ref(`${room}`).once('value').then((snapshot)=>{
            console.log(snapshot.val());
            obj=Object.values(snapshot.val());
            console.log(obj);
        }).then(()=>{
            console.log("in THEN")
            io.to(room).emit('user-joined', { clients:  clients_array, count: io.sockets.adapter.rooms[room].length, joinedUserId: socket.id ,obj : obj});
        }).catch((e)=>{
            console.log(e);
        })
        
    })

    socket.on('mute_all',()=>{
        socket.broadcast.to(room).emit('get_mute_all');
    })

    socket.on('unmute_all',()=>{
        socket.broadcast.to(room).emit('get_unmute_all')
    })

    socket.on('signaling', function(data) {
        io.to(data.toId).emit('signaling', { fromId: socket.id, ...data });
    });
    socket.on('disconnect', function() {
        database.ref(`${room}`).orderByChild('uid').equalTo(socket.id).on('child_added',(snapshot)=>{
            snapshot.ref.remove().then(()=>{console.log("Database removal works")})
            .then(()=>{
                let obj;
                database.ref(`${room}`).once('value').then((snapshot)=>{
                    console.log(snapshot.val());
                    obj=Object.values(snapshot.val());
                    console.log(obj);
                }).then(()=>{
                    console.log("user left in THEN")
                    io.to(room).emit('user-left', { userId : socket.id , obj : obj });
                }).catch((e)=>{
                    console.log(e);
                })
            })
        })
        
    })
    console.log("User connected");
    io.clients((e,clients)=>{
        if(e) throw e;
        console.log(clients);
    })
    socket.on('send_line',(data)=>{
        console.log(data)
        socket.broadcast.to(room).emit('receive_brush',data);
    });
    // socket.on('eraser',(data)=>{
    //     socket.broadcast.to(room).emit('receive_eraser',data);
    // });
    socket.on('message',(data)=>{
        socket.broadcast.to(room).emit('receivemsg',{name : name , message : data.message , h : data.h , m : data.m});
    })

    //Process student board access request
    socket.on('request_access',(data)=>{
        console.log("teacher id= "+teacher_id);
        io.to(teacher_id).emit('select_access',{id: socket.id, name: data.name});
    })

    socket.on('response', (data)=>{
        io.to(data.s_id).emit('access_success', {res: data.res});
    })
    
})

app.get("/",(req,res)=>{
    res.render('index');
})

app.get('/student',(req,res)=>{
    res.render('studentlogin');
})

app.get('/teacher',(req,res)=>{
    res.render('teacherlogin');
})

app.post('/student',(req,res)=>{
    let rawdata=fs.readFileSync("./public/users.json");
    let data=JSON.parse(rawdata);
    for(let key of Object.keys(data)){
        let doesexist=data[key].students.find((student)=>{
            return req.body.username===student.username && req.body.password===student.password;
        })
        if(doesexist!==undefined){
            res.render('welcome',{uname:req.body.username, roomid: data[key].MeetingID,category:'student' , currentclass : key});
        }
    }
    res.redirect('/student');
})

app.post('/teacher',(req,res)=>{
    let teacherrawdata=fs.readFileSync("./public/teachers.json");
    let tdata=JSON.parse(teacherrawdata);
    let currteacher=tdata.teachers.find((teacher)=>{
        return teacher.username===req.body.username && teacher.password===req.body.password;
    })
    if(currteacher!==undefined){
        res.send({classes : currteacher.classes});
    } else {
        res.send({classes : undefined});
    }
})

app.post('/teacherlogin',(req,res)=>{
    let teacherrawdata=fs.readFileSync("./public/teachers.json");
    let tdata=JSON.parse(teacherrawdata);
    let currteacher=tdata.teachers.find((teacher)=>{
        return teacher.username===req.body.username && teacher.password===req.body.password;
    })
    if(currteacher!==undefined){
        let rawdata=fs.readFileSync("./public/users.json");
        let data=JSON.parse(rawdata);
        let myclass=req.body.myclass;
        let roomid=data[myclass].MeetingID;
        res.render('welcome',{uname: req.body.username, roomid: roomid, category: 'teacher',currentclass:myclass});
    } else {
        res.redirect('/teacher');
    }
})

app.post('/addstudent',(req,res)=>{
    let rawdata=fs.readFileSync('./public/users.json');
    let data=JSON.parse(rawdata);
    console.log(req.body);
    let student= {
        username : req.body.username,
        password : req.body.password
    }
    data[req.body.currentclass].students.push(student);
    console.log(data);
    let write_data=JSON.stringify(data);
    console.log(write_data)
    fs.writeFileSync('./public/users.json',write_data);
})

http.listen(port,()=>{
    console.log("Server running at: http://localhost:"+port);
})