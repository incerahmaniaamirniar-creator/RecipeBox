<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>

        <div class="header">

          <div class="logo">

            <div class="logo-icon">

              <ion-icon
                :icon="restaurantOutline"
              />

            </div>

            <b>
              Recipe<span>Box</span>
            </b>

          </div>


          <div class="menu">

            <button
              class="active"
              @click="goHome"
            >

              <ion-icon
                :icon="homeOutline"
              />

              Home

            </button>


            <button
              @click="goSearch"
            >

              <ion-icon
                :icon="searchOutline"
              />

              Search

            </button>


            <button
              @click="goFavorite"
            >

              <ion-icon
                :icon="heartOutline"
              />

              Favorit

            </button>


            <button
              @click="goProfile"
            >

              <ion-icon
                :icon="personOutline"
              />

              Profil

            </button>

          </div>

        </div>

      </ion-toolbar>
    </ion-header>


    <ion-content>

      <!-- HERO -->
      <section class="hero">

        <div class="hero-text">

          <small>
            🍳 SELAMAT DATANG DI
          </small>


          <h1>

            Masak Enak<br>

            dengan
            <span>
              RecipeBox
            </span>

          </h1>


          <p>

            Temukan berbagai resep lezat dan
            buat masakan favoritmu dengan mudah.

          </p>


          <div class="search-box">

            <ion-icon
              :icon="searchOutline"
            />

            <input
              v-model="searchText"
              placeholder="Cari resep atau bahan..."
              @keyup.enter="searchRecipe"
            />


            <button
              @click="searchRecipe"
            >

              Cari

            </button>

          </div>

        </div>


        <div class="hero-image">

          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
            alt="Makanan"
          />

        </div>

      </section>


      <!-- MAIN -->
      <main>

        <!-- KATEGORI -->
        <section class="section">

          <div class="section-header">

            <div>

              <h2>
                Kategori
              </h2>

              <p>
                Pilih sesuai selera kamu
              </p>

            </div>


            <div
              class="see-all"
              @click="goCategories"
            >

              Lihat Semua →

            </div>

          </div>


          <!-- LOADING KATEGORI -->

          <div
            v-if="loading"
            class="loading-home"
          >

            <ion-spinner
              name="crescent"
            />

            <p>
              Mengambil kategori...
            </p>

          </div>


          <!-- KATEGORI -->

          <div
            v-else
            class="categories"
          >

            <button
              v-for="item in categories"
              :key="item.tag"
              class="category"
              @click="selectCategory(item.tag)"
            >

              <img
                :src="item.image"
                :alt="item.name"
              >


              <b>
                {{ item.name }}
              </b>


              <small>
                {{ item.count }} resep
              </small>

            </button>

          </div>

        </section>


        <!-- RESEP -->
        <section class="section">

          <div class="section-header">

            <div>

              <h2>
                🔥 Resep Pilihan
              </h2>

              <p>
                Resep lezat yang bisa kamu coba hari ini
              </p>

            </div>


            <div
              class="see-all"
              @click="goSearch"
            >

              Lihat Semua →

            </div>

          </div>


          <!-- LOADING RESEP -->

          <div
            v-if="loadingRecipes"
            class="loading-home"
          >

            <ion-spinner
              name="crescent"
            />

            <p>
              Mengambil resep...
            </p>

          </div>


          <!-- RESEP API -->

          <div
            v-else
            class="recipes"
          >

            <div
              v-for="recipe in recipes"
              :key="recipe.id"
              class="recipe-card"
              @click="openRecipe(recipe)"
            >

              <div class="recipe-image">

                <img
                  :src="recipe.image"
                  :alt="recipe.name"
                />


                <button
                  class="favorite"
                  @click.stop="
                    addFavorite(recipe.name)
                  "
                >

                  <ion-icon
                    :icon="heartOutline"
                  />

                </button>


                <span>
                  {{ recipe.category }}
                </span>

              </div>


              <div class="recipe-info">

                <h3>
                  {{ recipe.name }}
                </h3>


                <div class="recipe-footer">

                  <small>

                    <ion-icon
                      :icon="timeOutline"
                    />

                    {{ recipe.time }}

                  </small>


                  <button
                    class="arrow"
                    @click.stop="
                      openRecipe(recipe)
                    "
                  >

                    <ion-icon
                      :icon="arrowForwardOutline"
                    />

                  </button>

                </div>

              </div>

            </div>

          </div>

        </section>


        <!-- AI RECIPE ASSISTANT -->
        <section class="ai-box">

          <div class="ai-icon">
            🤖
          </div>


          <div>

            <h3>
              Bingung mau masak apa?
            </h3>


            <p>
              Biarkan RecipeBox membantu
              menemukan ide masakanmu.
            </p>

          </div>


          <button
            @click="goAIRecipe"
          >

            Coba Sekarang →

          </button>

        </section>

      </main>


      <!-- BOTTOM NAV -->
      <div class="bottom-nav">

        <button
          class="active"
          @click="goHome"
        >

          <ion-icon
            :icon="homeOutline"
          />

          <span>
            Home
          </span>

        </button>


        <button
          @click="goSearch"
        >

          <ion-icon
            :icon="searchOutline"
          />

          <span>
            Search
          </span>

        </button>


        <button
          @click="goFavorite"
        >

          <ion-icon
            :icon="heartOutline"
          />

          <span>
            Favorit
          </span>

        </button>


        <button
          @click="goShopping"
        >

          <ion-icon
            :icon="cartOutline"
          />

          <span>
            Shopping
          </span>

        </button>


        <button
          @click="goProfile"
        >

          <ion-icon
            :icon="personOutline"
          />

          <span>
            Profil
          </span>

        </button>

      </div>

    </ion-content>

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
  IonContent,
  IonIcon,
  IonSpinner
} from '@ionic/vue'


import {
  homeOutline,
  searchOutline,
  heartOutline,
  personOutline,
  restaurantOutline,
  timeOutline,
  arrowForwardOutline,
  cartOutline
} from 'ionicons/icons'


/* =========================
   ROUTER
========================= */

const router =
  useRouter()


/* =========================
   API
========================= */

const API_URL =
  'https://dummyjson.com/recipes'


/* =========================
   SEARCH
========================= */

const searchText =
  ref('')


/* =========================
   RECIPE API
========================= */

interface ApiRecipe {

  id: number

  name: string

  image: string

  tags?: string[]

  prepTimeMinutes: number

  cookTimeMinutes: number

  servings: number

  rating?: number

}


/* =========================
   HOME RECIPE
========================= */

interface HomeRecipe {

  id: number

  name: string

  category: string

  time: string

  image: string

}


/* =========================
   CATEGORY
========================= */

interface Category {

  name: string

  tag: string

  image: string

  count: number

}


/* =========================
   STATE
========================= */

const loading =
  ref(true)


const loadingRecipes =
  ref(true)


const categories =
  ref<Category[]>([])


const recipes =
  ref<HomeRecipe[]>([])


/* =========================
   KATEGORI HOME
========================= */

const categoryTags = [

  'Chicken',

  'Pasta',

  'Beef',

  'Shrimp',

  'Rice',

  'Dessert'

]


/* =========================
   LOAD DATA API
========================= */

async function loadHomeData() {

  try {

    loading.value =
      true

    loadingRecipes.value =
      true


    /*
     * Ambil semua resep
     * dari DummyJSON API.
     */

    const response =
      await fetch(
        `${API_URL}?limit=0`
      )


    if (!response.ok) {

      throw new Error(
        'Gagal mengambil data API'
      )

    }


    const data =
      await response.json()


    const allRecipes:
      ApiRecipe[] =
      data.recipes || []


    console.log(
      'Total resep API:',
      allRecipes.length
    )


    /* =====================
       KATEGORI
    ===================== */

    const categoryResult:
      Category[] = []


    categoryTags.forEach(
      tag => {

        const found =
          allRecipes.filter(
            recipe =>
              recipe.tags?.some(
                recipeTag =>
                  recipeTag.toLowerCase() ===
                  tag.toLowerCase()
              )
          )


        if (
          found.length > 0
        ) {

          categoryResult.push({

            name:
              tag,

            tag:
              tag,

            image:
              found[0].image,

            count:
              found.length

          })

        }

      }
    )


    categories.value =
      categoryResult


    loading.value =
      false


    /* =====================
       RESEP PILIHAN
    ===================== */

    recipes.value =
      allRecipes
        .slice(0, 8)
        .map(
          recipe => {

            const totalTime =
              (recipe.prepTimeMinutes || 0) +
              (recipe.cookTimeMinutes || 0)


            return {

              id:
                recipe.id,

              name:
                recipe.name,

              category:
                recipe.tags?.[0] ||
                'Recipe',

              time:
                `${totalTime} menit`,

              image:
                recipe.image

            }

          }
        )


    loadingRecipes.value =
      false


  } catch (error) {

    console.error(
      'Home API Error:',
      error
    )


    categories.value =
      []


    recipes.value =
      []


    loading.value =
      false


    loadingRecipes.value =
      false

  }

}


/* =========================
   NAVIGASI
========================= */

const goHome = () => {

  router.push(
    '/home'
  )

}


const goSearch = () => {

  router.push(
    '/search'
  )

}


const goFavorite = () => {

  router.push(
    '/favorite'
  )

}


const goShopping = () => {

  router.push(
    '/shopping-list'
  )

}


const goProfile = () => {

  router.push(
    '/profile'
  )

}


/* =========================
   AI RECIPE ASSISTANT
========================= */

const goAIRecipe = () => {

  router.push(
    '/ai-recipe'
  )

}


/* =========================
   CATEGORIES
========================= */

const goCategories = () => {

  router.push(
    '/categories'
  )

}


const selectCategory = (
  category: string
) => {

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
   SEARCH
========================= */

const searchRecipe = () => {

  const keyword =
    searchText.value.trim()


  if (keyword) {

    router.push({

      path:
        '/search',

      query: {

        q:
          keyword

      }

    })

  } else {

    router.push(
      '/search'
    )

  }

}


/* =========================
   DETAIL
========================= */

const openRecipe = (
  recipe: HomeRecipe
) => {

  router.push({

    path:
      '/recipe-detail',

    query: {

      id:
        String(recipe.id),

      name:
        recipe.name

    }

  })

}


/* =========================
   FAVORITE
========================= */

const addFavorite = (
  recipe: string
) => {

  console.log(
    'Ditambahkan ke favorit:',
    recipe
  )

}


/* =========================
   START
========================= */

onMounted(() => {

  loadHomeData()

})

</script>


<style scoped>

* {
  box-sizing:
    border-box;
}


ion-content {

  --background:
    #fffaf5;

}


ion-toolbar {

  --background:
    white;

  --border-width:
    0;

}


/* =========================
   HEADER
========================= */

.header {

  height:
    70px;

  max-width:
    1380px;

  margin:
    auto;

  padding:
    0 40px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

}


.logo {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  font-size:
    27px;

}


.logo span {

  color:
    #ff7117;

}


.logo-icon {

  width:
    43px;

  height:
    43px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    13px;

  background:
    #ff7117;

  color:
    white;

  font-size:
    24px;

}


.menu {

  display:
    flex;

  gap:
    8px;

}


.menu button {

  border:
    0;

  background:
    transparent;

  padding:
    11px 15px;

  border-radius:
    12px;

  display:
    flex;

  align-items:
    center;

  gap:
    6px;

  color:
    #555;

  font-size:
    15px;

  cursor:
    pointer;

}


.menu button.active,
.menu button:hover {

  background:
    #fff0e5;

  color:
    #ff7117;

}


/* =========================
   HERO
========================= */

.hero {

  min-height:
    360px;

  padding:
    45px
    max(
      40px,
      calc(
        (100% - 1300px) / 2
      )
    );

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  gap:
    40px;

  background:
    #fff0df;

}


.hero-text {

  max-width:
    650px;

}


.hero-text small {

  color:
    #e96818;

  font-weight:
    bold;

  letter-spacing:
    1px;

}


.hero h1 {

  font-size:
    48px;

  line-height:
    1.1;

  margin:
    10px 0 15px;

  color:
    #252525;

}


.hero h1 span {

  color:
    #ff7117;

}


.hero p {

  color:
    #666;

  font-size:
    17px;

  line-height:
    1.6;

  max-width:
    540px;

}


.search-box {

  width:
    100%;

  height:
    55px;

  margin-top:
    25px;

  background:
    white;

  border-radius:
    30px;

  display:
    flex;

  align-items:
    center;

  padding-left:
    18px;

  box-shadow:
    0 6px 20px
    rgba(
      0,
      0,
      0,
      .08
    );

}


.search-box ion-icon {

  font-size:
    22px;

  color:
    #888;

}


.search-box input {

  flex:
    1;

  border:
    0;

  outline:
    0;

  padding:
    0 12px;

  font-size:
    15px;

}


.search-box button {

  height:
    55px;

  padding:
    0 22px;

  border:
    0;

  border-radius:
    0 30px 30px 0;

  background:
    #ff7117;

  color:
    white;

  font-weight:
    bold;

  cursor:
    pointer;

}


.hero-image {

  width:
    380px;

  height:
    280px;

  border-radius:
    35px;

  overflow:
    hidden;

  box-shadow:
    0 15px 35px
    rgba(
      0,
      0,
      0,
      .15
    );

}


.hero-image img {

  width:
    100%;

  height:
    100%;

  object-fit:
    cover;

}


/* =========================
   MAIN
========================= */

main {

  max-width:
    1300px;

  margin:
    auto;

  padding:
    35px 30px 100px;

}


.section {

  margin-bottom:
    42px;

}


.section-header {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

  margin-bottom:
    20px;

}


.section-header h2 {

  margin:
    0;

  font-size:
    25px;

  color:
    #292929;

}


.section-header p {

  margin:
    5px 0 0;

  color:
    #888;

  font-size:
    14px;

}


.see-all {

  display:
    inline-block;

  padding:
    10px 12px;

  color:
    #e96613;

  font-weight:
    bold;

  cursor:
    pointer;

  position:
    relative;

  z-index:
    999;

  user-select:
    none;

}


.see-all:hover {

  color:
    #ff7117;

  text-decoration:
    underline;

}


/* =========================
   LOADING
========================= */

.loading-home {

  min-height:
    130px;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  justify-content:
    center;

  color:
    #888;

}


.loading-home ion-spinner {

  color:
    #ff7117;

  width:
    32px;

  height:
    32px;

}


.loading-home p {

  margin-top:
    8px;

  font-size:
    13px;

}


/* =========================
   KATEGORI
========================= */

.categories {

  display:
    grid;

  grid-template-columns:
    repeat(6, 1fr);

  gap:
    15px;

}


.category {

  border:
    0;

  background:
    white;

  padding:
    10px;

  border-radius:
    20px;

  box-shadow:
    0 5px 18px
    rgba(
      0,
      0,
      0,
      .07
    );

  cursor:
    pointer;

  transition:
    .25s;

  position:
    relative;

  z-index:
    5;

}


.category:hover {

  transform:
    translateY(-5px);

}


.category:active {

  transform:
    scale(.97);

}


.category img {

  width:
    100%;

  height:
    100px;

  object-fit:
    cover;

  border-radius:
    15px;

}


.category b {

  display:
    block;

  padding:
    8px 3px 1px;

  color:
    #333;

  font-size:
    14px;

}


.category small {

  display:
    block;

  color:
    #999;

  font-size:
    10px;

  padding-bottom:
    3px;

}


/* =========================
   RESEP
========================= */

.recipes {

  display:
    grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap:
    20px;

}


.recipe-card {

  background:
    white;

  border-radius:
    20px;

  overflow:
    hidden;

  box-shadow:
    0 5px 18px
    rgba(
      0,
      0,
      0,
      .07
    );

  transition:
    .25s;

  cursor:
    pointer;

}


.recipe-card:hover {

  transform:
    translateY(-5px);

}


.recipe-image {

  height:
    190px;

  position:
    relative;

}


.recipe-image img {

  width:
    100%;

  height:
    100%;

  object-fit:
    cover;

}


.recipe-image span {

  position:
    absolute;

  bottom:
    10px;

  left:
    10px;

  padding:
    5px 11px;

  border-radius:
    20px;

  background:
    white;

  color:
    #e96613;

  font-size:
    12px;

  font-weight:
    bold;

}


.favorite {

  position:
    absolute;

  top:
    10px;

  right:
    10px;

  width:
    38px;

  height:
    38px;

  border:
    0;

  border-radius:
    50%;

  background:
    white;

  color:
    #777;

  font-size:
    20px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  cursor:
    pointer;

}


.favorite:hover {

  color:
    #ff4f4f;

}


.recipe-info {

  padding:
    15px;

}


.recipe-info h3 {

  margin:
    0 0 12px;

  font-size:
    17px;

  color:
    #333;

  white-space:
    nowrap;

  overflow:
    hidden;

  text-overflow:
    ellipsis;

}


.recipe-footer {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    center;

}


.recipe-footer small {

  display:
    flex;

  align-items:
    center;

  gap:
    5px;

  color:
    #888;

}


.recipe-footer ion-icon {

  color:
    #ff7117;

}


.arrow {

  width:
    34px;

  height:
    34px;

  border:
    0;

  border-radius:
    50%;

  background:
    #fff0e5;

  color:
    #ff7117;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  cursor:
    pointer;

}


.arrow:hover {

  background:
    #ff7117;

  color:
    white;

}


/* =========================
   AI RECIPE ASSISTANT
========================= */

.ai-box {

  margin-top:
    10px;

  padding:
    25px 30px;

  border-radius:
    24px;

  background:
    linear-gradient(
      135deg,
      #fff0df,
      #fff8f2
    );

  display:
    flex;

  align-items:
    center;

  gap:
    20px;

  box-shadow:
    0 8px 25px
    rgba(
      0,
      0,
      0,
      .06
    );

}


.ai-icon {

  width:
    60px;

  height:
    60px;

  flex-shrink:
    0;

  border-radius:
    18px;

  background:
    white;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  font-size:
    32px;

  box-shadow:
    0 5px 15px
    rgba(
      0,
      0,
      0,
      .08
    );

}


.ai-box h3 {

  margin:
    0 0 5px;

  font-size:
    20px;

  color:
    #292929;

}


.ai-box p {

  margin:
    0;

  color:
    #777;

  font-size:
    14px;

}


.ai-box button {

  margin-left:
    auto;

  border:
    0;

  padding:
    13px 22px;

  border-radius:
    25px;

  background:
    #ff7117;

  color:
    white;

  font-weight:
    bold;

  cursor:
    pointer;

  white-space:
    nowrap;

  transition:
    .25s;

}


.ai-box button:hover {

  background:
    #e96613;

  transform:
    translateY(-2px);

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
    65px;

  background:
    white;

  border-top:
    1px solid #eee;

  display:
    flex;

  justify-content:
    center;

  gap:
    55px;

  align-items:
    center;

  z-index:
    1000;

}


.bottom-nav button {

  border:
    0;

  background:
    transparent;

  display:
    flex;

  flex-direction:
    column;

  align-items:
    center;

  gap:
    3px;

  color:
    #888;

  font-size:
    11px;

  cursor:
    pointer;

}


.bottom-nav button ion-icon {

  font-size:
    21px;

}


.bottom-nav button.active,
.bottom-nav button:hover {

  color:
    #ff7117;

}


/* =========================
   RESPONSIVE
========================= */

@media (
  max-width: 900px
) {

  .header {

    padding:
      0 20px;

  }


  .menu {

    display:
      none;

  }


  .hero {

    padding:
      30px 20px;

    flex-direction:
      column;

    align-items:
      stretch;

  }


  .hero h1 {

    font-size:
      38px;

  }


  .hero-image {

    width:
      100%;

    height:
      230px;

  }


  main {

    padding:
      25px 18px 90px;

  }


  .categories {

    grid-template-columns:
      repeat(3, 1fr);

  }


  .recipes {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .ai-box {

    flex-wrap:
      wrap;

  }


  .ai-box button {

    margin-left:
      0;

    width:
      100%;

  }


  .bottom-nav {

    gap:
      20px;

  }

}


@media (
  max-width: 550px
) {

  .logo {

    font-size:
      22px;

  }


  .logo-icon {

    width:
      38px;

    height:
      38px;

  }


  .hero {

    min-height:
      auto;

  }


  .hero h1 {

    font-size:
      32px;

  }


  .hero p {

    font-size:
      14px;

  }


  .categories {

    grid-template-columns:
      repeat(2, 1fr);

  }


  .recipes {

    grid-template-columns:
      1fr;

  }


  .recipe-image {

    height:
      210px;

  }


  .bottom-nav {

    justify-content:
      space-around;

    gap:
      0;

  }

}

</style>