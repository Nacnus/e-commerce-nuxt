<template>
  <v-container>
    <v-row>
      <v-col v-for="(item, i) in productList" :key="i" cols="12" md="4">
        <v-card
          class="ma-3 align-center px-2"
          max-width="374"
        >
          <v-img
            height="250"
            :src="item.image"
          ></v-img>

          <v-card-title>{{ item.title }}</v-card-title>

          <v-card-text>
            <v-row
              class="mx-0"
            >
              <v-rating
                :value="4.5"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>

              <div class="grey--text ms-4">
                4.5 (413)
              </div>
            </v-row><br>

            <div>{{ item.price }}₺</div>
          </v-card-text>

          <v-divider class="mx-4"/>
          <v-card-actions>
            <v-btn
              color="gray"
              text
              @click=""
            >
              Sepete Ekle
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data(){
    return{
      productList:[]
    }
  },
  created() {
    this.getShopList()
  },
  methods:{
    getShopList(){
      this.$axios.$get('products/')
        .then((response) => {
          this.productList = response.results
          })
    }
  }
}
</script>
