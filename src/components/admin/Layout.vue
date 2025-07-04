<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- 侧边栏 -->
    <aside
      :class="[sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0']"
    >
      <!-- 侧边栏头部 -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div class="flex items-center">
          <svg class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span class="ml-2 text-xl font-bold text-white">媒体管理系统</span>
        </div>
        <button
          @click="toggleSidebar"
          class="md:hidden text-gray-400 hover:text-white focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 侧边栏导航 -->
      <nav class="px-2 pt-4 pb-4 space-y-1">
        <NavItem
          icon="book"
          text="书籍管理"
          :active="currentRoute === '/admin/books'"
          :collapsed="!sidebarOpen"
          @click="navigateTo('/admin/books')"
        />
        <NavItem
          icon="user"
          text="用户管理"
          :active="currentRoute === '/admin/users'"
          :collapsed="!sidebarOpen"
          @click="navigateTo('/admin/users')"
        />
        <NavItem
          icon="stats"
          text="数据统计"
          :active="currentRoute === '/admin/stats'"
          :collapsed="!sidebarOpen"
          @click="navigateTo('/admin/stats')"
        />
        <NavItem
          icon="settings"
          text="系统设置"
          :active="currentRoute === '/admin/settings'"
          :collapsed="!sidebarOpen"
          @click="navigateTo('/admin/settings')"
        />
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部导航 -->
      <header class="bg-white shadow">
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex items-center">
            <button
              @click="toggleSidebar"
              class="mr-4 text-gray-500 hover:text-gray-600 focus:outline-none md:block"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="hidden md:block">
              <div class="flex items-center space-x-2">
                <a href="/admin" class="text-gray-500 hover:text-gray-700">首页</a>
                <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="text-gray-700">{{ currentPageName }}</span>
              </div>
            </div>
          </div>

          <!-- 用户菜单 -->
          <div class="flex items-center">
            <button class="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span class="sr-only">查看通知</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <div class="ml-4 relative">
              <div>
                <button
                  class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <img
                    class="h-8 w-8 rounded-full object-cover"
                    src="https://picsum.photos/id/1005/200/200"
                    alt="用户头像"
                  >
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
        <slot />
      </main>
    </div>

    <!-- 移动端遮罩 -->
    <div
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    ></div>
  </div>
</template>

<script>
import NavItem from '@/components/NavItem.vue';

export default {
  name: 'AdminLayout',
  components: {
    NavItem
  },
  data() {
    return {
      sidebarOpen: true,
      currentRoute: this.$route.path
    };
  },
  computed: {
    currentPageName() {
      const routeNames = {
        '/admin/books': '书籍管理',
        '/admin/users': '用户管理',
        '/admin/stats': '数据统计',
        '/admin/settings': '系统设置'
      };
      return routeNames[this.currentRoute] || '控制台';
    }
  },
  mounted() {
    // 监听窗口大小变化，在大屏幕上自动展开侧边栏
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    handleResize() {
      if (window.innerWidth >= 768) {
        this.sidebarOpen = true;
      }
    },
    navigateTo(path) {
      this.$router.push(path);
      // 在移动设备上导航后自动关闭侧边栏
      if (window.innerWidth < 768) {
        this.sidebarOpen = false;
      }
    }
  },
  watch: {
    '$route.path'(newPath) {
      this.currentRoute = newPath;
    }
  }
};
</script>