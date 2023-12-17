import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Weather from '../views/Weather.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/weather',
    name: 'Weather',
    component: Weather,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;