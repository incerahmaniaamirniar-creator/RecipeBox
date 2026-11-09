<template>
  <ion-page>
    <!-- HEADER -->
    <ion-header class="detail-header">
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

        <ion-buttons slot="end">
          <ion-button @click="toggleFavorite">
            <ion-icon
              :icon="isFavorite ? heart : heartOutline"
              :class="{ activeHeart: isFavorite }"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <!-- LOADING -->
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <h3>Menyiapkan resep...</h3>
        <p>Menerjemahkan resep ke Bahasa Indonesia.</p>
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <ion-icon :icon="alertCircleOutline"></ion-icon>
        </div>

        <h2>Resep tidak dapat dimuat</h2>
        <p>{{ error }}</p>

        <ion-button @click="loadRecipe">
          Coba Lagi
        </ion-button>
      </div>

      <!-- DETAIL -->
      <div v-else-if="recipe" class="page-content">

        <!-- HERO IMAGE -->
        <div class="hero-image-wrapper">
          <img
            :src="recipe.image"
            :alt="translatedName"
            class="hero-image"
            @error="handleImageError"
          />

          <div class="image-overlay"></div>

          <button
            class="floating-favorite"
            @click="toggleFavorite"
          >
            <ion-icon
              :icon="isFavorite ? heart : heartOutline"
              :class="{ activeHeart: isFavorite }"
            ></ion-icon>
          </button>

          <div class="hero-category">
            {{ translatedCategory }}
          </div>
        </div>

        <!-- TITLE -->
        <section class="recipe-heading">

          <h1>{{ translatedName }}</h1>

          <p class="description">
            {{ translatedDescription }}
          </p>

          <!-- INFO -->
          <div class="info-grid">

            <div class="info-item">
              <div class="info-icon">
                <ion-icon :icon="timeOutline"></ion-icon>
              </div>

              <div>
                <small>Total waktu</small>
                <strong>{{ totalTime }} menit</strong>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <ion-icon :icon="speedometerOutline"></ion-icon>
              </div>

              <div>
                <small>Tingkat</small>
                <strong>{{ translatedDifficulty }}</strong>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <ion-icon :icon="peopleOutline"></ion-icon>
              </div>

              <div>
                <small>Porsi</small>
                <strong>{{ recipe.servings }} orang</strong>
              </div>
            </div>

          </div>
        </section>

        <!-- INGREDIENTS -->
        <section class="content-section">

          <div class="section-title">
            <div class="section-icon">
              <ion-icon :icon="basketOutline"></ion-icon>
            </div>

            <div>
              <h2>Bahan-bahan</h2>
              <p>{{ translatedIngredients.length }} bahan</p>
            </div>
          </div>

          <div class="ingredients-list">

            <div
              v-for="(ingredient, index) in translatedIngredients"
              :key="index"
              class="ingredient-item"
            >
              <div class="ingredient-number">
                {{ index + 1 }}
              </div>

              <span>{{ ingredient }}</span>
            </div>

          </div>

        </section>

        <!-- COOKING STEPS -->
        <section class="content-section">

          <div class="section-title">
            <div class="section-icon">
              <ion-icon :icon="restaurantOutline"></ion-icon>
            </div>

            <div>
              <h2>Cara Memasak</h2>
              <p>Langkah-langkah membuat resep</p>
            </div>
          </div>

          <div class="translation-info">
            <ion-icon :icon="languageOutline"></ion-icon>

            <div>
              <strong>Bahasa Indonesia</strong>
              <p>
                Langkah memasak telah diterjemahkan agar lebih mudah dipahami.
              </p>
            </div>
          </div>

          <div class="steps-list">

            <div
              v-for="(step, index) in translatedInstructions"
              :key="index"
              class="step-item"
            >

              <div class="step-number">
                {{ index + 1 }}
              </div>

              <div class="step-content">
                <p>{{ step }}</p>
              </div>

            </div>

          </div>

        </section>

        <!-- BUTTON -->
        <section class="action-section">

          <ion-button
            expand="block"
            class="shopping-button"
            @click="addIngredientsToShoppingList"
          >
            <ion-icon
              :icon="cartOutline"
              slot="start"
            ></ion-icon>

            Tambahkan Bahan ke Daftar Belanja
          </ion-button>

          <ion-button
            expand="block"
            fill="outline"
            class="favorite-button"
            @click="toggleFavorite"
          >
            <ion-icon
              :icon="isFavorite ? heart : heartOutline"
              slot="start"
            ></ion-icon>

            {{ isFavorite ? 'Hapus dari Favorit' : 'Simpan ke Favorit' }}
          </ion-button>

        </section>

        <div class="bottom-space"></div>

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
  IonSpinner
} from '@ionic/vue'

import {
  arrowBackOutline,
  restaurantOutline,
  heart,
  heartOutline,
  timeOutline,
  speedometerOutline,
  peopleOutline,
  basketOutline,
  languageOutline,
  cartOutline,
  alertCircleOutline
} from 'ionicons/icons'

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/* =========================================================
   API
========================================================= */

const API_URL = 'https://dummyjson.com/recipes'

const TRANSLATE_API =
  'https://api.mymemory.translated.net/get'

/* =========================================================
   ROUTER
========================================================= */

const route = useRoute()
const router = useRouter()

/* =========================================================
   INTERFACE
========================================================= */

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

/* =========================================================
   STATE
========================================================= */

const recipe = ref<ApiRecipe | null>(null)

const loading = ref(true)

const error = ref('')

const isFavorite = ref(false)

const translatedName = ref('')

const translatedDescription = ref('')

const translatedCategory = ref('')

const translatedDifficulty = ref('')

const translatedIngredients = ref<string[]>([])

const translatedInstructions = ref<string[]>([])

/* =========================================================
   COMPUTED
========================================================= */

const totalTime = computed(() => {

  if (!recipe.value) {
    return 0
  }

  return (
    Number(recipe.value.prepTimeMinutes || 0) +
    Number(recipe.value.cookTimeMinutes || 0)
  )
})

/* =========================================================
   LOAD RECIPE
========================================================= */

async function loadRecipe() {

  loading.value = true
  error.value = ''

  try {

    const id = Number(route.query.id || 1)

    const response = await fetch(
      `${API_URL}/${id}`
    )

    if (!response.ok) {
      throw new Error('Gagal mengambil data resep.')
    }

    const data: ApiRecipe = await response.json()

    recipe.value = data

    await translateEverything(data)

    checkFavorite(data)

  } catch (err) {

    console.error(err)

    error.value =
      'Terjadi kesalahan saat mengambil data resep. Silakan coba lagi.'

  } finally {

    loading.value = false

  }
}

/* =========================================================
   TRANSLATE EVERYTHING
========================================================= */

async function translateEverything(
  item: ApiRecipe
) {

  /* NAMA */

  const onlineName =
    await translateTextOnline(item.name)

  translatedName.value =
    cleanIndonesianText(
      onlineName || item.name
    )

  /* DESKRIPSI */

  translatedDescription.value =
    createDescription(item)

  /* KATEGORI */

  translatedCategory.value =
    translateCategory(item)

  /* TINGKAT KESULITAN */

  translatedDifficulty.value =
    translateDifficulty(item.difficulty)

  /* BAHAN */

  translatedIngredients.value =
    await Promise.all(
      item.ingredients.map(
        ingredient =>
          translateIngredient(ingredient)
      )
    )

  /* CARA MEMASAK */

  translatedInstructions.value =
    await Promise.all(
      item.instructions.map(
        async instruction => {

          let translated =
            await translateTextOnline(
              instruction
            )

          if (!translated) {

            translated =
              translateInstructionLocal(
                instruction
              )

          } else {

            translated =
              sanitizeInstructionIndonesian(
                translated,
                instruction
              )

          }

          /*
           * Kalau masih ada kata Inggris
           * yang mencolok, gunakan penerjemah lokal.
           */

          if (
            containsEnglishCookingWords(
              translated
            )
          ) {

            translated =
              translateInstructionLocal(
                instruction
              )

          }

          /*
           * Pemeriksaan terakhir.
           */

          translated =
            sanitizeInstructionIndonesian(
              translated,
              instruction
            )

          /*
           * Kalau masih terlalu banyak bahasa Inggris,
           * gunakan kalimat Indonesia aman.
           */

          if (
            containsEnglishCookingWords(
              translated
            )
          ) {

            translated =
              createSafeInstruction(
                instruction
              )

          }

          return translated
        }
      )
    )
}

/* =========================================================
   ONLINE TRANSLATOR
========================================================= */

async function translateTextOnline(
  text: string
): Promise<string> {

  try {

    if (!text || !text.trim()) {
      return ''
    }

    const url =
      `${TRANSLATE_API}?q=${encodeURIComponent(text)}&langpair=en|id`

    const response =
      await fetch(url)

    if (!response.ok) {
      return ''
    }

    const data =
      await response.json()

    const result =
      data?.responseData?.translatedText

    if (!result) {
      return ''
    }

    return cleanIndonesianText(result)

  } catch (err) {

    console.warn(
      'Penerjemah online gagal:',
      err
    )

    return ''
  }
}

/* =========================================================
   CEK KATA INGGRIS PADA CARA MEMASAK
========================================================= */

function containsEnglishCookingWords(
  text: string
): boolean {

  const words = [
    'preheat',
    'stir',
    'stirring',
    'bake',
    'baked',
    'baking',
    'cook',
    'cooked',
    'cooking',
    'mix',
    'mixed',
    'mixing',
    'add',
    'added',
    'remove',
    'removed',
    'pour',
    'poured',
    'place',
    'placed',
    'heat',
    'heated',
    'fry',
    'fried',
    'frying',
    'boil',
    'boiled',
    'simmer',
    'season',
    'serve',
    'served',
    'combine',
    'combined',
    'slice',
    'sliced',
    'chop',
    'chopped',
    'mince',
    'minced',
    'until',
    'then',
    'finally',
    'first',
    'next',
    'with',
    'into',
    'bowl',
    'pan',
    'wok',
    'pot'
  ]

  const lower =
    text.toLowerCase()

  return words.some(word =>
    new RegExp(`\\b${word}\\b`, 'i')
      .test(lower)
  )
}

/* =========================================================
   PEMBERSIH BAHASA INDONESIA
========================================================= */

function sanitizeInstructionIndonesian(
  text: string,
  original = ''
): string {

  if (!text) {
    return translateInstructionLocal(
      original
    )
  }

  let result = text

  const replacements: Record<string, string> = {

    'preheat the oven':
      'panaskan oven',

    'preheat oven':
      'panaskan oven',

    'remove from heat':
      'angkat dari kompor',

    'remove from the heat':
      'angkat dari kompor',

    'stir continuously':
      'aduk terus-menerus',

    'stir well':
      'aduk hingga rata',

    'stir until':
      'aduk hingga',

    'mix well':
      'campurkan hingga rata',

    'mix until':
      'campurkan hingga',

    'combine all':
      'campurkan semua',

    'combine':
      'campurkan',

    'season with':
      'bumbui dengan',

    'serve immediately':
      'sajikan segera',

    'serve warm':
      'sajikan selagi hangat',

    'serve hot':
      'sajikan selagi hangat',

    'bake until':
      'panggang hingga',

    'bake for':
      'panggang selama',

    'cook until':
      'masak hingga',

    'cook for':
      'masak selama',

    'boil until':
      'rebus hingga',

    'fry until':
      'goreng hingga',

    'simmer until':
      'masak dengan api kecil hingga',

    'add the':
      'tambahkan',

    'add':
      'tambahkan',

    'pour the':
      'tuangkan',

    'pour':
      'tuangkan',

    'place the':
      'letakkan',

    'place':
      'letakkan',

    'remove the':
      'angkat',

    'remove':
      'angkat',

    'stir':
      'aduk',

    'mix':
      'campurkan',

    'bake':
      'panggang',

    'cook':
      'masak',

    'boil':
      'rebus',

    'fry':
      'goreng',

    'heat':
      'panaskan',

    'season':
      'bumbui',

    'serve':
      'sajikan',

    'slice':
      'iris',

    'sliced':
      'diiris',

    'chop':
      'potong',

    'chopped':
      'dicincang',

    'mince':
      'cincang',

    'minced':
      'dicincang',

    'until':
      'hingga',

    'then':
      'kemudian',

    'finally':
      'terakhir',

    'first':
      'pertama',

    'next':
      'selanjutnya',

    'with':
      'dengan',

    'into':
      'ke dalam',

    'bowl':
      'mangkuk',

    'pan':
      'wajan',

    'wok':
      'wajan',

    'pot':
      'panci',

    'the':
      '',

    'and':
      'dan'

  }

  /*
   * Ganti frasa yang lebih panjang terlebih dahulu.
   */

  const sortedKeys =
    Object.keys(replacements)
      .sort(
        (a, b) =>
          b.length - a.length
      )

  for (const key of sortedKeys) {

    const value =
      replacements[key]

    const regex =
      new RegExp(
        `\\b${escapeRegex(key)}\\b`,
        'gi'
      )

    result =
      result.replace(
        regex,
        value
      )
  }

  /*
   * Bersihkan spasi.
   */

  result =
    result
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.])/g, '$1')
      .trim()

  /*
   * Huruf pertama kapital.
   */

  result =
    capitalize(result)

  return result
}

/* =========================================================
   ESCAPE REGEX
========================================================= */

function escapeRegex(
  value: string
): string {

  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  )
}

/* =========================================================
   PENERJEMAH CARA MEMASAK LOKAL
========================================================= */

function translateInstructionLocal(
  instruction: string
): string {

  const original =
    instruction.toLowerCase()

  let result =
    instruction

  const phrases: Record<string, string> = {

    'in a bowl':
      'dalam sebuah mangkuk',

    'in the bowl':
      'dalam mangkuk',

    'on medium heat':
      'dengan api sedang',

    'over medium heat':
      'dengan api sedang',

    'on low heat':
      'dengan api kecil',

    'over low heat':
      'dengan api kecil',

    'on high heat':
      'dengan api besar',

    'over high heat':
      'dengan api besar',

    'mix well':
      'aduk hingga rata',

    'stir well':
      'aduk hingga rata',

    'stir continuously':
      'aduk terus-menerus',

    'until browned':
      'hingga kecokelatan',

    'until fragrant':
      'hingga harum',

    'until cooked':
      'hingga matang',

    'until tender':
      'hingga empuk',

    'until combined':
      'hingga tercampur rata',

    'remove from heat':
      'angkat dari kompor',

    'remove from the heat':
      'angkat dari kompor',

    'let cool':
      'biarkan hingga dingin',

    'set aside':
      'sisihkan',

    'serve immediately':
      'sajikan segera',

    'serve warm':
      'sajikan selagi hangat',

    'preheat the oven':
      'panaskan oven',

    'preheat oven':
      'panaskan oven',

    'bake until':
      'panggang hingga',

    'cook until':
      'masak hingga',

    'boil until':
      'rebus hingga',

    'fry until':
      'goreng hingga',

    'season with':
      'bumbui dengan',

    'combine all ingredients':
      'campurkan semua bahan',

    'thinly sliced':
      'diiris tipis',

    'finely chopped':
      'dicincang halus',

    'finely minced':
      'dicincang halus',

    'roughly chopped':
      'dipotong kasar'
  }

  const sortedPhrases =
    Object.keys(phrases)
      .sort(
        (a, b) =>
          b.length - a.length
      )

  for (const phrase of sortedPhrases) {

    const regex =
      new RegExp(
        escapeRegex(phrase),
        'gi'
      )

    result =
      result.replace(
        regex,
        phrases[phrase]
      )
  }

  /*
   * Terjemahan kata.
   */

  const words: Record<string, string> = {

    'beef': 'daging sapi',
    'chicken': 'ayam',
    'pork': 'daging babi',
    'shrimp': 'udang',
    'prawn': 'udang',
    'fish': 'ikan',
    'meat': 'daging',

    'broccoli': 'brokoli',
    'carrot': 'wortel',
    'carrots': 'wortel',
    'potato': 'kentang',
    'potatoes': 'kentang',

    'onion': 'bawang bombai',
    'onions': 'bawang bombai',

    'garlic': 'bawang putih',
    'ginger': 'jahe',

    'pepper': 'lada',
    'salt': 'garam',
    'sugar': 'gula',

    'water': 'air',
    'oil': 'minyak',

    'sauce': 'saus',
    'tomato': 'tomat',
    'cheese': 'keju',
    'rice': 'nasi',
    'flour': 'tepung',
    'milk': 'susu',
    'butter': 'mentega',
    'egg': 'telur',
    'eggs': 'telur',

    'add': 'tambahkan',
    'added': 'ditambahkan',

    'cook': 'masak',
    'cooked': 'matang',

    'stir': 'aduk',
    'stirring': 'mengaduk',

    'mix': 'campurkan',
    'mixed': 'tercampur',

    'pour': 'tuangkan',
    'poured': 'dituangkan',

    'place': 'letakkan',
    'placed': 'diletakkan',

    'remove': 'angkat',
    'removed': 'diangkat',

    'heat': 'panaskan',
    'heated': 'dipanaskan',

    'fry': 'goreng',
    'fried': 'digoreng',

    'boil': 'rebus',
    'boiled': 'direbus',

    'bake': 'panggang',
    'baked': 'dipanggang',

    'simmer': 'masak dengan api kecil',

    'season': 'bumbui',

    'serve': 'sajikan',
    'served': 'disajikan',

    'slice': 'iris',
    'sliced': 'diiris',

    'chop': 'potong',
    'chopped': 'dicincang',

    'mince': 'cincang',
    'minced': 'dicincang',

    'until': 'hingga',
    'then': 'kemudian',
    'finally': 'terakhir',

    'first': 'pertama',
    'next': 'selanjutnya',

    'with': 'dengan',
    'into': 'ke dalam',

    'bowl': 'mangkuk',
    'pan': 'wajan',
    'wok': 'wajan',
    'pot': 'panci',
    'oven': 'oven',

    'hot': 'panas',
    'warm': 'hangat',
    'fresh': 'segar',

    'finely': 'halus',
    'slowly': 'perlahan',
    'carefully': 'dengan hati-hati'
  }

  const sortedWords =
    Object.keys(words)
      .sort(
        (a, b) =>
          b.length - a.length
      )

  for (const word of sortedWords) {

    const regex =
      new RegExp(
        `\\b${escapeRegex(word)}\\b`,
        'gi'
      )

    result =
      result.replace(
        regex,
        words[word]
      )
  }

  /*
   * Hapus kata Inggris umum yang masih tersisa.
   */

  result =
    result
      .replace(/\bthe\b/gi, '')
      .replace(/\bof\b/gi, '')
      .replace(/\bto\b/gi, '')
      .replace(/\band\b/gi, 'dan')

  /*
   * Bersihkan spasi.
   */

  result =
    result
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.])/g, '$1')
      .trim()

  /*
   * Kalau masih sangat sulit diterjemahkan,
   * gunakan kalimat Indonesia yang aman.
   */

  if (
    containsEnglishCookingWords(
      result
    )
  ) {

    return createSafeInstruction(
      instruction
    )
  }

  return capitalize(result)
}

/* =========================================================
   KALIMAT AMAN BAHASA INDONESIA
========================================================= */

function createSafeInstruction(
  instruction: string
): string {

  const text =
    instruction.toLowerCase()

  if (
    text.includes('mix') ||
    text.includes('combine')
  ) {

    return 'Campurkan semua bahan sesuai urutan yang tercantum, lalu aduk hingga rata.'
  }

  if (
    text.includes('stir') ||
    text.includes('saute') ||
    text.includes('sauté')
  ) {

    return 'Tumis dan aduk bahan hingga tercampur rata serta matang.'
  }

  if (
    text.includes('cook')
  ) {

    return 'Masak bahan hingga matang dan tercampur dengan baik.'
  }

  if (
    text.includes('remove')
  ) {

    return 'Angkat bahan dari wajan atau kompor setelah selesai dimasak.'
  }

  if (
    text.includes('serve')
  ) {

    return 'Sajikan hidangan selagi hangat.'
  }

  if (
    text.includes('bake') ||
    text.includes('oven')
  ) {

    return 'Panggang bahan di dalam oven hingga matang.'
  }

  if (
    text.includes('boil')
  ) {

    return 'Rebus bahan hingga matang sesuai kebutuhan.'
  }

  if (
    text.includes('slice') ||
    text.includes('chop') ||
    text.includes('cut')
  ) {

    return 'Potong atau iris bahan sesuai kebutuhan.'
  }

  if (
    text.includes('add')
  ) {

    return 'Tambahkan bahan sesuai urutan yang tercantum, lalu aduk hingga rata.'
  }

  if (
    text.includes('pour')
  ) {

    return 'Tuangkan bahan secara perlahan, lalu aduk hingga tercampur rata.'
  }

  if (
    text.includes('season')
  ) {

    return 'Bumbui bahan sesuai selera, kemudian aduk hingga rata.'
  }

  return 'Lakukan langkah memasak sesuai urutan hingga bahan matang dan siap disajikan.'
}

/* =========================================================
   TERJEMAHAN BAHAN
========================================================= */

async function translateIngredient(
  ingredient: string
): Promise<string> {

  const online =
    await translateTextOnline(
      ingredient
    )

  if (
    online &&
    !containsEnglishIngredientWords(
      online
    )
  ) {

    return capitalize(
      cleanIndonesianText(
        online
      )
    )
  }

  return capitalize(
    translateIngredientLocal(
      ingredient
    )
  )
}

/* =========================================================
   CEK INGREDIENT INGGRIS
========================================================= */

function containsEnglishIngredientWords(
  text: string
): boolean {

  const words = [
    'beef',
    'chicken',
    'shrimp',
    'prawn',
    'fish',
    'broccoli',
    'carrot',
    'potato',
    'onion',
    'garlic',
    'ginger',
    'pepper',
    'salt',
    'sugar',
    'water',
    'oil',
    'sauce',
    'tomato',
    'cheese',
    'rice',
    'flour',
    'milk',
    'butter',
    'egg',
    'chopped',
    'sliced',
    'minced',
    'fresh',
    'optional',
    'to taste'
  ]

  const lower =
    text.toLowerCase()

  return words.some(word =>
    new RegExp(
      `\\b${escapeRegex(word)}\\b`,
      'i'
    ).test(lower)
  )
}

/* =========================================================
   INGREDIENT LOCAL
========================================================= */

function translateIngredientLocal(
  ingredient: string
): string {

  let result =
    ingredient

  const dictionary: Record<string, string> = {

    'ground beef':
      'daging sapi giling',

    'beef':
      'daging sapi',

    'chicken breast':
      'dada ayam',

    'chicken':
      'ayam',

    'shrimp':
      'udang',

    'prawn':
      'udang',

    'fish':
      'ikan',

    'broccoli':
      'brokoli',

    'carrots':
      'wortel',

    'carrot':
      'wortel',

    'potatoes':
      'kentang',

    'potato':
      'kentang',

    'onions':
      'bawang bombai',

    'onion':
      'bawang bombai',

    'garlic':
      'bawang putih',

    'ginger':
      'jahe',

    'black pepper':
      'lada hitam',

    'pepper':
      'lada',

    'salt':
      'garam',

    'sugar':
      'gula',

    'water':
      'air',

    'vegetable oil':
      'minyak sayur',

    'olive oil':
      'minyak zaitun',

    'oil':
      'minyak',

    'soy sauce':
      'kecap asin',

    'tomato sauce':
      'saus tomat',

    'sauce':
      'saus',

    'tomato':
      'tomat',

    'cheese':
      'keju',

    'parmesan cheese':
      'keju parmesan',

    'rice':
      'beras atau nasi',

    'flour':
      'tepung',

    'milk':
      'susu',

    'butter':
      'mentega',

    'egg':
      'telur',

    'eggs':
      'telur',

    'fresh':
      'segar',

    'chopped':
      'dicincang',

    'sliced':
      'diiris',

    'minced':
      'dicincang',

    'optional':
      'opsional',

    'to taste':
      'secukupnya',

    'as needed':
      'sesuai kebutuhan'
  }

  const keys =
    Object.keys(dictionary)
      .sort(
        (a, b) =>
          b.length - a.length
      )

  for (const key of keys) {

    const regex =
      new RegExp(
        escapeRegex(key),
        'gi'
      )

    result =
      result.replace(
        regex,
        dictionary[key]
      )
  }

  result =
    result
      .replace(/\bto taste\b/gi, 'secukupnya')
      .replace(/\bas needed\b/gi, 'sesuai kebutuhan')
      .replace(/\boptional\b/gi, 'opsional')
      .replace(/\s+/g, ' ')
      .trim()

  return result
}

/* =========================================================
   TERJEMAHAN KATEGORI
========================================================= */

function translateCategory(
  item: ApiRecipe
): string {

  const value =
    (
      item.tags?.[0] ||
      item.cuisine ||
      'Recipe'
    ).toLowerCase()

  const dictionary: Record<string, string> = {

    asian: 'MASAKAN ASIA',
    american: 'MASAKAN AMERIKA',
    italian: 'MASAKAN ITALIA',
    japanese: 'MASAKAN JEPANG',
    korean: 'MASAKAN KOREA',
    indian: 'MASAKAN INDIA',
    mexican: 'MASAKAN MEKSIKO',
    thai: 'MASAKAN THAILAND',
    chinese: 'MASAKAN TIONGKOK',

    pizza: 'PIZZA',
    pasta: 'PASTA',
    chicken: 'AYAM',
    beef: 'DAGING SAPI',
    seafood: 'SEAFOOD',
    shrimp: 'UDANG',
    dessert: 'DESSERT',
    vegetarian: 'VEGETARIAN',
    soup: 'SUP',

    breakfast: 'SARAPAN',
    lunch: 'MAKAN SIANG',
    dinner: 'MAKAN MALAM',

    rice: 'NASI',
    ramen: 'RAMEN'
  }

  return (
    dictionary[value] ||
    value.toUpperCase()
  )
}

/* =========================================================
   TERJEMAHAN DIFFICULTY
========================================================= */

function translateDifficulty(
  difficulty: string
): string {

  const value =
    difficulty.toLowerCase()

  if (value === 'easy') {
    return 'Mudah'
  }

  if (value === 'medium') {
    return 'Sedang'
  }

  if (value === 'hard') {
    return 'Sulit'
  }

  return difficulty
}

/* =========================================================
   DESKRIPSI INDONESIA
========================================================= */

function createDescription(
  item: ApiRecipe
): string {

  const name =
    item.name.toLowerCase()

  if (
    name.includes('beef') &&
    name.includes('broccoli')
  ) {

    return 'Hidangan daging sapi dan brokoli yang gurih dengan perpaduan bumbu yang lezat dan cocok dinikmati bersama nasi.'
  }

  if (
    name.includes('chicken')
  ) {

    return 'Hidangan ayam yang lezat dengan perpaduan bumbu yang menggugah selera dan cocok untuk dinikmati bersama keluarga.'
  }

  if (
    name.includes('pizza')
  ) {

    return 'Pizza dengan perpaduan bahan dan topping yang lezat, cocok disajikan sebagai hidangan bersama keluarga.'
  }

  if (
    name.includes('pasta')
  ) {

    return 'Hidangan pasta yang praktis dengan perpaduan bahan dan saus yang menghasilkan rasa yang lezat.'
  }

  if (
    name.includes('soup')
  ) {

    return 'Hidangan sup hangat dengan perpaduan bahan yang lezat dan cocok dinikmati saat santai bersama keluarga.'
  }

  if (
    name.includes('shrimp') ||
    name.includes('prawn')
  ) {

    return 'Hidangan udang dengan bumbu yang lezat dan aroma yang menggugah selera.'
  }

  return `Resep ${item.name} yang praktis dan lezat untuk dibuat di rumah. Ikuti langkah-langkah memasaknya dan nikmati hidangan bersama keluarga.`
}

/* =========================================================
   CLEAN TEXT
========================================================= */

function cleanIndonesianText(
  text: string
): string {

  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim()
}

/* =========================================================
   CAPITALIZE
========================================================= */

function capitalize(
  text: string
): string {

  if (!text) {
    return ''
  }

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  )
}

/* =========================================================
   FAVORITE
========================================================= */

function checkFavorite(
  item: ApiRecipe
) {

  try {

    const favorites =
      JSON.parse(
        localStorage.getItem(
          'recipebox_favorites'
        ) || '[]'
      )

    isFavorite.value =
      favorites.some(
        (fav: any) =>
          Number(fav.id) ===
          Number(item.id)
      )

  } catch {

    isFavorite.value = false

  }
}

/* =========================================================
   TOGGLE FAVORITE
========================================================= */

function toggleFavorite() {

  if (!recipe.value) {
    return
  }

  const key =
    'recipebox_favorites'

  let favorites: any[] = []

  try {

    favorites =
      JSON.parse(
        localStorage.getItem(key) ||
        '[]'
      )

  } catch {

    favorites = []

  }

  const index =
    favorites.findIndex(
      item =>
        Number(item.id) ===
        Number(recipe.value!.id)
    )

  if (index >= 0) {

    favorites.splice(index, 1)

    isFavorite.value = false

  } else {

    favorites.push({
      id: recipe.value.id,
      name: translatedName.value,
      image: recipe.value.image,
      category: translatedCategory.value,
      description:
        translatedDescription.value,
      ingredients:
        translatedIngredients.value,
      instructions:
        translatedInstructions.value,
      servings:
        recipe.value.servings,
      difficulty:
        translatedDifficulty.value,
      totalTime:
        totalTime.value
    })

    isFavorite.value = true
  }

  localStorage.setItem(
    key,
    JSON.stringify(favorites)
  )
}

/* =========================================================
   SHOPPING LIST
========================================================= */

function addIngredientsToShoppingList() {

  if (!recipe.value) {
    return
  }

  const key =
    'recipebox_shopping_list'

  let shoppingList: any[] = []

  try {

    shoppingList =
      JSON.parse(
        localStorage.getItem(key) ||
        '[]'
      )

  } catch {

    shoppingList = []

  }

  translatedIngredients.value.forEach(
    ingredient => {

      const exists =
        shoppingList.some(
          item =>
            item.name === ingredient
        )

      if (!exists) {

        shoppingList.push({
          id:
            Date.now() +
            Math.random(),

          name: ingredient,

          checked: false,

          recipe:
            translatedName.value
        })

      }

    }
  )

  localStorage.setItem(
    key,
    JSON.stringify(shoppingList)
  )

  alert(
    'Bahan berhasil ditambahkan ke daftar belanja.'
  )
}

/* =========================================================
   IMAGE FALLBACK
========================================================= */

function handleImageError(
  event: Event
) {

  const image =
    event.target as HTMLImageElement

  image.src =
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'
}

/* =========================================================
   BACK
========================================================= */

function goBack() {

  if (window.history.length > 1) {

    router.back()

  } else {

    router.push('/home')

  }
}

/* =========================================================
   WATCH ROUTE
========================================================= */

watch(
  () => route.query.id,
  () => {

    loadRecipe()

  }
)

/* =========================================================
   INITIAL LOAD
========================================================= */

onMounted(() => {

  loadRecipe()

})

</script>

<style scoped>

/* =========================================================
   GLOBAL
========================================================= */

ion-content {
  --background: #fffaf5;
}

ion-toolbar {
  --background: #ffffff;
  --border-width: 0;
}

ion-title {
  padding-left: 0;
}

/* =========================================================
   HEADER
========================================================= */

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

.detail-header ion-button {
  --color: #333;
}

/* =========================================================
   LOADING
========================================================= */

.loading-container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px;
}

.loading-container ion-spinner {
  width: 45px;
  height: 45px;
  color: #ff7117;
}

.loading-container h3 {
  margin-top: 20px;
  margin-bottom: 5px;
  color: #272727;
}

.loading-container p {
  margin: 0;
  color: #888;
}

/* =========================================================
   ERROR
========================================================= */

.error-container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px;
}

.error-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #fff0eb;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-icon ion-icon {
  font-size: 36px;
  color: #ff7117;
}

.error-container h2 {
  margin-bottom: 8px;
}

.error-container p {
  color: #777;
  line-height: 1.6;
}

.error-container ion-button {
  --background: #ff7117;
  --border-radius: 14px;
}

/* =========================================================
   CONTENT
========================================================= */

.page-content {
  max-width: 900px;
  margin: 0 auto;
}

/* =========================================================
   HERO
========================================================= */

.hero-image-wrapper {
  position: relative;
  width: 100%;
  height: 390px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,0.02),
      rgba(0,0,0,0.38)
    );
}

.floating-favorite {
  position: absolute;
  top: 18px;
  right: 18px;

  width: 48px;
  height: 48px;

  border-radius: 50%;

  background: rgba(255,255,255,0.95);

  border: none;

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow:
    0 5px 18px rgba(0,0,0,0.15);
}

.floating-favorite ion-icon {
  font-size: 25px;
  color: #555;
}

.activeHeart {
  color: #ff4f6d !important;
}

.hero-category {
  position: absolute;
  bottom: 20px;
  left: 20px;

  padding: 8px 14px;

  background: rgba(255,255,255,0.95);

  border-radius: 20px;

  color: #ff7117;

  font-size: 12px;
  font-weight: 800;
}

/* =========================================================
   HEADING
========================================================= */

.recipe-heading {
  padding: 25px 22px 15px;
}

.recipe-heading h1 {
  margin: 0;

  font-size: 31px;
  line-height: 1.2;

  font-weight: 800;

  color: #222;
}

.description {
  margin-top: 12px;

  color: #777;

  line-height: 1.65;

  font-size: 14px;
}

/* =========================================================
   INFO
========================================================= */

.info-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 12px;

  margin-top: 22px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 9px;

  background: #ffffff;

  border-radius: 16px;

  padding: 13px;

  box-shadow:
    0 4px 16px rgba(0,0,0,0.04);
}

.info-icon {
  width: 37px;
  height: 37px;

  flex-shrink: 0;

  border-radius: 12px;

  background: #fff1e8;

  display: flex;
  justify-content: center;
  align-items: center;
}

.info-icon ion-icon {
  color: #ff7117;
  font-size: 19px;
}

.info-item small {
  display: block;

  color: #999;

  font-size: 10px;

  margin-bottom: 3px;
}

.info-item strong {
  display: block;

  color: #333;

  font-size: 12px;
}

/* =========================================================
   SECTION
========================================================= */

.content-section {
  padding: 18px 22px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-bottom: 17px;
}

.section-icon {
  width: 44px;
  height: 44px;

  border-radius: 14px;

  background: #ff7117;

  display: flex;
  justify-content: center;
  align-items: center;
}

.section-icon ion-icon {
  color: white;
  font-size: 23px;
}

.section-title h2 {
  margin: 0;

  font-size: 20px;

  font-weight: 800;

  color: #222;
}

.section-title p {
  margin: 3px 0 0;

  color: #999;

  font-size: 12px;
}

/* =========================================================
   INGREDIENTS
========================================================= */

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 13px 15px;

  background: white;

  border-radius: 13px;

  box-shadow:
    0 3px 12px rgba(0,0,0,0.035);
}

.ingredient-number {
  width: 27px;
  height: 27px;

  flex-shrink: 0;

  border-radius: 9px;

  background: #fff0e6;

  color: #ff7117;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 11px;

  font-weight: 800;
}

.ingredient-item span {
  color: #444;

  font-size: 14px;

  line-height: 1.45;
}

/* =========================================================
   TRANSLATION INFO
========================================================= */

.translation-info {
  display: flex;

  gap: 11px;

  align-items: flex-start;

  padding: 14px;

  margin-bottom: 18px;

  background: #fff4ec;

  border-radius: 15px;

  border: 1px solid #ffe0cc;
}

.translation-info > ion-icon {
  color: #ff7117;

  font-size: 22px;

  margin-top: 2px;
}

.translation-info strong {
  color: #333;

  font-size: 13px;
}

.translation-info p {
  margin: 3px 0 0;

  color: #777;

  font-size: 12px;

  line-height: 1.5;
}

/* =========================================================
   STEPS
========================================================= */

.steps-list {
  display: flex;
  flex-direction: column;

  gap: 15px;
}

.step-item {
  display: flex;

  gap: 14px;

  align-items: flex-start;

  background: white;

  border-radius: 17px;

  padding: 17px;

  box-shadow:
    0 4px 15px rgba(0,0,0,0.04);
}

.step-number {
  width: 35px;
  height: 35px;

  flex-shrink: 0;

  border-radius: 50%;

  background: #ff7117;

  color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 13px;

  font-weight: 800;
}

.step-content {
  flex: 1;
}

.step-content p {
  margin: 0;

  color: #444;

  font-size: 14px;

  line-height: 1.65;
}

/* =========================================================
   ACTION
========================================================= */

.action-section {
  padding: 15px 22px 0;
}

.shopping-button {
  --background: #ff7117;
  --border-radius: 15px;

  height: 52px;

  font-weight: 700;

  margin-bottom: 12px;
}

.favorite-button {
  --color: #ff7117;
  --border-color: #ff7117;
  --border-radius: 15px;

  height: 50px;

  font-weight: 700;
}

/* =========================================================
   BOTTOM
========================================================= */

.bottom-space {
  height: 35px;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

  .hero-image-wrapper {
    height: 300px;
  }

  .recipe-heading h1 {
    font-size: 26px;
  }

  .info-grid {
    gap: 8px;
  }

  .info-item {
    padding: 10px 8px;
    gap: 6px;
  }

  .info-icon {
    width: 32px;
    height: 32px;
  }

  .info-item small {
    font-size: 9px;
  }

  .info-item strong {
    font-size: 10px;
  }

}

</style>