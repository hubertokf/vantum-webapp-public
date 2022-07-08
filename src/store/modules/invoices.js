import {services} from './../api'

const state = {
  invoice: {
    total: 0,
    owner: null,
    coupons: [],
    tasks: null,
    payments: []
  }
}

const getters = {
  getInvoice: state => state.invoice,
}

const mutations = {
  set_invoice (state, invoice) {
    state.invoice = invoice
  },
  add_payment (state, payment) {
    state.invoice.payments.push(payment)
  },
  add_coupon (state, coupon) {
    state.invoice.coupons.push(coupon)
  },
  remove_payment (state, paymentId) {
    var index = state.invoice.payments.findIndex(payment => payment.id === paymentId)
    state.invoice.payments.splice(index, 1)
  },
  remove_coupon (state, couponCode) {
    var index = state.invoice.coupons.findIndex(coupon => coupon.code === couponCode)
    state.invoice.coupons.splice(index, 1)
  },
  edit_invoice (state, editedInvoice) {
    state.invoice = editedInvoice
  },
}

const actions = {
  setInvoice ({
    commit,
  }, invoice) {
    commit('set_invoice', invoice)
  },
  addPayment ({
    commit,
  }, payment) {
    commit('add_payment', payment)
  },
  addCoupon ({
    commit,
  }, params) {
    return services.invoices.addCoupon(params)
      .then((response) => {
        // commit('add_coupon', this._vm.$clone(response.data.coupon))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },
  removePayment ({
    commit,
  }, payment) {
    commit('remove_payment', payment)
  },  
  removeCoupon ({
    commit,
  }, params) {
    return services.invoices.removeCoupon(params)
      .then((response) => {
        commit('remove_coupon', this._vm.$clone(params.couponCode))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },
  postInvoice ({
    commit,
  }, task) {
    return new Promise((resolve, reject) => {
      services.invoices.post(task)
      .then((response) => {
        commit('set_invoice', this._vm.$clone(response.data))
        resolve(response.data)
      })
      .catch((error) => reject(error))
    })
  },
  getInvoices ({
    commit,
    state
  }, filter) {
    return services.invoices.getAll(filter)
      .then((response) => {
        commit('get_invoices', this._vm.$clone(response.data))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },
  getInvoice ({
    commit,
    state
  }, id) {
    return services.invoices.get(id)
      .then((response) => {
        commit('get_invoice', this._vm.$clone(response.data))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },
  editInvoice ({
    commit,
    state
  }, id) {
    return services.invoices.edit(id)
      .then((response) => {
        commit('edit_invoice', this._vm.$clone(response.data))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  },
  deleteInvoice ({
    commit,
    state
  }, id) {
    return services.invoices.delete(id)
      .then((response) => {
        commit('delete_invoice', this._vm.$clone(response.data))
        return Promise.resolve(response.data)
      })
      .catch((error) => Promise.reject(error))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
