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
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Bookshelf data
const bookshelf = ref([
  { 
    id: 'entropy-clock', 
    title: "《熵减时钟》", 
    status: "暗域三部曲之一",
    coverImage: '/entropy-clock-cover.jpg',
    filePath: '/books/entropy-clock.md'
  },
  { 
    id: 'three-realms', 
    title: "《暗域三才集》", 
    status: "核心思想合集",
    coverImage: null,
    filePath: '/books/three-realms.md'
  }
]);

// Open book reader
const openBook = (book) => {
  router.push({ name: 'Reader', params: { bookId: book.id } });
};
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