<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 md:p-10 relative z-10 space-y-12">
    <!-- Prologue Section -->
    <section class="w-full max-w-4xl animate-fade-in-down">
      <div class="glass-effect rounded-2xl p-6 md:p-8">
        <h2 class="text-2xl md:text-3xl font-serif mb-4 text-center text-white/90">序章</h2>
        <p class="text-sm md:text-base leading-relaxed text-gray-300 text-justify">
          我的人生，是一场白雪茫茫的黑夜。这里很安静，安静得只能听见雪落下的声音，和我自己的心跳。这片雪原的中央，曾经有一棵树，枝繁叶茂。我以为它能撑起整个天地，为我抵御所有的风霜。后来我才知道，它早已空了心。那颗被带走的树心，是她。树心空了，风雪就从那个洞口灌了进来，一年又一年。
        </p>
      </div>
    </section>

    <!-- Bookshelf Section -->
    <main class="w-full max-w-6xl animate-fade-in" style="animation-delay: 0.3s;">
      <div class="glass-effect rounded-2xl overflow-hidden">
        <div class="p-3 md:p-6 bg-white/5">
          <h2 class="text-lg sm:text-xl md:text-2xl font-serif text-shadow text-center">暗域电子书库</h2>
        </div>
        <div class="p-4 md:p-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            <!-- Dynamically render books from the bookshelf data -->
            <div v-for="book in bookshelf" :key="book.id" class="group block book-cover-style" @click="openBook(book)">
          <div class="aspect-[2/3] bg-gray-800 rounded-md p-4 flex flex-col justify-end relative overflow-hidden border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95 sm:rounded-lg md:rounded-xl sm:p-5 md:p-6">
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div class="w-12 h-12 sm:w-10 sm:h-10 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
            </div>
                <img 
                  v-else 
                  :src="book.coverImage || '/default-book-cover.svg'" 
                  :alt="book.title" 
                  class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  @error="e => e.target.src = '/default-book-cover.svg'"
                >
                <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300">
                  <h3 class="text-white font-medium text-sm sm:text-base drop-shadow-md group-hover:text-shadow-lg transition-all duration-300">{{ book.title }}</h3>
                  <p class="text-gray-300 text-xs sm:text-sm group-hover:text-white transition-colors duration-300">{{ book.status || '未开始' }}</p>
              </div>
            </div>
          </div>
          <div v-if="error" class="mt-8 text-center text-red-400 p-4 bg-red-900/20 rounded-lg">
            {{ error }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
const router = useRouter();

// Bookshelf data
const bookshelf = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/media', {
      params: { type: 'book' }
    });
    bookshelf.value = response.data;
  } catch (err) {
    error.value = 'Failed to load books: ' + (err.message || 'Unknown error');
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.book-cover-style {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-cover-style:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(183, 146, 89, 0.3);
}

.glass-effect {
  background: rgba(15, 17, 21, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(183, 146, 89, 0.2);
}

.text-shadow {
  text-shadow: 0 0 10px rgba(183, 146, 89, 0.5);
}
</style>