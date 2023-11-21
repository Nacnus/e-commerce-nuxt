<template>
  <v-app>
    <v-main>
      <v-app-bar
        app
        flat
      >
        <v-container class="py-0 fill-height">
          <v-avatar
            class="mr-10"
            color="grey darken-1"
            size="32"
          />

          <v-btn text @click="redirectToHome">Anasayfa</v-btn>

          <v-spacer></v-spacer>
          <v-btn
            v-for="link in links"
            :key="link"
            text
          >
            {{ link }}
          </v-btn>
            <v-btn
              icon
            >
              <v-icon>mdi-cart-outline</v-icon>
            </v-btn>
        </v-container>
      </v-app-bar>
      <nuxt></nuxt>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    links: [
      'Kayıt Ol',
      'Giriş Yap'
    ],
  }),
  methods: {
    redirectToHome(){
      this.$router.push('/');
    }
  }
}
</script>
