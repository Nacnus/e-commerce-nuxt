<template>
  <v-container class="fill-height">
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
    <v-row align="center" style="max-width: 101%">
      <v-col md="6" class="text-center align-self-start">
        <v-img :src="mydata.image" alt="Ürün Resmi" width="100%" height="100%" />
      </v-col>
      <v-col md="6" class="align-self-start">
        <v-card class="elevation-3">
          <v-banner shaped >
            <v-card-title class="px-0 py-0">{{ mydata.title }}</v-card-title>
          </v-banner>
          <v-card-title>Kategori: {{ mydata.category?.name }}</v-card-title>
          <v-row>
            <v-col cols="4">
              <v-rating
                :value="mydata.star"
                color="#d90429"
                background-color="#d90429"
                dense
                half-increments
                readonly
                size="20"
                class="ml-5 px-0"
              />
            </v-col>

            <v-col class="d-flex justify-start">
              {{ mydata.star?.toFixed(1) }}
            </v-col>
          </v-row>
            <v-card-title
              class="ml-2"
              :style="{ 'font-weight': 'bold', 'font-size': '25px','color':'#ffdd00' }"
            >
              {{ formatCurrency(mydata.price) }}
            </v-card-title>

          <v-btn
          style="width: 90%"
          color="#82c0cc"
          class="mb-3 mt-3 ml-6 addCart-btn"
          @click="addBasket(mydata)"
          :disabled="mydata.count >= 1"
          >
            <v-icon class="mr-2">mdi-cart-arrow-down</v-icon>
            {{ mydata?.count >= 1 ? 'Sepette Mevcut' : 'Sepete Ekle' }}
          </v-btn>

          <v-banner shaped  >
            <v-card-title class="px-0 py-0" style="font-size: 90%;cursor: pointer" @click="toggleFullText">{{ displayText }}</v-card-title>
          </v-banner>
        </v-card>
      </v-col>
    </v-row>
    <v-container>
      <v-card class="mt-3">
        <v-card-title class="mb-4">Yorum Ekle</v-card-title>
        <v-form
          ref="comments"
          v-model="valid"
          lazy-validation
          class="mx-4"
        >
          <v-card-title class="py-0 mb-1">Kullanıcı Adı</v-card-title>
          <v-text-field
            v-model="username"
            :rules="nameRules"
            flat
            class="ml-3"
            outlined
            solo
            dense
            style="max-width: 30%;"
            required
            filled
          />
          <v-card-title class="mb-4">
            Ürünü Değerlendir
            <v-rating
              v-model="commentRating"
              color="#d90429"
              background-color="#d90429"
              half-increments
              hover
              class="ml-3"
            />
          </v-card-title>
          <v-card-title class="py-0 mb-1">Yorumunuz</v-card-title>
          <v-textarea
            v-model="comment"
            class="ml-3"
            :rules="commentRules"
            required
            filled
            outlined
            dense
            solo
            flat
            auto-grow
            rows="4"
            row-height="20"
          />

          <v-btn
            :disabled="!valid"
            color="#82c0cc"
            class="mr-4 mt-3 ml-3 mb-4"
            @click="validate(mydata.id)"
            style="color: white;"
          >
            Gönder
          </v-btn>
        </v-form>
      </v-card>
      <v-card class="mt-3">
        <v-card-title class="mb-4">Yorumlar</v-card-title>
        <v-card-text>
          <v-card v-for="(item, i) in mydata.comments" :key="i" class="mb-3">
            <v-list two-line>
              <v-list-item-content class="ml-3">
                <v-card-title class="py-0 px-0">
                  <v-card-subtitle class="px-0 py-0" style="font-size: 15px">{{ item.star?.toFixed(1) }}</v-card-subtitle>
                  <v-rating
                    :value="item.star"
                    color="#d90429"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    dense
                    half-increments
                    readonly
                    size="14"
                    class="ml-2"
                  />
                </v-card-title>
                {{ format_date(item.created_at) }}
                <v-list-item-title
                  v-html="item.username"
                  class="font-weight-bold text-uppercase"
                />
                <v-tab
                  style="cursor:none;color: black;pointer-events: none"
                >
                  <v-list-item-subtitle v-html="item.text" />
                </v-tab>
              </v-list-item-content>
            </v-list>
          </v-card>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import moment from 'moment'
export default {

  data () {
    return {
      dialog:false,
      mydata: {},
      isFullTextVisible: false,
      myDate: new Date(),
      commentRating:null,
      valid: true,
      username: '',
      nameRules: [
        v => !!v || 'Kullanıcı Adı girmek zorunlu!',
        v => v?.length <= 10 || 'Kullanıcı Adı 10 karakterden fazla olamaz',
      ],
      comment: '',
      commentRules: [
        v => !!v || 'Bu alan zorunlu!',
        v => v?.length <= 2000 || '250 karakterden fazla yorum yapamazsın!',
      ],
    }
  },
  created() {
    this.$axios.$get(`products/${this.$route.params.id}/`)
      .then((response) => {
        this.mydata = response
      })
  },
  computed:{
    displayText() {
      return this.isFullTextVisible ? this.mydata.description : this.getShortenedText();
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
      }).format(value);
    },
    getShortenedText() {
      const maxLength = 200;
      if (this.mydata.description?.length > maxLength) {
        return this.mydata.description.slice(0, maxLength) + "...";
      }
      return this.mydata.description;
    },
    toggleFullText() {
      this.isFullTextVisible = !this.isFullTextVisible;
    },
    format_date(value){
      if (value) {
        return moment(String(value)).format('DD/MM/YYYY')
      }
    },
    addBasket(item) {
      item.count++;
      this.$axios.$patch(`products/${item.id}/`, {count: item.count})
      this.dialog=true
    },
    validate(id){
      if(!this.$refs.comments.validate()) {
        alert ('Boş bırakılamaz!')
        return
      }
      let payload={
        username: this.username,
        product:id,
        text: this.comment,
        star: this.commentRating ?? 0
      }
      this.$axios.$post(`comments/`,payload)
        .then((response) => {
          this.mydata.comments.push(response)
          alert('Yorumunuz için teşekkür ederiz ^^')
        })
      this.commentRating = 0
      this.$refs.comments.reset()
    }
  }
}
</script>

<style scoped>
.addCart-btn {
  transition: background-color 0.3s; /* Geçiş efekti süresi */
  color:#ffffff
}

.addCart-btn:hover {
  background-color: #000000; /* Hover durumunda arkaplan rengi */
  color: black;
}
</style>
