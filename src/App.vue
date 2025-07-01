<template>
  <div class="font-serif text-white min-h-screen overflow-x-hidden relative">
    <!-- Background Video -->
    <div class="fixed inset-0 z-0 overflow-hidden">
      <video autoplay loop muted playsinline id="bg-video" class="w-full h-full object-cover">
        <source src="/bg-video.mp4" type="video/mp4">
      </video>
    </div>
    <div class="fixed inset-0 bg-black/60 z-0"></div>

    <!-- Main Content Area -->
    <div class="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative z-10 space-y-12">
      
      <!-- Prologue Section -->
      <section class="w-full max-w-4xl animate-fade-in-down">
        <div class="glass-effect rounded-2xl p-6 md:p-8">
          <h2 class="text-2xl md:text-3xl font-serif mb-4 text-center text-white/90">序章</h2>
          <p class="text-sm md:text-base leading-relaxed text-gray-300 text-justify">
            我的人生，是一场白雪茫茫的黑夜。这里很安静，安静得只能听见雪落下的声音，和我自己的心跳。这片雪原的中央，曾经有一棵树，枝繁叶茂。我以为它能撑起整个天地，为我抵御所有的风霜。后来我才知道，它早已空了心。那颗被带走的树心，是她。树心空了，风雪就从那个洞口灌了进来，一年又一年。在无数次快要被掩埋、被冻结的瞬间，在那些水深火热的挣扎里，我唯一能抓住的，是我自己的手。我救自己，一次，又一次，万万次。于是，我就这样，成了一个走进了门，却找不到出去的门的人。这片无垠的雪原，就是我的房间，我的世界。我不敢去想那扇门在哪里，因为我更怕知道它通向何方。也许门外是更深的黑夜，也许，根本就没有门。所以，我选择在这里，点一盏灯，将我走过的路，变成文字。如果你也碰巧走进了这里，不必急着寻找出路。可以坐下，一起看看这片黑夜里的雪。
          </p>
        </div>
      </section>

      <!-- Bookshelf Section -->
      <main class="w-full max-w-6xl animate-fade-in" style="animation-delay: 0.3s;">
        <div class="glass-effect rounded-2xl overflow-hidden">
          <div class="p-4 md:p-6 bg-white/5">
            <h2 class="text-xl md:text-2xl font-serif text-shadow text-center">暗域电子书库</h2>
          </div>
          <div class="p-4 md:p-8">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
              
              <!-- Dynamically render books from the bookshelf data -->
              <div v-for="book in bookshelf" :key="book.id" class="group block book-cover-style" @click="openBook(book)">
                <div class="aspect-[2/3] bg-gray-800 rounded-md p-4 flex flex-col justify-end relative overflow-hidden border border-gray-700">
                  <img v-if="book.coverImage" :src="book.coverImage" :alt="book.title" class="absolute inset-0 w-full h-full object-cover">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <h3 class="relative text-lg font-serif font-bold text-white z-10">{{ book.title }}</h3>
                  <p class="relative text-sm text-gray-400 z-10">{{ book.status }}</p>
                </div>
              </div>

              <!-- Add New Book Button -->
              <div @click="addBook" class="group aspect-[2/3] rounded-md border-2 border-dashed border-white/30 bg-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-colors duration-300 book-cover-style" title="创作后台">
                <i class="fa fa-plus-circle text-4xl text-white/60 group-hover:text-white transition-colors duration-300"></i>
                <p class="mt-3 text-sm text-white/70 font-medium group-hover:text-white transition-colors duration-300">添加新书</p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Sound Control Button -->
    <button @click="toggleSound" class="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 transition-all duration-300 opacity-70 hover:opacity-100 text-2xl" :title="isMuted ? '开启声音' : '静音'">
      <i :class="['fa', isMuted ? 'fa-volume-off' : 'fa-volume-up']"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// --- Data ---
const bookshelf = ref([
  { 
    id: 'entropy-clock', 
    title: "《熵减时钟》", 
    status: "暗域三部曲之一",
    coverImage: "/entropy-clock-cover.jpg",
    filePath: "/path/to/entropy-clock.epub" 
  },
  {
    id: 'three-realms',
    title: "《暗域三才集》",
    status: "核心思想合集",
    coverImage: null,
    filePath: "/path/to/three-realms.md"
  }
]);

const isMuted = ref(true);
let bgVideo = null;

// --- Lifecycle Hooks ---
onMounted(() => {
  bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    const startLoopTime = 3; 
    const endLoopTime = 15;
    bgVideo.currentTime = startLoopTime;
    bgVideo.addEventListener('timeupdate', () => {
      if (bgVideo.currentTime >= endLoopTime) {
        bgVideo.currentTime = startLoopTime;
      }
    });
  }
});

// --- Methods ---
const toggleSound = () => {
  if (bgVideo) {
    bgVideo.muted = !bgVideo.muted;
    isMuted.value = bgVideo.muted;
  }
};

const openBook = (book) => {
  alert(`正在打开: ${book.title}\n这是通往阅读器的入口。`);
};

const addBook = () => {
  alert('此处将链接到您的创作后台，用于上传和更新书籍。');
};
</script>

<style>
/* 引入外部字体和样式库 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Inter:wght@300;400&display=swap');
@import url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css');
</style>
