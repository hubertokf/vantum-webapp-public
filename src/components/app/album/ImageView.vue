<template>
  <div class="image-view">
    <div class="image">
      <img :src="image.url" alt="">
    </div>
    <div class="columns is-multiline info is-mobile">
      <div class="column is-one-third">
        <div class="attribute filename">
          <div class="label">Nome do Arquivo</div>
          <div class="value">{{ image.filename }}</div>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="attribute size">
          <div class="label">Tamanho</div>
          <div class="value">{{ formatBytes(image.size) }}</div>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="attribute resolution">
          <div class="label">Resolução</div>
          <div class="value">{{ parseFloat(image.resolution).toFixed(1) }}</div>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="attribute width">
          <div class="label">Largura</div>
          <div class="value">{{ image.width }}px</div>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="attribute height">
          <div class="label">Altura</div>
          <div class="value">{{ image.height }}px</div>
        </div>
      </div>
      <div class="column is-one-third">
        <div class="attribute type">
          <div class="label">Tipo</div>
          <div class="value">{{ image.type }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "image-view",
    props: {
      image: {
        type: Object,
        default: () => { return {
          id: "asdfasdfasdfa",
          filename: "teste.png",
          size: "200x300",
          resolution: "20 MP",
          width: "200 px",
          height: "300 px",
          type: "image/png",
          url: "https://starwarsblog.starwars.com/wp-content/uploads/2017/05/yoda-advice-featured-1.jpg"
        }}
      },
    },
    methods: {
      formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }
    },
  }
</script>

<style lang="scss" scoped>
 .image-view{
    margin: auto;
    font-size: 14px;

    .image{
      
    }

    .info{
      position: relative;
      background-color: black;
      color: white;
      margin: 0;
      padding-top: 20px;
      text-align: center;

      .attribute{

        .label{
          font-weight: bold;
          color: white;
          line-height: 14px;
          margin-bottom: 0;
          font-size: 12px;
        }

        .value{
          display: inline-block;
          color: white;
        }
      }
    }
 }
</style>