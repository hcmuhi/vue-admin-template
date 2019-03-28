<template>
  <div class="app-container">
    <!-- <my-detail v-bind="detailProps" v-if="detailProps.visible"></my-detail> -->
    <div class="d-filter">
      <el-input v-model="filter.name" class="d-item" clearable placeholder="名称" @keyup.enter.native="fetchData"/>
      <el-select v-model="filter.state" class="d-item" placeholder="状态" clearable>
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      <el-input v-model="filter.crtName" class="d-item" clearable placeholder="创建人" @keyup.enter.native="fetchData"/>
      <el-button class="d-item" type="primary" @click="fetchData">搜索</el-button>
      <div class="right-button">
        <el-button class="d-item" type="primary" @click="showDetail('', 'add')">新增</el-button>
      </div>
    </div>
    <div class="table-box">
      <my-table v-bind="tableProps">
        <!-- 列表item 自定义显示 -->
        <template slot-scope="scope" slot="columnSlotBtns">
          <el-button type="primary" size="small" @click="showDetail(scope.row, 'edit')" >编辑</el-button>
          <el-button type="danger" size="small" @click="showDel(scope.row)" >删除</el-button>
        </template>
      </my-table>
    </div>
  </div>
</template>

<script>

import api from '@/api'
import { MyTable } from '@/components/Table'
// import MyDetail from './detail'

export default {
  components: {
    MyTable
    // MyDetail
  }, // 组件
  filters: {}, // 过滤
  directives: {}, // 自定义指令
  props: {},
  data() {
    return {
      stateList: [
        { 'value': '1', 'label': '启用' },
        { 'value': '2', 'label': '停用' }
      ],
      /** ***************列表过滤*************** **/
      filter: {
        name: '',
        state: ''
      },
      /** ***************table 组件传入参数*************** **/
      tableProps: {
        indexOrder: true,
        loading: false,
        columns: [ // 表头定义:(width)  列固定(fixed: 'left') 列样式(class) 突出列(showBg: true)
          { label: '标题', prop: 'title' },
          { label: '状态', prop: 'status', width: 80 },
          { label: '更新人', prop: 'author', width: 80 },
          { label: '更新时间', prop: 'display_time', width: 160 },
          { label: '操作', slotName: 'columnSlotBtns', width: 160 }
        ],
        tableData: [], // 列表数据
        pageSize: 20,
        pageIndex: 1,
        totalCount: null,
        changeSize: (size) => {
          this.tableProps.pageSize = size
          this.fetchData()
        },
        changePageIndex: (pageIndex) => {
          this.tableProps.pageIndex = pageIndex
          this.fetchData(this.tableProps.pageIndex)
        },
        rowClick: (currentRow, event, column) => {}
      },
      /** ***************详情组件传入参数*************** **/
      detailProps: {
        title: '详情',
        visible: false,
        key: '0',
        dataId: null,
        type: 'add',
        reload: () => {
          this.fetchData()
          this.detailProps.visible = false
        },
        dialogClose: () => {
          this.detailProps.visible = false
        }
      }
    }
  },
  computed: {}, // 计算属性
  /** ***************************初始化  end  *************************** **/
  /** *************************生命周期钩子 start************************* **/
  created() {
    this.fetchData()
  },
  mounted() {},
  /** **************************生命周期钩子 end************************** **/
  /** ***************************methods start*************************** **/
  methods: {
    // -----其他方法 start-----
    // 详情
    showDetail(n, type) {
      // this.$router.push({ name: 'demoDetail', query: { id: n.id }, params: { title: '11', noCache: true }}) // noCache 刷新 // title
      this.detailProps = {
        ...this.detailProps,
        visible: true,
        dataId: n && n.wareId,
        type
      }
    },
    // 删除
    showDel(n) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDel(n)
      }).catch(() => {
      })
    },
    // -----其他方法  end -----
    // -----增删改查 start-----
    doDel(n) {
      this.tableProps.loading = true
      const data = {
        id: n.id,
        state: 2
      }
      api.fetch({
        url: api.ywlApi.deleteXXX,
        method: 'post',
        data
      }).then(res => {
        this.tableProps.loading = false
        if (res.status === 200) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.fetchData()
        } else {
          this.$notify({
            title: '失败',
            message: res.userMsg,
            type: 'error',
            duration: 2000
          })
        }
      }).catch(() => {
        this.tableProps.loading = false
      })
    },
    fetchData(pageIndex) {
      // 翻页时传入pageIndex，不翻页默认重置 1
      this.tableProps.pageIndex = (pageIndex / 1) || 1
      this.tableProps.loading = true
      const data = {
        page: this.tableProps.pageIndex,
        limit: this.tableProps.pageSize,
        ...this.filter
      }
      api.fetch({
        url: api.ywlApi.tableList,
        method: 'get',
        params: data
      }).then(res => {
        this.tableProps.loading = false
        if (res.code === 20000) {
          this.tableProps.tableData = res.data.items
          // this.tableProps.totalCount = res.data.total
          this.tableProps.totalCount = res.data.items.length
        } else {
          this.$notify({
            title: '失败',
            message: res.userMsg,
            type: 'error',
            duration: 2000
          })
        }
      }).catch(() => {
        this.tableProps.loading = false
      })
    }
    // -----增删改查  end -----
  }
  /** ****************************methods end**************************** **/
}
</script>
