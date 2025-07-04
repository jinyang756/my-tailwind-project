<template>
  <a
    href="javascript:void(0)"
    @click="handleClick"
    class="group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors duration-150"
    :class="active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    ">
    <!-- 图标 -->
    <div class="flex-shrink-0 flex items-center justify-center w-8 h-8">
      <Icon :icon="icon" class="h-5 w-5"/>
    </div>
    <!-- 文本 -->
    <span v-if="!collapsed" class="ml-3 transition-opacity duration-200">
      {{ text }}
    </span>
    <!-- 激活状态指示器 -->
    <span v-if="active && !collapsed" class="ml-auto bg-blue-500 w-1.5 h-6 rounded-l-full"></span>
  </a>
</template>

<script>
import Icon from '@/components/icons.vue';

export default {
  name: 'NavItem',
  components: {
    Icon
  },
  props: {
    icon: {
      type: String,
      required: true,
      validator: value => ['book', 'user', 'settings', 'stats'].includes(value)
    },
    text: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>

<style scoped>
/* 图标颜色过渡效果 */
.group svg {
  transition: fill 0.2s ease-in-out;
}

.group:hover svg,
.active svg {
  fill: currentColor;
}
</style>