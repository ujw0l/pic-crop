/*
 * Js Crop 
 * javascript library that enables image cropping 
 * https://ujwolbastakoti.wordpress.com/
 * MIT license
 *  
 */

'use strict'
class jsCrop {

    constructor(sel,param2,param3) {
        let elList = Array.from(document.querySelectorAll(sel));
        elList.forEach((el) => {
            if(undefined != el.type && 'file' == el.type ){
                        el.addEventListener('change', event=> {
                                    let img = event.target.files[0];
                                    if(undefined != img){
                                        if(FileReader){
                                            const reader = new FileReader();
                                            reader.addEventListener("load", event => {
                                                                                    var uploadImg = new Image();
                                                                                    uploadImg.src = event.target.result
                                                                                    uploadImg.addEventListener('load', event => this. createOverlay(event.target, param2,param3 ));
                                                                    });
                                            reader.readAsDataURL(img);
                                        } 
                                    }
                                }
                        );
            } else{
                el.addEventListener('click', event => event.target.addEventListener('load', this.createOverlay(event.target,param2,param3)));
            } 
        });

        window.addEventListener('resize', event => this.adjustApp(event));
        window.addEventListener('keydown', event => this.onKeyStroke(event));
    }


    /*
    * Create overlay and initialize cropping
    *
    *@param img image to be cropped
    *
    */

    createOverlay(img,param2,param3) {

        let imgType = undefined != param2 && undefined != param2.imageType && 'jpeg'== param2.imageType? param2.imageType : 'png';
        let imgQuality = undefined != param2 && undefined != param2.imageQuality ? param2.imageQuality : '1';


        let scrollCss =  document.createElement('style');
        scrollCss.id = 'ctc-scroll-css';
        scrollCss.innerHTML = `body{ overflow:hidden;margin:0;} ::-webkit-scrollbar-track {background: rgba(255, 255, 255, 1);} ::-moz-scrollbar-track { background: rgba(255, 255, 255, 1);} #js-crop-toolbar::-webkit-scrollbar {display: none;} #js-crop-toolbar::-moz-scrollbar {display: none;}`;
        document.querySelector('head').appendChild(scrollCss);
        window.scrollTo(0, 0);
  
    

        let overlayDivEl = document.createElement("div");
        let overlayBgColor = undefined != param2 &&  undefined != param2.customColor && undefined != param2.customColor.overlayBgColor ? param2.customColor.overlayBgColor: 'rgba(0,0,0,1)';
        overlayDivEl.id = "js-crop-overlay";
        overlayDivEl.style = `top:0%;left:0%;right:0%;bottom:0%;height:${window.innerHeight}px;width:${window.innerWidth}px;background-color:${overlayBgColor};z-index:100000;`;
        document.body.insertBefore(overlayDivEl, document.body.firstChild);

        let orgImage = new Image();
        orgImage.src = img.src;
        let imgActHeight = orgImage.height;
        let imgActWidth = orgImage.width;
        let overlayDiv = document.querySelector('#js-crop-overlay');
        let opImgDim = this.getOptimizedImageSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, imgActWidth, imgActHeight);
        let imgStyle = `box-shadow:0px 0px 5px rgba(255,255,255,1);display:inline-block;margin:${((overlayDiv.offsetHeight - opImgDim.height) / 2)}px ${(((0.97 * overlayDiv.offsetWidth) - opImgDim.width) / 2)}px;vertical-align:top;`;
     
            orgImage.id = "js-crop-image";
            orgImage.style = imgStyle;
            orgImage.height = opImgDim.height;
            orgImage.width = opImgDim.width;
            orgImage.setAttribute('data-img-type', imgType);
            orgImage.setAttribute('data-img-quality',imgQuality );
            orgImage.setAttribute('data-crop-status','in-active');
            orgImage.setAttribute('data-crop-step','0');
            orgImage.setAttribute('data-crop-0',orgImage.src)
            orgImage.setAttribute('data-crop-count','0')
            orgImage.setAttribute('draggable', 'false');
            orgImage.setAttribute('data-dim-ratio', `${imgActWidth / opImgDim.width},${imgActHeight / opImgDim.height}`);
            overlayDiv.appendChild(orgImage);

     
        let jsCropCloseBtn = document.createElement('span');
            jsCropCloseBtn.id = "js-crop-close-btn";
            jsCropCloseBtn.title = "Close";
            jsCropCloseBtn.innerHTML = "&#10539;";
            jsCropCloseBtn.addEventListener('click', () => this.closeOverlay());
            jsCropCloseBtn.style = `cursor:pointer;position:absolute;left:3px;font-size:${0.016*document.querySelector('#js-crop-overlay').offsetWidth}px;color:rgba(255,255,255,1);text-shadow:-1px -1px 1px rgba(0,0,0,1);`;
            overlayDiv.appendChild(jsCropCloseBtn);


    this.createToolbar(overlayDiv, orgImage.src, {
        height: opImgDim.height,
        width: opImgDim.width,
        dimRatio: `${imgActWidth / opImgDim.width},${imgActHeight / opImgDim.height}`
    },param2,param3);


    }

    /*
    * Adjust crop overlay on window resize
    *
    *@param e resize event
    *
    */

    adjustApp(e) {
        let overlayDiv = document.querySelector('#js-crop-overlay');
        if(undefined != overlayDiv){
                let loadedImg = document.querySelector('#js-crop-image');
                let toolbarDiv = document.querySelector('#js-crop-toolbar');

                overlayDiv.style.height =`${window.innerHeight}px`;
                overlayDiv.style.width =`${window.innerWidth}px`;
            
                let toolbarOpts = Array.from(toolbarDiv.querySelectorAll('div'));
                toolbarDiv.style.height = overlayDiv.offsetHeight+'px';
                toolbarDiv.style.paddingTop = ((overlayDiv.offsetHeight - (toolbarOpts.length * toolbarDiv.offsetWidth)) / 2) + 'px';
            

                let bufferImg = new Image();
                bufferImg.src = loadedImg.src;
                let opImgDim = this.getOptimizedImageSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, bufferImg.width, bufferImg.height);
                loadedImg.height = opImgDim.height
                loadedImg.width = opImgDim.width;
                loadedImg.style.margin = `${(((overlayDiv.offsetHeight - opImgDim.height) / 2))}px ${(((0.97 * overlayDiv.offsetWidth) - opImgDim.width) / 2)}px`;

                toolbarOpts.map(x => {
                    x.style.height = x.offsetWidth + 'px';
                    x.style.fontSize = (0.80 * x.offsetWidth) + 'px';
                });

                document.querySelector('#js-crop-close-btn').style.fontSize = (0.45 * toolbarDiv.offsetWidth) + 'px';
                if(undefined != document.querySelector('#cropRect')){
                    document.querySelector('#js-crop-overlay').removeChild(document.querySelector('#js-crop-overlay').querySelector('#cropRect'));
                    document.querySelector('#start-crop').innerHTML = '&#8862;';
                    document.querySelector('#start-crop').title = `Select area`;
                    document.querySelector('#js-crop-image').setAttribute('data-crop-status','in-active');
                    document.querySelector('#js-crop-image').removeAttribute('data-start-co');
                }

        }
    }

    /*
    * Create toolbar 
    *
    *@param overlayDiv Overlay div object 
    *@param imgSrc  Image source of image to be loaded
    *@param imgDim  Image dimension to load
	*@param param2 for future extension
    */

    createToolbar(overlayDiv,imgSrc,imgDim,param2,param3) {
        let imgType = undefined != param2 && undefined != param2.imageType && 'jpeg' == param2.imageType  ? param2.imageType : 'png';
        let toolbar = document.createElement('div');
        let toolbarBgColor = undefined != param2 &&  undefined != param2.customColor && undefined != param2.customColor.toolbarBgColor ? param2.customColor.toolbarBgColor: 'rgba(255,255,255,1)';
        toolbar.id = `js-crop-toolbar`;
        toolbar.style = `tex-align:center;padding:2px;color:rgba(255,255,255,1);display:inline-block;width:3%;height:${overlayDiv.offsetHeight}px;position:absolute;float:right;right:0;background-color:${toolbarBgColor};overflow-y:auto;`;
        overlayDiv.appendChild(toolbar);

        let btnFontColor = undefined != param2 && undefined != param2.customColor && undefined != param2.customColor.buttonFontColor ? param2.customColor.buttonFontColor : 'rgba(255,255,255,1)';
        let btnBgColor = undefined != param2 &&  undefined != param2.customColor && undefined != param2.customColor.buttonBgColor ? param2.customColor.buttonBgColor: 'rgba(0,0,0,1)';
        let btnStyle = `color:${btnFontColor};opacity:0;font-size:300%;cursor:pointer;border-radius:0%;margin-bottom:3px;background-color:${btnBgColor};text-align:center;width:98%;height:${toolbar.offsetWidth - 6}px;border:1px solid ${btnBgColor};box-shadow:-1px -1px 10px ${btnBgColor};`;
        let btnMouseenter = `this.style.boxShadow ='-2px -2px 10px ${btnBgColor}'; this.style.borderRadius='20%'`;
        let btnMouseleave = `this.style.boxShadow ='-1px -1px 1px ${btnBgColor}';this.style.borderRadius='25%'`;

        let cropIconDiv = document.createElement('div');
        cropIconDiv.id = `start-crop`;
        cropIconDiv.title = `Select area`;
        cropIconDiv.style = btnStyle;
        cropIconDiv.setAttribute('onmouseenter', btnMouseenter);
        cropIconDiv.setAttribute('onmouseleave', btnMouseleave);
        cropIconDiv.innerHTML = '&#8862;';
        cropIconDiv.addEventListener('click', () => this.addCropEventListener(event));
        toolbar.appendChild(cropIconDiv);

        
        let revertDiv = document.createElement('div');
        revertDiv.id = `revert-to-original`;
        revertDiv.title = `Revert to original Image`;
        revertDiv.setAttribute('data-img-dimension', imgDim.height + ',' + imgDim.width);
        revertDiv.setAttribute('data-dim-ratio', imgDim.dimRatio);
        revertDiv.setAttribute('onmouseenter', btnMouseenter);
        revertDiv.setAttribute('onmouseleave', btnMouseleave);
        revertDiv.style = btnStyle;
        revertDiv.innerHTML = '&#8646;';
        revertDiv.addEventListener('click', event => this.revertToOriginal(event));
        toolbar.appendChild(revertDiv);

        let prevStepDiv = document.createElement('div');
        prevStepDiv.id = `previous-step`;
        prevStepDiv.title = `Revert to previous crop`;
        prevStepDiv.style = btnStyle;
        prevStepDiv.setAttribute('onmouseenter', btnMouseenter);
        prevStepDiv.setAttribute('onmouseleave', btnMouseleave);
        prevStepDiv.innerHTML = '&#10550;';
        prevStepDiv.addEventListener('click', event => this.restorePreviousCrop(event));
        toolbar.appendChild(prevStepDiv);

        let nextStepDiv = document.createElement('div');
        nextStepDiv.id = `next-step`;
        nextStepDiv.title = `Restore last crop`;
        nextStepDiv.style = btnStyle;
        nextStepDiv.setAttribute('onmouseenter', btnMouseenter);
        nextStepDiv.setAttribute('onmouseleave', btnMouseleave);
        nextStepDiv.innerHTML = '&#10551;';
        nextStepDiv.addEventListener('click', event => this.restoreNextCrop(event));
        toolbar.appendChild(nextStepDiv);

       
if(undefined != param2 && 0 !== param2.length ){

            if(false !== param2.saveButton){
                let saveImgDiv = document.createElement('div');
                saveImgDiv.id = `save-image`;
                saveImgDiv.title = `Save Image`;
                saveImgDiv.style = btnStyle;
                saveImgDiv.setAttribute('onmouseenter', btnMouseenter);
                saveImgDiv.setAttribute('onmouseleave', btnMouseleave);
                saveImgDiv.innerHTML = '&#10515;';
                saveImgDiv.addEventListener('click',()=>{
                                                            let downloadLink = document.createElement('a');
                                                            downloadLink.href = this.currentImgToBlob();
                                                            downloadLink.setAttribute('download', 'image.'+imgType);
                                                            downloadLink.click();
                });
                toolbar.appendChild(saveImgDiv);
            }
            
            if(undefined != param2.extButton  && 0 !== param2.extButton.length && 'function' == typeof(param2.extButton.callBack)){ 
                let extBtnDiv = document.createElement('div');
                extBtnDiv.id = `ext-button`;
                extBtnDiv.style = undefined != param2.extButton.buttonCSS ? btnStyle +param2.extButton.buttonCSS : btnStyle;
                extBtnDiv.setAttribute('onmouseenter', btnMouseenter);
                extBtnDiv.setAttribute('onmouseleave', btnMouseleave);
                extBtnDiv.title = param2.extButton.buttonTitle ? param2.extButton.buttonTitle: 'Extension';
                extBtnDiv.innerHTML = param2.extButton.buttonText ? param2.extButton.buttonText: 'ext';
                extBtnDiv.addEventListener('click', ()=>param2.extButton.callBack(this.currentImgToBlob()));
                toolbar.appendChild(extBtnDiv);
            }
}else{
    let saveImgDiv = document.createElement('div');
        saveImgDiv.id = `save-image`;
        saveImgDiv.title = `Save Image`;
        saveImgDiv.style = btnStyle;
        saveImgDiv.setAttribute('onmouseenter', btnMouseenter);
        saveImgDiv.setAttribute('onmouseleave', btnMouseleave);
        saveImgDiv.innerHTML = '&#10515;';
        saveImgDiv.addEventListener('click',()=>{
                                                    let downloadLink = document.createElement('a');
                                                    downloadLink.href = this.currentImgToBlob();
                                                    downloadLink.setAttribute('download', 'image.'+imgType);
                                                    downloadLink.click();
        });
        toolbar.appendChild(saveImgDiv);
}

if(undefined != param3 && 0 !== param3.length ){
   param3.map((x,i)=>{
    let btnEvnt =  undefined != x.buttonEvent ? x.buttonEvent : 'click';
    let addBtnDiv = document.createElement('div');
    addBtnDiv.id = `ext-button-${i}`;
    addBtnDiv.style = undefined != x.buttonCSS ? btnStyle + x.buttonCSS : btnStyle;
    addBtnDiv.setAttribute('onmouseenter', btnMouseenter);
    addBtnDiv.setAttribute('onmouseleave', btnMouseleave);
    addBtnDiv.title = x.buttonTitle ? x.buttonTitle: `Button ${i+1}`;
    addBtnDiv.innerHTML = x.buttonText ? x.buttonText: `ext`;
    if('function' == typeof(x.callBack)){
        addBtnDiv.addEventListener( btnEvnt, ()=>x.callBack(this.currentImgToBlob(),x.relParam));
    }
    toolbar.appendChild(addBtnDiv);
   });

}


    let toolbarDiv = document.querySelector('#js-crop-toolbar');
    let toolbarOpts = Array.from(toolbarDiv.querySelectorAll('div'));;

        toolbarDiv.style.paddingTop = ((overlayDiv.offsetHeight - (toolbarOpts.length * toolbarDiv.offsetWidth)) / 2) + 'px'
        toolbarOpts.map((x, i) => {
            setTimeout(() => {
                x.style.height = x.offsetWidth  + 'px';
                x.style.opacity = '1';
                x.style.boxShadow = `-1px -1px 1px ${btnBgColor}`;
                x.style.fontSize = (0.80 * x.offsetWidth) + 'px';
                x.style.borderRadius = '25%';
                x.addEventListener('click',(event)=> {
                   if(0 !== i){
                    if(undefined != document.querySelector('#cropRect')){
                        document.querySelector('#js-crop-overlay').removeChild(document.querySelector('#js-crop-overlay').querySelector('#cropRect'));
                     }
                     document.querySelector('#start-crop').innerHTML = '&#8862;';
                     document.querySelector('#start-crop').title = `Select area`;
                     document.querySelector('#js-crop-image').setAttribute('data-crop-status','in-active');
                     document.querySelector('#js-crop-image').style.cursor = '';
                     document.querySelector('#js-crop-image').removeAttribute('data-start-co');
                   }  
                });
            }, (5 * i))
        });
    }


   
    /*
    * Active crop area select
    *
    *@param e  Select area button click event
    *
    */ 

    addCropEventListener(e) {
        let imgEl =  document.querySelector('#js-crop-image');
        imgEl.setAttribute('data-mouse-status','up');
        if('in-active' === imgEl.getAttribute('data-crop-status') ){
            imgEl.style.cursor = 'crosshair';
            imgEl.setAttribute('data-crop-status', `active`);
            imgEl.addEventListener("mousedown", event => {
                                                                event.target.setAttribute('data-start-co', `${event.offsetX},${event.offsetY}`);
                                                                event.target.setAttribute('data-mouse-status','down');
                                                                event.target.addEventListener('mousemove', event => this.createCropBox(event));
                                                            
            });
            e.target.innerHTML = '&#9986;';
            e.target.title = 'Crop'; 

        } else if ('crop-ready' === imgEl.getAttribute('data-crop-status')){
            this.endCrop();
            e.target.innerHTML = '&#8862;';
            e.target.title = `Select area`;
            imgEl.setAttribute('data-crop-status', `in-active`);
        }
        document.querySelector('#js-crop-overlay').addEventListener('mouseup',event =>   {
                                                                                                if('start-crop' != event.target.id && 'in-active' != imgEl.getAttribute('data-crop-status')){
                                                                                                        imgEl.setAttribute('data-crop-status','crop-ready');
                                                                                                        imgEl.setAttribute('data-mouse-status','up');
                                                                                         }
                                                                    });
    }


    /*
    * Revert to original image
    *
    *@param e  Button click event
    *
    */

    revertToOriginal(e) {
        let overlayDiv = document.querySelector('#js-crop-overlay');
        let imgEl = document.querySelector('#js-crop-image');
        let cropStepCount = parseInt(imgEl.getAttribute('data-crop-count'));
        let bufferImg = new Image();
        bufferImg.src = imgEl .getAttribute('data-crop-0');
        imgEl.setAttribute('data-crop-count','0');
        imgEl.setAttribute('data-crop-step','0');

        for(let i=1; i<=cropStepCount; i++){
            imgEl.removeAttribute('data-crop-'+i);
          }

        let opImgDim = this.getOptimizedImageSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, bufferImg.width, bufferImg.height);
        imgEl.style.margin = `${((overlayDiv.offsetHeight - opImgDim.height) / 2)}px ${(((0.97 * overlayDiv.offsetWidth) - opImgDim.width) / 2)}px`;
        imgEl.height = opImgDim.height;
        imgEl.width = opImgDim.width;
        imgEl.setAttribute('data-crop-status','in-active');
        imgEl.removeAttribute('data-mouse-status');
        imgEl.setAttribute('data-dim-ratio', e.target.getAttribute('data-dim-ratio'));
        imgEl.src = imgEl.getAttribute('data-crop-0');
       
    }


    /*
    * Resotre previous crop step
    *
    *@param e button click event
    *
    */
    restorePreviousCrop(e) {
        let imgEl = document.querySelector('#js-crop-image');
        let curCropStep = parseInt(imgEl.getAttribute('data-crop-step'));
        if (1 < curCropStep ) {
      
                    let overlayDiv = document.querySelector('#js-crop-overlay');
                    let bufferImg = new Image();
                    bufferImg.src = imgEl .getAttribute('data-crop-'+(curCropStep-1));
                    bufferImg.addEventListener('load', ()=>{
                        let opImgDim = this.getOptimizedImageSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, bufferImg.width, bufferImg.height);
                        imgEl.setAttribute('data-crop-step',(curCropStep-1));
                        imgEl.style.margin = `${((overlayDiv.offsetHeight - opImgDim.height) / 2)}px ${(((0.97 * overlayDiv.offsetWidth) - opImgDim.width) / 2)}px`;
                        imgEl.height = opImgDim.height;
                        imgEl.width = opImgDim.width;
                        imgEl.src = bufferImg.src
                    });
        }
    }

   /*
    * Resotre next crop step
    *
    *@param e button click event
    *
    */

    restoreNextCrop(e) {
        let imgEl = document.querySelector('#js-crop-image');
        let curCropStep = parseInt(imgEl.getAttribute('data-crop-step'));
        let totalCrop = parseInt(imgEl.getAttribute('data-crop-count'));
        if ( 0 < curCropStep  && totalCrop >= (curCropStep+1) ) {
                    let overlayDiv = document.querySelector('#js-crop-overlay');
                    let bufferImg = new Image();
                    bufferImg.src = imgEl .getAttribute('data-crop-'+(curCropStep+1));
                 
                    bufferImg.addEventListener('load', ()=>{
                        let opImgDim = this.getOptimizedImageSize(overlayDiv.offsetWidth, overlayDiv.offsetHeight, bufferImg.width, bufferImg.height);
                        imgEl.setAttribute('data-crop-step',(curCropStep+1));
                        imgEl.style.margin = `${((overlayDiv.offsetHeight - opImgDim.height) / 2)}px ${(((0.97 * overlayDiv.offsetWidth) - opImgDim.width) / 2)}px`;
                        imgEl.height = opImgDim.height;
                        imgEl.width = opImgDim.width;
                        imgEl.src = bufferImg.src;
                        console.log(imgEl.style.margin); 
                    });
        }
    }

    /*
    * Restore current crop state to blob
    *
    */
    currentImgToBlob() {
        let loadedImg = document.querySelector('#js-crop-image');
        let origImgRatio = loadedImg.getAttribute('data-dim-ratio').split(',');
        let imgType = `image/${loadedImg.getAttribute('data-img-type')}`;  
        let imgQuality = parseFloat(loadedImg.getAttribute('data-img-quality'));
        let tempCanv = document.createElement('canvas');
        let downloadLink = document.createElement('a');
        let tempCtx = tempCanv.getContext('2d');
        let imgHtRatio = parseFloat(origImgRatio[1]);
        let imgWdRatio = parseFloat(origImgRatio[0]);
        tempCanv.height = loadedImg.height;
        tempCanv.width = loadedImg.width;
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        tempCtx.drawImage(loadedImg, 0, 0, loadedImg.offsetWidth * imgWdRatio, loadedImg.offsetHeight * imgHtRatio, 0, 0, loadedImg.offsetWidth, loadedImg.offsetHeight);
        return tempCanv.toDataURL(imgType,imgQuality);
    }

     /*
    * Close overlay on close button click
    */

    closeOverlay() {
        document.body.removeChild(document.querySelector('#js-crop-overlay'));
		document.body.style.overflow = '';
		document.body.style.margin = ''
		document.querySelector('head').removeChild(document.querySelector('#ctc-scroll-css'));
    }

    /*
    *End crop on crop button click
    */

    endCrop() {

        let cropRect = document.querySelector('#cropRect');
        if (undefined != cropRect ) {
            let startCo = cropRect.getAttribute('data-start-xy').split(',');
            let cropImg = document.querySelector('#js-crop-image');
            let curCropStep = parseInt(cropImg.getAttribute('data-crop-step'))+1;
            let cropStepCount = parseInt(cropImg.getAttribute('data-crop-count'));
            let origImgRatio = cropImg.getAttribute('data-dim-ratio').split(',');
            let overlayDiv = document.querySelector('#js-crop-overlay');
            let imgQuality = parseFloat(cropImg.getAttribute('data-img-quality'));
            let imgType = `'image/${cropImg.getAttribute('data-img-type')}`;
   

            let tempCanv = document.createElement('canvas');
            let tempCtx = tempCanv.getContext('2d');
            let imgHtRatio = parseFloat(origImgRatio[1]);
            let imgWdRatio = parseFloat(origImgRatio[0]);
            let cropImgWd = cropRect.offsetWidth * imgWdRatio;
            let cropImgHt = cropRect.offsetHeight * imgHtRatio;
            cropImg.style.margin = `${((overlayDiv.offsetHeight - cropRect.offsetHeight) / 2)}px ${(((0.97 * overlayDiv.offsetWidth) - cropRect.offsetWidth) / 2)}px`;
            cropImg.style.cursor = '';
            tempCanv.height = cropRect.offsetHeight;
            tempCanv.width = cropRect.offsetWidth;
            cropImg.setAttribute('data-dim-ratio', '1,1');
            cropImg.height = cropRect.offsetHeight;
            cropImg.width = cropRect.offsetWidth;
            tempCtx.imageSmoothingEnabled = true;
            tempCtx.imageSmoothingQuality = 'high';
            tempCtx.drawImage(cropImg, (parseInt(startCo[0]) * imgWdRatio), ((parseInt(startCo[1])) * imgHtRatio), cropImgWd, cropImgHt, 0, 0, cropRect.offsetWidth, cropRect.offsetHeight);
            let imgBlob = tempCanv.toDataURL(imgType,imgQuality);
            cropImg.setAttribute('data-crop-step',curCropStep);
            cropImg.setAttribute('data-crop-'+curCropStep, imgBlob);
            cropImg.setAttribute('data-crop-count',curCropStep);
           
            cropImg.src = imgBlob;
            cropImg.removeAttribute('data-start-co');
            overlayDiv.removeChild(cropRect);

            for(let i = (curCropStep+1); i<=cropStepCount; i++){
                cropImg.removeAttribute('data-crop-'+i);
              }
        }

    }

    /*
    * Create cropbox on button click
    *
    *@param e mousmover event
    *
    */

    createCropBox(e) {
        let imgEl = document.querySelector("#js-crop-image");
        if ('in-active' != imgEl.getAttribute('data-crop-status') && 'down' == imgEl.getAttribute('data-mouse-status')) {
            let par = this.setCanvasCo(e);
            if (undefined != par) {
                let cropRect = document.querySelector('#cropRect');
                if (undefined == cropRect) {
                    cropRect = document.createElement('canvas');
                    cropRect.id = 'cropRect';
                    cropRect.style = `z-index:1001000;cursor:crosshair;position:absolute;border:1px dotted rgba(255,255,255,1);box-shadow:0px 0px 10px rgba(0,0,0,1);left:${parseFloat(imgEl.style.marginLeft) + par.startX}px;top:${parseFloat(imgEl.style.marginTop) + par.startY}px;width:${par.width}px;height:${par.height}px;`;
                    cropRect.setAttribute('data-start-xy', par.startX + ',' + par.startY);
                    imgEl.parentNode.insertBefore(cropRect, imgEl);
                    cropRect.addEventListener('mousedown', ()=>imgEl.setAttribute('data-mouse-status','down'));
                    cropRect.addEventListener('mouseup', ()=>imgEl.setAttribute('data-mouse-status','up'));
                    cropRect.addEventListener('mousemove',event => {
                                                                    if('down' == imgEl.getAttribute('data-mouse-status')){
                                                                        event.target.style.width =  event.offsetX+'px';
                                                                        event.target.style.height = event.offsetY+'px';
                                                                    }                               
                    });
                } else {
                    cropRect.style.left = (parseFloat(imgEl.style.marginLeft) + par.startX) + 'px';
                    cropRect.style.top = (parseFloat(imgEl.style.marginTop) + par.startY) + 'px';
                    cropRect.style.height = par.height + 'px';
                    cropRect.style.width = par.width + 'px';
                    cropRect.setAttribute('data-start-xy', par.startX + ',' + par.startY);
                }
            }
        }
    }

 

       
    /*
    * Optimize image size to fit screen
    *
    *@param screenWidth  window.innerWidth
    *@param screenHeight  window.innerHeight
    *@param imageActualWidth  actual width of image
    *@param imageActualHeight  actual height of image
	*@return object object with optimized image width and height
    */
    getOptimizedImageSize(screenWidth, screenHeight, imageActualWidth, imageActualHeight) {

        var imageScreenHeightRatio = 0,
            imageScreenWidthRatio = 0,
            optimizedImageHeight = 0,
            optimizedImageWidth = 0;
        var imgPercent = 0.95,
            marginPercent = 0.05;

        if ((imageActualWidth >= screenWidth) && (imageActualHeight >= screenHeight)) {
            if (imageActualWidth >= imageActualHeight) {
                if (imageActualWidth > imageActualHeight) {
                    imageScreenWidthRatio = imageActualWidth / screenWidth;
                    optimizedImageWidth = (imageActualWidth / imageScreenWidthRatio) - (marginPercent * screenWidth);
                    optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
                    if (optimizedImageHeight >= (imgPercent * screenHeight)) {
                        imageScreenHeightRatio = screenHeight / imageActualHeight;
                        optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (marginPercent * screenHeight);
                        optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
                    }
                } else {
                    if (screenWidth > screenHeight) {
                        optimizedImageHeight = (imgPercent * screenHeight);
                        optimizedImageWidth = optimizedImageHeight;
                    } else if (screenHeight > screenWidth) {
                        optimizedImageWidth = (imgPercent * screenWidth);
                        optimizedImageHeight = optimizedImageWidth;
                    } else {
                        imageScreenHeightRatio = screenHeight / imageActualHeight;
                        optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (marginPercent * screenHeight);
                        optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
                    }
                }
            } else {
                imageScreenHeightRatio = imageActualHeight / screenHeight;
                optimizedImageHeight = (imageActualHeight / imageScreenHeightRatio) - (marginPercent * screenHeight);
                optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
            }
        } else if (imageActualWidth >= screenWidth && imageActualHeight < screenHeight) {
            imageScreenWidthRatio = screenWidth / imageActualWidth;
            optimizedImageWidth = imageActualWidth * imageScreenWidthRatio - (marginPercent * screenWidth);
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        } else if (imageActualHeight >= screenHeight && imageActualWidth < screenWidth) {
            imageScreenHeightRatio = screenHeight / imageActualHeight;
            optimizedImageHeight = imageActualHeight * imageScreenHeightRatio - (marginPercent * screenHeight);
            optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        } else {
            var avilableImageWidth = imgPercent * screenWidth;
            var avilableImageHeight = imgPercent * screenHeight;
            if (imageActualWidth >= avilableImageWidth && imageActualHeight >= avilableImageHeight) {
                var imageAvilableWidthRatio = avilableImageWidth / imageActualWidth;
                imageAvilableHeightRatio = avilableImageHeight / imageActualHeight;
                optimizedImageWidth = avilableImageWidth * imageAvilableWidthRatio;
                optimizedImageHeight = screenHeight * imageScreenHeightRatio;
            } else if (imageActualWidth >= avilableImageWidth && imageActualHeight < avilableImageHeight) {
                var imageAvilableWidthRatio = avilableImageWidth / imageActualWidth;
                optimizedImageWidth = imageActualWidth * imageAvilableWidthRatio;
                optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
            } else if (imageActualHeight >= avilableImageHeight && imageActualWidth < avilableImageWidth) {
                var imageAvilableHeightRatio = avilableImageHeight / imageActualHeight;
                optimizedImageHeight = imageActualHeight * imageAvilableHeightRatio;
                optimizedImageWidth = imageActualWidth * (optimizedImageHeight / imageActualHeight);
            } else {
                optimizedImageWidth = imageActualWidth;
                optimizedImageHeight = imageActualHeight;
            }
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        }
        //at last check it optimized width is still large			
        if (optimizedImageWidth > (imgPercent * screenWidth)) {
            optimizedImageWidth = imgPercent * screenWidth;
            optimizedImageHeight = imageActualHeight * (optimizedImageWidth / imageActualWidth);
        }
        return {
            width: optimizedImageWidth,
            height: optimizedImageHeight
        };
    }

    
    /*
    * Set crop canvas coordinate
    *
    *@param e mousmove event
    *
    */
    setCanvasCo(e) {

        if (undefined != e.target.getAttribute('data-start-co')) {
            let startCoArr = e.target.getAttribute('data-start-co').split(',');
            let startX = parseInt(startCoArr[0]);
            let startY = parseInt(startCoArr[1]);
            let endX = e.offsetX < 0 ? 0 : e.offsetX;
            let endY = e.offsetY < 0 ? 0 : e.offsetY;
            let cropHeight = endY >= startY ? endY - startY : startY - endY;
            let cropWidth = endX >= startX ? endX - startX : startX - endX;

            if (0 !== cropWidth && 0 !== cropHeight) {

                if (endX < startX && endY < startY) {
                    return {
                        el: e.target,
                        startX: endX,
                        startY: (startY - cropHeight),
                        height: cropHeight,
                        width: cropWidth
                    }
                } else if (endX > startX && endY < startY) {
                    return {
                        el: e.target,
                        startX: startX,
                        startY: (startY - cropHeight),
                        height: cropHeight,
                        width: cropWidth
                    }
                } else if (endX < startX && endY > startY) {
                    return {
                        el: e.target,
                        startX: endX,
                        startY: (endY - cropHeight),
                        height: cropHeight,
                        width: cropWidth
                    }
                } else {
                    return {
                        el: e.target,
                        startX: startX,
                        startY: startY,
                        height: cropHeight,
                        width: cropWidth
                    }

                }

            } else {
                return;
            }

        }

    }

    /*
	*Handle keystroke event
	* 
	*@param e Key stroke event
	*
	*/
	onKeyStroke(event){
            let cropRect =  document.querySelector('#cropRect');

                if (undefined != cropRect ) {
                    let imgEl = document.querySelector('#js-crop-image');

                    console.log(imgEl);
                    let startXy =  cropRect.getAttribute('data-start-xy').split(',');
                    let newStartY, newStartX;
                            switch(event.code){
                                case 'ArrowUp' :
                                       newStartY =  parseInt(startXy[1])-1;
                                      if(0 <= newStartY ){
                                        cropRect.setAttribute('data-start-xy',startXy[0]+','+newStartY);
                                        imgEl.setAttribute('data-start-co',startXy[0]+','+newStartY);
                                        cropRect.style.top = parseInt(cropRect.style.top)-1;
                                      }
                                break;
                                case 'ArrowDown':
                                   newStartY =  parseInt(startXy[1])+1;
                                      if((cropRect.offsetHeight+newStartY)  <=  imgEl.offsetHeight){
                                        cropRect.setAttribute('data-start-xy',startXy[0]+','+newStartY);
                                        imgEl.setAttribute('data-start-co',startXy[0]+','+newStartY);
                                        cropRect.style.top = parseInt(cropRect.style.top)+1;
                                      }
                                      
                                break;
                                case 'ArrowLeft' :
                                    newStartX =  parseInt(startXy[0])-1 ;
                                    if(0 <= newStartX ){
                                      cropRect.setAttribute('data-start-xy', newStartX+','+startXy[1]);
                                      imgEl.setAttribute('data-start-co',newStartX+','+startXy[1]);
                                      cropRect.style.left = parseInt(cropRect.style.left)-1;
                                    }
                                break;
                                case 'ArrowRight':
                                    newStartX =  parseInt(startXy[0])+1;
                                    if((cropRect.offsetWidth+newStartX)  <=  imgEl.offsetWidth){
                                      cropRect.setAttribute('data-start-xy',newStartX+','+startXy[1]);
                                      imgEl.setAttribute('data-start-co',newStartX+','+startXy[1]);
                                      cropRect.style.left = parseInt(cropRect.style.left)+1;
                                    }
                                break;
                            }
                    }
            }




}