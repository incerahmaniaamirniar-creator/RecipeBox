import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

import HomePage from '../views/HomePage.vue';
import SearchPage from '../views/SearchPage.vue';
import CategoriesPage from '../views/CategoriesPage.vue'
import RecipeDetailPage from '../views/RecipeDetailPage.vue';
import FavoritePage from '../views/FavoritePage.vue';
import ShoppingListPage from '../views/ShoppingListPage.vue';
import ProfilePage from '../views/ProfilePage.vue';
import AIRecipePage from '../views/AIRecipePage.vue';
import AppSettingsPage from '../views/AppSettingsPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },

  { path: '/home', name: 'Home', component: HomePage },

  { path: '/search', name: 'Search', component: SearchPage },

  {
  path: '/categories',
  name: 'Categories',
  component: CategoriesPage
},

  {
    path: '/recipe-detail',
    name: 'RecipeDetail',
    component: RecipeDetailPage
  },

  {
    path: '/favorite',
    name: 'Favorite',
    component: FavoritePage
  },

  {
    path: '/shopping-list',
    name: 'ShoppingList',
    component: ShoppingListPage
  },

  {
  path: '/profile',
  name: 'Profile',
  component: ProfilePage
},

{
  path: '/ai-recipe',
  name: 'AIRecipe',
  component: AIRecipePage
},

{
  path: '/app-settings',
  name: 'AppSettings',
  component: AppSettingsPage
}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;