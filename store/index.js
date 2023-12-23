export const state = () => {
  return {
    cart: [],
    cartCount: 0
  }
}

export const mutations = {
  addToCart(state, item) {
    if (!state.cart.find(e => e.id === item.id)) {
      state.cart = item
    }
    else {
      (state.cart.find(e => e.id === item.id)).count++
      state.cartCount++
    }
  },
  increaseCount(state, item) {
    item.count++
    this.$axios.$patch(`products/${item.id}/`,{count: item.count })
  },
  decreaseCount(state, item) {

    if (!(state.cart.find(e => e.id === item.id).count <=1)) {
      item.count--
      this.$axios.$patch(`products/${item.id}/`, {count: item.count})
    }
    else {
      item.count = 0
      this.$axios.$patch(`products/${item.id}/`, {count: 0})
        .then(()=>{
          this.$axios.$get('products/', {
            params: { page_size: 100 } })
            .then((res) => {
              this.commit('addToCart', res.results.filter(item => item.count > 0))
            })
        }
      )

    }
  },
}
