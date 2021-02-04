import {upload} from './upload.js'

upload('#file', {
   multi:true,
   accept: ['.png', '.jpg', '.jpeg', '.gif'],
   onUpload(files) {
      console.log('Files:' ,files)
   }
})