<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>🍴 RecipeBox</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content :fullscreen="true">

      <div class="page-content">

        <!-- SEARCH -->
        <div class="search-box">

          <ion-icon :icon="searchOutline"></ion-icon>

          <ion-input
            v-model="searchText"
            placeholder="Cari resep..."
            @keyup.enter="searchRecipe"
          ></ion-input>

          <ion-button
            fill="clear"
            @click="searchRecipe"
          >
            Cari
          </ion-button>

        </div>


        <!-- KATEGORI -->
        <div class="section-header">

          <h2>Kategori</h2>

          <span class="category-total">
            {{ categories.length }} kategori
          </span>

        </div>


        <div class="categories">

          <div
            v-for="category in categories"
            :key="category.tag"
            class="category-item"
            @click="selectCategory(category)"
          >

            <div class="category-image">

              <ion-spinner
                v-if="!category.image"
                name="crescent"
              ></ion-spinner>

              <img
                v-else
                :src="category.image"
                :alt="category.name"
              />

            </div>

            <span>
              {{ category.name }}
            </span>

            <small>
              {{ category.count }} resep
            </small>

          </div>

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
            Mengambil resep...
          </p>

        </div>


        <!-- HASIL RESEP -->
        <div
          v-if="!loading && recipes.length > 0"
          class="result-section"
        >

          <div class="section-header">

            <h2>
              {{ resultTitle }}
            </h2>

            <span class="result-count">
              {{ recipes.length }} resep
            </span>

          </div>


          <div class="recipe-list">

            <div
              v-for="recipe in recipes"
              :key="recipe.id"
              class="recipe-card"
              @click="openDetail(recipe)"
            >

              <img
                :src="recipe.image"
                :alt="recipe.name"
                class="recipe-image"
              />


              <div class="recipe-info">

                <span class="recipe-category">
                  {{ recipe.category }}
                </span>

                <h3>
                  {{ recipe.name }}
                </h3>

                <p>
                  {{ recipe.description }}
                </p>


                <div class="recipe-meta">

                  <span>
                    ⏱ {{ recipe.time }}
                  </span>

                  <span>
                    👥 {{ recipe.servings }}
                  </span>

                  <span>
                    ⭐ {{ recipe.rating }}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        <!-- TIDAK ADA HASIL -->
        <div
          v-if="
            !loading &&
            searchPerformed &&
            recipes.length === 0
          "
          class="welcome-card"
        >

          <div class="welcome-icon">
            😢
          </div>

          <h2>
            Resep Tidak Ditemukan
          </h2>

          <p>
            Coba cari resep lain atau pilih
            kategori yang berbeda.
          </p>

        </div>


        <!-- TAMPILAN AWAL -->
        <div
          v-if="
            !loading &&
            !searchPerformed
          "
          class="welcome-card"
        >

          <div class="welcome-icon">
            🍳
          </div>

          <h2>
            Cari Resep Favoritmu
          </h2>

          <p>
            Pilih kategori atau cari nama
            resep yang kamu inginkan.
          </p>

        </div>

      </div>

    </ion-content>


    <!-- BOTTOM NAV -->
    <ion-footer class="bottom-nav">

      <div
        class="nav-item"
        @click="goHome"
      >
        <ion-icon :icon="homeOutline"></ion-icon>
        <span>Home</span>
      </div>


      <div class="nav-item active">

        <ion-icon :icon="searchOutline"></ion-icon>

        <span>Search</span>

      </div>


      <div
        class="nav-item"
        @click="goFavorite"
      >

        <ion-icon :icon="heartOutline"></ion-icon>

        <span>Favorite</span>

      </div>


      <div
        class="nav-item"
        @click="goShoppingList"
      >

        <ion-icon :icon="cartOutline"></ion-icon>

        <span>Shopping</span>

      </div>


      <div
        class="nav-item"
        @click="goProfile"
      >

        <ion-icon :icon="personOutline"></ion-icon>

        <span>Profile</span>

      </div>

    </ion-footer>

  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  onMounted
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'


import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonIcon,
  IonInput,
  IonButton,
  IonSpinner
} from '@ionic/vue'


import {
  searchOutline,
  homeOutline,
  heartOutline,
  cartOutline,
  personOutline
} from 'ionicons/icons'


/* =========================
   ROUTER
========================= */

const router = useRouter()

const route = useRoute()


/* =========================
   API
========================= */

const API_URL =
  'https://dummyjson.com/recipes'


/* =========================
   STATE
========================= */

const searchText =
  ref('')

const loading =
  ref(false)

const searchPerformed =
  ref(false)

const resultTitle =
  ref('Daftar Resep')


/* =========================
   API RECIPE
========================= */

interface ApiRecipe {

  id: number

  name: string

  ingredients: string[]

  instructions: string[]

  prepTimeMinutes: number

  cookTimeMinutes: number

  servings: number

  difficulty: string

  cuisine: string

  image: string

  tags?: string[]

  rating?: number

}


/* =========================
   RECIPE UNTUK TAMPILAN
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

  rating: string

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
   DATA
========================= */

const allRecipes =
  ref<ApiRecipe[]>([])

const recipes =
  ref<Recipe[]>([])

const categories =
  ref<Category[]>([])


/* =========================
   LOAD SEMUA RESEP
========================= */

async function loadAllRecipes() {

  try {

    const response =
      await fetch(
        `${API_URL}?limit=0`
      )


    if (!response.ok) {

      throw new Error(
        'Gagal mengambil semua resep'
      )

    }


    const data =
      await response.json()


    allRecipes.value =
      data.recipes || []


    console.log(
      'Jumlah resep dari API:',
      allRecipes.value.length
    )


    /*
     * Setelah semua resep berhasil
     * diambil, kita buat kategori
     * berdasarkan tag yang benar-benar
     * ada di data API.
     */

    createCategories()


  } catch (error) {

    console.error(
      'Gagal mengambil resep:',
      error
    )

  }

}


/* =========================
   BUAT KATEGORI DARI TAG API
========================= */

function createCategories() {

  const tagMap =
    new Map<
      string,
      ApiRecipe[]
    >()


  /*
   * Ambil semua tag dari
   * seluruh resep.
   */

  allRecipes.value.forEach(
    recipe => {

      recipe.tags?.forEach(
        tag => {

          if (!tagMap.has(tag)) {

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
   * Buat gambar kategori.
   *
   * Kita mencari gambar yang belum
   * dipakai oleh kategori lain supaya
   * gambar tidak terlalu banyak kembar.
   */

  const usedImages =
    new Set<string>()


  const newCategories:
    Category[] = []


  tagMap.forEach(
    (tagRecipes, tag) => {

      let selectedRecipe =
        tagRecipes.find(
          recipe =>
            !usedImages.has(
              recipe.image
            )
        )


      /*
       * Kalau semua gambar sudah
       * pernah digunakan, tetap
       * gunakan gambar pertama.
       */

      if (!selectedRecipe) {

        selectedRecipe =
          tagRecipes[0]

      }


      if (selectedRecipe) {

        usedImages.add(
          selectedRecipe.image
        )


        newCategories.push({

          name: tag,

          tag: tag,

          image:
            selectedRecipe.image,

          count:
            tagRecipes.length

        })

      }

    }
  )


  /*
   * Urutkan kategori berdasarkan
   * jumlah resep terbanyak.
   */

  newCategories.sort(
    (a, b) =>
      b.count - a.count
  )


  categories.value =
    newCategories


  console.log(
    'Jumlah kategori:',
    categories.value.length
  )

}


/* =========================
   CONVERT RECIPE
========================= */

function convertRecipe(
  item: ApiRecipe,
  selectedCategory?: string
): Recipe {

  const totalTime =
    (item.prepTimeMinutes || 0) +
    (item.cookTimeMinutes || 0)


  return {

    id:
      String(item.id),

    /*
     * Kalau sedang membuka kategori,
     * tampilkan kategori yang dipilih.
     */

    category:
      selectedCategory ||
      item.tags?.[0] ||
      item.cuisine ||
      'Recipe',

    name:
      item.name,

    image:
      item.image,

    description:
      item.instructions?.[0] ||
      'Resep lezat untuk kamu coba.',

    time:
      `${totalTime} menit`,

    level:
      item.difficulty ||
      'Easy',

    servings:
      `${item.servings} porsi`,

    rating:
      item.rating !== undefined
        ? item.rating.toFixed(1)
        : 'N/A'

  }

}


/* =========================
   LOAD HASIL
========================= */

function showRecipes(
  recipeData: ApiRecipe[],
  title: string,
  selectedCategory?: string
) {

  resultTitle.value =
    title


  recipes.value =
    recipeData.map(
      recipe =>
        convertRecipe(
          recipe,
          selectedCategory
        )
    )


  searchPerformed.value =
    true

}


/* =========================
   SEARCH
========================= */

function searchRecipe() {

  const keyword =
    searchText.value.trim()


  if (!keyword) {

    recipes.value = []

    searchPerformed.value =
      false

    return

  }


  const keywordLower =
    keyword.toLowerCase()


  /*
   * Cari dari 100 resep yang
   * sudah diambil dari API.
   *
   * Jadi hasil tetap mengikuti
   * data API.
   */

  const found =
    allRecipes.value.filter(
      recipe => {

        const name =
          recipe.name.toLowerCase()

        const cuisine =
          recipe.cuisine?.toLowerCase() || ''

        const tags =
          recipe.tags
            ?.join(' ')
            .toLowerCase() || ''

        return (
          name.includes(
            keywordLower
          ) ||
          cuisine.includes(
            keywordLower
          ) ||
          tags.includes(
            keywordLower
          )
        )

      }
    )


  showRecipes(
    found,
    `Hasil pencarian "${keyword}"`
  )

}


/* =========================
   PILIH KATEGORI
========================= */

function selectCategory(
  category: Category
) {

  searchText.value =
    category.name


  const found =
    allRecipes.value.filter(
      recipe =>
        recipe.tags?.some(
          tag =>
            tag.toLowerCase() ===
            category.tag.toLowerCase()
        )
    )


  showRecipes(
    found,
    `Resep ${category.name}`,
    category.name
  )

}


/* =========================
   DETAIL
========================= */

function openDetail(
  recipe: Recipe
) {

  router.push({

    path:
      '/recipe-detail',

    query: {

      id:
        recipe.id,

      name:
        recipe.name

    }

  })

}


/* =========================
   NAVIGATION
========================= */

function goHome() {

  router.push('/home')

}


function goFavorite() {

  router.push('/favorite')

}


function goShoppingList() {

  router.push('/shopping-list')

}


function goProfile() {

  router.push('/profile')

}


/* =========================
   ON MOUNTED
========================= */

onMounted(
  async () => {

    loading.value = true

    await loadAllRecipes()

    loading.value = false


    const keyword =
      route.query.q as
      string | undefined


    const categoryName =
      route.query.category as
      string | undefined


    if (keyword) {

      searchText.value =
        keyword

      searchRecipe()

      return

    }


    if (categoryName) {

      const found =
        categories.value.find(
          category =>
            category.name.toLowerCase() ===
            categoryName.toLowerCase()
        )


      if (found) {

        selectCategory(
          found
        )

      }

    }

  }
)

</script>


<style scoped>

ion-toolbar {

  --background: #ffffff;

  --color: #222;

}

ion-title {

  font-weight: 700;

}


.page-content {

  padding:
    20px
    16px
    100px;

  background: #fff;

  min-height: 100%;

}


/* =========================
   SEARCH
========================= */

.search-box {

  display: flex;

  align-items: center;

  background: #f5f5f5;

  border-radius: 14px;

  padding:
    4px
    8px
    4px
    14px;

  margin-bottom: 24px;

}

.search-box ion-icon {

  font-size: 21px;

  color: #777;

}

.search-box ion-input {

  --padding-start: 10px;

  --padding-end: 5px;

}

.search-box ion-button {

  --color: #ff6b35;

  font-weight: 600;

}


/* =========================
   SECTION
========================= */

.section-header {

  display: flex;

  justify-content:
    space-between;

  align-items: center;

  margin-bottom: 14px;

}

.section-header h2 {

  margin: 0;

  font-size: 20px;

  font-weight: 700;

  color: #222;

}

.category-total,
.result-count {

  font-size: 12px;

  color: #888;

}


/* =========================
   CATEGORY
========================= */

.categories {

  display: flex;

  gap: 16px;

  overflow-x: auto;

  padding-bottom: 10px;

  margin-bottom: 28px;

}

.categories::-webkit-scrollbar {

  display: none;

}

.category-item {

  min-width: 78px;

  text-align: center;

  cursor: pointer;

}

.category-image {

  width: 68px;

  height: 68px;

  border-radius: 50%;

  overflow: hidden;

  margin: auto;

  border:
    2px solid
    #f2f2f2;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #f7f7f7;

}

.category-image img {

  width: 100%;

  height: 100%;

  object-fit: cover;

}

.category-image ion-spinner {

  color: #ff6b35;

}

.category-item span {

  display: block;

  margin-top: 7px;

  font-size: 13px;

  color: #444;

  white-space: nowrap;

}

.category-item small {

  display: block;

  margin-top: 3px;

  font-size: 10px;

  color: #999;

}


/* =========================
   LOADING
========================= */

.loading-box {

  text-align: center;

  padding: 40px 20px;

}

.loading-box ion-spinner {

  width: 35px;

  height: 35px;

  color: #ff6b35;

}

.loading-box p {

  color: #777;

}


/* =========================
   RECIPE LIST
========================= */

.recipe-list {

  display: flex;

  flex-direction: column;

  gap: 16px;

}


/* =========================
   RECIPE CARD
========================= */

.recipe-card {

  display: flex;

  background: #fff;

  border-radius: 18px;

  overflow: hidden;

  box-shadow:
    0 5px 18px
    rgba(
      0,
      0,
      0,
      0.08
    );

  cursor: pointer;

}

.recipe-image {

  width: 125px;

  min-width: 125px;

  height: 145px;

  object-fit: cover;

}

.recipe-info {

  padding: 12px;

  flex: 1;

}

.recipe-category {

  font-size: 11px;

  color: #ff6b35;

  font-weight: 600;

  text-transform: capitalize;

}

.recipe-info h3 {

  margin:
    5px
    0;

  font-size: 16px;

  color: #222;

}

.recipe-info p {

  margin:
    0
    0
    10px;

  color: #777;

  font-size: 12px;

  line-height: 1.4;

  display:
    -webkit-box;

  -webkit-line-clamp: 2;

  -webkit-box-orient: vertical;

  overflow: hidden;

}

.recipe-meta {

  display: flex;

  flex-wrap: wrap;

  gap: 8px;

  font-size: 10px;

  color: #666;

}


/* =========================
   WELCOME
========================= */

.welcome-card {

  text-align: center;

  padding:
    35px
    20px;

  background: #fff7f2;

  border-radius: 20px;

  margin-top: 20px;

}

.welcome-icon {

  font-size: 50px;

  margin-bottom: 10px;

}

.welcome-card h2 {

  margin:
    0
    0
    8px;

  color: #222;

}

.welcome-card p {

  margin: 0;

  color: #777;

  line-height: 1.5;

}


/* =========================
   BOTTOM NAV
========================= */

.bottom-nav {

  background: #fff;

  border-top:
    1px solid
    #eee;

  height: 68px;

  display: flex;

  justify-content:
    space-around;

  align-items: center;

}

.nav-item {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 4px;

  color: #999;

  font-size: 11px;

  cursor: pointer;

}

.nav-item ion-icon {

  font-size: 21px;

}

.nav-item.active {

  color: #ff6b35;

}

</style>