export default {
	state: {
		burger: true,
		back: false,
		close: false,
	},

	getters: {
		getBurguer: state => state.burger,
		getBack: state => state.back,
		getClose: state => state.close,
	},

	mutations: {
		set_burger(state, value) {
			state.burger = value
			state.back = !value
			state.close = !value
		},
		set_back(state, value) {
			state.back = value
			state.burger = !value
			state.close = !value
		},
		set_close(state, value) {
			state.close = value
			state.burger = !value
			state.back = !value
		},
	},

	actions: {

	}
}