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
    bodyZone.style =`height:${window.innerHeight}px;width:${window.innerWidth}px;`;
    imgLoadDiv.style =`height:25px;width 200px;margin-left:${(window.innerWidth-200)/2}px;margin-top:${(window.innerHeight-25)/2}px`;
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
        bodyZone.style =`height:${window.innerHeight}px;width:${window.innerWidth}px;`;
        imgLoadDiv.style =`margin-left:${(window.innerWidth-200)/2}px;margin-top:${(window.innerHeight-25)/2}px`;
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

