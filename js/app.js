window.addEventListener('load',()=> {
    new jsCrop('#upload-img');


    
    document.querySelector("#browse-image").addEventListener('click',()=>{
        document.querySelector("#upload-img").click();

    });

    let  bodyZone =  document.querySelector('body');
    bodyZone.addEventListener("dragover",(event)=>event.preventDefault());

    bodyZone.addEventListener('drop',(event)=>{
    
        event.preventDefault();
        let file = event.dataTransfer.items[0].getAsFile();

        console.log(file);

    })


   


});

