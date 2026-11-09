<template>
  <ion-page>

    <ion-header class="header">
      <ion-toolbar>
        <ion-title>Categories</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content>

      <div class="page">

        <!-- INTRO -->
        <div class="intro">

          <h1>
            Pilih Kategori 🍴
          </h1>

          <p>
            Temukan resep favoritmu berdasarkan
            kategori makanan.
          </p>

        </div>


        <!-- LOADING -->
        <div
          v-if="loading"
          class="loading-box"
        >

          <ion-spinner
            name="crescent"
          ></ion-spinner>

          <p>
            Mengambil kategori...
          </p>

        </div>


        <!-- CATEGORY -->
        <div
          v-else
          class="categories"
        >

          <div
            v-for="category in categories"
            :key="category.tag"
            class="category-card"
            @click="openCategory(category.tag)"
          >

            <img
              :src="category.image"
              :alt="category.name"
            />

            <div class="overlay"></div>


            <div class="category-info">

              <span class="emoji">
                {{ category.emoji }}
              </span>

              <h2>
                {{ category.name }}
              </h2>

              <p>
                {{ category.count }} resep
              </p>

            </div>

          </div>

        </div>


        <!-- JIKA KOSONG -->
        <div
          v-if="
            !loading &&
            categories.length === 0
          "
          class="empty-box"
        >

          <div>
            😢
          </div>

          <h2>
            Kategori belum tersedia
          </h2>

          <p>
            Data kategori belum berhasil
            diambil dari API.
          </p>

        </div>

      </div>

    </ion-content>


    <!-- BOTTOM NAV -->
    <div class="bottom-nav">

      <div @click="goHome">

        <span>⌂</span>

        <small>
          Home
        </small>

      </div>


      <div @click="goSearch">

        <span>⌕</span>

        <small>
          Search
        </small>

      </div>


      <div class="active">

        <span>◉</span>

        <small>
          Categories
        </small>

      </div>


      <div @click="goFavorite">

        <span>♡</span>

        <small>
          Favorite
        </small>

      </div>


      <div @click="goProfile">

        <span>♙</span>

        <small>
          Profile
        </small>

      </div>

    </div>

  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  onMounted
} from 'vue'

import {
  useRouter
} from 'vue-router'


import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner
} from '@ionic/vue'


const router =
  useRouter()


/* =========================
   API
========================= */

const API_URL =
  'https://dummyjson.com/recipes'


/* =========================
   RECIPE
========================= */

interface Recipe {

  id: number

  name: string

  image: string

  tags?: string[]

}


/* =========================
   CATEGORY
========================= */

interface Category {

  name: string

  tag: string

  image: string

  count: number

  emoji: string

}


/* =========================
   STATE
========================= */

const loading =
  ref(true)


const categories =
  ref<Category[]>([])


/* =========================
   EMOJI
========================= */

function getEmoji(
  tag: string
) {

  const emojis: Record<
    string,
    string
  > = {

    Pizza: '🍕',

    Vegetarian: '🥗',

    Dessert: '🍰',

    Pasta: '🍝',

    Chicken: '🍗',

    Beef: '🥩',

    Shrimp: '🦐',

    Rice: '🍚',

    Ramen: '🍜',

    Soup: '🍲',

    Salad: '🥗',

    Cookies: '🍪',

    Baking: '🧁',

    Sushi: '🍣',

    Curry: '🍛',

    Sandwich: '🥪',

    Seafood: '🦐',

    Grilling: '🔥',

    Smoothie: '🥤',

    'Street food': '🌮',

    'Main course': '🍽️'

  }


  return (
    emojis[tag] ||
    '🍴'
  )

}


/* =========================
   LOAD CATEGORIES
========================= */

async function loadCategories() {

  try {

    loading.value = true


    /*
     * Ambil seluruh resep
     * dari API.
     */

    const response =
      await fetch(
        `${API_URL}?limit=0`
      )


    if (!response.ok) {

      throw new Error(
        'Gagal mengambil resep'
      )

    }


    const data =
      await response.json()


    const recipes:
      Recipe[] =
      data.recipes || []


    /*
     * Map untuk menyimpan
     * resep berdasarkan tag.
     */

    const tagMap =
      new Map<
        string,
        Recipe[]
      >()


    /*
     * Masukkan setiap resep
     * ke semua tag yang dimilikinya.
     */

    recipes.forEach(
      recipe => {

        recipe.tags?.forEach(
          tag => {

            if (
              !tagMap.has(tag)
            ) {

              tagMap.set(
                tag,
                []
              )

            }


            tagMap
              .get(tag)!
              .push(recipe)

          }
        )

      }
    )


    /*
     * Buat daftar kategori.
     */

    const result:
      Category[] = []


    tagMap.forEach(
      (tagRecipes, tag) => {

        if (
          tagRecipes.length === 0
        ) {
          return
        }


        /*
         * Gunakan gambar resep
         * pertama dari kategori.
         */

        const recipe =
          tagRecipes[0]


        result.push({

          name:
            tag,

          tag:
            tag,

          image:
            recipe.image,

          count:
            tagRecipes.length,

          emoji:
            getEmoji(tag)

        })

      }
    )


    /*
     * Kategori dengan jumlah
     * resep terbanyak ditampilkan
     * lebih dahulu.
     */

    result.sort(
      (a, b) =>
        b.count - a.count
    )


    categories.value =
      result


    console.log(
      'Jumlah resep:',
      recipes.length
    )

    console.log(
      'Jumlah kategori:',
      result.length
    )


  } catch (error) {

    console.error(
      'Category API Error:',
      error
    )

    categories.value = []

  } finally {

    loading.value = false

  }

}


/* =========================
   OPEN CATEGORY
========================= */

function openCategory(
  category: string
) {

  router.push({

    path:
      '/search',

    query: {

      category:
        category

    }

  })

}


/* =========================
   NAVIGATION
========================= */

function goHome() {

  router.push('/home')

}


function goSearch() {

  router.push('/search')

}


function goFavorite() {

  router.push('/favorite')

}


function goProfile() {

  router.push('/profile')

}


/* =========================
   START
========================= */

onMounted(() => {

  loadCategories()

})

</script>


<style scoped>

ion-content {

  --background:
    #fffaf5;

}


/* =========================
   HEADER
========================= */

.header ion-toolbar {

  --background:
    #fffaf5;

  --color:
    #292929;

}


/* =========================
   PAGE
========================= */

.page {

  padding:
    25px
    18px
    110px;

}


/* =========================
   INTRO
========================= */

.intro {

  margin-bottom:
    25px;

}

.intro h1 {

  margin:
    0;

  font-size:
    28px;

  font-weight:
    800;

  color:
    #292929;

}

.intro p {

  margin-top:
    8px;

  color:
    #888;

  font-size:
    14px;

  line-height:
    1.5;

}


/* =========================
   LOADING
========================= */

.loading-box {

  text-align:
    center;

  padding:
    50px 20px;

}

.loading-box ion-spinner {

  width:
    38px;

  height:
    38px;

  color:
    #f27a21;

}

.loading-box p {

  color:
    #888;

  font-size:
    14px;

}


/* =========================
   CATEGORY GRID
========================= */

.categories {

  display:
    grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap:
    16px;

}


/* =========================
   CARD
========================= */

.category-card {

  position:
    relative;

  height:
    190px;

  border-radius:
    22px;

  overflow:
    hidden;

  cursor:
    pointer;

  background:
    #eee;

  box-shadow:
    0 8px 22px
    rgba(
      0,
      0,
      0,
      0.10
    );

  transition:
    0.2s;

}

.category-card:active {

  transform:
    scale(0.97);

}


/* =========================
   IMAGE
========================= */

.category-card img {

  width:
    100%;

  height:
    100%;

  object-fit:
    cover;

  display:
    block;

}


/* =========================
   OVERLAY
========================= */

.overlay {

  position:
    absolute;

  inset:
    0;

  background:
    linear-gradient(
      to top,
      rgba(
        0,
        0,
        0,
        0.78
      ),
      rgba(
        0,
        0,
        0,
        0.05
      )
    );

}


/* =========================
   INFO
========================= */

.category-info {

  position:
    absolute;

  left:
    15px;

  right:
    15px;

  bottom:
    14px;

  color:
    white;

}

.emoji {

  font-size:
    22px;

}

.category-info h2 {

  margin:
    3px 0 2px;

  font-size:
    19px;

  font-weight:
    800;

}

.category-info p {

  margin:
    0;

  font-size:
    12px;

  opacity:
    0.9;

}


/* =========================
   EMPTY
========================= */

.empty-box {

  text-align:
    center;

  padding:
    50px 20px;

  background:
    #fff;

  border-radius:
    20px;

}

.empty-box div {

  font-size:
    50px;

}

.empty-box h2 {

  color:
    #292929;

  margin:
    10px 0 5px;

}

.empty-box p {

  color:
    #888;

  font-size:
    14px;

}


/* =========================
   BOTTOM NAV
========================= */

.bottom-nav {

  position:
    fixed;

  bottom:
    0;

  left:
    0;

  right:
    0;

  height:
    70px;

  display:
    flex;

  justify-content:
    space-around;

  align-items:
    center;

  background:
    rgba(
      255,
      255,
      255,
      0.96
    );

  border-top:
    1px solid
    #eee;

  z-index:
    999;

}

.bottom-nav div {

  flex:
    1;

  text-align:
    center;

  color:
    #999;

  cursor:
    pointer;

}

.bottom-nav span {

  display:
    block;

  font-size:
    23px;

  line-height:
    25px;

}

.bottom-nav small {

  font-size:
    10px;

}

.bottom-nav .active {

  color:
    #f27a21;

  font-weight:
    bold;

}

</style>
