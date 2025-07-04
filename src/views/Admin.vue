<template>
  <AdminLayout>
    <!-- 管理页面内容将通过路由显示在这里 -->
    <router-view />
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/admin/Layout.vue';

export default {
  name: 'Admin',
  components: {
    AdminLayout
  }
};
</script>

<style scoped>
/* 自定义滚动条样式 */
::v-deep .scrollbar-thin {
  scrollbar-width: thin;
}

::v-deep .scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

::v-deep .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>