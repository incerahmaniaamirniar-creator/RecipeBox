<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header class="header">
      <ion-toolbar>

        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <span class="back-icon">‹</span>
          </ion-button>
        </ion-buttons>

        <ion-title>App Settings</ion-title>

      </ion-toolbar>
    </ion-header>


    <ion-content>

      <div class="settings-page">

        <!-- INTRO -->
        <div class="settings-intro">

          <div class="settings-icon">
            ⚙️
          </div>

          <div>
            <h1>Pengaturan</h1>
            <p>Atur preferensi aplikasi RecipeBox</p>
          </div>

        </div>


        <!-- PREFERENCES -->
        <section>

          <h2>Preferences</h2>

          <div class="settings-card">

            <!-- NOTIFICATION -->
            <div class="setting-item">

              <div class="setting-icon notification">
                🔔
              </div>

              <div class="setting-text">
                <strong>Notifikasi Resep</strong>
                <span>
                  Dapatkan pengingat dan rekomendasi resep
                </span>
              </div>

              <ion-toggle
                v-model="notifications"
                @ionChange="saveSettings"
              />

            </div>


            <!-- DARK MODE -->
            <div class="setting-item">

              <div class="setting-icon dark">
                🌙
              </div>

              <div class="setting-text">
                <strong>Dark Mode</strong>
                <span>
                  Gunakan tampilan gelap
                </span>
              </div>

              <ion-toggle
                v-model="darkMode"
                @ionChange="toggleDarkMode"
              />

            </div>


            <!-- LANGUAGE -->
            <div class="setting-item">

              <div class="setting-icon language">
                🌐
              </div>

              <div class="setting-text">
                <strong>Bahasa</strong>
                <span>Bahasa aplikasi</span>
              </div>

              <select
                v-model="language"
                @change="saveSettings"
              >
                <option value="Indonesia">
                  Indonesia
                </option>

                <option value="English">
                  English
                </option>
              </select>

            </div>

          </div>

        </section>


        <!-- DATA -->
        <section>

          <h2>Data</h2>

          <div class="settings-card">

            <button
              class="setting-item button-item"
              @click="clearLocalData"
            >

              <div class="setting-icon delete">
                🗑️
              </div>

              <div class="setting-text">

                <strong>Hapus Data Lokal</strong>

                <span>
                  Hapus Favorite dan Shopping List
                </span>

              </div>

              <span class="arrow">›</span>

            </button>

          </div>

        </section>


        <!-- ABOUT -->
        <section>

          <h2>About</h2>

          <div class="settings-card">

            <button
              class="setting-item button-item"
              @click="showAbout"
            >

              <div class="setting-icon about">
                ℹ️
              </div>

              <div class="setting-text">

                <strong>Tentang RecipeBox</strong>

                <span>
                  Informasi mengenai aplikasi
                </span>

              </div>

              <span class="arrow">›</span>

            </button>


            <!-- VERSION -->
            <div class="setting-item">

              <div class="setting-icon version-icon">
                📱
              </div>

              <div class="setting-text">

                <strong>Versi Aplikasi</strong>

                <span>RecipeBox</span>

              </div>

              <span class="version">
                1.0.0
              </span>

            </div>

          </div>

        </section>


        <!-- FOOTER -->
        <div class="app-footer">

          <div class="footer-logo">
            🍳
          </div>

          <strong>RecipeBox</strong>

          <p>
            Temukan resep, simpan favorit,
            dan siapkan bahan masakanmu.
          </p>

          <small>
            Version 1.0.0
          </small>

        </div>

      </div>

    </ion-content>

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
  IonContent,
  IonButtons,
  IonButton,
  IonToggle
} from '@ionic/vue'


const router = useRouter()


/* SETTINGS */

const notifications = ref(true)

const darkMode = ref(false)

const language = ref('Indonesia')


/* LOAD SETTINGS */

const loadSettings = () => {

  const savedNotifications =
    localStorage.getItem('recipebox_notifications')

  const savedDarkMode =
    localStorage.getItem('recipebox_dark_mode')

  const savedLanguage =
    localStorage.getItem('recipebox_language')


  if (savedNotifications !== null) {
    notifications.value =
      savedNotifications === 'true'
  }


  if (savedDarkMode !== null) {
    darkMode.value =
      savedDarkMode === 'true'
  }


  if (savedLanguage) {
    language.value = savedLanguage
  }


  applyDarkMode()

}


/* SAVE SETTINGS */

const saveSettings = () => {

  localStorage.setItem(
    'recipebox_notifications',
    String(notifications.value)
  )

  localStorage.setItem(
    'recipebox_language',
    language.value
  )

}


/* DARK MODE */

const toggleDarkMode = () => {

  localStorage.setItem(
    'recipebox_dark_mode',
    String(darkMode.value)
  )

  applyDarkMode()

}


const applyDarkMode = () => {

  document.body.classList.toggle(
    'recipebox-dark',
    darkMode.value
  )

}


/* BACK */

const goBack = () => {

  router.push('/profile')

}


/* CLEAR DATA */

const clearLocalData = () => {

  const confirmDelete = window.confirm(
    'Apakah kamu yakin ingin menghapus Favorite dan Shopping List?'
  )

  if (!confirmDelete) {
    return
  }


  localStorage.removeItem(
    'recipebox_favorites'
  )

  localStorage.removeItem(
    'recipebox_shopping_list'
  )


  alert(
    'Data Favorite dan Shopping List berhasil dihapus.'
  )

}


/* ABOUT */

const showAbout = () => {

  alert(
    'RecipeBox adalah aplikasi resep yang membantu pengguna menemukan resep, menyimpan resep favorit, dan mengatur daftar bahan masakan.\n\nVersion 1.0.0'
  )

}


/* START */

onMounted(() => {

  loadSettings()

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

.header ion-title {
  font-size: 18px;
  font-weight: 800;
}

.back-icon {
  font-size: 34px;
  line-height: 1;
  color: #f27a21;
}


/* PAGE */

.settings-page {
  padding: 22px 18px 40px;
}


/* INTRO */

.settings-intro {
  display: flex;
  align-items: center;

  padding: 22px;

  border-radius: 24px;

  background: linear-gradient(
    135deg,
    #fff0e5,
    #fff8f2
  );

  box-shadow:
    0 8px 25px
    rgba(0, 0, 0, 0.06);
}


.settings-icon {
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 18px;

  background: white;

  font-size: 28px;

  box-shadow:
    0 5px 15px
    rgba(0, 0, 0, 0.07);
}


.settings-intro h1 {
  margin: 0 0 5px 15px;

  color: #292929;

  font-size: 22px;
  font-weight: 800;
}


.settings-intro p {
  margin: 0 0 0 15px;

  color: #999;

  font-size: 12px;
}


/* SECTION */

section {
  margin-top: 28px;
}


section h2 {
  margin: 0 0 12px 3px;

  color: #292929;

  font-size: 17px;
  font-weight: 800;
}


/* CARD */

.settings-card {
  overflow: hidden;

  background: white;

  border-radius: 21px;

  box-shadow:
    0 7px 20px
    rgba(0, 0, 0, 0.06);
}


/* ITEM */

.setting-item {
  width: 100%;
  min-height: 72px;

  display: flex;
  align-items: center;

  padding: 13px 15px;

  border: none;
  border-bottom: 1px solid #f1f1f1;

  background: white;

  text-align: left;
}


.setting-item:last-child {
  border-bottom: none;
}


.button-item {
  cursor: pointer;
}


/* ICON */

.setting-icon {
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  font-size: 20px;

  flex-shrink: 0;
}


.notification {
  background: #fff1e7;
}


.dark {
  background: #eeeeee;
}


.language {
  background: #eaf5ff;
}


.delete {
  background: #fff0f0;
}


.about {
  background: #eaf5ff;
}


.version-icon {
  background: #fff8df;
}


/* TEXT */

.setting-text {
  flex: 1;
  margin-left: 13px;
}


.setting-text strong {
  display: block;

  color: #333;

  font-size: 14px;
}


.setting-text span {
  display: block;

  margin-top: 4px;

  color: #999;

  font-size: 11px;

  line-height: 1.4;
}


/* TOGGLE */

ion-toggle {
  --track-background: #ddd;
  --track-background-checked: #f27a21;

  --handle-background: white;
  --handle-background-checked: white;
}


/* LANGUAGE */

.setting-item select {
  min-width: 105px;

  padding: 8px 9px;

  border: 1px solid #eee;

  border-radius: 10px;

  background: #fffaf5;

  color: #555;

  font-size: 11px;

  outline: none;
}


/* ARROW */

.arrow {
  color: #bbb;
  font-size: 27px;
}


/* VERSION */

.version {
  color: #999;

  font-size: 12px;

  white-space: nowrap;
}


/* FOOTER */

.app-footer {
  text-align: center;

  padding: 35px 20px 20px;
}


.footer-logo {
  width: 55px;
  height: 55px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0 auto 10px;

  border-radius: 17px;

  background: #fff0e5;

  font-size: 27px;
}


.app-footer strong {
  display: block;

  color: #292929;

  font-size: 17px;
}


.app-footer p {
  max-width: 270px;

  margin: 7px auto;

  color: #999;

  font-size: 11px;

  line-height: 1.5;
}


.app-footer small {
  color: #bbb;

  font-size: 10px;
}


/* DARK MODE */

:global(body.recipebox-dark) {

  background: #181818;

}


:global(body.recipebox-dark ion-content) {

  --background: #181818;

}


:global(body.recipebox-dark .header ion-toolbar) {

  --background: #181818;
  --color: white;

}


:global(body.recipebox-dark .settings-intro) {

  background: #242424;

}


:global(body.recipebox-dark .settings-intro h1) {

  color: white;

}


:global(body.recipebox-dark section h2) {

  color: white;

}


:global(body.recipebox-dark .settings-card) {

  background: #242424;

}


:global(body.recipebox-dark .setting-item) {

  background: #242424;

  border-bottom-color: #333;

}


:global(body.recipebox-dark .setting-text strong) {

  color: white;

}


:global(body.recipebox-dark .setting-text span) {

  color: #aaa;

}


:global(body.recipebox-dark .setting-item select) {

  background: #303030;

  color: white;

  border-color: #444;

}


:global(body.recipebox-dark .app-footer strong) {

  color: white;

}


:global(body.recipebox-dark .app-footer p) {

  color: #aaa;

}

</style>