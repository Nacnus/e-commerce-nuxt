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
                  <v-card-title style="font-size: medium">{{ truncateText(item.title, 20) }}</v-card-title>
                </span>
              </template>
              <v-card-text>{{item.title}}</v-card-text>
            </v-tooltip>


            <v-card-title> {{moneyFormat(item.price)}}</v-card-title>

            <v-text-field
              :value="item.count"
              @blur="productUpdate(item,$event.target.value)"
              append-outer-icon="mdi-plus"
              :prepend-icon="item.count === 1 ? 'mdi-delete' : 'mdi-minus'"
              class="text-field-center"
              style="max-width: 15%;"
              @click:append-outer="productIncrease(item)"
              @click:prepend="productDecrease(item, i)"
            />
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card class="fill-height d-flex align-center justify-center flex-column" v-else>
        <v-icon size="60" class="mb-1">mdi-cart</v-icon>
        <v-card-title>
          Sepetinizde Ürün Bulunmamaktadır.
        </v-card-title>
      </v-card>
    </v-col>

    <v-col>
      <v-card max-width="500">
        <v-card-title style="font-size: medium" class="d-flex align-center justify-space-between">
          <span>
            Ürünün Fiyatı:
          </span>
          <span style="color: #ffdd00">
            {{moneyFormat(sumPrice)}}
          </span>
        </v-card-title>

        <v-card-title v-if="cartList.length > 0" style="font-size:medium" class="d-flex align-center justify-space-between">
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

        <v-card-title class="d-flex justify-space-between">
          <span>
            Toplam:
          </span>
          <span style="color: #ffdd00">
            {{moneyFormat(sumPrice)}}
          </span>
        </v-card-title>

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
import {moneyFormat, truncateText} from "../utils/helpers";

export default {
  data () {
    return{
      showFreeShipping: false,
      cartList: []
    }
  },
  computed: {
    // cartList () {
    //   return this.$store.state.cart
    // },
    sumPrice () {
      let sum = 0
      this.cartList.forEach(item => {
        sum += item.price * item.count
      });
      return Math.floor(sum)
    }
  },
  mounted() {
    this.fetchProduct()
  },
  methods: {
    moneyFormat,
    truncateText,
    fetchProduct(){
      this.$axios.$get('products/')
        .then((res) => {
          this.cartList = res.results.filter(item => item.count > 0)
        })
    },
    buyNow () {
      if (this.cartList.length < 1){
        return alert('Sepetiniz boştur ürün ekleyiniz!')
      }
      let payload = {
        total_price : Number(this.sumPrice)
      }
      this.$axios.$post('orders/',payload).then(this.fetchProduct)
    },
    productUpdate(item,data){
      this.$axios.$patch(`products/${item.id}/`, {count:data}).then(this.fetchProduct)
    },
    productIncrease(item){
      item.count++
      this.$axios.$patch(`products/${item.id}/`,{count: item.count })
    },
    productDecrease(item, index){
      item.count--
      this.$axios.$patch(`products/${item.id}/`, {count: item.count})
      if (item.count === 0) {
        this.cartList.splice(index,1)
      }
    }
  }
}
</script>

<style>
.text-field-center input{
    text-align: center;
}
</style>
