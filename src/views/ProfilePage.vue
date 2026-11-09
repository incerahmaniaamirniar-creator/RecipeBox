<template>
  <ion-page>

    <ion-header class="header">
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div class="profile-page">

        <!-- PROFILE HEADER -->
        <div class="profile-header">

          <div class="avatar">
            👩🏻‍🍳
          </div>

          <div class="profile-text">
            <p class="hello">Halo, Recipe Lover 👋</p>
            <h1>My Profile</h1>
            <p class="email">Selamat memasak hari ini ❤️</p>
          </div>

          <button class="edit-button" @click="showEdit">
            ✎
          </button>

        </div>


        <!-- STATISTICS -->
        <div class="stats">

          <div class="stat-card">
            <span class="stat-icon">❤️</span>
            <strong>{{ favoriteCount }}</strong>
            <small>Favorite</small>
          </div>

          <div class="stat-card">
            <span class="stat-icon">🛒</span>
            <strong>{{ shoppingCount }}</strong>
            <small>Belanja</small>
          </div>

          <div class="stat-card">
            <span class="stat-icon">🍳</span>
            <strong>5</strong>
            <small>Recipes</small>
          </div>

        </div>


        <!-- MY ACCOUNT -->
        <section>

          <h2>My Account</h2>

          <div class="menu-card">

            <button class="menu-item" @click="goFavorite">

              <div class="menu-icon favorite">
                ❤️
              </div>

              <div class="menu-text">
                <strong>Favorite Recipes</strong>
                <span>Lihat resep yang kamu simpan</span>
              </div>

              <span class="arrow">›</span>

            </button>


            <button class="menu-item" @click="goShopping">

              <div class="menu-icon shopping">
                🛒
              </div>

              <div class="menu-text">
                <strong>Shopping List</strong>
                <span>Kelola bahan masakanmu</span>
              </div>

              <span class="arrow">›</span>

            </button>


            <button class="menu-item" @click="showMyRecipes">

              <div class="menu-icon recipes">
                🍳
              </div>

              <div class="menu-text">
                <strong>My Recipes</strong>
                <span>Resep yang kamu buat</span>
              </div>

              <span class="arrow">›</span>

            </button>

          </div>

        </section>


        <!-- SETTINGS -->
        <section>

          <h2>Settings</h2>

          <div class="menu-card">

            <button class="menu-item" @click="showSettings">

              <div class="menu-icon settings">
                ⚙️
              </div>

              <div class="menu-text">
                <strong>App Settings</strong>
                <span>Atur preferensi RecipeBox</span>
              </div>

              <span class="arrow">›</span>

            </button>


            <button class="menu-item" @click="showAbout">

              <div class="menu-icon about">
                ℹ️
              </div>

              <div class="menu-text">
                <strong>About RecipeBox</strong>
                <span>Tentang aplikasi</span>
              </div>

              <span class="arrow">›</span>

            </button>

          </div>

        </section>


        <!-- LOGOUT -->
        <button class="logout-button" @click="logout">
          🚪 &nbsp; Logout
        </button>


        <p class="version">
          RecipeBox • Version 1.0
        </p>

      </div>

    </ion-content>


    <!-- BOTTOM NAVIGATION -->
    <div class="bottom-nav">

      <div @click="goHome">
        <span>⌂</span>
        <small>Home</small>
      </div>

      <div @click="goSearch">
        <span>⌕</span>
        <small>Search</small>
      </div>

      <div @click="goCategories">
        <span>◉</span>
        <small>Categories</small>
      </div>

      <div @click="goFavorite">
        <span>♡</span>
        <small>Favorite</small>
      </div>

      <div class="active">
        <span>♙</span>
        <small>Profile</small>
      </div>

    </div>

  </ion-page>
</template>


<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/vue'


const router = useRouter()

const favoriteCount = ref(0)
const shoppingCount = ref(0)


/* LOAD DATA */

const loadStats = () => {

  const favorites =
    localStorage.getItem('recipebox_favorites')

  const shopping =
    localStorage.getItem('recipebox_shopping_list')


  if (favorites) {

    try {

      const data = JSON.parse(favorites)

      favoriteCount.value =
        Array.isArray(data) ? data.length : 0

    } catch {

      favoriteCount.value = 0

    }

  }


  if (shopping) {

    try {

      const data = JSON.parse(shopping)

      shoppingCount.value =
        Array.isArray(data) ? data.length : 0

    } catch {

      shoppingCount.value = 0

    }

  }

}


/* NAVIGATION */

const goHome = () => {
  router.push('/home')
}


const goSearch = () => {
  router.push('/search')
}


const goCategories = () => {
  router.push('/categories')
}


const goFavorite = () => {
  router.push('/favorite')
}


const goShopping = () => {
  router.push('/shopping-list')
}


/* OTHER BUTTONS */

const showEdit = () => {

  alert(
    'Fitur edit profile akan tersedia pada pengembangan berikutnya.'
  )

}


const showMyRecipes = () => {

  alert(
    'Fitur My Recipes akan tersedia pada pengembangan berikutnya.'
  )

}
 
  const showSettings = () => {

  router.push('/app-settings')

}


const showAbout = () => {

  alert(
    'RecipeBox adalah aplikasi resep untuk membantu menemukan, menyimpan, dan mengatur resep makanan favorit.'
  )

}


const logout = () => {

  alert(
    'Kamu masih dalam mode demo RecipeBox.'
  )

}


onMounted(() => {
  loadStats()
})

</script>


<style scoped>

ion-content {
  --background: #fffaf5;
}


/* HEADER */

.header ion-toolbar {
  --background: #fffaf5;
  --color: #292929;
}


/* PAGE */

.profile-page {
  padding: 22px 18px 110px;
}


/* PROFILE HEADER */

.profile-header {
  position: relative;

  display: flex;
  align-items: center;

  padding: 22px;

  border-radius: 26px;

  background: linear-gradient(
    135deg,
    #fff0e5,
    #fff8f2
  );

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.07);
}


.avatar {
  width: 78px;
  height: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: white;

  font-size: 42px;

  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);

  flex-shrink: 0;
}


.profile-text {
  margin-left: 16px;
}


.hello {
  margin: 0 0 4px;

  color: #e96613;

  font-size: 12px;

  font-weight: 600;
}


.profile-text h1 {
  margin: 0;

  color: #292929;

  font-size: 23px;

  font-weight: 800;
}


.email {
  margin: 5px 0 0;

  color: #888;

  font-size: 12px;
}


.edit-button {
  position: absolute;

  top: 15px;
  right: 15px;

  width: 35px;
  height: 35px;

  border: none;

  border-radius: 50%;

  background: white;

  color: #e96613;

  font-size: 18px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}


/* STATISTICS */

.stats {
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 10px;

  margin-top: 18px;
}


.stat-card {
  display: flex;

  flex-direction: column;

  align-items: center;

  padding: 15px 5px;

  background: white;

  border-radius: 18px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}


.stat-icon {
  font-size: 21px;

  margin-bottom: 5px;
}


.stat-card strong {
  color: #292929;

  font-size: 19px;
}


.stat-card small {
  margin-top: 3px;

  color: #999;

  font-size: 10px;
}


/* SECTION */

section {
  margin-top: 27px;
}


section h2 {
  margin: 0 0 12px 3px;

  color: #292929;

  font-size: 18px;

  font-weight: 800;
}


/* MENU CARD */

.menu-card {
  overflow: hidden;

  background: white;

  border-radius: 21px;

  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.06);
}


/* MENU ITEM */

.menu-item {
  width: 100%;

  display: flex;

  align-items: center;

  padding: 15px;

  border: none;

  border-bottom: 1px solid #f1f1f1;

  background: white;

  text-align: left;

  cursor: pointer;
}


.menu-item:last-child {
  border-bottom: none;
}


.menu-icon {
  width: 45px;
  height: 45px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 14px;

  font-size: 21px;

  flex-shrink: 0;
}


.menu-icon.favorite {
  background: #fff0f2;
}


.menu-icon.shopping {
  background: #fff4e8;
}


.menu-icon.recipes {
  background: #fff8df;
}


.menu-icon.settings {
  background: #eeeeee;
}


.menu-icon.about {
  background: #eaf5ff;
}


.menu-text {
  flex: 1;

  margin-left: 13px;
}


.menu-text strong {
  display: block;

  color: #333;

  font-size: 14px;
}


.menu-text span {
  display: block;

  margin-top: 4px;

  color: #999;

  font-size: 11px;
}


.arrow {
  color: #bbb;

  font-size: 26px;
}


/* LOGOUT */

.logout-button {
  width: 100%;

  margin-top: 25px;

  padding: 15px;

  border: 1px solid #ffd5d5;

  border-radius: 17px;

  background: #fff5f5;

  color: #e45555;

  font-size: 14px;

  font-weight: 700;
}


.version {
  text-align: center;

  margin: 18px 0 5px;

  color: #aaa;

  font-size: 10px;
}


/* BOTTOM NAV */

.bottom-nav {
  position: fixed;

  bottom: 0;
  left: 0;
  right: 0;

  height: 70px;

  display: flex;

  justify-content: space-around;

  align-items: center;

  background: rgba(255, 255, 255, 0.97);

  border-top: 1px solid #eee;

  z-index: 999;
}


.bottom-nav div {
  flex: 1;

  text-align: center;

  color: #999;

  cursor: pointer;
}


.bottom-nav span {
  display: block;

  font-size: 23px;

  line-height: 25px;
}


.bottom-nav small {
  font-size: 10px;
}


.bottom-nav .active {
  color: #f27a21;

  font-weight: bold;
}

</style>