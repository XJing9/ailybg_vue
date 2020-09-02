<template>
    <div>
      <el-button
        size="mini"
        icon="el-icon-plus"
        type="primary"
        style="float: left;background-color: cadetblue;border-color: cadetblue"
      >新增区县</el-button>
      <el-table
        :data="areList.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        style="width: 100%;margin-bottom: 20px;"
        row-key="are_id"
        :header-cell-style="rowClass"
        :cell-style="cellStyle"
        :tree-props="{children: 'twoList', hasChildren: 'hasChildren'}">
        <el-table-column
          prop="are_id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="are_name"
          label="名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300px">
          <template slot-scope="scope">
            <el-row>
              <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit"></el-button>
              <el-button style="background-color: indianred;border-color: indianred" type="danger" size="mini" class="el-icon-delete"></el-button>
              <el-button v-if="scope.row.parent_id ==0" type="primary" size="mini" icon="el-icon-plus"
                         class="add" >添加地标
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="PageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalCount">
      </el-pagination>
    </div>
</template>

<script>
export default {
  name: 'area',
  data () {
    return {
      addvisible: false,
      updatevisible: false,
      areList: {},
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [5, 9, 15, 30],
      // 默认每页显示的条数（可修改）
      PageSize: 5
    }
  },
  created: function () {
    this.showAre()
  },
  methods: {
    /* 显示数据 */
    showAre () {
      this.$axios.post('areaCon/queryAre')
        .then(response => {
          this.areList = response
          this.totalCount = response.length
        })
    },
    // 设置表头的颜色
    rowClass () {
      return 'background:#545c64;color:white'
    },
    // 设置指定行、列、具体单元格颜色
    cellStyle () {
      return 'background:#545c64;color:white'
    },
    handleSizeChange (val) {
      // 改变每页显示的条数
      this.PageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange (val) {
      // 改变默认的页数
      this.currentPage = val
    }
  }
}
</script>

<style scoped>

</style>
