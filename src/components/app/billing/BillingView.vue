<template>
  <div class="billing-view">
    <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="false"></b-loading>
    <div class="billingInfo" v-if="invoice != null">

      <div class="introductionText">
        <p>Legal!</p>

        <p>O seu processamento totalizou</p>
      </div>

        <div class="totalPrice">
          R$ {{formatPrice(this.invoice.total)}}
          <!-- <span v-if="getAlbumCount <= 200">*</span> -->
        </div>
          
        <div class="postMessages">
          <p>Entraremos em contato para continuar com o processo de pagamento.</p>

          <p>Após o pagamento, o seu processamento iniciará automáticamente</p>

          <p><strong>Obrigado pela confiança!</strong></p>
        </div>

        <div class="coupon">
          <div class="label">Cupons de desconto</div>
          <ul class="couponList">
            <li class="appliedCoupon" v-for="(coupon, index) in invoice.coupons" :key="'coupon-'+index">
              <div class="description">{{coupon.description}}</div>
              <div class="factor">
                {{coupon.factor*100}}%
              </div>
              -
              <div class="code">
                {{coupon.code}}
              </div>
              <div class="remove" @click="removeCoupon(coupon)">
                <i class="fas fa-times"></i>
              </div>
            </li>
          </ul>

          <b-field class="coupon"
          :type="{'is-danger': errors.has('inputCoupon')}">

            <b-input
              v-model="inputCoupon"
              name="inputCoupon"
              v-validate="'required'"
              placeholder="Possui um cupom?"
            ></b-input>

            <b-button
              class="button next-bt is-primary"
              @click="addCoupon"
            >Aplicar</b-button>
          </b-field>

        </div>
        
      <div class="nextButton has-text-centered" v-if="showButton">
        <a class="button" @click="payAfter()" :disabled="btDisabled">Visualizar</a>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "billing-view",
    props: {
      plan: {
        type: Object,
        default: null
      },
      album: {
        type: Object,
        default: null
      },
      task: {
        type: Object,
        default: null
      },
      showButton: {
        type: Boolean,
        default: true
      },
      invoiceObj:{
        type: Object,
        default: null
      }
    },
    
    data() {
      return {
        btDisabled: false,
        isLoading: true,
        inputCoupon: "",
        invoice: null
      }
    },
    components: {
    },
    async mounted () {
      if(this.invoiceObj){
        this.invoice = this.invoiceObj
        this.isLoading = false
      }
    },
    computed: {
      getAlbumCount () {
        if (this.album != null){
          return this.album.count
        }else{
          return 0
        }
      },
    },
    methods: {
      setInvoice(invoice){
        this.invoice = invoice
        this.isLoading = false
      },
      removeCoupon(coupon){
        return new Promise((resolve, reject) => {
          const result = this.$validator.validate('inputCoupon')

          if (result) {
            this.$store.dispatch('removeCoupon', {
              couponCode: coupon.code,
              invoiceId: this.invoice._id,
              owner: this.$store.getters.getUser.id
            })
            .then((invoice) => {
              this.invoice = invoice
              resolve(invoice)
            }).catch((e)=>{
              reject(e)
            })
          }
        })
      },
      async addCoupon(){
        const result = this.$validator.validate('inputCoupon')

        if (result) {
          this.$store.dispatch('addCoupon', {
            couponCode: this.inputCoupon,
            invoiceId: this.invoice._id,
            owner: this.$store.getters.getUser.id
          })
          .then((r) => {
            if (r.invoice){
              this.invoice = r.invoice
            }else if(r.code == "invalid"){
              this.$buefy.dialog.alert({
                title: 'Cupom inválido',
                message: 'Cupom inválido.',
                type: 'is-danger',
                hasIcon: true,
                icon: 'times-circle',
                iconPack: 'fa'
              })
            }else if(r.code == "expired"){
              this.$buefy.dialog.alert({
                title: 'Cupom expirado',
                message: 'Cupom já expirado.',
                type: 'is-danger',
                hasIcon: true,
                icon: 'times-circle',
                iconPack: 'fa'
              })
            }else if(r.code == "alreadyUsed"){
              this.$buefy.dialog.alert({
                title: 'Cupom em uso',
                message: 'Cupom já em uso.',
                type: 'is-danger',
                hasIcon: true,
                icon: 'times-circle',
                iconPack: 'fa'
              })
            }
          }).catch((e)=>{
            console.log(e)
          })
        }
          
      },
      getValue () {
        if (this.album != null){
          return (this.album.count * this.cost * ((this.album.width * this.album.height)/1000000))/2
        }else{
          return 0
        }
      },
      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },
      payAfter() {
        if(this.plan.project != null){
          this.$router.push({name: 'Project', params:{projectId:this.plan.project.id}})
        } else{
          this.$router.push({name: 'Plan', params:{planId:this.plan.id}})          
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .billing-view{
    margin-top: 20px;
    margin-bottom: 20px;

    .loading-overlay {
      z-index: 0;
    }

    .introductionText{
      text-align: center;
    }

    .totalPrice{
      text-align: center;
      font-weight: bold;
      color: var(--color-light);
      font-size: 30px;
      margin-bottom: 20px;

      span{
        font-size: 16px;
        vertical-align: text-top;
      }
    }

    .postMessages{
      font-size: 14px;
      line-height: 14px;
      text-align: center;

      p{
        margin-bottom: 10px;
      }
    }

    .coupon{
      
      .couponList{

        .appliedCoupon{
          background-color: var(--color-lighter);
          padding: 10px;
          margin-bottom: 10px;
          position: relative;

          &:hover{
            .remove{
              display: block;
            }
          }

          .description{
            width: 100%;
            font-size: 14px;
            line-height: 14px;
          }

          .factor{
            display: inline-block;
            font-size: 12px;
          }

          .code{
            display: inline-block;
            font-size: 12px;
          }

          .remove{
            display: none;
            @include v-centerer;
            color: var(--color-dark);
            right: 10px;
            font-size: 16px;
            cursor: pointer;
          }
        }
      }
    }

    .message{
      text-align: center;
      font-weight: bold;
      padding: 5px;

      h3{
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 20px;
      }
    }

    .nextButton{
      .button{
        color: white;
        background-color: var(--color-light);
      }
    }
  }
</style>