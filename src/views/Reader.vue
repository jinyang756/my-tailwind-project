<template>
  <div class="min-h-screen flex flex-col bg-darker text-light relative" :class="theme === 'sepia' ? 'bg-sepia text-sepia-dark' : theme === 'light' ? 'bg-light text-dark' : 'bg-darker text-light'">
    <!-- Reading Header -->
    <header class="py-4 px-6 border-b border-accent/20 flex justify-between items-center bg-dark/80 backdrop-blur-md z-10">
      <button @click="goBack" class="p-2 rounded-full hover:bg-accent/20 transition-colors">
        <i class="fa fa-arrow-left text-accent"></i>
      </button>
      <h1 class="text-xl font-serif text-center flex-1">{{ currentBook.title }}</h1>
      <div class="flex space-x-2">
        <button @click="toggleSettings" class="p-2 rounded-full hover:bg-accent/20 transition-colors">
          <i class="fa fa-cog text-accent"></i>
        </button>
      </div>
    </header>

    <!-- Reading Content -->
    <main class="flex-grow overflow-auto p-4 md:p-8" @scroll="handleScroll">
      <div class="max-w-3xl mx-auto" :style="{ fontSize: `${fontSize}px`, fontFamily: fontFamily }">
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
        <div v-else class="prose prose-invert max-w-none" v-html="bookContent"></div>
      </div>
    </main>

    <!-- Progress Bar -->
    <div class="h-1 bg-dark/50 w-full">
      <div class="h-full bg-accent transition-all duration-300" :style="{ width: `${progress}%` }"></div>
    </div>

    <!-- Reading Controls -->
    <div class="py-3 px-6 border-t border-accent/20 flex justify-between items-center bg-dark/80 backdrop-blur-md">
      <div class="text-sm text-light/70">{{ Math.round(progress) }}%</div>
      <div class="flex space-x-4">
        <button @click="decreaseFontSize" class="p-2 rounded-full hover:bg-accent/20 transition-colors" :disabled="fontSize <= 14">
          <i class="fa fa-font text-accent"></i> A-
        </button>
        <button @click="increaseFontSize" class="p-2 rounded-full hover:bg-accent/20 transition-colors" :disabled="fontSize >= 24">
          <i class="fa fa-font text-accent"></i> A+
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    <div v-if="showSettings" class="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div class="bg-dark rounded-xl p-6 w-full max-w-md border border-accent/20">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-serif text-accent">阅读设置</h2>
          <button @click="toggleSettings" class="p-2 rounded-full hover:bg-accent/20 transition-colors">
            <i class="fa fa-times text-light/70"></i>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Theme Selection -->
          <div>
            <h3 class="text-sm text-light/70 mb-3">主题</h3>
            <div class="flex space-x-3">
              <button @click="setTheme('dark')" class="w-10 h-10 rounded-full bg-darker border-2 border-accent/50 flex items-center justify-center" :class="theme === 'dark' ? 'ring-2 ring-accent' : ''"></button>
              <button @click="setTheme('sepia')" class="w-10 h-10 rounded-full bg-sepia border-2 border-accent/50 flex items-center justify-center" :class="theme === 'sepia' ? 'ring-2 ring-accent' : ''"></button>
              <button @click="setTheme('light')" class="w-10 h-10 rounded-full bg-light border-2 border-accent/50 flex items-center justify-center" :class="theme === 'light' ? 'ring-2 ring-accent' : ''"></button>
            </div>
          </div>

          <!-- Font Family -->
          <div>
            <h3 class="text-sm text-light/70 mb-3">字体</h3>
            <div class="grid grid-cols-2 gap-2">
              <button @click="setFontFamily('serif')" class="py-2 px-4 rounded-md bg-dark border border-accent/20 hover:bg-accent/20 transition-colors" :class="fontFamily === 'serif' ? 'bg-accent/20' : ''">
                衬线字体
              </button>
              <button @click="setFontFamily('sans-serif')" class="py-2 px-4 rounded-md bg-dark border border-accent/20 hover:bg-accent/20 transition-colors" :class="fontFamily === 'sans-serif' ? 'bg-accent/20' : ''">
                无衬线字体
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import marked from 'marked';

// State
const loading = ref(true);
const bookContent = ref('');
const progress = ref(0);
const showSettings = ref(false);
const scrollTimeout = ref(null);

// Composables
const route = useRoute();
const router = useRouter();
const store = useStore();

// Getters from store
const theme = computed(() => store.state.theme);
const fontSize = computed(() => store.state.fontSize);
const fontFamily = computed(() => store.state.fontFamily);
const currentBook = computed(() => {
  const bookId = route.params.bookId;
  // In a real app, you would fetch this from an API or books collection
  return {
    id: bookId,
    title: bookId === 'entropy-clock' ? '《熵减时钟》' : '《暗域三才集》'
  };
});

// Methods
const goBack = () => router.go(-1);
const toggleSettings = () => showSettings.value = !showSettings.value;
const increaseFontSize = () => store.commit('setFontSize', fontSize.value + 1);
const decreaseFontSize = () => store.commit('setFontSize', fontSize.value - 1);
const setTheme = (theme) => store.commit('setTheme', theme);
const setFontFamily = (family) => store.commit('setFontFamily', family);

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  const newProgress = (scrollTop / (scrollHeight - clientHeight)) * 100;
  progress.value = newProgress;

  // Save progress after scrolling stops for 1 second
  clearTimeout(scrollTimeout.value);
  scrollTimeout.value = setTimeout(() => {
    store.dispatch('saveReadingProgress', {
      bookId: currentBook.value.id,
      progress: newProgress
    });
  }, 1000);
};

const loadBookContent = async () => {
  try {
    loading.value = true;
    // In a real app, you would fetch the actual book content
    const response = await fetch(`/books/${currentBook.value.id}.md`);
    const markdown = await response.text();
    bookContent.value = marked.parse(markdown);

    // Load saved progress
    const savedProgress = store.getters.getReadingProgress(currentBook.value.id);
    if (savedProgress > 0) {
      progress.value = savedProgress;
      // Scroll to saved position after a short delay to ensure content is rendered
      setTimeout(() => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
          const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
          mainContent.scrollTop = (savedProgress / 100) * scrollHeight;
        }
      }, 500);
    }
  } catch (error) {
    console.error('Failed to load book content:', error);
    bookContent.value = '<div class="text-center py-10"><p class="text-light/70">无法加载书籍内容</p></div>';
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadBookContent();
});

onUnmounted(() => {
  clearTimeout(scrollTimeout.value);
  // Save progress when leaving the page
  store.dispatch('saveReadingProgress', {
    bookId: currentBook.value.id,
    progress: progress.value
  });
});
</script>

<style scoped>
/* Custom theme colors */
.bg-sepia {
  background-color: #f4ecd8;
}

.text-sepia-dark {
  color: #5f4b32;
}

/* Custom scrollbar */
main::-webkit-scrollbar {
  width: 6px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background-color: rgba(183, 146, 89, 0.5);
  border-radius: 3px;
}

/* Markdown content styling */
.prose p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.prose h1, .prose h2, .prose h3 {
  color: #B79259;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose blockquote {
  border-left: 3px solid #B79259;
  padding-left: 1rem;
  margin-left: 0;
  font-style: italic;
}
</style>