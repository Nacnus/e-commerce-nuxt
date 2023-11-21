<template>
  <v-container class="fill-height">
    <v-row>
      <v-col>
        <v-img :src= "mydata.image"/>
      </v-col>
      <v-col><v-banner
        shaped
      >{{mydata.title}}</v-banner>
        <v-subheader>{{mydata.price}}₺</v-subheader>
        <v-btn text><v-icon>mdi-cart-arrow-down</v-icon>Sepete Ekle</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      mydata: {}
    }
  },
  mounted() {
    this.$axios.$get(`products/${this.$route.params.id}/`)
      .then((response) => {
        this.mydata = response
      })
  }
}
</script>

<style scoped>

</style>
