<template>
  <section class="footer-section section is-fluid">
    <div class="has-text-centered">
      <div class="container">
        <div class="columns is-multiline">
          <div class="column is-4">
            <div class="footer-content about">
              <div class="title">
                Sobre a Vantum
              </div>
              <div class="text">
                Utilizamos tecnologia e inovação para mapear informações relevantes com agilidade e confiança, entregando soluções que agregam valor ao seu negócio.
              </div>
            </div>
            <div class="footer-content">
              <div class="title">
                Contato
              </div>
              <div class="text">
                <a href="https://goo.gl/maps/SwKu4ApfrJz" target="_blank">
                <i class="fas fa-map-marker-alt" style="display:block; float: left; margin-top 20px;"></i>
                Pelotas Parque Tecnológico <br>
                Av. Domingos de Almeida, 1785 <br>
                Pelotas | Rio Grande do Sul <br>
                </a>
              </div>
              <div class="text">
                <a href="mailto:ontato@vantum.com.br" target="_blank">
                  <i class="fas fa-envelope"></i>
                  contato@vantum.com.br
                </a>
              </div>
            </div>

          </div>
          <div class="column is-3">
            <div class="footer-content">
              <div class="title">
                Mapa do site
              </div>
              <div class="text">
                <ul>
                  <li><a href="/" target="">Home</a></li>
                  <li><a href="#features" target="">Soluções</a></li>
                  <li><a href="#aboutus" target="">Quem Somos</a></li>
                  <li><a href="#contact" target="">Contato</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="footer-content social">
              <div class="img">
                <img class="branco" src="../assets/img/Marca_principal_branco.svg">
              </div>
              <div class="title">
                Siga, curta e compartilhe!
              </div>
              <div class="text">
                <ul>
                  <li><a href="https://www.facebook.com/vantumdrones/" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-square"></i></a></li>
                  <li><a href="https://www.instagram.com/vantumdrones/" target="_blank"><i class="fab fa-instagram"></i></a></li>
                  <li><a href="https://www.linkedin.com/company/vantum/" target="_blank"><i class="fab fa-linkedin"></i></a></li>
                  <li><a href="https://wa.me/5553981177468?text=Eu%20estou%20interessado%20em%20seus%20servicos" target="_blank"><i class="fab fa-whatsapp-square"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "footer-section",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.footer-section {
  background-color: var(--color-dark);

  .column {
    &:not(:last-child) {
      border-right: 1px solid var(--color-darker);
    }

    &:not(:first-child) {
      border-left: 1px solid var(--color-shadow);
    }
  }

  .footer-content {
    text-align: left;
    color: white;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;

    &.social {
      text-align: center;
      ul {
        margin: 0;
        list-style-type: none;
        li {
          display: inline-block;
          margin: 0px 10px;
          font-size: 45px;
          font-weight: normal;

          a {
            color: inherit;
            &:hover {
              color: inherit;
            }

            i {
              font-size: 36px;
            }
          }
        }
      }
    }

    ul {
      list-style-type: none;
      margin-left: 30px;

      li {
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 20px;
      }
    }

    &:not(:last-child) {
      margin-bottom: 40px;
    }

    .img {
      text-align: center;
      img {
        width: 250px;
      }
    }

    .title {
      color: white;
      font-size: 18px;
      font-weight: bold;
    }

    .text {
      font-size: 14px;
      font-weight: normal;
      margin-bottom: 10px;

      a {
        color: inherit;
      }

      i {
        display: block;
        float: left;
        margin-right: 15px;
        font-size: 16px;
        margin-top: 4px;

        &.fa-map-marker-alt {
          margin-top: 27px;
          margin-right: 19px;
        }
      }
    }
  }
}
</style>
