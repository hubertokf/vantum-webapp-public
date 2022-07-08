<template>
  <div class="file-uploader">



    <form  v-if="showDropzone" ref="fileform" class="fileForm" :class="{'has-advanced-upload':determineDragAndDropCapable()}">

      <div class="inputPlace">
        
        <input class="file" type="file" id="file" ref="files" :accept="types" v-on:change="handleFilesUpload()" :multiple="maxUpload > 1 || maxUpload == -1" />
        <label for="file">
          <i class="fas fa-cloud-upload-alt"></i><br/>
          <strong>Clique</strong><span class="dragndrop"> ou arraste para ca</span>
        </label>
      </div>
      
      <div class="uploading">Uploading&hellip;</div>
      <div class="success">Done!</div>
      <div class="error">Error! <span></span>.</div>
    </form>


    <div class="upload-info">
      <div class="title" v-if="!compact">
        Imagens Selecionadas: {{ this.files.length }}
      </div>

      <b-progress
        :type="'is-success'"
        :size="'is-medium'"
        :value="totalProgress"
        :show-value="true"
        :format="'percent'"
        :precision="4"
        :keep-trailing-zeroes="false"
        v-if="!compact"
      ></b-progress>
      
      <div class="file-listing columns is-multiline">
        <div class="column file-item-column is-full" v-for="(file, index) in files" :key="'file-'+index">

        <b-progress
          :type="'is-success'"
          class="file-item"
          :value="progressFiles[index].progress"
          :show-value="true"
          :format="'percent'"
          :precision="4"
          :keep-trailing-zeroes="false"
        >
          <i class="fas fa-image"></i>
          <span class="filename">{{ file.name }}</span>
          
          <div v-if="progressFiles[index].progress != 0 && uploading == true" class="progressNumber is-pulled-right">{{ progressFiles[index].progress }}%</div>

          <a v-if="progressFiles[index].progress == 0 && uploading == false" class="remove is-pulled-right" v-on:click="removeFile( index )"><i class="fas fa-times"></i></a>
        </b-progress>

        </div>
      </div>

    </div>

    <b-button :loading="uploading" :disabled="uploading" class="button" v-if="!autoStartUpload" v-show="showButton &&(files.length > 0)" v-on:click="processQueue()">Upload</b-button>



  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "file-uploader",
  props: {
    showButton: {
      type: Boolean,
      default: true
    },
    showDropzone: {
      type: Boolean,
      default: true
    },
    makeThumbnails: {
      type: Boolean,
      default: true
    },
    autoStartUpload: {
      type: Boolean,
      default: false
    },
    uploadPath: {
      type: String,
      default: ""
    },
    filename: {
      type: String,
      default: ""
    },
    types: {
      type: String,
      default: ".jpg,.png,.tif,.tiff"
    },
    maxUpload: {
      type: Number,
      default: -1
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      files: [],
      // autoStartUpload: false,
      // uploadPath: "",
      // makeThumbnails: true,
      totalUploadPercentage: 0,
      progressFiles: [],
      uploading: false,
      dragAndDropCapable: false
    };
  },
  mounted () {
    
    this.dragAndDropCapable = this.determineDragAndDropCapable();

    if( this.dragAndDropCapable ){
      
      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
        
        this.$refs.fileform.addEventListener(evt, function(e){
          e.preventDefault();
          e.stopPropagation();
        }.bind(this), false);
      }.bind(this));

      this.$refs.fileform.addEventListener('drop', function(e){
        for( let i = 0; i < e.dataTransfer.files.length; i++ ){

          if (this.files.length < this.maxUpload || this.maxUpload == -1){
            this.progressFiles.push({progress:0})
            this.files.push( e.dataTransfer.files[i] );
          }else{
            alert("Número máximo de arquivos permitido é "+this.maxUpload)
          }
        }

        if(this.autoStartUpload){
          this.processQueue()
        }
      }.bind(this));
    }
  },
  computed: {
    totalProgress() {
      if (!this.totalUploadPercentage){
        return 0;
      }
      return parseInt(
        Math.round((this.totalUploadPercentage * 100) / this.files.length)
      );
    },
    progresslist: function() {
      return this.progressFiles;
    },
    getQueuedFiles(){
      return this.files.length
    }
  },

  methods: {
    handleFilesUpload() {
      for( let i = 0; i < this.$refs.files.files.length; i++ ){
        if (this.files.length < this.maxUpload || this.maxUpload == -1){
          this.progressFiles.push({progress:0})
          this.files.push( this.$refs.files.files[i] );
        }else{
          alert("Número máximo de arquivos permitido é "+this.maxUpload)
        }
      }
      this.$refs.files.value = ''

      if(this.autoStartUpload){
        this.processQueue()
      }
    },

    getUploadLink(params) {
      return axios.post("/api/v2/sign", params);
    },

    updateProgress(index, progress) {
      this.progressFiles[index].progress = progress
    },

    async processQueue() {
      return new Promise(async (resolve, reject) => {

        this.$buefy.toast.open({
          message: 'Upload iniciado',
          type: 'is-success'
          // position: 'is-bottom'
        })
        this.uploading = true
        for (var i = 0; i < this.files.length; i++) {
          let file = this.files[i];
          if (this.makeThumbnails && file.type.match(/image.*/)) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async event => await this.readerLoad(event, file, i);
          }

          await this.uploadFile(file, this.uploadPath, i, false);

        }
        this.uploading = false
        this.$emit('queue-complete')
        resolve()

        this.$buefy.toast.open({
          message: 'Upload finalizado',
          type: 'is-success'
          // position: 'is-bottom'
        })
      })
       
    },

    async readerLoad(readerEvent, file, progressIndex) {
      var image = new Image();
      image.src = readerEvent.target.result;
      image.onload = async imageEvent =>
      await this.resizeImageAndUpload(image, file, this.uploadPath, progressIndex);
    },

    async resizeImageAndUpload(
      image,
      inputFile,
      path,
      progressIndex,
      width = 100,
      height = 100,
      max_size = 544
    ) {
      // Resize the image
      var canvas = document.createElement("canvas");
      // var max_size = 544 // TODO : pull max size from a site config
      // var width = 50
      // var height = 50;
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);
      var dataUrl = canvas.toDataURL(inputFile.type);
      var resizedImage = this.dataURLToBlob(dataUrl);

      if (resizedImage && dataUrl) {
        let file = this.dataURLtoFile(dataUrl, inputFile.name);

        await this.uploadFile(file, path + "thumbnails/", null, true);
      }
    },

    async uploadFile(file, path, index, thumbnail = false) {
      let fname = file.name
      let fext = file.name.split('.').pop();
      if (this.filename != "") {
        fname = this.filename+'.'+fext
      }

        let self = this;
        await this.getUploadLink({
          filetype: "multipart/form-data",
          filename: fname,
          filepath: path
        })
          .then(async function(response) {
            if (thumbnail){
              self.$emit('sending-thumbnail', file)
            }else{
              self.$emit('sending', file)
            }
            await axios
              .put(response.data.signedURL, file, {
                headers: {
                  "Content-Type": "multipart/form-data"
                },
                onUploadProgress: function(progressEvent) {
                if (!thumbnail) {
                  let progress = parseInt(
                    Math.round((progressEvent.loaded * 100) / progressEvent.total)
                  );
                  self.updateProgress(index, progress)
                }
                }.bind(this)
              })
              .then(function() {
                if (!thumbnail) {
                  self.totalUploadPercentage++;
                  self.$emit('sending-success', file)
                }else{
                  self.$emit('sending-thumbnail-success', file)
                }

              })
              .catch(function() {

                if (!thumbnail) {
                  self.$emit('sending-fail', file)
                }else{
                  self.$emit('sending-thumbnail-fail', file)
                }
              });
          })
          .catch(function(err) {
            self.$emit('sign-fail', err)
          });
    },

    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    dataURLToBlob(dataurl) {
      var BASE64_MARKER = ";base64,";
      if (dataurl.indexOf(BASE64_MARKER) == -1) {
        var parts = dataurl.split(",");
        var contentType = parts[0].split(":")[1];
        var raw = parts[1];

        return new Blob([raw], { type: contentType });
      }

      var parts = dataurl.split(BASE64_MARKER);
      var contentType = parts[0].split(":")[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    },

    determineDragAndDropCapable() {
      var div = document.createElement("div");

      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },

    getImagePreviews(){
      /*
        Iterate over all of the files and generate an image preview for each one.
      */
      for( let i = 0; i < this.files.length; i++ ){
        /*
          Ensure the file is an image file
        */
        if ( /\.(jpe?g|png|gif)$/i.test( this.files[i].name ) ) {
          /*
            Create a new FileReader object
          */
          let reader = new FileReader();

          /*
            Add an event listener for when the file has been loaded
            to update the src on the file preview.
          */
          reader.addEventListener("load", function(){
            this.$refs['preview'+parseInt( i )][0].src = reader.result;
          }.bind(this), false);

          /*
            Read the data for the file in through the reader. When it has
            been loaded, we listen to the event propagated and set the image
            src to what was loaded from the reader.
          */
          reader.readAsDataURL( this.files[i] );
        }else{
          /*
            We do the next tick so the reference is bound and we can access it.
          */
          this.$nextTick(function(){
            this.$refs['preview'+parseInt( i )][0].src = '/images/file.png';
          });
        }
      }
    },

    removeFile( index ){
      this.files.splice( index, 1 );
    }
  }
};
</script>
<style lang="scss">
.file-uploader {
  .fileForm {
    display: block;
    height: 100px;
    width: 100%;
    background: #ccc;
    margin: auto;
    text-align: center;
    margin-bottom: 20px;
    border-radius: 4px;
    

    .inputPlace{
      @include v-centerer2;
      height: 100%;

      .file {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;

        + label {
          font-size: 1.25em;
          height: 100%;
          font-weight: 700;
          color: black;
          width: 100%;
          display: inline-block;
          cursor: pointer;

          i{
            margin-top: 23px;
          }
        }

        &:focus + label,
        .file + label:hover {
          // onclick
        }
      }

      .file:focus + label {
        outline: 1px dotted #000;
        outline: -webkit-focus-ring-color auto 5px;
      }

      .file + label * {
        pointer-events: none;
      }

      .dragndrop,
      .uploading,
      .success,
      .error {
        display: none;
      }

      
    }

    &.has-advanced-upload {
      background-color: #eee;
      outline: 2px dashed #aaa;
      outline-offset: -10px;

      .dragndrop {
        display: inline;
      }
    }

    .dragndrop,
    .uploading,
    .success,
    .error {
      display: none;
    }
  }

  .button{
    display: block;
    width: 120px;
    margin: 0 auto;
  }

  .upload-info{

    .title{
      font-size: 16px;
    }

    .file-listing{
      width: 100%;
      margin: auto;
      padding: 10px;
      background-color: #eee;
      max-height: 312px;
      overflow-y: scroll;
      overflow-x: hidden;

      &::-webkit-scrollbar-track {
        background-color: #f5f5f5;
      }

      &::-webkit-scrollbar {
        width: 8px;
        background-color: #f5f5f5;
      }

      &::-webkit-scrollbar-thumb {
        // border-radius: 10px;
        background-color: #888;
      }

      .file-item-column{
        padding-bottom: 10px;
        padding-top: 0;

        &:last-child{
          padding-bottom: 0;

          .progress{
            margin-bottom: 0;
          }
        }
      }

      .file-item{
        // max-width: 300px;
        background-color: #666;
        text-align: left;
        position: relative;
        height: 30px;

        .progress{
          
          // padding: 5px 10px;
          height: 100%;
          border-radius: 0;
        }

        .progress-value{
          height: 30px;
          width: 100%;
          padding: 0px 10px;
          font-size: 1rem;
          line-height: 2rem;
        }

        .progressNumber{
          display: block;
          width: 30px;
          text-align: center;
        }

        .filename{
          max-width: 80%;
          display: inline-block;
          overflow: hidden;
          max-height: 100%;
        }

        .fa-image{
          vertical-align: super;
          margin-right: 5px;
        }

        &:hover{
          .remove{
            display: block;
          }
        }

        .remove{
          display: none;
          color: red;
          cursor: pointer;
          width: 30px;
          text-align: center;
        }
      }

    }
  }

  .submit-button{
    display: block;
    margin: auto;
    text-align: center;
    width: 200px;
    padding: 10px;
    text-transform: uppercase;
    background-color: #CCC;
    color: white;
    font-weight: bold;
    margin-top: 20px;
  }
}
</style>