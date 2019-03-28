<script>
/* eslint-disable */
</script>
<template>
  <div class="tables d-table-box">
    <el-table
      border
      stripe
      fit
      ref="myTable"
      @current-change="currentChange"
      highlight-current-row
      :data="tableData"
      v-loading="loading"
      @row-click="rowClick"
      :max-height="height"
      @sort-change="sortChange"
      :row-class-name="tableRowClassName || filterRowClassName"
      :key="height"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      :span-method="spanMethod"
      :empty-text="totalCount == 0 ? '暂无数据' : ' '"
    >
      <!-- 序号 start -->
      <el-table-column type="index" width="40" v-if="indexOrder" align="center" :fixed="indexFixed || false" class-name="table-first"></el-table-column>
      <!-- 多选 start -->
      <el-table-column type="selection" :selectable="selectable" width="40" align="center" v-if="selection" :fixed="selectionFixed || false" class-name="table-first" ></el-table-column>
      <el-table-column align="center" fixed="right" width="120" v-if="tableFilter">
        <template slot="header" slot-scope="scope" >
          <el-input v-model="filter" size="mini" placeholder="本页搜索"/>
          <slot v-bind="scope" name="filterHeaderSlot"></slot>
        </template>
        <template slot-scope="scope">
          <div>{{filter ? scope.row.firstFilterText : ''}}</div>
          <!-- <slot v-bind="scope" name="filterSlot"></slot> -->
        </template>
      </el-table-column>
      <!-- 表单 start -->
      <el-table-column
        v-for="(item, index) in columns"
        :prop="item.prop"
        :label="item.label"
        :align="item.align || 'center'"
        :header-align="item.headerAlign"
        :sortable="item.sortable"
        :defaultSort="item.defaultSort"
        :width="item.width || ''"
        :fixed="item.fixed || false"
        :class-name="index == 0 || item.showBg || item.fixed ? `table-first ${item.class || ''}` : (item.class || '')"
        :label-class-name="item.child ? 'table-father' : '' "
        :show-overflow-tooltip="item.showOverflowTooltip || false "
        :key="index"
      >
        <!-- 内容处理 start -->
        <template slot-scope="scope" >
          <div class="table-td" :class="item.className" v-if="item.slotName">
            <slot v-bind="scope" :name="item.slotName"></slot>
          </div>
          <div class="table-td" :class="item.className" v-else>
            {{ scope.row[item.prop] == 0 && scope.row[item.prop] !== '' ? scope.row[item.prop] : (scope.row[item.prop] || '--') }}
          </div>
        </template>
        <!-- 内容处理  end  -->
      </el-table-column>
    </el-table>
    <slot name="beforePage"></slot>
    <!-- 分页处理 start -->
    <div class="page-list" v-if="pagination">
      <el-pagination
        background
        v-if="pagination"
        :page-size="pageSize"
        :current-page="pageIndex"
        @size-change="changeSize"
        @current-change="changePageIndex"
        :page-sizes="pageSizeList"
        :pager-count="pageCount"
        :layout="paginationLayout"
        :total="totalCount || 0">
      </el-pagination>
    </div>
    <!-- 分页处理  end  -->
  </div>
      
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        filter: '',
        // pageSizeList: [10, 20, 30, 50],
        height: undefined
      }
    },
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      selection: {
        type: Boolean,
        default: false
      },
      indexOrder: {
        type: Boolean,
        default: false
      },
      indexFixed: {
        type: Boolean,
        default: false
      },
      tableFilter: {
        type: Boolean,
        default: false
      },
      selectable: {
        type: Function,
        default: () => {
          return true
        }
      },
      selectionFixed: {
        type: String,
        default: ''
      },
      /**
       * columns属性:
       * label 对应表头名字
       * prop  后端数据键值
       * width 宽度
       * fixed 是否固定
       * class 样式类名
       * align	对齐方式
       * headerAlign 表头对齐方式，若不设置该项，则使用表格的对齐方式
       * sortable 可排序
       * defaultSort 默认排序
       * showOverflowTooltip 单行显示
       */
      columns: {
        type: Array,
        default: []
      },
      tableData: {
        type: Array,
        default: null
      },
      pagination: {
        type: Boolean,
        default: true
      },
      paginationLayout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
      },
      pageCount: {
        type: Number,
        default: 7
      },
      pageSize: {
        type: Number,
        default: 15
      },
      pageSizeList: {
        type: Array,
        default: () => {
          return [10, 20, 30, 50]
        }
      },
      pageIndex: {
        type: Number,
        default: 1
      },
      totalCount: {
        type: Number,
        default: null
      },
      flow: { // 高度浮动根据页面
        type: Boolean,
        default: true
      },
      flowHeight: { // 浮动高度
        type: Number,
        default: 0
      },
      flowBottom: { // 浮动底部距离
        type: Number,
        default: 100
      },
      rowClick: {
        type: Function,
        default: () => {}
      },
      tableRowClassName: {
        type: Function,
        default: null
      },
      spanMethod: {
        type: Function,
        default: null
      },
      changeSize: {
        type: Function,
        default: null
      },
      changePageIndex: {
        type: Function,
        default: null
      },
      handleSelect: {
        type: Function,
        default: () => {}
      },
      handleSelectAll: {
        type: Function,
        default: () => {}
      },
      handleSelectionChange: {
        type: Function,
        default: () => {}
      },
      currentChange: {
        type: Function,
        default: () => {}
      },
      sortChange: {
        type: Function,
        default: () => {}
      }
    },
    methods: {
      toggleRowSelection(row) {
        // 处理选中
        this.$refs.myTable.toggleRowSelection(row)
      },
      filterRowClassName({ row, rowIndex }) {
        // 本页搜索
        if (this.tableFilter && this.filter) {
          const show = this.columns.some(column => {
            const matchText = (row[column.prop] || '').match(this.filter)
            if (matchText) {
              row.firstFilterText = row[column.prop]
            }
            return !!matchText
          })
          return show ? '' : 'no-show'
        } else {
          return ''
        }
      },
      // dealPageSizeList() {
      //   const pageSize = Number(this.pageSize)
      //   var bool = this.pageSizeList.includes(pageSize)
      //   if (!bool) {
      //     this.pageSizeList.push(pageSize)
      //     this.pageSizeList = this.pageSizeList.sort((a, b) => { return a - b })
      //   }
      // },
      dealTableHeight() {
        if (this.flowHeight) {
          this.height = this.flowHeight
        } else {
          const table = document.querySelector('.tables')
          const tableTop = this.offset(table).top
          const bottom = this.flowBottom
          this.height = document.body.offsetHeight - tableTop - bottom
        }
      },
      getRowKey(row) {
        return row[this.rowKey]
      },
      offset(elem) {
        var obj = {
          left: elem.offsetLeft,
          top: elem.offsetTop,
          width: elem.offsetWidth,
          height: elem.offsetHeight
        }
        while (elem !== document.body) {
          elem = elem.offsetParent || document.body
          obj.left += elem.offsetLeft
          obj.top += elem.offsetTop
        }
        return obj
      }
    },
    computed: {
    }, // 计算属性
    watch: {
      totalCount() {
        if (this.tableData && this.tableData.length === 0 && this.pageIndex !== 1) {
          this.changePageIndex(1)
        }
      }
    },
    created() {
    },
    mounted() {
      // // 处理外部传入的pageSize
      // this.dealPageSizeList()
      // 处理table高度滚动条
      if (this.flow) {
        setTimeout(() => {
          this.dealTableHeight()
        }, 300)
      }
    }
  }
</script>


<style scoped>
.tables {
  margin: 0;
  min-height: 280px;
  position: relative;
  width: 100%;
}
.table-td {
  font-size: 14px;
  color: #666666;
}
.forLink .table-td{
  font-size: 14px;
  color: #05A6EF;
  cursor: pointer;
}
.forLink:hover .table-td{
  color: #05A6dd;
  text-decoration: underline;
  cursor: pointer; 
}
.page-list{
  overflow: hidden;
  margin-top: 30px;
  margin-bottom: 10px;
  text-align: right;
}
</style>
<style>
.d-table-box .el-table__body {
  box-sizing: border-box;
  margin-left: -1px;
}
.d-table-box .table-first{
  /* background: #F2FAFD; */
}
.d-table-box .table-father{
  text-align:center;
  background: #000;
}
.d-table-box td.nobg{
  background: #fff!important;
}
.d-table-box .bg2{
  background: #E4F7FF!important;
}
.d-table-box .bg3{
  background: #FFF8E9!important;
}
.d-table-box .bg4{
  background: #FFE9FF!important;
}
.d-table-box .table_child_nopadding > tr{
  background: #8adbff!important;
}
.d-table-box .el-table__row.green-row .table-first{
  background: #82D2B2
}
.d-table-box .el-table__row.red-row .table-first{
  background: #FF7777
}
.d-table-box .no-show {
  display: none;
}
</style>
