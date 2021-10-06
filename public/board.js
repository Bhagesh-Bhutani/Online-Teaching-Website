$(()=>{
  
  $('.tooltipped').tooltip();
  $('.materialboxed').materialbox();
  $('.modal').modal();
  rgb_input=document.getElementById('rgb_picker')
  let c=0;
  $('#pg_no').text(c);
  let boards=[];
  for(let i=0;i<100;i++){
    boards[i]=undefined;
  }

  $(document).on('click','.symbol',(e)=>{
    let symbol = $(e.target).text();
    var textNode = new Konva.Text({
      text: symbol,
      x: 500,
      y: 80,
      fontSize: 20,
      draggable: true,
      width: 200,
    });
  
    text_layer.add(textNode);
  
    tr = new Konva.Transformer({
      node: textNode,
      enabledAnchors: ['middle-left', 'middle-right'],
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
  
    textNode.on('transform', function () {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });
  
    // text_layer.add(tr);
    text_layer.draw();
  
    textNode.on('dblclick', () => {
      // hide text node and transformer:
      textNode.hide();
      tr.hide();
      text_layer.draw();
  
      var textPosition = textNode.absolutePosition();
  
      // find position of stage container on the page:
      var stageBox = stage.container().getBoundingClientRect();
  
      var areaPosition = {
          x: stageBox.left + textPosition.x,
          y: stageBox.top + textPosition.y,
        };
  
        // create textarea and style it
        var textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
  
        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
        textarea.style.height =
          textNode.height() - textNode.padding() * 2 + 5 + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        rotation = textNode.rotation();
        var transform = '';
        if (rotation) {
          transform += 'rotateZ(' + rotation + 'deg)';
        }
  
        var px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
          px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += 'translateY(-' + px + 'px)';
  
        textarea.style.transform = transform;
  
        // reset height
        textarea.style.height = 'auto';
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px';
  
        textarea.focus();
  
        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener('click', handleOutsideClick);
          textNode.show();
          tr.show();
          tr.forceUpdate();
          text_layer.draw();
        }
  
        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            // set width for placeholder
            newWidth = textNode.placeholder.length * textNode.fontSize();
          }
          // some extra fixes on different browsers
          var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          var isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
          if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
          }
  
          var isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent);
          if (isEdge) {
            newWidth += 1;
          }
          textarea.style.width = newWidth + 'px';
        }
  
        textarea.addEventListener('keydown', function (e) {
          // hide on enter
          // but don't hide on shift + enter
          if (e.keyCode === 13 && !e.shiftKey) {
            textNode.text(textarea.value);
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.keyCode === 27) {
            removeTextarea();
          }
        });
  
        textarea.addEventListener('keydown', function (e) {
          scale = textNode.getAbsoluteScale().x;
          setTextareaWidth(textNode.width() * scale);
          textarea.style.height = 'auto';
          textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + 'px';
        });
  
        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            textNode.text(textarea.value);
            removeTextarea();
          }
        }
        setTimeout(() => {
          window.addEventListener('click', handleOutsideClick);
        });
      });
    $('.modal').modal('close');
  })

  rgb_input.addEventListener('input',(e)=>{
    mystroke=e.target.value;
  })

  $(".dropdown-trigger").dropdown({
    coverTrigger: false
 });
  // $(document).on('click','video',(e)=>{
  //   if(element.requestFullscreen){
  //       element.requestFullscreen();
  //   } 
  //   else if (element.webkitRequestFullscreen){
  //       element.webkitRequestFullscreen();
  //   }
  //   else if (element.mozRequestFullScreen){
  //       element.mozRequestFullScreen();
  //   }
  //   else if (element.msRequestFullscreen){
  //       element.msRequestFullscreen();
  //   }   
  // })
  // $('#stage_btn').on('click',(e)=>{

  // })

  // $('#remove_stage').on('click',(e)=>{
  //   $.post()
  // })

  // Video Zoom in-out event handlers
  // $('[data-toggle="tooltip"]').tooltip()
  // $(document).on('click','.videos',(e)=>{
  //   let vid=e.target;
  //   // console.log(vid.getAttribute('zoom'))
  //   vid.setAttribute('zoom',vid.getAttribute('zoom')==='out' ? 'in' : 'out');
  //   if(vid.getAttribute('zoom')==='in'){
  //     vid.style.width= '70%' ;
  //     vid.style.height='100%' ;
  //   } else {
  //     vid.style.width= '15%' ;
  //     vid.style.height='10%' ;
  //   }
  // })
  
  function attach_board_denied(){
    $(document).on('mousedown','#container',(e)=>{
      // e.preventDefault();
      console.log("Drawing");
      alert("Not allowed! Request access from Teacher first!");
      // return false;
    })
  }

  function allow_board_access(){
    $(document).off('mousedown','#container');
  }
  //Initially turn off click events for students
  if(category!=='teacher'){
    // $('#container').css('pointer-events','none');
    // attach_board_denied();
  } else {
    $('#request_access').remove();
  }

  $(document).on('click','#request_access',(e)=>{
    console.log("requesting");
    socket.emit('request_access',{name: name});
  })

  //This option is for teacher only, to select whether to give access to the student for board or not
  let student_id=undefined;
  socket.on('select_access',(data)=>{
    console.log(data.id);
    console.log(data.name);
    student_id=data.id;
    $('.modal-content>h4').text(`Grant Permission to ${data.name} ?`);
    // $('#modal_btn').click();
    var Modalelem = document.querySelector('.modal');
    var instance = M.Modal.init(Modalelem);
    instance.open();
  })

  //Teacher agrees or disagrees to give access
  $(document).on('click','.response',(e)=>{
    let res=e.target.id;
    socket.emit('response', {res: res, s_id: student_id});
  })

  socket.on('access_success',(data)=>{
    if(data.res==='agree'){
      // allow_board_access();
      alert("Teacher allowed board edit access to you.")
      $('#container').css('pointer-events','auto');
    } else {
      // attach_board_denied();
      alert("Teacher denied permission for your access.")
    }
  })


  $('#tool').formSelect();
  var width = window.innerWidth;
  var height = window.innerHeight - 25;
  let mystroke='black'; //Color
  let mystrokewidth=5; //Thickness
  let eraser_stroke='white';
  let bg_color='white';
  let isFill=false;
  let graph=false;
  let isLine=false;
  // var tr;
  // var tr2;
  document.getElementById('set_bar').value=mystrokewidth;
  document.getElementById('rgb_picker').setAttribute('value',mystroke);

  function toast(html){
    M.toast({html : html , classes : "rounded"});
  }

  // options

  $(document).on('click','.tools',(e)=>{
    console.log(e.target);
    mode = $(e.target).attr('data-value');
    if(mode==='brush'){
      let arr = [...stage.find('.protractor_node')];
      protractor_layer.destroyChildren();
          for (pro of arr){
            console.log(pro)
            var img = new Image();
        img.src = 'pro.png';

        img.onload = function() {
          var img_width = img.width;
          var img_height = img.height;
      
          // calculate dimensions to get max 300px
          var max = 300;
          var ratio = (img_width > img_height ? (img_width / max) : (img_height / max))
      
          // now load the Konva image
          var theImg = new Konva.Image({
            image: img,
            x: pro.attrs.x,
            y: pro.attrs.y,
            width: img_width/ratio,
            height: img_height/ratio,
            // centeredScaling: true,
            draggable: false,
            rotation: 0,
            name : 'protractor_node'
          });
      
          
          // protractor_layer.add(tr2);
          protractor_layer.add(theImg);
          protractor_layer.draw();
        }
          }
          protractor_layer.draw();
    } else {
      let arr = [...stage.find('.protractor_node')];
      protractor_layer.destroyChildren();
          for (pro of arr){
            var img = new Image();
        img.src = 'pro.png';

        img.onload = function() {
          var img_width = img.width;
          var img_height = img.height;
      
          // calculate dimensions to get max 300px
          var max = 300;
          var ratio = (img_width > img_height ? (img_width / max) : (img_height / max))
      
          // now load the Konva image
          var theImg = new Konva.Image({
            image: img,
            x: pro.attrs.x,
            y: pro.attrs.y,
            width: img_width/ratio,
            height: img_height/ratio,
            // centeredScaling: true,
            draggable: true,
            rotation: 0,
            name : 'protractor_node'
          });
      
          
          // protractor_layer.add(tr2);
          protractor_layer.add(theImg);
          protractor_layer.draw();
          toast("Protractor rendered");
        }
          }
          protractor_layer.draw();
    }
      console.log(mode);
      if(mode==='brush'){
          $('#container').css('cursor',`url('pencil.cur'), auto`);
          toast("Brush Selected");
      }
      if(mode==='eraser'){
        $('#container').css('cursor',`url('eraser.cur'), auto`);
        toast("Eraser Selected");
      }
      if(mode==='fill'){
        $('#container').css('cursor',`url('paint_bucket.cur'), auto`);
        toast("Fill tool Selected");
      }
      if(mode==='bg_color'){
        $('#container').css('cursor',`default`);
        toast("Click on a color to change background")
      }
      if(mode==='shape_edit'){
          $('#container').css('cursor',`default`);          
      }

      if(mode==='line'){
        toast("Line Tool Selected");
        ('#container').css("cursor","crosshair");
      }

      if(mode==='fill'){
          isFill=true;
      } else {
          isFill=false;
      }

      if(mode==='protractor'){
        $('#container').css('cursor',`default`);
        var img = new Image();
        img.src = 'pro.png';

        img.onload = function() {
          var img_width = img.width;
          var img_height = img.height;
      
          // calculate dimensions to get max 300px
          var max = 300;
          var ratio = (img_width > img_height ? (img_width / max) : (img_height / max))
      
          // now load the Konva image
          var theImg = new Konva.Image({
            image: img,
            x: 50,
            y: 30,
            width: img_width/ratio,
            height: img_height/ratio,
            // centeredScaling: true,
            draggable: true,
            rotation: 0,
            name : 'protractor_node'
          });
      
          
          // protractor_layer.add(tr2);
          protractor_layer.add(theImg);
          protractor_layer.draw();
          toast("Protractor rendered");
        }
      }

      if(mode==='scale'){
        toast("Scale rendered");
        $('#container').css('cursor',`default`);
        var img = new Image();
        img.src = 'scale.svg';

        img.onload = function() {
          var img_width = img.width;
          var img_height = img.height;
      
          // calculate dimensions to get max 300px
          var max = 300;
          var ratio = (img_width > img_height ? (img_width / max) : (img_height / max))
      
          // now load the Konva image
          var theImg = new Konva.Image({
            image: img,
            x: 50,
            y: 30,
            width: img_width/ratio,
            height: img_height/ratio,
            centeredScaling: true,
            draggable: true,
            rotation: 0,
            name : 'protractor_node'
          });
      
          
          protractor_layer.add(tr2);
          protractor_layer.add(theImg);
          protractor_layer.draw();
        }
      }

      if(mode==='grid_lines'){
        toast("Grid Lines Selected");
      }
  })

  // var select = document.getElementById('tool');
  // select.addEventListener('change', function () {
      
  // });

  // Initializing stage
  var stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height,
  });

  // layers
  let bg_layer=new Konva.Layer();
  let layer = new Konva.Layer();
  let shapes_layer= new Konva.Layer();
  let image_layer = new Konva.Layer();
  let text_layer = new Konva.Layer();
  let protractor_layer = new Konva.Layer();
  console.log(image_layer);
  stage.add(bg_layer);
  stage.add(layer);
  stage.add(image_layer);
  stage.add(shapes_layer);
  stage.add(text_layer);
  stage.add(protractor_layer);
  stage.draw();
  let myline;
  // layer.add(myline)
  layer.draw()
  boards[c]=stage.toJSON();
  for(let i=1;i<100;i++){
    boards[i]=stage.toJSON();
  }
  
  var scaleBy = 1.00;
      $('#zoom_in').on('click', (e) => {
        e.preventDefault();
        scaleBy+=0.1;
        let new_zoom=Math.round(scaleBy*100);
        $("#zoom_meter").text(new_zoom);
        stage.scale({ x: scaleBy, y: scaleBy });
        // stage.position(newPos);
        stage.batchDraw();
      });

      $('#zoom_out').on('click', (e) => {
        e.preventDefault();
        scaleBy-=0.1;
        let new_zoom=Math.round(scaleBy*100);
        $("#zoom_meter").text(new_zoom);
        stage.scale({ x: scaleBy, y: scaleBy });
        // stage.position(newPos);
        stage.batchDraw();
      });
  
  let tr1;
  // listen for the file input and load the image.
$("#fileInput").change(function(e){

  var URL = window.webkitURL || window.URL;
  var url = URL.createObjectURL(e.target.files[0]);
  var img = new Image();
  img.src = url;

  img.onload = function() {

    var img_width = img.width;
    var img_height = img.height;

    // calculate dimensions to get max 300px
    var max = 300;
    var ratio = (img_width > img_height ? (img_width / max) : (img_height / max))

    // now load the Konva image
    var theImg = new Konva.Image({
      image: img,
      x: 50,
      y: 30,
      width: img_width/ratio,
      height: img_height/ratio,
      centeredScaling: true,
      draggable: true,
      rotation: 0,
      name: 'shape'
    });


    // tr1 = new Konva.Transformer({
    //   nodes: [theImg],
    //   centeredScaling: true,
    // });
    // shapes_layer.add(tr1);
    // transformer.nodes().concat([theImg]);
    shapes_layer.add(theImg);
    shapes_layer.draw();
  }
});

// Save page event handler
$(document).on('click','#save_page',(e)=>{
  let myurl=stage.toDataURL();
  let a=document.createElement('a');
  a.download="Snapshot.png";
  a.href=myurl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
})

// Grid event handler
$(document).on('click','.grid',(e)=>{
  let g=e.target.id;
  if(g==='no_grid'){
    image_layer.destroyChildren();
    image_layer.draw();
  } else if(g==='w1_grid') {
    image_layer.destroyChildren();
    image_layer.draw();
    let myimg=new Image();
    myimg.src='w1.svg';
    let kimg=new Konva.Image({
      image: myimg,
      width: stage.width(),
      height: stage.height()
    })
    image_layer.add(kimg);
    image_layer.draw();
  } else if(g==='sq_grid'){
    image_layer.destroyChildren();
    image_layer.draw();
    let myimg=new Image();
    myimg.src='main_grid.svg';
    let kimg=new Konva.Image({
      image: myimg,
      width: stage.height(),
      height: stage.height()
    })
    
    // console.log(kimg.width())
    image_layer.add(kimg);
    // image_layer.add(kimg2)
    image_layer.draw();
  }
})

  // Transformer config
  let transformer = new Konva.Transformer({
      nodes: stage.find('.shape')
  });

  // Protractor transformer
  let tr2 = new Konva.Transformer({
    nodes: stage.find('.protractor_node'),
    centeredScaling: true,
  });

  shapes_layer.add(transformer);
  shapes_layer.draw();

  // Event handler to clear the canvas
  $(document).on('click','#clear_btn',()=>{
      layer.destroyChildren();
      shapes_layer.destroyChildren();
      image_layer.destroyChildren();
      transformer = new Konva.Transformer({
        //   nodes: stage.find('.shape'),
          name: 'shape'
      });
      console.log(transformer)
      shapes_layer.add(transformer);
      layer.draw();
      shapes_layer.draw();
      image_layer.draw();
      graph=false;
      boards[c]=stage.toJSON();
  })

  var isPaint = false;
  var mode = 'NONE';
  var lastLine;

//   Double click event
  stage.on('dblclick',function(e){
    console.log(e.target.name())
    
    if(e.target.name()===''){
        transformer.detach();
        // tr.detach();
        tr2.detach();
        shapes_layer.draw();
        protractor_layer.draw();
        layer.draw();
        boards[c]=stage.toJSON();
    }
  })

  // Protractor transformer attach event on click
  protractor_layer.on('click',(e)=>{
    tr2.attachTo(e.target);
  })

  

//   Mouse click and hold till user draws
  stage.on('mousedown touchstart', function (e) {
    var pos = stage.getPointerPosition();
      if(mode==='brush' || mode==='eraser'){
          isPaint = true;
          var pos = stage.getPointerPosition();
          if(mode==='brush'){
              lastLine = new Konva.Line({
              stroke: mystroke,
              strokeWidth: mystrokewidth,
              globalCompositeOperation: 'source-over',
              points: [pos.x, pos.y],
              });
              layer.add(lastLine);
          } else if(mode==='eraser'){
              lastLine = new Konva.Line({
              stroke: eraser_stroke,
              strokeWidth:mystrokewidth,
              points: [pos.x, pos.y],
              });
              layer.add(lastLine);
          }
      } else if(mode==='line'){
        isLine=true;
        myline=new Konva.Line({
          stroke: mystroke,
          strokeWidth: 1,
          points: [pos.x,pos.y,pos.x,pos.y]
        })
        console.log(myline)
        layer.add(myline);
        layer.batchDraw();
      }
      boards[c]=stage.toJSON();
  });

//   Receive pencil socket event
  socket.on('receive_brush',(data)=>{
      console.log(data.points)
    //   Multiplying the received line points by stage width and height of other devices for Normalisation
      for(let i=0;i<data.points.length;i++){
          if(i%2==0){
              data.points[i]=data.points[i]*stage.width();
          } else {
            data.points[i]=data.points[i]*stage.height();
          }
      }
      console.log(data.points);
      let received_line=new Konva.Line(data);
      layer.add(received_line);
      layer.batchDraw();
      boards[c]=stage.toJSON();
  })

//   When left mouse click is released
  stage.on('mouseup touchend', function () {
    if(isPaint===true){
        let li=[...lastLine.points()];
          for(let i=0;i<li.length;i++){
              if(i%2==0){
                  li[i]=li[i]/stage.width();
              } else {
                  li[i]=li[i]/stage.height();
              }
          }
          console.log("Hi!")
        if(mode==='brush'){
            console.log(lastLine.points())
            socket.emit('send_line',{
                stroke: mystroke,
                strokeWidth: mystrokewidth,
                globalCompositeOperation: 'source-over',
                points: li
            })

        } else if(mode==='eraser'){
            console.log(lastLine.points())
            socket.emit('send_line',{
                stroke: eraser_stroke,
                strokeWidth: mystrokewidth,
                points: li
            })
        }
    } else if(isLine){
      console.log(myline.points())
    } 
      isPaint = false;
      lastLine=undefined;
      myline=undefined;
      isLine=false;
      boards[c]=stage.toJSON();
  });

//   When mouse hovers outside canvas stage
  stage.on('mouseleave',()=>{
      if(isPaint===true){
          let li=[...lastLine.points()];
          for(let i=0;i<li.length;i++){
              if(i%2==0){
                  li[i]=li[i]/stage.width();
              } else {
                  li[i]=li[i]/stage.height();
              }
          }
          console.log("Hi!")
          if(mode==='brush'){
                console.log(lastLine.points())
                socket.emit('send_line',{
                stroke: mystroke,
                strokeWidth: mystrokewidth,
                globalCompositeOperation: 'source-over',
                points: li
            })
        } else if(mode==='eraser'){
            console.log(lastLine.points())
                socket.emit('send_line',{
                stroke: 'white',
                strokeWidth: mystrokewidth,
                points: li
        })
    }
    isLine=false;
    isPaint=false;
  }})

  // and core function - drawing
  stage.on('mousemove touchmove', function () {
      // if (!isPaint) {
      //   return;
      // }
      const pos = stage.getPointerPosition();
      if(isPaint){
        var newPoints = lastLine.points().concat([pos.x, pos.y]);
      //   console.log(newPoints);
        lastLine.points(newPoints);
        layer.batchDraw();
      } else if(isLine){
        console.log(myline)
        myline.points()[2]=pos.x;
        myline.points()[3]=pos.y;
        layer.batchDraw();
      }
      boards[c]=stage.toJSON();
  });

  // Circle button event handler
  $(document).on('click','#circle_btn',(e)=>{
      let circle=new Konva.Circle({
          x : stage.width()/2,
          y: stage.height()/2,
          radius : 100,
          stroke: 'black',
          strokeWidth: 4,
          draggable: true,
          name: 'shape',
      })
      shapes_layer.add(circle);
      shapes_layer.draw();
  })
  // rectangle button event handler
  $(document).on('click','#rectangle_btn',(e)=>{
      var rect = new Konva.Rect({
          x : stage.width()/2,
          y: stage.height()/2,
          width: 100,
          height: 50,
          stroke: 'black',
          strokeWidth: 4,
          draggable : true,
          name: 'shape'
      });
      shapes_layer.add(rect);
      shapes_layer.draw();
  })

// Square rendering
  $(document).on('click','#square_btn',(e)=>{
      let square= new Konva.Rect({
        x : stage.width()/2,
        y: stage.height()/2,
        width: 100,
        height: 100,
        stroke: 'black',
        strokeWidth: 4,
        draggable : true,
        name: 'shape'
    });
    shapes_layer.add(square);
    shapes_layer.draw();
  })

//   Triangle rendering
  $(document).on('click','.polygon',(e)=>{
    console.log(e.target.getAttribute('data-sides'));
      let polygon= new Konva.RegularPolygon({
        x : stage.width()/2,
        y: stage.height()/2,
        sides: parseInt(e.target.getAttribute('data-sides')),
        radius: 80,
        stroke: 'black',
        strokeWidth: mystrokewidth,
        draggable : true,
        name: 'shape'
      })

      shapes_layer.add(polygon);
      shapes_layer.draw();
  })

  // Event handler to change current color
  $(document).on('click','.color_picker',(e)=>{
    //   in if: When user is setting background , in else: The brush stroke color gets modified
      if(mode==='bg_color'){
        bg_layer.destroyChildren();
        bg_color=e.target.id;
        let myrec=new Konva.Rect({
          width: stage.width(),
          height: stage.height(),
          fill: bg_color
        })
        bg_layer.add(myrec);
        bg_layer.draw();
        // stage.getContainer().style.backgroundColor = bg_color;
        eraser_stroke=bg_color;
      } else {
        console.log(e.target.id);
        mystroke=e.target.id;
      }
  })

  // Event handler to detect clicked shape and attach transformer
  shapes_layer.on('click',(e)=>{
      console.log("Shapes Layer clicked")
      let shape=e.target;
      if(isFill===true){
          shape.fill(mystroke);
      }
      transformer.attachTo(shape);
      console.log(e.target._id)
  })

  text_layer.on('click',(e)=>{
    console.log("text layer clicked")
  })

  // Range event handler
  $(document).on('change','#set_bar',()=>{
      mystrokewidth=document.getElementById('set_bar').value;
      console.log(mystrokewidth)
  })

  // Render graph
  $(document).on('click','#graph',(e)=>{
    if(graph===false){
      image=document.createElement('img');
      image.src="graph.svg";
      console.log(image)
      let kimg=new Konva.Image({
        image: image,
        width: stage.width(),
        height: stage.height()
      })
      image_layer.add(kimg);
      image_layer.draw();
      graph=true;
    } else {
      graph=false;
      image_layer.destroyChildren();
      image_layer.draw();
      // graph=false;
    }
  })

  // Textbox
  $(document).on('click','#mytextbox',(e)=>{
    var textNode = new Konva.Text({
      text: 'add text here',
      x: 500,
      y: 80,
      fontSize: 20,
      draggable: true,
      width: 200,
    });
  
    text_layer.add(textNode);
  
    tr = new Konva.Transformer({
      node: textNode,
      enabledAnchors: ['middle-left', 'middle-right'],
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
  
    textNode.on('transform', function () {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });
  
    // text_layer.add(tr);
    text_layer.draw();
  
    textNode.on('dblclick', () => {
      // hide text node and transformer:
      textNode.hide();
      tr.hide();
      text_layer.draw();
  
      var textPosition = textNode.absolutePosition();
  
      // find position of stage container on the page:
      var stageBox = stage.container().getBoundingClientRect();
  
      var areaPosition = {
          x: stageBox.left + textPosition.x,
          y: stageBox.top + textPosition.y,
        };
  
        // create textarea and style it
        var textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
  
        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
        textarea.style.height =
          textNode.height() - textNode.padding() * 2 + 5 + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        rotation = textNode.rotation();
        var transform = '';
        if (rotation) {
          transform += 'rotateZ(' + rotation + 'deg)';
        }
  
        var px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
          px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += 'translateY(-' + px + 'px)';
  
        textarea.style.transform = transform;
  
        // reset height
        textarea.style.height = 'auto';
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px';
  
        textarea.focus();
  
        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener('click', handleOutsideClick);
          textNode.show();
          tr.show();
          tr.forceUpdate();
          text_layer.draw();
        }
  
        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            // set width for placeholder
            newWidth = textNode.placeholder.length * textNode.fontSize();
          }
          // some extra fixes on different browsers
          var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          var isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
          if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
          }
  
          var isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent);
          if (isEdge) {
            newWidth += 1;
          }
          textarea.style.width = newWidth + 'px';
        }
  
        textarea.addEventListener('keydown', function (e) {
          // hide on enter
          // but don't hide on shift + enter
          if (e.keyCode === 13 && !e.shiftKey) {
            textNode.text(textarea.value);
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.keyCode === 27) {
            removeTextarea();
          }
        });
  
        textarea.addEventListener('keydown', function (e) {
          scale = textNode.getAbsoluteScale().x;
          setTextareaWidth(textNode.width() * scale);
          textarea.style.height = 'auto';
          textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + 'px';
        });
  
        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            textNode.text(textarea.value);
            removeTextarea();
          }
        }
        setTimeout(() => {
          window.addEventListener('click', handleOutsideClick);
        });
      });
  
  })
})

//validation of file extension

var _validFileExtensions = [".jpg", ".jpeg", ".gif", ".png"];    
function ValidateInput(Input) {
    if (Input.type == "file") {
        var sFileName = Input.value;
         if (sFileName.length > 0) {
            var blnValid = false;
            for (var j = 0; j < _validFileExtensions.length; j++) {
                var sCurExtension = _validFileExtensions[j];
                if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                    blnValid = true;
                    break;
                }
            }
             
            if (!blnValid) {
                alert("Sorry, " + sFileName + " is invalid, Only " + _validFileExtensions.join(", ") + " are allowed extensions. ");
                Input.value = "";
                return false;
            }
        }
    }
    return true;
}