<template>
  <ion-page>
    <ion-content class="page-content">

      <!-- HEADER -->
      <div class="header">
        <div>
          <div class="brand">
            <span class="logo">🍊</span>
            <span>RecipeBox</span>
          </div>

          <p class="subtitle">
            Daftar belanja bahan masakanmu
          </p>
        </div>

        <div class="leaf">🌿</div>
      </div>

      <!-- TITLE -->
      <div class="title-section">
        <h1>Shopping List 🛒</h1>
        <p>Catat bahan yang perlu kamu beli</p>
      </div>

      <!-- ADD ITEM -->
      <div class="add-box">

        <input
          v-model="newItem"
          type="text"
          placeholder="Tambah bahan..."
          @keyup.enter="addItem"
        />

        <button @click="addItem">
          +
        </button>

      </div>

      <!-- LIST -->
      <div class="list-container">

        <div
          v-for="item in shoppingList"
          :key="item.id"
          class="shopping-item"
          :class="{ checked: item.checked }"
        >

          <!-- CHECK -->
          <div
            class="check-circle"
            @click="toggleItem(item.id)"
          >
            <span v-if="item.checked">
              ✓
            </span>
          </div>

          <!-- NAME -->
          <span class="item-name">
            {{ item.name }}
          </span>

          <!-- DELETE -->
          <button
            class="delete-button"
            @click="deleteItem(item.id)"
          >
            🗑️
          </button>

        </div>

        <!-- EMPTY STATE -->
        <div
          v-if="shoppingList.length === 0"
          class="empty-state"
        >

          <div class="empty-icon">
            🛒
          </div>

          <h2>
            Belum ada bahan
          </h2>

          <p>
            Tambahkan bahan yang ingin kamu beli
            untuk resep favoritmu.
          </p>

          <div class="food-decoration">
            🥕 🍅 🥬
          </div>

        </div>

      </div>

      <!-- BOTTOM NAVIGATION -->
      <div class="bottom-nav">

        <div
          class="nav-item"
          @click="goTo('/home')"
        >
          <span>🏠</span>
          <small>Home</small>
        </div>

        <div
          class="nav-item"
          @click="goTo('/search')"
        >
          <span>🔍</span>
          <small>Search</small>
        </div>

        <div
          class="nav-item"
          @click="goTo('/favorite')"
        >
          <span>❤️</span>
          <small>Favorit</small>
        </div>

        <div class="nav-item active">
          <span>🛒</span>
          <small>Shopping</small>
        </div>

        <div
          class="nav-item"
          @click="goTo('/profile')"
        >
          <span>👤</span>
          <small>Profil</small>
        </div>

      </div>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import {
  IonPage,
  IonContent
} from '@ionic/vue';


const router = useRouter();


// ==============================
// TYPE SHOPPING ITEM
// ==============================

interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
}


// ==============================
// DATA
// ==============================

const newItem = ref('');

const shoppingList = ref<ShoppingItem[]>([]);


// ==============================
// LOAD DATA
// ==============================

const loadShoppingList = () => {

  const savedList =
    localStorage.getItem(
      'recipebox_shopping_list'
    );

  if (savedList) {

    shoppingList.value =
      JSON.parse(savedList);

  } else {

    shoppingList.value = [];

  }

};


// ==============================
// SAVE DATA
// ==============================

const saveShoppingList = () => {

  localStorage.setItem(
    'recipebox_shopping_list',
    JSON.stringify(
      shoppingList.value
    )
  );

};


// ==============================
// ADD ITEM
// ==============================

const addItem = () => {

  const name =
    newItem.value.trim();

  if (!name) {
    return;
  }

  shoppingList.value.push({

    id: Date.now(),

    name: name,

    checked: false

  });

  saveShoppingList();

  newItem.value = '';

};


// ==============================
// CHECK ITEM
// ==============================

const toggleItem = (id: number) => {

  const item =
    shoppingList.value.find(
      item => item.id === id
    );

  if (item) {

    item.checked =
      !item.checked;

    saveShoppingList();

  }

};


// ==============================
// DELETE ITEM
// ==============================

const deleteItem = (id: number) => {

  shoppingList.value =
    shoppingList.value.filter(
      item => item.id !== id
    );

  saveShoppingList();

};


// ==============================
// NAVIGATION
// ==============================

const goTo = (path: string) => {

  router.push(path);

};


// ==============================
// LOAD WHEN PAGE OPENED
// ==============================

onMounted(() => {

  loadShoppingList();

});

</script>


<style scoped>

.page-content {
  --background: #fffaf2;
  background: #fffaf2;

  min-height: 100vh;

  padding-bottom: 90px;
}


/* =========================
   HEADER
========================= */

.header {

  padding: 25px 22px 10px;

  display: flex;

  justify-content: space-between;

  align-items: flex-start;

}

.brand {

  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 22px;

  font-weight: 800;

  color: #f27a21;

}

.logo {
  font-size: 25px;
}

.subtitle {

  margin: 5px 0 0;

  font-size: 13px;

  color: #777;

}

.leaf {

  font-size: 32px;

  transform: rotate(-10deg);

}


/* =========================
   TITLE
========================= */

.title-section {

  padding: 10px 22px 18px;

}

.title-section h1 {

  margin: 0;

  font-size: 27px;

  font-weight: 800;

  color: #333;

}

.title-section p {

  margin-top: 6px;

  color: #888;

  font-size: 14px;

}


/* =========================
   ADD ITEM
========================= */

.add-box {

  margin: 0 22px 20px;

  background: white;

  border-radius: 16px;

  padding: 8px;

  display: flex;

  box-shadow:
    0 5px 18px
    rgba(0, 0, 0, 0.06);

}

.add-box input {

  flex: 1;

  border: none;

  outline: none;

  padding: 12px;

  font-size: 14px;

  background: transparent;

}

.add-box button {

  width: 45px;

  height: 45px;

  border: none;

  border-radius: 12px;

  background: #f27a21;

  color: white;

  font-size: 27px;

  font-weight: 500;

}


/* =========================
   LIST
========================= */

.list-container {

  padding: 0 22px;

}

.shopping-item {

  display: flex;

  align-items: center;

  background: white;

  padding: 15px;

  border-radius: 16px;

  margin-bottom: 12px;

  box-shadow:
    0 4px 15px
    rgba(0, 0, 0, 0.05);

}


/* CHECK CIRCLE */

.check-circle {

  width: 25px;

  height: 25px;

  min-width: 25px;

  border-radius: 50%;

  border: 2px solid #f27a21;

  display: flex;

  align-items: center;

  justify-content: center;

  color: white;

  background: white;

  margin-right: 12px;

  cursor: pointer;

}

.checked .check-circle {

  background: #f27a21;

}


/* ITEM NAME */

.item-name {

  flex: 1;

  font-size: 15px;

  color: #333;

}

.checked .item-name {

  text-decoration: line-through;

  color: #999;

}


/* DELETE */

.delete-button {

  border: none;

  background: transparent;

  font-size: 17px;

  cursor: pointer;

}


/* =========================
   EMPTY STATE
========================= */

.empty-state {

  text-align: center;

  padding: 55px 25px;

}

.empty-icon {

  font-size: 65px;

}

.empty-state h2 {

  color: #444;

  margin-bottom: 5px;

}

.empty-state p {

  color: #999;

  font-size: 14px;

  line-height: 1.6;

}

.food-decoration {

  margin-top: 18px;

  font-size: 25px;

}


/* =========================
   BOTTOM NAV
========================= */

.bottom-nav {

  position: fixed;

  bottom: 0;

  left: 0;

  right: 0;

  height: 72px;

  background: white;

  display: flex;

  justify-content: space-around;

  align-items: center;

  box-shadow:
    0 -4px 18px
    rgba(0, 0, 0, 0.08);

  z-index: 100;

}

.nav-item {

  text-align: center;

  color: #999;

  font-size: 20px;

  cursor: pointer;

}

.nav-item small {

  display: block;

  font-size: 10px;

  margin-top: 3px;

}

.nav-item.active {

  color: #f27a21;

}

.nav-item span {

  display: block;

}


/* =========================
   RESPONSIVE
========================= */

@media (min-width: 768px) {

  .header,
  .title-section,
  .add-box,
  .list-container {

    max-width: 650px;

    margin-left: auto;

    margin-right: auto;

  }

}

</style>