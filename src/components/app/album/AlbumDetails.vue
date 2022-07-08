<template>
  <div class="album-details">
    <div class="created">
      <div class="date">
        <i class="fas fa-calendar-alt"></i>
        {{ album.createdAt | moment("DD/MM/YYYY HH:mm")}}
      </div>

      <div class="owner">
        <i class="fas fa-user-alt"></i>
        {{ album.owner.firstName }}
      </div>
    </div>

    <div class="description attribute">
      <strong>Descrição:</strong> 
      {{ album.description }}
    </div>

    <div class="count attribute">
      <strong>Número de imagens:</strong> 
      {{ album.count }}
    </div>

    <div class="type attribute">
      <strong>Tipo de imagens:</strong> 
      {{ album.type }}
    </div>

    <div class="camera attribute">
      <strong>Tipo de camera:</strong> 
      {{ album.camera }}
    </div>

    <div class="imageSize attribute">
      <strong>Tamanho das imagens:</strong> 
      {{ album.width }} x {{ album.height }}
    </div>
  </div>
</template>

<script>
  export default {
    name: "album-details",
    props: {
      album: {
        type: Object,
      },
    },
  }
</script>

<style lang="scss" scoped>
.album-details{

  .created {
    font-size: 12px;
    margin-bottom: 20px;
    width: 100%;
    text-align: center;

    .date {
      display: inline;
    }

    .owner {
      display: inline;
      margin-left: 15px;
    }
  }

  .attribute{
    margin-bottom: 20px;

    p{
      display: inline;
    }
  }
}

</style>