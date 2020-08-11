// In renderer process (web page).
const { ipcRenderer} = require('electron')


window.addEventListener('load',()=> {
    var jCrop = new jsCrop('#upload-img');
    let uploadBtn =   document.querySelector("#upload-img")
    let browseImg =  document.querySelector("#browse-image");
    let imgLoadDiv = document.querySelector('#image-load');
    browseImg.addEventListener('click',()=>uploadBtn.click());
        

    let  bodyZone =  document.querySelector('body');
    bodyZone.addEventListener("dragover",(event)=>event.preventDefault());
    bodyZone.style =`height:${window.innerHeight}px;width:${window.innerWidth}px;overflow:hidden;`;
    imgLoadDiv.style =`height:${window.innerHeight}px;width:${window.innerWidth}px;padding-top:${(window.innerHeight/2)-12.5}px;padding-left:${(window.innerWidth/2)-125}px;`;
    bodyZone.addEventListener('drop',(event)=>{
        event.preventDefault();
        let img = event.dataTransfer.files[0]
       if(FileReader){
           let reader =  new FileReader();
           reader.readAsDataURL(img);
           reader.addEventListener('load',event=>{ 
            let dropedImg = new Image();
              dropedImg.src = event.target.result;
              dropedImg.addEventListener('load', event=>  jCrop.createOverlay(event.target));
           });
              
       }
    })


    window.addEventListener('resize',()=>{
        bodyZone.style =`height:${window.innerHeight}px;width:${window.innerWidth}px;overflow:hidden;`;
        imgLoadDiv.style =`height:${window.innerHeight}px;width:${window.innerWidth}px;padding-top:${(window.innerHeight/2)-12.5}px;padding-left:${(window.innerWidth/2)-125}px;`;
    })

    ipcRenderer.on('open-file', (event,args) =>{

       let closeBtn =  document.querySelector('#js-crop-close-btn')
        if(null != closeBtn){ closeBtn.click()};

        let ext = args[1] == '.jpeg' || args[1] == '.jpg' ? 'jpeg' : 'png';
        let img = new Image();
        img.src = `data:image/${ext};base64,`+args[0];
        img.addEventListener('load',event=>jCrop.createOverlay(event.target));
    })
});



// In renderer process (web page).

