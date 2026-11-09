<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>

        <div class="header-content">

          <div class="logo">

            <div class="logo-icon">
              <ion-icon :icon="restaurantOutline"></ion-icon>
            </div>

            <div>
              <h1>Recipe<span>Box</span></h1>
              <p>Resep favoritmu</p>
            </div>

          </div>

        </div>

      </ion-toolbar>
    </ion-header>


    <ion-content>

      <!-- DEKORASI -->
      <div class="leaf leaf-one">🍃</div>
      <div class="leaf leaf-two">🌿</div>
      <div class="leaf leaf-three">🍃</div>


      <div class="favorite-container">

        <!-- JUDUL -->
        <div class="heading">

          <div class="heading-icon">
            ❤️
          </div>

          <div>
            <h2>Resep Favorit</h2>
            <p>Kumpulan resep yang kamu sukai.</p>
          </div>

        </div>


        <!-- JIKA BELUM ADA FAVORIT -->
        <div
          v-if="favorites.length === 0"
          class="empty-favorite"
        >

          <div class="empty-icon">
            ❤️
          </div>

          <h3>Belum ada resep favorit</h3>

          <p>
            Resep yang kamu sukai akan muncul di sini.
          </p>

          <button
            class="search-button"
            @click="goSearch"
          >
            Cari Resep
          </button>

        </div>


        <!-- DAFTAR FAVORIT -->
        <div
          v-else
          class="favorite-grid"
        >

          <ion-card
            v-for="recipe in favorites"
            :key="recipe.id"
            class="recipe-card"
          >

            <!-- FOTO -->
            <div class="recipe-image">

              <img
                :src="recipe.image"
                :alt="recipe.name"
              />

            </div>


            <!-- ISI -->
            <div class="card-content">

              <span class="category-label">
                {{ recipe.category }}
              </span>

              <h3>
                {{ recipe.name }}
              </h3>

              <p>
                {{ recipe.description }}
              </p>


              <div class="card-bottom">

                <span>
                  ⏱️ {{ recipe.time }}
                </span>


                <button
                  class="heart-button"
                  @click.stop="removeFavorite(recipe.id)"
                >
                  ❤️
                </button>

              </div>


              <!-- LIHAT RESEP -->
              <button
                class="detail-button"
                @click="openDetail(recipe.id)"
              >
                Lihat Resep
              </button>

            </div>

          </ion-card>

        </div>


        <!-- INFORMASI -->
        <div class="favorite-info">

          <div>🍴</div>

          <p>
            Resep favoritmu akan tersimpan di sini.
          </p>

        </div>

      </div>


      <!-- BOTTOM NAVIGATION -->
      <div class="bottom-navigation">

        <button @click="goHome">
          <ion-icon :icon="homeOutline"></ion-icon>
          <span>Home</span>
        </button>


        <button @click="goSearch">
          <ion-icon :icon="searchOutline"></ion-icon>
          <span>Search</span>
        </button>


        <button class="active">
          <ion-icon :icon="heartOutline"></ion-icon>
          <span>Favorit</span>
        </button>


        <button @click="goShopping">
          <ion-icon :icon="cartOutline"></ion-icon>
          <span>Shopping</span>
        </button>


        <button @click="goProfile">
          <ion-icon :icon="personOutline"></ion-icon>
          <span>Profil</span>
        </button>

      </div>

    </ion-content>

  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
  IonCard
} from '@ionic/vue'

import {
  restaurantOutline,
  homeOutline,
  searchOutline,
  heartOutline,
  cartOutline,
  personOutline
} from 'ionicons/icons'

import {
  ref,
  onMounted
} from 'vue'

import { useRouter } from 'vue-router'


const router = useRouter()


/* =========================
   TIPE RESEP
========================= */

interface Recipe {

  id: string

  category: string

  name: string

  image: string

  description: string

  time: string

  level: string

  servings: string

}


/* =========================
   DATA FAVORIT
========================= */

const favorites = ref<Recipe[]>([])


/* =========================
   AMBIL FAVORIT
========================= */

const loadFavorites = () => {

  const savedFavorites =
    localStorage.getItem('recipebox_favorites')

  if (savedFavorites) {

    favorites.value =
      JSON.parse(savedFavorites)

  } else {

    favorites.value = []

  }

}


/* =========================
   HAPUS FAVORIT
========================= */

const removeFavorite = (id: string) => {

  favorites.value =
    favorites.value.filter(
      recipe => recipe.id !== id
    )


  localStorage.setItem(
    'recipebox_favorites',
    JSON.stringify(favorites.value)
  )

}


/* =========================
   BUKA DETAIL
========================= */

const openDetail = (id: string) => {

  router.push({
    path: '/recipe-detail',
    query: {
      id: id
    }
  })

}


/* =========================
   NAVIGASI
========================= */

const goHome = () => {

  router.push('/home')

}


const goSearch = () => {

  router.push('/search')

}


const goShopping = () => {

  router.push('/shopping-list')

}


const goProfile = () => {

  router.push('/profile')

}


/* =========================
   LOAD SAAT HALAMAN DIBUKA
========================= */

onMounted(() => {

  loadFavorites()

})

</script>


<style scoped>

ion-content {
  --background: #fffaf5;
}


ion-toolbar {
  --background: white;
  --border-width: 0;
}


/* =========================
   HEADER
========================= */

.header-content {

  height: 70px;

  display: flex;

  align-items: center;

  padding: 0 25px;

}


.logo {

  display: flex;

  align-items: center;

  gap: 10px;

}


.logo-icon {

  width: 42px;

  height: 42px;

  border-radius: 13px;

  background: #ff7117;

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 23px;

}


.logo h1 {

  margin: 0;

  font-size: 22px;

  font-weight: 800;

}


.logo h1 span {

  color: #ff7117;

}


.logo p {

  margin: 1px 0 0;

  font-size: 12px;

  color: #888;

}


/* =========================
   DEKORASI
========================= */

.leaf {

  position: absolute;

  opacity: 0.16;

  pointer-events: none;

}


.leaf-one {

  top: 90px;

  right: 20px;

  font-size: 75px;

  transform: rotate(20deg);

}


.leaf-two {

  top: 350px;

  left: -10px;

  font-size: 60px;

  transform: rotate(-25deg);

}


.leaf-three {

  bottom: 100px;

  right: 15px;

  font-size: 55px;

}


/* =========================
   CONTAINER
========================= */

.favorite-container {

  position: relative;

  z-index: 2;

  max-width: 950px;

  margin: auto;

  padding: 35px 20px 110px;

}


/* =========================
   HEADING
========================= */

.heading {

  display: flex;

  align-items: center;

  gap: 15px;

  margin-bottom: 30px;

}


.heading-icon {

  width: 58px;

  height: 58px;

  background: #ffe9e9;

  border-radius: 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 28px;

}


.heading h2 {

  margin: 0;

  font-size: 30px;

  color: #292929;

}


.heading p {

  margin: 5px 0 0;

  color: #777;

}


/* =========================
   EMPTY
========================= */

.empty-favorite {

  background: white;

  border-radius: 22px;

  padding: 45px 25px;

  text-align: center;

  box-shadow:
    0 7px 22px rgba(0, 0, 0, 0.06);

}


.empty-icon {

  width: 80px;

  height: 80px;

  margin: auto;

  border-radius: 50%;

  background: #fff0e5;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 35px;

}


.empty-favorite h3 {

  margin: 18px 0 7px;

  font-size: 20px;

  color: #333;

}


.empty-favorite p {

  margin: 0;

  color: #888;

  font-size: 13px;

}


.search-button {

  margin-top: 20px;

  border: none;

  background: #ff7117;

  color: white;

  padding: 12px 22px;

  border-radius: 12px;

  font-weight: 700;

}


/* =========================
   GRID
========================= */

.favorite-grid {

  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 20px;

}


/* =========================
   CARD
========================= */

.recipe-card {

  margin: 0;

  border-radius: 20px;

  overflow: hidden;

  background: white;

  box-shadow:
    0 7px 22px rgba(0, 0, 0, 0.07);

}


.recipe-image {

  width: 100%;

  height: 180px;

  background: #fff5e9;

  overflow: hidden;

}


.recipe-image img {

  width: 100%;

  height: 100%;

  object-fit: cover;

  display: block;

}


.card-content {

  padding: 18px;

}


.category-label {

  display: inline-block;

  background: #fff0e5;

  color: #e96613;

  padding: 5px 11px;

  border-radius: 15px;

  font-size: 11px;

  font-weight: 600;

}


.card-content h3 {

  margin: 10px 0 5px;

  font-size: 20px;

  color: #333;

}


.card-content p {

  margin: 0;

  color: #777;

  font-size: 13px;

  line-height: 1.5;

}


.card-bottom {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 15px;

  color: #888;

  font-size: 12px;

}


.heart-button {

  border: none;

  background: #fff0e5;

  width: 36px;

  height: 36px;

  border-radius: 50%;

  cursor: pointer;

  font-size: 17px;

}


.detail-button {

  width: 100%;

  margin-top: 12px;

  padding: 11px;

  border: none;

  border-radius: 12px;

  background: #ff7117;

  color: white;

  font-size: 12px;

  font-weight: 700;

}


/* =========================
   INFO
========================= */

.favorite-info {

  margin-top: 30px;

  padding: 20px;

  background: white;

  border-radius: 18px;

  text-align: center;

  color: #777;

}


.favorite-info div {

  font-size: 30px;

}


.favorite-info p {

  margin: 7px 0 0;

}


/* =========================
   BOTTOM NAV
========================= */

.bottom-navigation {

  position: fixed;

  left: 0;

  right: 0;

  bottom: 0;

  height: 67px;

  background: white;

  border-top: 1px solid #eee;

  display: flex;

  justify-content: center;

  z-index: 100;

}


.bottom-navigation button {

  width: 130px;

  border: none;

  background: transparent;

  color: #777;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 3px;

  font-size: 11px;

  cursor: pointer;

}


.bottom-navigation ion-icon {

  font-size: 21px;

}


.bottom-navigation button.active {

  color: #ff7117;

}


/* =========================
   MOBILE
========================= */

@media (max-width: 650px) {

  .header-content {

    padding: 0 16px;

  }


  .favorite-container {

    padding: 25px 16px 105px;

  }


  .heading h2 {

    font-size: 25px;

  }


  .favorite-grid {

    grid-template-columns: 1fr;

  }


  .bottom-navigation button {

    width: 20%;

  }


  .bottom-navigation button span {

    font-size: 9px;

  }

}

</style>