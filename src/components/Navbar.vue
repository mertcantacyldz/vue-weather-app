<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToWeather = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    router.push('/weather');
  } else {
    alert('Giriş yapmadınız!');
  }
};

const goToLogin = () => {
  // Burada çıkış işlemini gerçekleştirebilir ve isAuthenticated değerini 'false' olarak set edebilirsiniz
  localStorage.setItem('isAuthenticated', 'false');
  router.push('/');
};
</script>

<template>
  <div class="flex items-center justify-center bg-[#FFEECC] rounded-2xl w-[50%] h-20 relative z-20 mb-10 mt-3">
    <div class="container mx-auto flex items-center justify-center">
      <div class="mx-10">
        <button @click="goToLogin">
          <p class="relative before:absolute before:left-0 before:-bottom-1.5 before:h-1 before:w-0 hover:before:w-full before:rounded-full before:bg-navyellow before:duration-500 before:transition-all text-gray-400 font-inter font-semibold md:text-[1.70rem] hover:text-navyellow transition-all duration-500 delay-50">
            Login
          </p>
        </button>
      </div>

      <div class="mx-10">
        <button @click="goToWeather">
          <p class="relative transition-all duration-500 before:absolute before:-bottom-1.5 before:left-0 before:w-0 before:h-1 before:rounded-full before:transition-all before:duration-500 before:bg-navyellow hover:before:w-full text-gray-400 font-inter font-semibold md:text-[1.70rem] hover:text-navyellow delay-50">
            Weather
          </p>
        </button>
      </div>
    </div>

    
  </div>
</template>