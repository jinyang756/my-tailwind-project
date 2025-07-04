<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="handleClose"></div>

      <!-- 模态框居中技巧 -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- 模态框内容 -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEdit ? '编辑书籍' : '添加新书籍' }}
              </h3>
              <div class="mt-4 space-y-4">
                <!-- 封面图上传 -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">封面图</label>
                  <div class="flex items-center space-x-4">
                    <div class="h-24 w-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        v-if="book.coverImage"
                        :src="book.coverImage"
                        alt="封面预览"
                        class="h-full w-full object-cover"
                      >
                      <div v-else class="text-center text-gray-500 text-xs">
                        <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="block mt-1">无封面</span>
                      </div>
                    </div>
                    <div>
                      <label class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                        <span>上传封面</span>
                        <input type="file" class="sr-only" accept="image/*" @change="handleImageUpload">
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 标题输入 -->
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700">标题</label>
                  <input
                    type="text"
                    v-model="book.title"
                    id="title"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="输入书籍标题"
                    required
                  >
                </div>

                <!-- 作者输入 -->
                <div>
                  <label for="author" class="block text-sm font-medium text-gray-700">作者</label>
                  <input
                    type="text"
                    v-model="book.author"
                    id="author"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="输入作者名称"
                    required
                  >
                </div>

                <!-- 状态选择 -->
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700">状态</label>
                  <select
                    id="status"
                    v-model="book.status"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已发布</option>
                    <option value="archived">已归档</option>
                  </select>
                </div>

                <!-- 描述输入 -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700">描述</label>
                  <textarea
                    id="description"
                    v-model="book.description"
                    rows="3"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="输入书籍描述"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="handleSave"
          >
            保存
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="handleClose"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookFormModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    book: {
      type: Object,
      default: () => ({
        title: '',
        author: '',
        status: 'draft',
        description: '',
        coverImage: ''
      })
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formBook: { ...this.book }
    };
  },
  watch: {
    book(newVal) {
      this.formBook = { ...newVal };
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleSave() {
      // 简单表单验证
      if (!this.formBook.title.trim()) {
        alert('请输入书籍标题');
        return;
      }
      if (!this.formBook.author.trim()) {
        alert('请输入作者名称');
        return;
      }
      this.$emit('save', this.formBook);
    },
    handleImageUpload(e) {
      const file = e.target.files[0];
      if (file) {
        // 在实际应用中，这里应该上传文件到服务器
        // 这里使用临时URL进行预览
        const reader = new FileReader();
        reader.onload = (event) => {
          this.formBook.coverImage = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>