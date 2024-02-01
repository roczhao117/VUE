import {
  createRouter,
  createWebHistory
} from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';


const routes = [{
  path: '/',
  name: 'Login',
  component: Login,
  hidden: true
}, {
  path: '/Home',
  name: 'Home',
  component: Home,
  hidden: true
}, ];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes

})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next()
  } else {
    //  console.log(this.$store.getters.token)
    if (localStorage.getItem("token")) {
      next()
    } else {
      next("/");
    }
  }
});


export default router