

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');

const login = () => {
  if (username.value === 'admin' && password.value === '123') {
    localStorage.setItem('isAuthenticated', 'true');
    router.push("/weather");
    console.log("git");
  } else {
    alert('Hatalı kullanıcı adı veya şifre');
  }
};
</script>

<template>
  <div class="  grid grid-cols-1 min-h-screen ">
   
    <div class="w-full flex items-center justify-center text-[#FFEECC] text-3xl md:text-6xl font-semibold ">Weather App</div>
   
   <div class="flex  justify-center w-full p-[2%]">
    <form  class=" h-[400px]  bg-white rounded-lg md:w-[20%]  w-full flex flex-col items-center justify-center gap-5 p-9" @submit.prevent="login">
      <label for="username">Username:</label>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-2.5 " v-model="username" type="text" id="username" required>

      <label for="password">Password:</label>
      <input class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-2.5 " v-model="password" type="password" id="password" required>

      <button class=" my-[10%] w-full text-white bg-navyellow hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center " type="submit">Login</button>
    </form>
   </div>

  </div>
</template>
