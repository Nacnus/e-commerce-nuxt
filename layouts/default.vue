<template>
  <v-app>
    <v-main>
      <v-app-bar
        app
        flat
        class="custom-app-bar"
        color="#006d77EE"
      >
        <v-container class="py-0 fill-height">
          <img
            class="mr-10"
            style="width: 50px;height: 50px;border-radius: 100%;cursor: pointer"
            src="/images/logo.png"
            @click="redirect"
          />
          <v-btn
            v-for="(item,i) in tabs"
            :key="i"
            text
            @click="redirectToCategory(item.params)"
            color="#ffffff"
            class="text-capitalize"
          >
            {{item.text}}
          </v-btn>
          <v-spacer/>
          <v-text-field
            dark
            label="Ara..."
            dense
            flat
            hide-details
            solo
            solo-inverted
            class="mr-8"
            v-model="searchItem"
            @keydown.enter="searchItems"
            append-icon="mdi-magnify"
            @click:append="searchItems"
          />
          <v-btn
            @click="redirectToCart"
            class="text-capitalize"
          >
            Sepet
            <v-icon class="ml-2" size="19">mdi-cart-outline</v-icon>
          </v-btn>
        </v-container>
      </v-app-bar>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data(){
    return{
      searchItem:'',
      categoryItem:'',
      count:2,
      products:{},
      tabs: [
        {
          text: 'Anasayfa',
        },
        {
          text: 'Televizyonlar',
          params: '2'
        },
        {
          text: 'Laptoplar',
          params: '3',
        },
        {
          text: 'Tabletler',
          params: '4',
        },
        {
          text: 'Kulaklıklar',
          params: '5',
        },
        {
          text: 'Klavyeler',
          params: '6',
        }
      ]
    }
  },
  methods: {
    redirect() {
      this.$router.push('/');
    },
    redirectToCategory(id){
      this.$router.push({ path: '/', query: { category: id } });
    },
    searchItems(){
      this.$router.push({path:'/',query:{search:this.searchItem}})
    },
    redirectToCart() {
      this.$router.push('/cart')
    },
  }
}
</script>
