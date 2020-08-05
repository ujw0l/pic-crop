window.addEventListener('load',()=> {
    var jCrop = new jsCrop('#upload-img');

    document.querySelector("#browse-image").addEventListener('click',()=>{
        document.querySelector("#upload-img").click();
    });

    let  bodyZone =  document.querySelector('body');
    bodyZone.addEventListener("dragover",(event)=>event.preventDefault());

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

});

