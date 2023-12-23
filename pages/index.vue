<template>
  <v-container class="py-0">
    <v-snackbar
      v-model="dialog"
      timeout="2000"
    >
      Sepete Ürününüz Eklenmiştir

      <template v-slot:action="{ attrs }">
        <v-btn
          color="#82c0cc"
          text
          v-bind="attrs"
          @click="dialog = false"
        >
          Kapat
        </v-btn>
      </template>
    </v-snackbar>
      <v-carousel
        class="py-0 fill-height"
        cycle
        height="380"
        hide-delimiter-background
        hide-delimiters
        show-arrows
      >
        <v-carousel-item
          v-for="(slide, i) in sliderImage"
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
                <v-img :src="slide" width="%100"/>
              </div>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    <v-row>
      <v-col v-for="(item, i) in productList" :key="i"  md="6" lg="3">
        <v-card rounded>
          <v-card-title>
            <v-img
              class="d-flex"
              height="200px"
              width="200px"
              style="cursor: pointer; "
              @click="redirect(item)"
              :src="item.image"
              contain
            />
          </v-card-title>
          <v-card-title
            class="subtitle-2"
            style="cursor: pointer"
            @click="redirect(item)"
          >
            {{ truncateText(item.title) }}
          </v-card-title>
          <v-card-text>

            <v-row>
              <v-col cols="4">
                <v-rating
                  :value="item.star"
                  color="#d90429"
                  background-color="#d90429"
                  dense
                  half-increments
                  readonly
                  size="14"
                />
              </v-col>
              <v-col class="d-flex justify-start">
                {{ item.star.toFixed(1) }}
              </v-col>
            </v-row>
              <v-card-text
                class="px-0"
                :style="{ 'font-weight': 'bold', 'font-size': '25px','color':'#ffdd00' }"
              >
                {{ formatCurrency(item.price) }}
              </v-card-text>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              class="addCart-btn mb-3 elevation-0"
              @click="addCart(item)"
              :disabled="item?.count >= 1"
            >
              {{ item?.count >= 1 ? 'Sepette Mevcut' : 'Sepete Ekle' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="length"
          @input="changePage"
          circle
          color="#82c0cc"
          class="mt-5 mb-4"
        />
      </div>
  </v-container>

</template>

<script>
export default {
  data(){
    return{
      dialog: false,
      sliderImage:[
        {
          src:"/images/2.jpg"
        },
        {
          src:"/images/1.jpg"
        },
        {
          src:"/images/3.jpg"
        }
      ],
      productList:[],
      page:1,
      length:0
    }
  },
  created() {
    this.getShoplist(1)
  },
  watch: {
    $route() {
      this.getShoplist(1)
    },
  },
  methods:{
    getShoplist(page){
      const params = {
        page_size: 12,
        page,
        search: this.$route.query.search,
        category: this.$route.query.category,
      }
      this.$axios.$get('products/', { params })//,{params:{category:1} })
        .then((response) => {
          this.productList = response.results
          this.length = Math.ceil(response.count/12)
          window.scrollTo(0, 0)
        })
    },
    changePage(page) {
      this.getShoplist(page)
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(value);
    },
    truncateText(text, length = 62) {
      return text ? (text.length > length ? text.slice(0, length) + '...' : text) : '';
    },
    addCart(item) {
      item.count++;
      this.$axios.$patch(`products/${item.id}/`,{count: item.count})
        .then(()=>{
          this.getShoplist()
          return this.dialog=true
        })

    },
    redirect (item) {
      this.$router.push('/detail/'+item.id)
    }
  },
}
</script>
<style scoped>
.addCart-btn {
  transition: background-color 0.3s; /* Geçiş efekti süresi */
  color: #82c0cc ;
}

.addCart-btn:hover {
  background-color: #82c0cc; /* Hover durumunda arkaplan rengi */
  color: white;
}
</style>
