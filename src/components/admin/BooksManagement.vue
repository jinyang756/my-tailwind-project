<template>
  <div class="space-y-6">
    <!-- 搜索和筛选区域 -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索书籍标题或作者..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon icon="search" class="h-5 w-5 text-gray-400"/>
          </div>
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">所有状态</option>
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
          <option value="archived">已归档</option>
        </select>
      </div>
      <div class="flex gap-3">
        <button
          @click="refreshBooks"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Icon icon="refresh" class="h-4 w-4 mr-2 inline"/>
          刷新
        </button>
        <button
          @click="showAddBookModal = true"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Icon icon="add" class="h-4 w-4 mr-2 inline"/>
          添加书籍
        </button>
      </div>
    </div>

    <!-- 书籍列表表格 -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">封面</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新日期</th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="book in filteredBooks" :key="book.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="h-12 w-8 flex-shrink-0">
                <img :src="book.coverImage || '/default-book-cover.svg'" :alt="book.title" class="h-full w-full object-cover rounded"
                />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ book.title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ book.author }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="statusBadgeClass(book.status)">
                {{ book.status === 'draft' ? '草稿' : book.status === 'published' ? '已发布' : '已归档' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(book.updatedAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="editBook(book)" class="text-blue-600 hover:text-blue-900 mr-4">
            <Icon icon="edit" class="h-4 w-4 inline-block mr-1"/>
            编辑
          </button>
              <button @click="deleteBook(book.id)" class="text-red-600 hover:text-red-900">
            <Icon icon="delete" class="h-4 w-4 inline-block mr-1"/>
            删除
          </button>
            </td>
          </tr>
          <tr v-if="filteredBooks.length === 0 && !isLoading">
            <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500">
              没有找到符合条件的书籍
            </td>
          </tr>
          <tr v-if="isLoading">
            <td colspan="6" class="px-6 py-10 text-center">
              <div class="flex justify-center">
                <div class="w-10 h-10 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            显示第 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到 <span class="font-medium">{{ Math.min(currentPage * pageSize, totalBooks) }}</span> 条，共 <span class="font-medium">{{ totalBooks }}</span> 条结果
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">上一页</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="page in pageNumbers"
              :key="page"
              @click="currentPage = page"
              :class="currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span class="sr-only">下一页</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- 添加/编辑书籍模态框 -->
    <BookFormModal
      v-if="showAddBookModal || showEditBookModal"
      :show="showAddBookModal || showEditBookModal"
      :book="currentBook"
      :is-edit="showEditBookModal"
      @close="closeModal"
      @save="saveBook"
    />
  </div>
</template>

<script>
import BookFormModal from './BookFormModal.vue';
import Icon from '@/components/icons.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'BooksManagement',
  components: {
    BookFormModal,
    Icon
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: 'all',
      currentPage: 1,
      pageSize: 10,
      showAddBookModal: false,
      showEditBookModal: false,
      currentBook: null
    };
  },
  computed: {
    ...mapState('books', ['books', 'isLoading']),
    filteredBooks() {
      return this.books
        .filter(book => {
          // 搜索过滤
          if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
          }
          return true;
        })
        .filter(book => {
          // 状态过滤
          if (this.statusFilter !== 'all') {
            return book.status === this.statusFilter;
          }
          return true;
        })
        .slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
    totalBooks() {
      return this.books.filter(book => {
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
        }
        return true;
      }).filter(book => {
        if (this.statusFilter !== 'all') {
          return book.status === this.statusFilter;
        }
        return true;
      }).length;
    },
    totalPages() {
      return Math.ceil(this.totalBooks / this.pageSize);
    },
    pageNumbers() {
      // 生成页码数组
      const pages = [];
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + 4);

      if (endPage - startPage < 4 && this.totalPages > 4) {
        if (startPage === 1) {
          endPage = 5;
        } else if (endPage === this.totalPages) {
          startPage = Math.max(1, this.totalPages - 4);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    }
  },
  methods: {
    ...mapActions('books', ['fetchBooks', 'deleteBook', 'saveBook']),
    statusBadgeClass(status) {
      switch (status) {
        case 'published':
          return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
        case 'draft':
          return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
        case 'archived':
          return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
        default:
          return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    refreshBooks() {
      this.fetchBooks();
    },
    editBook(book) {
      this.currentBook = { ...book };
      this.showEditBookModal = true;
    },
    closeModal() {
      this.showAddBookModal = false;
      this.showEditBookModal = false;
      this.currentBook = null;
    },
    async saveBook(bookData) {
      await this.saveBook(bookData);
      this.closeModal();
    }
  },
  mounted() {
    this.fetchBooks();
  }
};
</script>