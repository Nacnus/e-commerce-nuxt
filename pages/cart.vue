<template>
<v-container>
  <v-row>
    <v-col class="ml-2 mr-2" md="2" lg="9">
      <v-list v-if="cartList.length > 0">
        <v-list-item v-for="(item, i) in cartList" :key="i" class="elevation-3 rounded mb-5">
          <v-list-item-avatar size="80">
            <v-img :src="item.image"/>
          </v-list-item-avatar>
          <v-list-item-title style="justify-content: space-between; display: flex;">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-card-title style="font-size: medium">{{ truncateText(item.title) }}</v-card-title>
                </span>
              </template>
              <v-card-text>{{item.title}}</v-card-text>
            </v-tooltip>

            <v-card-title> {{formatCurrency(item.price)}}</v-card-title>
            <v-text-field
              :value="item.count"
              @blur="productUpdate(item,$event.target.value)"
              append-outer-icon="mdi-plus"
              :prepend-icon="buttonText(item.id)"
              class="text-center"
              style="max-width: 15%;"
              @click:append-outer="productIncrease(item)"
              @click:prepend="productDecrease(item)"
            />
          </v-list-item-title>
        </v-list-item>
      </v-list>
    <v-card style="text-align: center;display: flex; flex-direction: column; align-items: center; justify-content: center;" class="fill-height" v-else>
      <v-icon size="90" class="mb-2">mdi-cart</v-icon>
      <v-card-text style="font-weight: bold; color: black;" class="text-h3">Sepetinizde Ürün Bulunmamaktadır.</v-card-text>
    </v-card>
    </v-col>
    <v-col>
      <v-card max-width="500">
        <v-card-title style="font-size: medium" class="d-flex align-center justify-space-between">
            <span>
              Ürünün Fiyatı:
            </span>
            <span style="color: #ffdd00">
              {{formatCurrency(sumPrice)}}
            </span>
        </v-card-title>
        <v-card-title v-if="showFreeShipping" style="font-size:medium" class="d-flex align-center justify-space-between">
            <span>
              Kargo:
            </span>
            <span>
              <span>
                Bedava
              </span>
              <span style="font-size: large;text-decoration: line-through" class="ml-1">
                 30₺
              </span>
            </span>
        </v-card-title>
        <v-divider/>
        <v-card-title>
          <span>
            <span>
              Toplam:
            </span>
            <span style="color: #ffdd00">
              {{formatCurrency(sumPrice)}}
            </span>
          </span></v-card-title>
        <v-card-title>
          <v-btn
            color="#82c0cc"
            class="text-capitalize"
            dark
            block
            @click="buyNow"
          >
            Satın Al
          </v-btn>
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>
<script>
export default {
  data(){
    return{
      showFreeShipping: false,
    }
  },
  computed: {
    cartList () {
      this.showFreeShipping = this.$store.state.cart.length > 0;
      return this.$store.state.cart
    },
    sumPrice () {
      let sum = 0
      this.$store.state.cart.forEach(item => {
        sum += item.price*item.count
      });
      return Math.floor(sum)
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(value);
    },
    truncateText(text, length = 50) {
      return text ? (text.length > length ? text.slice(0, length) + '...' : text) : '';
    },
    buyNow () {
      if (this.$store.state.cart.length<1){
        return alert('Sepetiniz boştur ürün ekleyiniz!')
      }
      else{
        let payload={
          total_price : Number(this.sumPrice)
        }
        this.$axios.$post('orders/',payload).then(()=>
          this.$axios.$get('products/')
            .then((res) => {
              this.$store.commit('addToCart', res.results.filter(item => item.count > 0))
            })
        )}
    },
    productUpdate(item,data){
       this.$axios.$patch(`products/${item.id}/`, {count:data})
         .then(()=>{
           this.fetchProduct()
         })
    },
    productIncrease(item){
      this.$store.commit('increaseCount',item)
    },
    fetchProduct(){
      this.$axios.$get('products/')
        .then((res) => {
          this.$store.commit('addToCart', res.results.filter(item => item.count > 0))
        })
    },
    productDecrease(item){
      this.$store.commit('decreaseCount',item)
    },
    buttonText(id) {
      if ((this.$store.state.cart.find(e => e.id === id).count) == 1) {
        return 'mdi-delete'
      }
      else {
        return 'mdi-minus'
      }
    },

  },
  mounted() {
    this.fetchProduct()
  }
}
</script>
