<template>
  <v-container>
    <v-row>
      <v-carousel
        cycle
        height="400"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(slide, i) in productList"
          :key="i"
        >
          <v-sheet
            height="100%"
          >
            <v-row
              class="fill-height"
              align="center"
              justify="center"
            >
              <div class="text-h2">
                <v-img :src="slide.image" width="400"/><br>
              </div>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      <v-col v-for="(item, i) in productList" :key="i" cols="12" md="4">
        <v-card
          class="ma-3 align-center px-2"
          max-width="374"
        >
          <v-img
            style="cursor: pointer;"
            @click="redirect(item)"
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
    },
    redirect (item) {
      console.log(item)
      this.$router.push('/detail/'+item.id)
    }
  }
}
</script>
