<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon :icon="arrowBackOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>
          <div class="logo-title">
            <ion-icon :icon="restaurantOutline"></ion-icon>
            <span>Recipe<span>Box</span></span>
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div class="ai-page">

        <!-- AI HEADER -->
        <section class="ai-header">

          <div class="robot">
            🤖
          </div>

          <div class="badge">
            ✨ RECIPE ASSISTANT
          </div>

          <h1>
            Bingung mau masak apa?
          </h1>

          <p>
            Beritahu bahan yang kamu punya,
            dan RecipeBox akan membantu menemukan
            ide resep untukmu.
          </p>

        </section>

        <!-- INPUT -->
        <section class="input-card">

          <div class="input-title">
            <ion-icon :icon="basketOutline"></ion-icon>

            <div>
              <h2>Bahan yang kamu punya</h2>
              <p>Masukkan beberapa bahan yang tersedia.</p>
            </div>
          </div>

          <ion-textarea
            v-model="ingredientsInput"
            placeholder="Contoh: ayam, telur, bawang putih, nasi..."
            :auto-grow="true"
            :rows="4"
          ></ion-textarea>

          <ion-button
            expand="block"
            class="search-button"
            @click="findRecipes"
            :disabled="loading"
          >
            <ion-spinner
              v-if="loading"
              name="crescent"
            ></ion-spinner>

            <template v-else>
              <ion-icon
                :icon="sparklesOutline"
                slot="start"
              ></ion-icon>

              Cari Ide Resep
            </template>
          </ion-button>

        </section>

        <!-- SUGGESTIONS -->
        <section
          v-if="!searched"
          class="suggestion-section"
        >

          <h3>Coba bahan seperti:</h3>

          <div class="suggestions">

            <button
              v-for="item in suggestions"
              :key="item"
              @click="useSuggestion(item)"
            >
              {{ item }}
            </button>

          </div>

        </section>

        <!-- LOADING -->
        <div
          v-if="loading"
          class="loading-box"
        >
          <ion-spinner name="crescent"></ion-spinner>

          <p>
            RecipeBox sedang mencari ide resep...
          </p>
        </div>

        <!-- ERROR -->
        <div
          v-if="error"
          class="error-box"
        >
          <ion-icon :icon="alertCircleOutline"></ion-icon>

          <p>{{ error }}</p>
        </div>

        <!-- RESULTS -->
        <section
          v-if="searched && !loading && recipes.length"
          class="results-section"
        >

          <div class="result-heading">
            <div>
              <h2>✨ Ide resep untukmu</h2>

              <p>
                Ditemukan {{ recipes.length }} resep
                yang cocok dengan bahanmu.
              </p>
            </div>
          </div>

          <div class="recipe-list">

            <div
              v-for="recipe in recipes"
              :key="recipe.id"
              class="recipe-card"
              @click="openRecipe(recipe)"
            >

              <img
                :src="recipe.image"
                :alt="recipe.name"
                @error="handleImageError"
              />

              <div class="recipe-info">

                <span class="recipe-category">
                  {{ recipe.category }}
                </span>

                <h3>
                  {{ recipe.name }}
                </h3>

                <div class="recipe-meta">

                  <span>
                    <ion-icon :icon="timeOutline"></ion-icon>
                    {{ recipe.totalTime }} menit
                  </span>

                  <span>
                    <ion-icon :icon="peopleOutline"></ion-icon>
                    {{ recipe.servings }} porsi
                  </span>

                </div>

              </div>

              <ion-icon
                class="arrow-icon"
                :icon="chevronForwardOutline"
              ></ion-icon>

            </div>

          </div>

        </section>

        <!-- NO RESULT -->
        <div
          v-if="searched && !loading && !recipes.length"
          class="empty-box"
        >

          <div class="empty-icon">
            🍳
          </div>

          <h2>Belum menemukan resep</h2>

          <p>
            Coba masukkan bahan lain atau tambahkan
            lebih banyak bahan.
          </p>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonTextarea,
  IonSpinner
} from '@ionic/vue'

import {
  arrowBackOutline,
  restaurantOutline,
  basketOutline,
  sparklesOutline,
  alertCircleOutline,
  timeOutline,
  peopleOutline,
  chevronForwardOutline
} from 'ionicons/icons'

import { ref } from 'vue'
import { useRouter } from 'vue-router'


/* =====================================================
   ROUTER
===================================================== */

const router = useRouter()


/* =====================================================
   API
===================================================== */

const API_URL =
  'https://dummyjson.com/recipes'


/* =====================================================
   STATE
===================================================== */

const ingredientsInput = ref('')

const loading = ref(false)

const searched = ref(false)

const error = ref('')


/* =====================================================
   RECIPE TYPE
===================================================== */

interface Recipe {

  id: number

  name: string

  image: string

  ingredients: string[]

  instructions: string[]

  prepTimeMinutes: number

  cookTimeMinutes: number

  servings: number

  difficulty: string

  cuisine: string

  tags?: string[]

}


/* =====================================================
   RESULT TYPE
===================================================== */

interface RecipeResult {

  id: number

  name: string

  image: string

  category: string

  totalTime: number

  servings: number

}


/* =====================================================
   RECIPES
===================================================== */

const recipes =
  ref<RecipeResult[]>([])


/* =====================================================
   SUGGESTIONS
===================================================== */

const suggestions = [

  'ayam, telur',

  'nasi, telur',

  'pasta, keju',

  'udang, bawang putih',

  'kentang, ayam',

  'tomat, keju'

]


/* =====================================================
   USE SUGGESTION
===================================================== */

function useSuggestion(
  value: string
) {

  ingredientsInput.value =
    value

}


/* =====================================================
   FIND RECIPES
===================================================== */

async function findRecipes() {

  error.value = ''

  recipes.value = []

  searched.value = true

  if (
    !ingredientsInput.value.trim()
  ) {

    error.value =
      'Masukkan bahan yang kamu punya terlebih dahulu.'

    return

  }

  loading.value = true

  try {

    /*
     * Ambil semua resep dari API
     */

    const response =
      await fetch(
        `${API_URL}?limit=0`
      )

    if (!response.ok) {

      throw new Error(
        'Gagal mengambil data resep.'
      )

    }

    const data =
      await response.json()

    const allRecipes:
      Recipe[] =
      data.recipes || []


    /*
     * Pisahkan bahan yang dimasukkan pengguna.
     */

    const userIngredients =
      ingredientsInput.value
        .toLowerCase()
        .split(',')
        .map(
          item =>
            item.trim()
        )
        .filter(
          item =>
            item.length > 0
        )


    /*
     * Cari resep berdasarkan
     * kecocokan bahan.
     */

    const matched =
      allRecipes
        .map(recipe => {

          const recipeText =
            [
              recipe.name,
              ...(recipe.ingredients || []),
              ...(recipe.tags || []),
              recipe.cuisine
            ]
              .join(' ')
              .toLowerCase()

          let score = 0

          userIngredients.forEach(
            ingredient => {

              /*
               * Kecocokan langsung.
               */

              if (
                recipeText.includes(
                  ingredient
                )
              ) {

                score += 3

              }

              /*
               * Cek kata per kata.
               */

              const words =
                ingredient
                  .split(' ')
                  .filter(
                    word =>
                      word.length > 2
                  )

              words.forEach(word => {

                if (
                  recipeText.includes(word)
                ) {

                  score += 1

                }

              })

            }
          )

          return {
            recipe,
            score
          }

        })
        .filter(
          item =>
            item.score > 0
        )
        .sort(
          (a, b) =>
            b.score - a.score
        )


    /*
     * Ambil maksimal 8 resep.
     */

    recipes.value =
      matched
        .slice(0, 8)
        .map(
          item =>
            convertRecipe(
              item.recipe
            )
        )


  } catch (err) {

    console.error(err)

    error.value =
      'Terjadi kesalahan saat mencari resep. Silakan coba lagi.'

  } finally {

    loading.value = false

  }

}


/* =====================================================
   CONVERT RECIPE
===================================================== */

function convertRecipe(
  item: Recipe
): RecipeResult {

  return {

    id: item.id,

    name: item.name,

    image: item.image,

    category:
      item.tags?.[0] ||
      item.cuisine ||
      'Recipe',

    totalTime:
      Number(
        item.prepTimeMinutes || 0
      ) +
      Number(
        item.cookTimeMinutes || 0
      ),

    servings:
      item.servings || 1

  }

}


/* =====================================================
   OPEN RECIPE
===================================================== */

function openRecipe(
  recipe: RecipeResult
) {

  router.push({
    path: '/recipe-detail',

    query: {
      id: String(recipe.id),
      name: recipe.name
    }

  })

}


/* =====================================================
   BACK
===================================================== */

function goBack() {

  router.back()

}


/* =====================================================
   IMAGE FALLBACK
===================================================== */

function handleImageError(
  event: Event
) {

  const image =
    event.target as HTMLImageElement

  image.src =
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'

}

</script>


<style scoped>

/* =====================================================
   PAGE
===================================================== */

ion-content {
  --background: #fffaf5;
}

ion-toolbar {
  --background: #ffffff;
  --border-width: 0;
}


/* =====================================================
   LOGO
===================================================== */

.logo-title {

  display: flex;

  align-items: center;

  gap: 7px;

  font-size: 20px;

  font-weight: 800;

  color: #252525;

}

.logo-title ion-icon {

  color: #ff7117;

  font-size: 24px;

}

.logo-title span span {

  color: #ff7117;

}


/* =====================================================
   MAIN
===================================================== */

.ai-page {

  max-width: 850px;

  margin: 0 auto;

  padding: 25px 20px 50px;

}


/* =====================================================
   AI HEADER
===================================================== */

.ai-header {

  text-align: center;

  padding: 20px 10px 25px;

}

.robot {

  width: 90px;

  height: 90px;

  margin: 0 auto 15px;

  border-radius: 30px;

  background:
    linear-gradient(
      135deg,
      #fff0e4,
      #ffe1ca
    );

  display: flex;

  justify-content: center;

  align-items: center;

  font-size: 50px;

  box-shadow:
    0 10px 25px
    rgba(255,113,23,0.12);

}

.badge {

  display: inline-block;

  padding: 7px 13px;

  border-radius: 20px;

  background: #fff0e6;

  color: #360d81;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: .5px;

}

.ai-header h1 {

  margin: 15px 0 8px;

  font-size: 28px;

  color: #222;

  font-weight: 800;

}

.ai-header p {

  max-width: 550px;

  margin: auto;

  color: #777;

  font-size: 14px;

  line-height: 1.7;

}


/* =====================================================
   INPUT CARD
===================================================== */

.input-card {

  background: #ffffff;

  border-radius: 22px;

  padding: 20px;

  box-shadow:
    0 7px 25px
    rgba(0,0,0,0.05);

}

.input-title {

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 15px;

}

.input-title > ion-icon {

  width: 43px;

  height: 43px;

  padding: 10px;

  border-radius: 13px;

  background: #fff0e6;

  color: #ff7117;

}

.input-title h2 {

  margin: 0;

  font-size: 16px;

  color: #9024ce;

}

.input-title p {

  margin: 3px 0 0;

  color: #999;

  font-size: 11px;

}

ion-textarea {

  --background: #fffaf5;

  --border-radius: 14px;

  --padding-start: 14px;

  --padding-end: 14px;

  --padding-top: 13px;

  --padding-bottom: 13px;

  --color: #333;

  margin-bottom: 13px;

}


/* =====================================================
   SEARCH BUTTON
===================================================== */

.search-button {

  --background: #ff7117;

  --border-radius: 14px;

  height: 50px;

  font-weight: 700;

}


/* =====================================================
   SUGGESTIONS
===================================================== */

.suggestion-section {

  padding: 22px 2px;

}

.suggestion-section h3 {

  margin: 0 0 12px;

  font-size: 13px;

  color: #666;

}

.suggestions {

  display: flex;

  flex-wrap: wrap;

  gap: 8px;

}

.suggestions button {

  border: none;

  background: #ffffff;

  color: #555;

  padding: 9px 13px;

  border-radius: 20px;

  font-size: 11px;

  box-shadow:
    0 3px 10px
    rgba(0,0,0,0.04);

}


/* =====================================================
   LOADING
===================================================== */

.loading-box {

  text-align: center;

  padding: 30px;

}

.loading-box ion-spinner {

  color: #ff7117;

}

.loading-box p {

  color: #888;

  font-size: 13px;

}


/* =====================================================
   ERROR
===================================================== */

.error-box {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-top: 15px;

  padding: 14px;

  background: #fff0ed;

  border-radius: 14px;

  color: #d94c35;

}

.error-box ion-icon {

  font-size: 22px;

}

.error-box p {

  margin: 0;

  font-size: 13px;

}


/* =====================================================
   RESULTS
===================================================== */

.results-section {

  margin-top: 25px;

}

.result-heading h2 {

  margin: 0;

  font-size: 20px;

  color: #222;

}

.result-heading p {

  margin: 5px 0 15px;

  color: #999;

  font-size: 12px;

}


/* =====================================================
   RECIPE LIST
===================================================== */

.recipe-list {

  display: flex;

  flex-direction: column;

  gap: 12px;

}

.recipe-card {

  position: relative;

  display: flex;

  align-items: center;

  gap: 13px;

  padding: 10px;

  background: #ffffff;

  border-radius: 17px;

  box-shadow:
    0 5px 18px
    rgba(0,0,0,0.045);

  cursor: pointer;

}

.recipe-card img {

  width: 88px;

  height: 88px;

  object-fit: cover;

  border-radius: 13px;

  flex-shrink: 0;

}

.recipe-info {

  flex: 1;

  min-width: 0;

}

.recipe-category {

  font-size: 9px;

  color: #ff7117;

  font-weight: 800;

  text-transform: uppercase;

}

.recipe-info h3 {

  margin: 4px 0 8px;

  font-size: 14px;

  color: #333;

  line-height: 1.3;

}

.recipe-meta {

  display: flex;

  gap: 12px;

  color: #999;

  font-size: 10px;

}

.recipe-meta span {

  display: flex;

  align-items: center;

  gap: 3px;

}

.recipe-meta ion-icon {

  color: #ff7117;

}

.arrow-icon {

  color: #bbb;

  font-size: 18px;

}


/* =====================================================
   EMPTY
===================================================== */

.empty-box {

  text-align: center;

  padding: 45px 20px;

}

.empty-icon {

  font-size: 48px;

}

.empty-box h2 {

  margin: 12px 0 5px;

  font-size: 18px;

  color: #0d09e9d3;

}

.empty-box p {

  margin: 0;

  color: #999;

  font-size: 13px;

  line-height: 1.6;

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {

  .ai-page {

    padding:
      20px 15px 40px;

  }

  .ai-header h1 {

    font-size: 25px;

  }

  .robot {

    width: 78px;

    height: 78px;

    font-size: 42px;

  }

  .recipe-card img {

    width: 78px;

    height: 78px;

  }

}

</style>