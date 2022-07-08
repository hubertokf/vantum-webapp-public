<template>
  <div class="company-form">
    <b-field
      label="Nome"
      :type="{'is-danger': errors.has('name')}"
      :message="errors.first('name')"
    >
      <b-input 
        v-model="company.name" 
        name="name" 
        placeholder="Nome da empresa" 
        expanded
        v-validate="'required'"
        icon-pack="fas"
        icon="briefcase">
      </b-input>
    </b-field>


    <b-field
      label="CNPJ"
      :type="{'is-danger': errors.has('cnpj')}"
      :message="errors.first('cnpj')"
    >
      <b-input 
        v-model="company.cnpj" 
        v-mask="'##.###.###/####-##'"
        name="cnpj" 
        v-validate="'required'"
        placeholder="CNPJ da empresa" 
        expanded
        icon-pack="fas"
        icon="briefcase">
      </b-input>
    </b-field>


    <b-field
      label="Logo"
      :type="{'is-danger': errors.has('logo')}"
      :message="errors.first('logo')"
    >

      <file-upload
        @queue-complete="(file) => vqueueComplete(file)"
        @sending-success="(file) => successEvent(file)"
        :uploadPath="'company_data/'+company.id+'/'"
        :showButton="false"
        :makeThumbnails="true"
        :autoStartUpload="false"
        :maxUpload="1"
        :compact="true"
        ref="fileUpload"
      ></file-upload>
    </b-field>

    <div class="columns is-multiline">
      <div class="column is-half">
        <b-field
          label="Cor 1"
          :type="{'is-danger': errors.has('color1')}"
          :message="errors.first('color1')"
        >
          <color-picker :color="company.colors.color1" v-model="company.colors.color1" ></color-picker>

        </b-field>
      </div>
      <div class="column is-half">
        <b-field
          label="Cor 2"
          :type="{'is-danger': errors.has('color2')}"
          :message="errors.first('color2')"
        >
          <color-picker :color="company.colors.color2" v-model="company.colors.color2" ></color-picker>

        </b-field>
      </div>
      <div class="column is-half">
        <b-field
          label="Cor 3"
          :type="{'is-danger': errors.has('color3')}"
          :message="errors.first('color3')"
        >
          <color-picker :color="company.colors.color3" v-model="company.colors.color3" ></color-picker>

        </b-field>
      </div>

      <div class="column is-half">
        <b-field
          label="Cor 4"
          :type="{'is-danger': errors.has('color4')}"
          :message="errors.first('color4')"
        >
          <color-picker :color="company.colors.color4" v-model="company.colors.color4" ></color-picker>

        </b-field>
      </div>
    </div>




  </div>
</template>

<script>
  import FileUpload from "../FileUpload";
  import ColorPicker from "../ui/ColorPicker";

  export default {
    name: 'company-form',
    components: {
      "file-upload": FileUpload,
      ColorPicker
    },
    props: {
      user: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        queueComplete: false,
        colors: '#194d33',
        company: {
          id: null,
          name: '',
          cnpj: '',
          logo: '',
          owner: null,
          colors: {
            color1: '#006746',
            color2: '#00ce46',
            color3: '#164A39',
            color4: '#caf0d6',
          },
        }
      }
    },

    methods: {
      async successEvent (file, response) {

        this.company.logo = "https://storage.cloud.google.com/storage-vantum/company_data/"+this.company.id+"/"+file.name+"?authuser=0",

        await this.updateCompany().then((company)=>{

        })
        .catch((e)=>{
          this.$buefy.toast.open({
            message: 'Erro no upload da logo marca',
            type: 'is-danger'
          })
        })

      },
      vqueueComplete (file) {
        this.queueComplete = true

        this.$buefy.toast.open({
          message: 'Upload completo',
          type: 'is-success'
          // position: 'is-bottom'
        })
      },
      createCompany: function() {
        return new Promise((resolve, reject) => {
          this.company.owner = this.user._id
          this.$store.dispatch('postCompany', this.company)
          .then((company) => {
            this.company = company

            this.$buefy.toast.open({
              message: 'Empresa cadastrada!',
              type: 'is-success'
            })
            resolve(company)
          })
          .catch((e)=>{
            reject(e)
          })
        })
      },

      updateCompany: function() {
        return new Promise((resolve, reject) => {
          this.$store.dispatch('editCompany', this.company)
          .then((company) => {
            this.$buefy.toast.open({
              message: 'Empresa editada!',
              type: 'is-success'
            })
            resolve(company)
          })
          .catch((e)=>{
            reject(e)
          })
        })
      },
      submit() {
        return new Promise((resolve, reject) => {

          this.$validator.validateAll().then(async result => {
            if (result) {
              if (this.company.id == null){
                if (this.$refs.fileUpload.getQueuedFiles > 0) {
                  this.btDisabled = true
                  await this.createCompany().then((company)=>{
                    this.$refs.fileUpload.processQueue().then(async ()=>{
          
                      resolve(company)
                    })
                  })
                  .catch((e)=>{
                    if (e.response.data.message == "A empresa com nome Vantum já existe.") {
                      this.$buefy.toast.open({
                        message: 'Empresa com esse nome já foi cadastrada.',
                        type: 'is-danger'
                      })
                    }else{
                      this.$buefy.toast.open({
                        message: 'Empresa não adicionada',
                        type: 'is-danger'
                      })
                    }
                    reject(e)

                  })
                } else {
                  this.$buefy.toast.open({
                    message: 'Empresa não adicionada, é necessário selecionar uma logo',
                    type: 'is-danger'
                    // position: 'is-bottom'
                  })
                }

              } else {
                if (this.$refs.fileUpload.getQueuedFiles > 0) {
                  this.btDisabled = true
                  await this.updateCompany().then((company)=>{
                    this.$refs.fileUpload.processQueue().then(async ()=>{
          
                      resolve(company)
                    })
                  })
                  .catch((e)=>{
                    this.$buefy.toast.open({
                      message: 'Empresa não editada',
                      type: 'is-danger'
                    })
                    reject(e)

                  })
                } else {
                  this.$buefy.toast.open({
                    message: 'Empresa não editada, é necessário selecionar uma logo',
                    type: 'is-danger'
                    // position: 'is-bottom'
                  })
                }
              }
            } else {
              this.$buefy.toast.open({
                message: "Formulário inválido, verifique os campos.",
                type: "is-danger",
                position: "is-bottom"
              });
            }
          })
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  .company-form{
    margin-bottom: 20px;
  }

</style>