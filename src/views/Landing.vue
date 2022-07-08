<template>
  <div class="landing">
    <div class="section hero overlay">
      <div class="container" style="    width: 100%;">
        <vue-carousel
          :per-page="1"
          :autoplay="true"
          :loop="true"
          :speed="5"
          :autoplayTimeout="5000"
          :autoplayHoverPause="true"
          :navigationEnabled="false"
          :paginationEnabled="true"
          :paginationActiveColor="'#00ce46'"
          :mouse-drag="false"
          :paginationPadding="0"
          :paginationSize="10"
        >

          <slide class="sectionslide VueCarousel-slide-active">
            <div class="slogan">
              <div class="msg">Descubra como é <strong>fácil</strong> e <strong>barato</strong> criar mapas usando drones</div>
            </div>
          </slide>

          <slide class="sectionslide VueCarousel-slide-active">
            <div class="slogan">
              <div class="msg">Agregue aos seus mapas informações georreferenciadas
              </div>
            </div>
          </slide>

          <slide class="sectionslide VueCarousel-slide-active">
            <div class="slogan">
              <div class="msg">Armazene suas imagens em nuvem,
                <br>processe e crie mapas digitais
              </div>
            </div>
          </slide>

          <slide class="sectionslide">
            <div class="slogan">
              <div class="msg">Trabalhe em seus mapas com ferramentas colaborativas</div>
            </div>
          </slide>

          <slide class="sectionslide">
            <div class="slogan">
              <div class="msg">Faça medições, crie anotações e marcações em seus mapas</div>
            </div>
          </slide>

          <slide class="sectionslide">
            <div class="slogan">
              <div class="msg">Trabalhe de maneira inteligente utilizando imagens aéreas e drones</div>
            </div>
          </slide>
        </vue-carousel>
        <div class="columns is-centered">
          <div class="column is-3">
            <a href="/signup?freebt">
              <div class="button is-fullwidth is-primary simulatebt">Experimente Grátis</div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="section features">
      <div class="container">
        <div class="columns is-multiline">
          <div id="features" class="column section-title is-12">
            Soluções
          </div>
          <div class="column is-one-quarters-widescreen feature">
            <div class="icon"><i class="fas fa-plane"></i></div>
            <div class="title">Coleta de Imagens</div>
            <div class="text">Em campo, colete todas as imagens que você precisa utilizando drones/VANTs de qualquer fabricante.</div>
          </div>
          <div class="column is-one-quarters-widescreen feature">
            <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
            <div class="title">Upload de Imagens</div>
            <div class="text">Acesse a plataforma <b>Vantum</b> e envie suas imagens com apenas alguns cliques por meio de qualquer dispositivo.</div>
          </div>
          <div class="column is-one-quarters-widescreen feature">
            <div class="icon"><i class="fas fa-server"></i></div>
            <div class="title">Processamento</div>
            <div class="text">Processamos suas imagens de maneira automatizada gerando mapas 2D e 3D entregando resultados confiáveis.</div>
          </div>
          <div class="column is-one-quarters-widescreen feature">
            <div class="icon"><i class="fas fa-map-marked-alt"></i></div>
            <div class="title">Tomada de Ação</div>
            <div class="text">Visualize, analise e compartilhe seus mapas e tenha acesso online a ferramentas de análise.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section application-fields">
      <div class="container">
        <div class="columns">
          <div class="column section-title is-12">
            Áreas de Aplicação
          </div>
        </div>
        <div class="columns">
          <div class="column section-subtitle is-12">
            Use mapas, fotos e modelos 3D para economizar tempo, apoiar tomadas de decisão, reduzir riscos e aumentar seus lucros.
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-third">
            <div class="application-field">
              <div class="text">
                Agricultura
              </div>
              <div class="bg-image agriculture">
                <picture>
                  <source type="image/webp" srcset="../assets/img/webp/cards/agriculture2.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
                  <img src="../assets/img/cards/agriculture2.jpg" alt="Huberto">
                </picture>
              </div>
            </div>
          </div>
          <div class="column auto">
            <div class="application-field">
              <div class="text">
                Construção
              </div>
              <div class="bg-image construction">
                <picture>
                  <source type="image/webp" srcset="../assets/img/webp/cards/construction2.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
                  <img src="../assets/img/cards/construction2.jpg" alt="Huberto">
                </picture>
              </div>
            </div>
          </div>
          <div class="column auto">
            <div class="application-field">
              <div class="text">
                Energia
              </div>
              <div class="bg-image energy">
                <picture>
                  <source type="image/webp" srcset="../assets/img/webp/cards/energy2.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
                  <img src="../assets/img/cards/energy2.jpg" alt="Huberto">
                </picture>
              </div>
            </div>
          </div>
        </div>

        <div class="columns is-multiline">
          <div class="column auto">
            <div class="application-field">
              <div class="text">
                Segurança
              </div>
              <div class="bg-image security">
                <picture>
                  <source type="image/webp" srcset="../assets/img/webp/cards/security2.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
                  <img src="../assets/img/cards/security2.jpg" alt="Huberto">
                </picture>
              </div>
            </div>
          </div>
          <div class="column auto">
            <div class="application-field">
              <div class="text">
                Mineração
              </div>
              <div class="bg-image mining">
                <picture>
                  <source type="image/webp" srcset="../assets/img/webp/cards/mining2.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
                  <img src="../assets/img/cards/mining2.jpg" alt="Huberto">
                </picture>
              </div>
            </div>
          </div>
          <div class="column is-one-third">
            <div class="application-field">
              <div class="text">
                Meio ambiente
              </div>
              <div class="bg-image florestal">
                <picture>
                  <source type="image/webp" srcset="../assets/img/webp/cards/florestal.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
                  <img src="../assets/img/cards/florestal.jpg" alt="Huberto">
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="pricing" class="section pricing">
      <div class="container">
        <div id="features" class="column section-title is-12">
          Preços
        </div>
        <div class="columns">
          <div class="column section-subtitle is-12 tryit">
            <a href="/signup?freebt">
              <div class="button is-fullwidth is-primary simulatebt">Experimente Grátis</div>
            </a>
            Processe 2 mapas de até 200 imagens gratuitamente!
          </div>
        </div>
        <div class="pricing-table">

          

          <!-- <div class="pricing-plan">
            <div class="plan-header">Gratuíto</div>
            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">R$</span>0,00</span>/mês</div>
            <div class="plan-items">
              <div class="plan-item">1 mês de armazenamento</div>
              <div class="plan-item">Ferramentas de produtividade</div>
              <div class="plan-item">2 Processamentos</div>
              <div class="plan-item">Limitado a 200 imagens</div>
            </div>
            <div class="plan-footer">
              <a href="/signup" class="button is-fullwidth">Escolher</a>
            </div>
          </div> -->

          <div class="pricing-plan">
            <div class="plan-header">Sob demanda</div>
            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">R$</span>0,00</span>/mês</div>
            <div class="plan-items">
              <div class="plan-item">1 mês de armazenamento</div>
              <div class="plan-item">Ferramentas de produtividade</div>
              <div class="plan-item">Pague somente o que processar <i class="fas fa-question-circle paymethod" @click="openModalBilling"></i></div>
              <!-- <div class="plan-item">Limitado a 200 imagens</div> -->
            </div>
            <div class="plan-footer">
              <a href="/signup" class="button is-fullwidth">Escolher</a>
            </div>
          </div>

          <div class="pricing-plan is-active">
            <div class="plan-header">Assinante</div>
            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">R$</span>29,90</span>/mês</div>
            <div class="plan-items">
              <div class="plan-item">100GB de armazenamento</div>
              <div class="plan-item">Ferramentas de produtividade</div>
              <div class="plan-item">45% OFF nos processamentos <i class="fas fa-question-circle paymethod" @click="openModalBilling"></i></div>
              <div class="plan-item">Até 1000 imagens por mapa</div>
              <!-- <div class="plan-item">45% de desconto nos processamentos</div> -->
            </div>
            <div class="plan-footer">
              <a href="/signup?subscriptionPlan=monthly" class="button is-fullwidth">Escolher</a>
            </div>
          </div>

          <!-- <div class="pricing-plan is-active">
            <div class="plan-header">Anual</div>
            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">R$</span>180,00</span>/ano</div>
            <div class="plan-items">
              <div class="plan-item">100GB de armazenamento</div>
              <div class="plan-item">Ferramentas de produtividade</div>
              <div class="plan-item">Pague somente o que utilizar <i class="fas fa-question-circle paymethod" @click="openModalBilling"></i></div>
              <div class="plan-item">30% de desconto nos processamentos</div>
            </div>
            <div class="plan-footer">
              <a href="/signup?subscriptionPlan=anual" class="button is-fullwidth">Escolher</a>
            </div> 
          </div>-->

          <div class="pricing-plan">
            <div class="plan-header">Premium</div>
            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency">R$</span>599,00</span>/mês</div>
            <div class="plan-items">
              <div class="plan-item">100GB de armazenamento</div>
              <div class="plan-item">Ferramentas de produtividade</div>
              <div class="plan-item">Até 1000 imagens por mapa</div>
              <div class="plan-item">Processe até 10 mil imagens por mês</div>
            </div>
            <div class="plan-footer">
              <a href="/signup?subscriptionPlan=premium" class="button is-fullwidth">Escolher</a>
            </div>
          </div>

          <div class="pricing-plan">
            <div class="plan-header">Empresarial</div>
            <div class="plan-price"><span class="plan-price-amount"><span class="plan-price-currency"></span>Consulte</span></div>
              <div class="plan-item">Uma plataforma personalizada<br />para o seu negócio</div>
              <div class="plan-item">Planos customizados</div>
            <div class="plan-footer">
              <a href="#contact" class="button is-fullwidth">Entrar em contato</a>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="section contact">
      <div class="bg">
        <picture>
          <source type="image/webp" srcset="../assets/img/webp/bg-contact.webp">
          <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
          <img src="../assets/img/bg-contact.png" alt="Huberto">
        </picture>
      </div>
      
      <div class="container">
        <div class="columns">
        </div>
        <div class="columns is-multiline">
          <div class="column">
          </div>
          <div class="column">

            <div id="contact" class="column section-title is-12">
              Ficou com alguma dúvida? Fale conosco!
            </div>
            <div class="column section-subtitle is-12">
              Oferecemos consultoria técnica e soluções específicas para o seu negócio. <br>Entre em contato!
            </div>
            <div class="column is-12">
              
              <contact-form></contact-form>              

            </div>
          </div>
        </div>
      </div>
    </div>




    <div class="section aboutus">
      <div class="container">
        <div class="columns">
          <div id="aboutus" class="column section-title is-12">
            Nossa Equipe
          </div>
        </div>
        <div class="columns is-multiline">
          <!-- <div class="column auto">
            <div class="worker">
              <div class="worker-photo">
                <img src="../assets/img/workers/fernando.jpeg" alt="">
              </div>
              <div class="worker-name">
                Fernando Castanho
              </div>
              <div class="worker-description">
                Diretor Executivo<br>
                Engenheiro Agrônomo
              </div>
            </div>
          </div> -->
          <div class="column auto">
            <div class="worker">
              <div class="worker-photo">
                <picture>
                  <source type="image/webp" srcset="../assets/img/webp/workers/huberto2.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/huberto2.jp2"> -->
                  <img src="../assets/img/workers/huberto2.jpg" alt="Huberto">
                </picture>
                <!-- <img src="../assets/img/workers/huberto2.jpg" alt="Huberto"> -->
              </div>
              <div class="worker-name">
                Huberto Kaiser Filho
              </div>
              <div class="worker-description">
                Diretor de Tecnologia<br>
                Engenheiro de Computação
              </div>
            </div>
          </div>
          <div class="column auto">
            <div class="worker">
              <div class="worker-photo">
                <picture>
                  <source type="image/webp" srcset="../assets/img/webp/workers/janice2.webp">
                  <!-- <source type="image/jp2" srcset="../assets/img/jp2/workers/janice2.jp2"> -->
                  <img srcset="../assets/img/workers/janice2.jpg" alt="Janice">
                </picture>
                <!-- <img src="../assets/img/workers/janice2.jpg" alt="Janice"> -->
              </div>
              <div class="worker-name">
                Janice Silveira
              </div>
              <div class="worker-description">
                Diretora Comercial<br>
                Engenheira Hídricaq
              </div>
            </div>
          </div>
          <div class="column auto">
            <div class="worker">
              <div class="worker-photo">
                <picture>
                  <source type="image/webp" srcset="@/assets/img/webp/workers/leonardo2.webp">
                  <!-- <source type="image/sjp2" srcset="@/assets/img/jp2/workers/leonardo2.jp2"> -->
                  <img srcset="../assets/img/workers/leonardo2.jpg" alt="Leonardo">
                </picture>
                <!-- <img src="../assets/img/workers/leonardo2.jpg" alt="Leonardo"> -->
              </div>
              <div class="worker-name">
                Leonardo João
              </div>
              <div class="worker-description">
                Diretor de Desenvolvimento<br>
                Engenheiro de Computação
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section partners">
      <div class="container">
        <div class="columns">
          <div class="column section-title is-12">
            Parceiros
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="partner">
              <a href="http://portal.ufpel.edu.br/" target="_blank" rel="noopener noreferrer">
                <div class="logo">
                  <picture class="ufpel">
                    <source type="image/webp" srcset="../assets/img/webp/partners/ufpel2.webp">
                    <!-- <source type="image/jp2" srcset="../assets/img/jp2/partners/ufpel2.jp2"> -->
                    <img src="../assets/img/partners/ufpel2.png" alt="UFPel">
                  </picture>
                  <!-- <img class="ufpel" src="../assets/img/partners/ufpel2.png" alt="UFPel"> -->
                </div>
                <div class="title">UFPel</div>
              </a>
            </div>
          </div>
          <div class="column">
            <div class="partner">
              <a href="https://wp.ufpel.edu.br/conectar/" target="_blank" rel="noopener noreferrer">
                <div class="logo">
                  <picture class="conectar">
                    <source type="image/webp" srcset="../assets/img/webp/partners/conectar2.webp">
                    <!-- <source type="image/jp2" srcset="../assets/img/jp2/partners/conectar2.jp2"> -->
                    <img src="../assets/img/partners/conectar2.png" alt="Conectar">
                  </picture>
                  <!-- <img class="conectar" src="../assets/img/partners/conectar2.png" alt="Conectar"> -->
                </div>
                <div class="title">Conectar</div>
              </a>
            </div>
          </div>
          <div class="column">
            <div class="partner">
              <a href="http://pelotasparquetecnologico.com.br/" target="_blank" rel="noopener noreferrer">
                <div class="logo">
                  <picture class="parque">
                    <source type="image/webp" srcset="../assets/img/webp/partners/parque.webp">
                    <!-- <source type="image/jp2" srcset="../assets/img/jp2/partners/parque.jp2"> -->
                    <img src="../assets/img/partners/parque.png" alt="Pelotas Parque Tecnológico">
                  </picture>
                  <!-- <img class="parque" src="../assets/img/partners/parque.png" alt="Pelotas Parque Tecnológico"> -->
                </div>
                <div class="title">Parque Tecnologico</div>
              </a>
            </div>
          </div>
          <!-- <div class="column">
            <div class="partner">
              <a href="http://hadlerhasse.com.br/site/" target="_blank" rel="noopener noreferrer">
                <div class="logo">
                  <img class="hadler" src="../assets/img/partners/hadler.png" alt="Hadler e ">
                </div>
                <div class="title">Hadler & Hasse Ltda.</div>
              </a>
            </div>
          </div>
          <div class="column">
            <div class="partner">
              <a href="https://partamon.com/" target="_blank" rel="noopener noreferrer">
                <div class="logo">
                  <img class="partamon" src="../assets/img/partners/partamon.png">
                </div>
                <div class="title">Partamon</div>
              </a>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// https://buefy.github.io/#/documentation/icon
import ContactForm from "@/components/Contact.form";
import PaymentModal from "./ModalPaymentMethod";
import SubscribeForm from '@/components/SubscribeForm'
import { Carousel, Slide } from "vue-carousel";

export default {
  name: "landing",
  components: {
    ContactForm,
    "vue-carousel": Carousel,
    Slide,
    SubscribeForm,
    PaymentModal
  },
  data() {
    return {
      fullname: "",
      email: "",
      actuation: "Área de Atuação",
      message: ""
    };
  },
  mounted () {
    ;
  },
  methods: {
    openModalBilling() {
      this.$buefy.modal.open({
          parent: this,
          component: PaymentModal,
          hasModalCard: true
        })
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.VueCarousel-inner {
  transition: transform 0ms ease 0ms !important;
}

.VueCarousel-slide {
  opacity: 0 !important;
}

.VueCarousel-slide-active {
  transition: all 0.5s !important;
  opacity: 1 !important;
}

.VueCarousel-dot{
  background-clip: inherit !important;
  margin: 0px 5px;
  margin-bottom: 40px;
}

.landing {
  .section-title {
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    color: #333;
  }

  .hero {
    // min-height: 760px;
    min-height: 100vh;
    background-color: var(--color-dark);
    background: url(../assets/img/bg2.jpg) no-repeat;
    background-size: cover;
    background-position: center;
    padding-top: 90px;
    padding-bottom: 30px;
    text-align: center;

    &.overlay {
      position: relative;

      &:before {
        position: absolute;
        content: " ";
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        background-color: rgba(0, 40, 27, 0.6);
      }
    }

    h1 {
      // margin-top: 329px;
      text-align: center;
      font-weight: bold;
    }

    .slogan {
      color: white;
      font-size: 60px;
      text-align: center;
      // font-weight: bold;
      line-height: 70px;
      opacity: 1;
      padding: 130px 0 150px 0;
      text-shadow: 1px 1px 1px #000;

      .msg {
        text-align: center;
        font-weight: normal;
        font-size: 11vw;
        font-size: 4vmax;
        line-height: 11vw;
        line-height: 5vmax;

        strong{
          color: white;
          font-weight: bold;
        }
      }
    }

    .simulatebt{
      background-color: var(--color-light);
      border: 3px solid var(--color-light);
      padding: 0 10px;
      // font-size: 24px;
      font-size: 1.3rem;
      height: 60px;
      font-weight: bold;
      text-transform: uppercase;

      &:hover{
        background-color: var(--color-light);
      }
    }

    .form-subscribe {
      background-color: white;
      margin-top: 90px;
      border-radius: 4px;
      box-shadow: 5px 4px 20px -9px;
      min-height: 235px;
      text-align: center;

      h2 {
        font-weight: normal;
        font-size: 40px;
        margin-top: 0;
        font-weight: bold;
      }

      h4 {
        font-weight: normal;
        margin-top: 0;
        font-size: 18px;
      }

      button.button {
        background-color: #00ce46;
        font-weight: bold;

        &:hover {
          background-color: #00ce46;
        }
      }
    }
  }

  .features {
    padding: 80px 15px;
    // color: white;
    // color: var(--color-dark);
    // background-color: var(--color-dark);

    .section-title {
      margin-bottom: 55px;
      // color: white;
      // color: var(--color-dark);
    }

    .feature {
      text-align: center;

      .icon {
        font-size: 40px;
        margin-bottom: 25px;
        font-weight: normal;
        color: var(--color-dark);
        // color: white;
      }

      .title {
        // color: white;
        font-size: 16px;
      }

      .text {
        font-size: 14px;
      }
    }
  }

  .pricing {
    padding: 120px 0 180px 0;
    

    .tryit{
      font-size: 18px;
      text-align:center;

      .simulatebt{
        background-color: var(--color-light);
        border: 3px solid var(--color-light);
        padding: 0 10px;
        // font-size: 24px;
        margin: auto;
        margin-bottom: 10px;
        font-size: 1.3rem;
        height: 40px;
        width: 300px;
        font-weight: bold;
        text-transform: uppercase;

        &:hover{
          background-color: var(--color-light);
        }
      }

      a{
        color: var(--color-light);
      }
    }

    .section-title {
      margin-bottom: 15px;
      color: var(--color-dark);
    }

    .plan-item{

      .paymethod{
        cursor: pointer;
      }
    }

    .pricing-plan{

      .plan-annouce{
        text-align: center;
        margin-top: 95px;
        font-weight: bold;
        font-size: 20px;
        color: var(--color-dark);
      }

      &.is-active{
        .plan-price{
          color: var(--color-light);

          span{
            color: var(--color-light);
          }
        }
        .button{
          background-color: var(--color-light) !important;
          color: white !important;
        }
      }

    }

    .button{
      background-color: var(--color-dark);
      color: white;
    }

    .feature {
      text-align: center;

      .icon {
        font-size: 40px;
        margin-bottom: 25px;
        font-weight: normal;
        color: white;
      }

      .title {
        color: white;
        font-size: 16px;
      }

      .text {
        font-size: 14px;
      }
    }
  }


  .aboutus {
    background-color: white;
    padding: 80px 15px;

    .section-title {
      margin-bottom: 40px;
    }

    .text {
      margin-bottom: 30px;
    }

    .worker {
      text-align: center;

      .worker-photo {
        border-radius: 100%;
        width: 120px;
        height: 120px;
        margin: 0 auto;
        margin-bottom: 20px;
        overflow: hidden;

        img {
          -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
          filter: grayscale(100%);
        }
      }

      .worker-name {
        font-weight: bold;
        font-size: 14px;
      }

      .worker-description {
        font-size: 12px;
        line-height: 16px;
      }
    }
  }

  .application-fields {
    padding: 80px 15px;
    color: white;
    background-color: var(--color-dark);

    .section-title {
      margin-bottom: 0;
      color: white;
    }

    .section-subtitle {
      font-size: 16px;
      margin-bottom: 30px;
    }

    .application-field {
      position: relative;
      height: 250px;
      text-align: center;
      overflow: hidden;
      margin-bottom: 0;
      -webkit-box-shadow: 4px 1px 18px -8px black;
      box-shadow: 4px 1px 18px -8px black;

      .bg-image {
        position: absolute;
        text-align: center;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: white;

        img{
          height: 100%;
          width: auto;
          max-width: fit-content;
        }

        // &.agriculture {
        //   img{
        //     height: 100%;
        //     width: auto;
        //     max-width: fit-content;
        //   }
        // }
        // &.construction {
        //   background: url(../assets/img/cards/construction2.jpg) no-repeat;
        //   background-size: cover;
        // }
        // &.energy {
        //   background: url(../assets/img/cards/energy2.jpg) no-repeat;
        //   background-size: cover;
        // }
        // &.government {
        //   background: url(../assets/img/cards/government.png) no-repeat;
        //   background-size: cover;
        // }
        // &.security {
        //   background: url(../assets/img/cards/security2.jpg) no-repeat;
        //   background-size: cover;
        // }
        // &.mining {
        //   background: url(../assets/img/cards/mining2.jpg) no-repeat;
        //   background-size: cover;
        // }
        // &.florestal {
        //   background: url(../assets/img/cards/florestal.jpg) no-repeat;
        //   background-size: cover;
        // }
      }

      .text {
        position: absolute;
        top: 50%;
        bottom: 50%;
        z-index: 1;
        left: 0;
        color: white;
        text-shadow: 3px 3px 3px #000;
        font-weight: bold;
        font-size: 20px;
        width: 100%;
      }
    }
  }

  .partners {
    padding: 6rem 1.5rem;

    .section-title {
      margin-bottom: 30px;
    }

    .partner {
      text-align: center;
      display: inline-block;

      .logo {
        overflow: hidden;
        height: 110px;

        img {
          max-height: 100%;

          &.ufpel {
          }

          &.conectar {
            // margin: 10px 0;
          }
          &.parque {
            margin: 8px 0px;
          }
          &.hadler {
            margin: 4px 0;
          }
          &.partamon {
            margin: 0;
          }
        }
      }

      .title {
        font-size: 18px;
        visibility: hidden;
      }
    }
  }

  .contact {
    background-color: var(--color-dark);
    color: white;
    background-position: -280px center;
    background-repeat: no-repeat;
    padding: 9rem 1.5rem;
    overflow: hidden;
    position: relative;

    .bg{
      position: absolute;
      top: 0;
      left: -280px;
    }

    .section-title {
      color: white;
      text-align: left;
      margin-bottom: 0;
    }

    .section-subtitle {
      text-align: left;
      font-size: 16px;
    }
  }
}
</style>
