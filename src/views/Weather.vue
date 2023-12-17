<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import citiesData from "../data/cities.json";

const cityData = ref([]);
const staticCities = ref([]);
const popup = ref(false);
const inputData = ref("");
const inputCity = ref("");
const apiKey = "a2af33e5a93ceb08af5a20caec94290d";
const language = ref("tr");
const fetchData = async () => {
  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${inputData.value},tr&units=metric&appid=${apiKey}&lang=${language.value}`
    );

    inputCity.value = result.data;
    console.log("geldi", inputCity.value);
  } catch (error) {
    console.error("API isteği başarısız oldu:", error);
  }
};

const initializeData = async () => {
  try {
    const [responseAnkara, responseIstanbul] = await axios.all([
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Ankara,tr&units=metric&appid=${apiKey}&lang=${language.value}`
      ),
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Istanbul,tr&units=metric&appid=${apiKey}&lang=${language.value}`
      ),
    ]);

    const requestsForStatic = [];

    // Tablo için alınan  statik şehir isimleri için for döngüsü ile veri alışı
    for (const city of citiesData.cities) {
      const request = axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},tr&units=metric&appid=${apiKey}&lang=${language.value}`
      );
      requestsForStatic.push(request);
    }

    // hızlı olması için direkt array içine değil axios.all ile  alıp array içine koyuyoruz
    const responses = await axios.all(requestsForStatic);
    staticCities.value = responses;
  
    // dil değişikliğinde veriler   sıfırlanıyor
    cityData.value = [];
    staticCities.value = [];

    
    cityData.value = [...cityData.value, responseAnkara, responseIstanbul];
    staticCities.value = [...staticCities.value, ...responses];


    
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  initializeData();
});
const changeLanguage = (newLanguage) => {
  language.value = newLanguage;

  console.log("dil", language.value)

  initializeData();

    
  fetchData()
}
console.log(inputData.value, "xxx");
const getWeatherImage = (main) => {
  switch (main) {
    case "Clear":
      return '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256"><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M11,0v3h2v-3zM4.22266,2.80859l-1.41406,1.41406l2.12109,2.12109l1.41406,-1.41406zM19.77734,2.80859l-2.12109,2.12109l1.41406,1.41406l2.12109,-2.12109zM12,5c-3.86599,0 -7,3.13401 -7,7c0,3.86599 3.13401,7 7,7c3.86599,0 7,-3.13401 7,-7c0,-3.86599 -3.13401,-7 -7,-7zM0,11v2h3v-2zM21,11v2h3v-2zM4.92969,17.65625l-2.12109,2.12109l1.41406,1.41406l2.12109,-2.12109zM19.07031,17.65625l-1.41406,1.41406l2.12109,2.12109l1.41406,-1.41406zM11,21v3h2v-3z"></path></g></g></svg>';
    case "Mist":
      return '<svg class=" w-20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" version="1.1" id="Layer_1" viewBox="0 0 512 512" xml:space="preserve"> <g> <g> <rect y="304.899" width="477.483" height="34.517"/> </g> </g> <g> <g> <rect y="419.955" width="477.483" height="34.517"/> </g> </g> <g> <g> <rect x="34.517" y="362.427" width="477.483" height="34.517"/> </g> </g> <g> <g> <path d="M391.191,207.101c0-82.607-66.966-149.573-149.573-149.573S92.045,124.494,92.045,207.101    c-41.303,0-74.786,33.484-74.786,74.786h448.719C465.978,240.585,432.494,207.101,391.191,207.101z"/> </g> </g> </svg>';
    case "Clouds":
      return '<svg class=" w-20" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 640 512"><path fill="#fcfcfc" d="M0 336c0 79.5 64.5 144 144 144H512c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"/></svg>';
    case "Rain":
      return '<svg class=" w-20" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path fill="#ffffff" d="M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96H96zM81.5 353.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6S-3.3 490.7 1.9 478.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm120 0c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm244.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6s17.8 19.3 12.6 31.5zM313.5 353.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6z"/></svg>';
    case "Drizzle ":
      return '<svg class=" w-20" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path fill="#ffffff" d="M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96H96zm-6.8 52c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L89.2 372zm160 0c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L249.2 372zm124.9 64.6L409.2 372c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3z"/></svg>';
    case "Snow":
      return '<svg class=" w-20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"" version="1.1" id="_x32_" viewBox="0 0 512 512" xml:space="preserve"> <style type="text/css"> .st0{fill:#ffffff;} </style> <g> <circle class="st0" cx="367.189" cy="366.609" r="16.298"/> <circle class="st0" cx="258.841" cy="366.609" r="16.298"/> <path class="st0" d="M150.5,382.907c8.991,0,16.29-7.299,16.29-16.299c0-8.999-7.299-16.298-16.29-16.298   c-9,0-16.298,7.299-16.298,16.298C134.202,375.608,141.501,382.907,150.5,382.907z"/> <circle class="st0" cx="319.033" cy="430.243" r="16.298"/> <circle class="st0" cx="210.692" cy="430.243" r="16.298"/> <path class="st0" d="M150.5,479.412c-9,0-16.298,7.299-16.298,16.29c0,8.999,7.298,16.298,16.298,16.298   s16.299-7.299,16.299-16.298C166.799,486.711,159.5,479.412,150.5,479.412z"/> <path class="st0" d="M258.849,479.412c-8.999,0-16.298,7.299-16.298,16.29c0,8.999,7.299,16.298,16.298,16.298   c9,0,16.299-7.299,16.299-16.298C275.147,486.711,267.848,479.412,258.849,479.412z"/> <path class="st0" d="M367.189,479.412c-8.991,0-16.29,7.299-16.29,16.29c0,8.999,7.299,16.298,16.29,16.298   c9,0,16.298-7.299,16.298-16.298C383.487,486.711,376.189,479.412,367.189,479.412z"/> <path class="st0" d="M467.916,156.439c-14.93-14.946-34.795-25.016-56.858-27.811c-1.924-34.554-16.588-65.79-39.538-88.716   C346.901,15.27,312.753-0.008,275.163,0c-35.209-0.008-67.408,13.404-91.577,35.35c-20.778,18.861-35.657,44.117-41.687,72.633   c-5.839-0.97-11.82-1.518-17.916-1.518c-29.943-0.016-57.172,12.168-76.789,31.801c-19.624,19.608-31.808,46.838-31.8,76.789   c-0.008,29.942,12.176,57.181,31.8,76.788c19.616,19.633,46.846,31.809,76.789,31.8h274.675   c27.006,0.008,51.574-10.981,69.258-28.682c17.708-17.692,28.698-42.251,28.69-69.258   C496.614,198.69,485.624,174.123,467.916,156.439z M449.85,276.89c-13.138,13.121-31.161,21.2-51.192,21.208H123.983   c-22.967-0.008-43.644-9.273-58.715-24.327c-15.054-15.071-24.312-35.74-24.328-58.716c0.016-22.976,9.273-43.654,24.328-58.724   c15.071-15.046,35.748-24.319,58.715-24.319c8.576,0,16.805,1.294,24.568,3.691l14.888,4.603l1.592-15.502   c2.862-27.868,16.059-52.669,35.741-70.535c19.69-17.866,45.71-28.714,74.391-28.723c30.614,0.008,58.218,12.375,78.29,32.43   c20.056,20.072,32.423,47.676,32.431,78.299c0,1.078-0.042,2.339-0.099,3.807l-0.49,13.744l13.487-0.514   c19.982,0.041,37.955,8.095,51.068,21.2c13.122,13.138,21.2,31.153,21.209,51.192C471.051,245.736,462.972,263.751,449.85,276.89z"/> </g> </svg>';
    case "Thunderstorm":
      return '<svg class=" w-20" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path fill="#ffffff" d="M0 224c0 53 43 96 96 96h47.2L290 202.5c17.6-14.1 42.6-14 60.2 .2s22.8 38.6 12.8 58.8L333.7 320H352h64c53 0 96-43 96-96s-43-96-96-96c-.5 0-1.1 0-1.6 0c1.1-5.2 1.6-10.5 1.6-16c0-44.2-35.8-80-80-80c-24.3 0-46.1 10.9-60.8 28C256.5 24.3 219.1 0 176 0C114.1 0 64 50.1 64 112c0 7.1 .7 14.1 1.9 20.8C27.6 145.4 0 181.5 0 224zm330.1 3.6c-5.8-4.7-14.2-4.7-20.1-.1l-160 128c-5.3 4.2-7.4 11.4-5.1 17.8s8.3 10.7 15.1 10.7h70.1L177.7 488.8c-3.4 6.7-1.6 14.9 4.3 19.6s14.2 4.7 20.1 .1l160-128c5.3-4.2 7.4-11.4 5.1-17.8s-8.3-10.7-15.1-10.7H281.9l52.4-104.8c3.4-6.7 1.6-14.9-4.2-19.6z"/></svg>';
    default:
      return null;
  }
};
// gelen description değerini büyük harf ile başlatıyoruz
const capitalizeFirstLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const openPopUp = () => {
  popup.value = true;

  fetchData();

  console.log("aç", popup.value);
};

const closePopup = () => {
  popup.value = false;
  inputCity.value= null
  inputData.value=  null
  
};
</script>

<template>
  <div class="w-full flex flex-col items-center min-h-screen py-3 px-10">
    <div class="flex flex-col items-center md:items-end w-full mb-4 ">
     <p class="font-mono font-semibold">Languages</p>
     <div class="flex justify-center gap-3 mr-3">
      <button class="bg-navyellow p-[5%] rounded-md" @click="changeLanguage('tr')" >TR</button>
      <button  class="bg-navyellow p-[5%] rounded-md" @click="changeLanguage('en')" >EN</button>
      <button   class="bg-navyellow p-[5%] rounded-md" @click="changeLanguage('ru')" >RU</button>
      <button  class="bg-navyellow p-[5%] rounded-md" @click="changeLanguage('de')" >DE</button>
     </div>
    </div>
    <div class="w-full flex items-center justify-center text-[#FFEECC] text-6xl font-semibold mb-10 text-center">
      Weather App
    </div>

    <div
      className="relative z-20 mb-10  bg-navyellow  flex items-center justify-center  py-4 w-16 hover:w-80 h-16 rounded-full transition-all delay-300 durution-500 ease-in-out group">
      <input v-model="inputData" placeholder="Şehir ismi giriniz."
        className="border-none bg-none outline-none rounded-full mx-2 w-0  group-hover:w-[80%] hidden group-hover:inline  bg-navyellow placeholder:text-white  font-medium text-white transition-all  delay-500 durution-500 ease-in-out  " />

      <button @click="openPopUp" class="">
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 512 512">
          <path
            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </button>
    </div>

    <div
      class="flex-col flex lg:flex-row justify-between items-center w-full h-full lg:h-[600px] bg-red-50 p-2 lg:p-10 rounded-lg">
      <div class="grid grid-cols-1 w-4/5 lg:w-2/4 xl:w-1/3">
        <div class="bg-ankara bg-cover mb-5 flex w-full rounded-[40px]" v-for="(data, index) in cityData" :key="index">
          <div
            class="bg-white py-10 md:gap-4 md:p-5 rounded-l-[35px] md:rounded-[35px] flex flex-col w-full items-center justify-between relative z-10">
            <p class="md:text-3xl font-mono font-semibold text-center">
              {{ data.data.name }} ,{{ data.data.sys.country }}
            </p>
            <p class="md:text-7xl font-mono font-semibold">
              {{ parseFloat(data.data.main.temp).toFixed(0) }}°C
            </p>
            <p class="md:text-3xl font-semibold text text-center">
              {{ capitalizeFirstLetter(data.data.weather[0].description) }}
            </p>
          </div>

          <div class="grid grid-cols-1 p-5 w-full gap-2">
            <div class="flex justify-center" v-html="getWeatherImage(data.data.weather[0].main)"></div>

            <div class="flex pl-[30%] gap-2">
              <svg class="w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.7639 7C16.3132 6.38625 17.1115 6 18 6C19.6569 6 21 7.34315 21 9C21 10.6569 19.6569 12 18 12H3M8.50926 4.66667C8.87548 4.2575 9.40767 4 10 4C11.1046 4 12 4.89543 12 6C12 7.10457 11.1046 8 10 8H3M11.5093 19.3333C11.8755 19.7425 12.4077 20 13 20C14.1046 20 15 19.1046 15 18C15 16.8954 14.1046 16 13 16H3"
                  stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="text-white flex items-center text-lg font-mono font-bold">
                {{ data.data.wind.speed }} m/s
              </p>
            </div>
            <div class="flex pl-[30%] gap-3">
              <svg class="w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.0066 3.25608C16.8483 2.85737 19.1331 2.8773 22.2423 3.65268C22.7781 3.78629 23.1038 4.32791 22.9699 4.86241C22.836 5.39691 22.2931 5.7219 21.7573 5.58829C18.8666 4.86742 16.9015 4.88747 15.4308 5.20587C13.9555 5.52524 12.895 6.15867 11.7715 6.84363L11.6874 6.89494C10.6044 7.55565 9.40515 8.28729 7.82073 8.55069C6.17734 8.82388 4.23602 8.58235 1.62883 7.54187C1.11607 7.33724 0.866674 6.75667 1.0718 6.24513C1.27692 5.73359 1.85889 5.48479 2.37165 5.68943C4.76435 6.6443 6.32295 6.77699 7.492 6.58265C8.67888 6.38535 9.58373 5.83916 10.7286 5.14119C11.855 4.45445 13.1694 3.6538 15.0066 3.25608Z"
                  fill="#ffffff" />
                <path
                  d="M22.2423 7.64302C19.1331 6.86765 16.8483 6.84772 15.0066 7.24642C13.1694 7.64415 11.855 8.44479 10.7286 9.13153C9.58373 9.8295 8.67888 10.3757 7.492 10.573C6.32295 10.7673 4.76435 10.6346 2.37165 9.67977C1.85889 9.47514 1.27692 9.72393 1.0718 10.2355C0.866674 10.747 1.11607 11.3276 1.62883 11.5322C4.23602 12.5727 6.17734 12.8142 7.82073 12.541C9.40515 12.2776 10.6044 11.546 11.6874 10.8853L11.7715 10.834C12.895 10.149 13.9555 9.51558 15.4308 9.19621C16.9015 8.87781 18.8666 8.85777 21.7573 9.57863C22.2931 9.71224 22.836 9.38726 22.9699 8.85275C23.1038 8.31825 22.7781 7.77663 22.2423 7.64302Z"
                  fill="#ffffff" />
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M18.9998 10.0266C18.6526 10.0266 18.3633 10.2059 18.1614 10.4772C18.0905 10.573 17.9266 10.7972 17.7089 11.111C17.4193 11.5283 17.0317 12.1082 16.6424 12.7555C16.255 13.3996 15.8553 14.128 15.5495 14.8397C15.2567 15.5213 14.9989 16.2614 14.9999 17.0117C15.0006 17.2223 15.0258 17.4339 15.0604 17.6412C15.1182 17.9872 15.2356 18.4636 15.4804 18.9521C15.7272 19.4446 16.1131 19.9674 16.7107 20.3648C17.3146 20.7664 18.0748 21 18.9998 21C19.9248 21 20.685 20.7664 21.2888 20.3648C21.8864 19.9674 22.2724 19.4446 22.5192 18.9522C22.764 18.4636 22.8815 17.9872 22.9393 17.6413C22.974 17.4337 22.9995 17.2215 22.9998 17.0107C23.0001 16.2604 22.743 15.5214 22.4501 14.8397C22.1444 14.128 21.7447 13.3996 21.3573 12.7555C20.968 12.1082 20.5803 11.5283 20.2907 11.111C20.073 10.7972 19.909 10.573 19.8382 10.4772C19.6363 10.2059 19.3469 10.0266 18.9998 10.0266ZM20.6119 15.6257C20.3552 15.0281 20.0049 14.3848 19.6423 13.782C19.4218 13.4154 19.2007 13.0702 18.9998 12.7674C18.7989 13.0702 18.5778 13.4154 18.3573 13.782C17.9948 14.3848 17.6445 15.0281 17.3878 15.6257L17.3732 15.6595C17.1965 16.0704 16.9877 16.5562 17.0001 17.0101C17.0121 17.3691 17.1088 17.7397 17.2693 18.0599C17.3974 18.3157 17.574 18.5411 17.8201 18.7048C18.06 18.8643 18.4248 19.0048 18.9998 19.0048C19.5748 19.0048 19.9396 18.8643 20.1795 18.7048C20.4256 18.5411 20.6022 18.3156 20.7304 18.0599C20.8909 17.7397 20.9876 17.3691 20.9996 17.01C21.0121 16.5563 20.8032 16.0705 20.6265 15.6597L20.6119 15.6257Z"
                  fill="#ffffff" />
                <path
                  d="M14.1296 11.5308C14.8899 11.2847 15.4728 12.076 15.1153 12.7892C14.952 13.1151 14.7683 13.3924 14.4031 13.5214C13.426 13.8666 12.6166 14.3527 11.7715 14.8679L11.6874 14.9192C10.6044 15.5799 9.40516 16.3115 7.82074 16.5749C6.17735 16.8481 4.23604 16.6066 1.62884 15.5661C1.11608 15.3615 0.866688 14.7809 1.07181 14.2694C1.27694 13.7578 1.8589 13.509 2.37167 13.7137C4.76436 14.6685 6.32297 14.8012 7.49201 14.6069C8.67889 14.4096 9.58374 13.8634 10.7286 13.1654C11.8166 12.5021 12.9363 11.9171 14.1296 11.5308Z"
                  fill="#ffffff" />
              </svg>
              <p class="flex items-center text-white text-lg font-mono font-bold">
                {{ data.data.main.humidity }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white w-4/5 lg:w-1/3 max-h-[500px] overflow-y-auto scrollable-container rounded-2xl p-4">
        <div
          class="flex lg:flex-row flex-col items-center gap-[20%] lg:h-[3rem] bg-x mb-2 rounded-md px-1 lg:px-3 hover:scale-[1.05] hover:bg-navyellow"
          v-for="(data, index) in staticCities" :key="index">
          <p class="font-mono font-semibold w-[30%] text-center">
            {{ data.data.name }} ,{{ data.data.sys.country }}
          </p>
          <p class="font-mono font-semibold">
            {{ parseFloat(data.data.main.temp).toFixed(0) }}°C
          </p>
          <p class="font-semibold text">
            {{ capitalizeFirstLetter(data.data.weather[0].description) }}
          </p>
        </div>
      </div>
    </div>
  </div>
  
      <!-- Popup alanı --> 

  <div v-if="popup" class="fixed inset-0 bg-modal_bg z-30 flex items-center justify-center">
    <div class="h-[40rem]   mt-16 relative"> 
      <button @click="closePopup" class="bg-red-300 h-12 w-12 rounded-md absolute right-0 top-0 ">
        X
      </button>
      <div class="h-[35rem] w-full bg-red-50 p-2 flex items-center justify-center ">
              

        <div class="bg-ankara bg-cover mb-5 flex rounded-[40px]">
        <div
          class="bg-white py-10 md:gap-4 md:p-5 rounded-l-[35px] md:rounded-[35px] flex flex-col w-full items-center justify-between relative z-10"
        >
          <p class="md:text-3xl font-mono font-semibold text-center">
            {{ inputCity.name }} ,{{ inputCity.sys.country }}
          </p>
          <p class="md:text-7xl font-mono font-semibold">
            {{ parseFloat(inputCity.main.temp).toFixed(0) }}°C
          </p>
          <p class="md:text-3xl font-semibold text text-center">
            {{ capitalizeFirstLetter(inputCity.weather[0].description) }}
          </p>
        </div>

        <div class="grid grid-cols-1 p-5 w-full gap-2">
          <div
            class="flex justify-center"
            v-html="getWeatherImage(inputCity.weather[0].main)"
          ></div>

          <div class="flex pl-[30%] gap-2">
            <svg
              class="w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15.7639 7C16.3132 6.38625 17.1115 6 18 6C19.6569 6 21 7.34315 21 9C21 10.6569 19.6569 12 18 12H3M8.50926 4.66667C8.87548 4.2575 9.40767 4 10 4C11.1046 4 12 4.89543 12 6C12 7.10457 11.1046 8 10 8H3M11.5093 19.3333C11.8755 19.7425 12.4077 20 13 20C14.1046 20 15 19.1046 15 18C15 16.8954 14.1046 16 13 16H3"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="text-white flex items-center text-lg font-mono font-bold">
              {{ inputCity.wind.speed }} m/s
            </p>
          </div>
          <div class="flex pl-[30%] gap-3">
            <svg
              class="w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15.0066 3.25608C16.8483 2.85737 19.1331 2.8773 22.2423 3.65268C22.7781 3.78629 23.1038 4.32791 22.9699 4.86241C22.836 5.39691 22.2931 5.7219 21.7573 5.58829C18.8666 4.86742 16.9015 4.88747 15.4308 5.20587C13.9555 5.52524 12.895 6.15867 11.7715 6.84363L11.6874 6.89494C10.6044 7.55565 9.40515 8.28729 7.82073 8.55069C6.17734 8.82388 4.23602 8.58235 1.62883 7.54187C1.11607 7.33724 0.866674 6.75667 1.0718 6.24513C1.27692 5.73359 1.85889 5.48479 2.37165 5.68943C4.76435 6.6443 6.32295 6.77699 7.492 6.58265C8.67888 6.38535 9.58373 5.83916 10.7286 5.14119C11.855 4.45445 13.1694 3.6538 15.0066 3.25608Z"
                fill="#ffffff"
              />
              <path
                d="M22.2423 7.64302C19.1331 6.86765 16.8483 6.84772 15.0066 7.24642C13.1694 7.64415 11.855 8.44479 10.7286 9.13153C9.58373 9.8295 8.67888 10.3757 7.492 10.573C6.32295 10.7673 4.76435 10.6346 2.37165 9.67977C1.85889 9.47514 1.27692 9.72393 1.0718 10.2355C0.866674 10.747 1.11607 11.3276 1.62883 11.5322C4.23602 12.5727 6.17734 12.8142 7.82073 12.541C9.40515 12.2776 10.6044 11.546 11.6874 10.8853L11.7715 10.834C12.895 10.149 13.9555 9.51558 15.4308 9.19621C16.9015 8.87781 18.8666 8.85777 21.7573 9.57863C22.2931 9.71224 22.836 9.38726 22.9699 8.85275C23.1038 8.31825 22.7781 7.77663 22.2423 7.64302Z"
                fill="#ffffff"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.9998 10.0266C18.6526 10.0266 18.3633 10.2059 18.1614 10.4772C18.0905 10.573 17.9266 10.7972 17.7089 11.111C17.4193 11.5283 17.0317 12.1082 16.6424 12.7555C16.255 13.3996 15.8553 14.128 15.5495 14.8397C15.2567 15.5213 14.9989 16.2614 14.9999 17.0117C15.0006 17.2223 15.0258 17.4339 15.0604 17.6412C15.1182 17.9872 15.2356 18.4636 15.4804 18.9521C15.7272 19.4446 16.1131 19.9674 16.7107 20.3648C17.3146 20.7664 18.0748 21 18.9998 21C19.9248 21 20.685 20.7664 21.2888 20.3648C21.8864 19.9674 22.2724 19.4446 22.5192 18.9522C22.764 18.4636 22.8815 17.9872 22.9393 17.6413C22.974 17.4337 22.9995 17.2215 22.9998 17.0107C23.0001 16.2604 22.743 15.5214 22.4501 14.8397C22.1444 14.128 21.7447 13.3996 21.3573 12.7555C20.968 12.1082 20.5803 11.5283 20.2907 11.111C20.073 10.7972 19.909 10.573 19.8382 10.4772C19.6363 10.2059 19.3469 10.0266 18.9998 10.0266ZM20.6119 15.6257C20.3552 15.0281 20.0049 14.3848 19.6423 13.782C19.4218 13.4154 19.2007 13.0702 18.9998 12.7674C18.7989 13.0702 18.5778 13.4154 18.3573 13.782C17.9948 14.3848 17.6445 15.0281 17.3878 15.6257L17.3732 15.6595C17.1965 16.0704 16.9877 16.5562 17.0001 17.0101C17.0121 17.3691 17.1088 17.7397 17.2693 18.0599C17.3974 18.3157 17.574 18.5411 17.8201 18.7048C18.06 18.8643 18.4248 19.0048 18.9998 19.0048C19.5748 19.0048 19.9396 18.8643 20.1795 18.7048C20.4256 18.5411 20.6022 18.3156 20.7304 18.0599C20.8909 17.7397 20.9876 17.3691 20.9996 17.01C21.0121 16.5563 20.8032 16.0705 20.6265 15.6597L20.6119 15.6257Z"
                fill="#ffffff"
              />
              <path
                d="M14.1296 11.5308C14.8899 11.2847 15.4728 12.076 15.1153 12.7892C14.952 13.1151 14.7683 13.3924 14.4031 13.5214C13.426 13.8666 12.6166 14.3527 11.7715 14.8679L11.6874 14.9192C10.6044 15.5799 9.40516 16.3115 7.82074 16.5749C6.17735 16.8481 4.23604 16.6066 1.62884 15.5661C1.11608 15.3615 0.866688 14.7809 1.07181 14.2694C1.27694 13.7578 1.8589 13.509 2.37167 13.7137C4.76436 14.6685 6.32297 14.8012 7.49201 14.6069C8.67889 14.4096 9.58374 13.8634 10.7286 13.1654C11.8166 12.5021 12.9363 11.9171 14.1296 11.5308Z"
                fill="#ffffff"
              />
            </svg>
            <p class="flex items-center text-white text-lg font-mono font-bold">
              {{ inputCity.main.humidity }}%
            </p>
          </div>
        </div>
      </div>
        
        
      </div>
    </div>
  </div>
</template>

<style>
.scrollable-container::-webkit-scrollbar {
  width: 12px;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: #ffbc00;
  border-radius: 6px;
}
</style>
