<template>
  <div class="payment-method-modal">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Metodo de cobrança</p>
          <div class="close" @click="$emit('close')	"><i class="fas fa-times"></i></div>
        </header>
        <section class="modal-card-body">
            <p>Em nosso método de cobrança você paga apenas o que utilizar.</p>
            <p>Nosso modelo se baseia em uma relação do número e na resolução de cada imagem. A partir deste modelo, é estimado uma cobrança referente aos dados que você enviar para processamento.</p>
        </section>
    </div>
  </div>
</template>

<script>

export default {
  name: "payment-method-modale",
  data() {
    return {
    };
  }
};

</script>

<style lang="scss" scoped>

.payment-method-modal {
  p{
    margin-bottom: 10px;
  }

  .close{
    cursor: pointer;
  }
}

</style>
