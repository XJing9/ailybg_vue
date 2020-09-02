<template>
    <div>
      <el-button
        @click="updateInduList={};addvisible=true"
        size="mini"
        icon="el-icon-plus"
        type="primary"
        style="float: left;background-color: cadetblue;border-color: cadetblue"
      >新增</el-button>
      <el-table
        :data="induList.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        style="width: 100%;margin-bottom: 20px;"
        row-key="indu_id"
        :header-cell-style="rowClass"
        :cell-style="cellStyle">
        <el-table-column
          prop="indu_id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="indu_name"
          label="名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300px">
          <template slot-scope="scope">
            <el-row>
              <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit" @click="updatevisible=true;showPermissionDialog(scope.row)"></el-button>
              <el-button style="background-color: indianred;border-color: indianred" type="danger" size="mini" class="el-icon-delete" @click="deleteIndu(scope.row)"></el-button>

            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="PageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalCount">
      </el-pagination>

      <!--添加行业类型-->
      <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="addvisible"
                 title="添加行业类型">
        <el-form ref="configForm" :model="updateInduList" size="small" label-width="100px"
                 style="width: 50%" class="form">

          <el-form-item label="行业名称" prop="indu_name">
            <el-input clearable v-model="updateInduList.indu_name" name="indu_name" size="small" placeholder="请输入行业类型"/>
          </el-form-item>

          <el-form-item>
            <el-button :loading="addBtnLoading" type="primary" size="small"
                       @click="addIndu">立即提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--修改行业类型-->
      <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="updatevisible"
                 title="修改行业类型">
        <el-form ref="configForm" :model="updateInduList" size="small" label-width="100px"
                 style="width: 50%" class="form">

          <el-form-item label="行业名称" prop="indu_name">
            <el-input clearable v-model="updateInduList.indu_name" name="indu_name" size="small" placeholder="请输入行业类型"/>
          </el-form-item>

          <el-form-item>
            <el-button :loading="updateBtnLoading" type="primary" size="small"
                       @click="updateIndu()">立即提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'industrys',
  data () {
    return {
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [5, 9, 15, 30],
      // 默认每页显示的条数（可修改）
      PageSize: 5,
      induList: {},
      updateInduList: {},
      updateBtnLoading: false,
      addBtnLoading: false,
      updatevisible: false,
      addvisible: false
    }
  },
  created: function () {
    this.showIndu()
  },
  methods: {
    /* 显示数据 */
    showIndu: function () {
      this.$axios.post('IndustrysCon/queryAll')
        .then(response => {
          this.induList = response
          this.totalCount = response.length
        })
    },
    addIndu: function () {
      this.$axios.post('IndustrysCon/insert', this.$qs.stringify(this.updateInduList))
        .then(response => {
          if (response != null) {
            this.$message({
              showClose: true,
              message: '恭喜你，添加成功',
              type: 'success'
            })
            this.addvisible = false
            this.showIndu()
          } else {
            this.$message({
              showClose: true,
              message: '添加失败！',
              type: 'error'
            })
          }
        })
    },
    updateIndu: function () {
      console.log(this.updateInduList)
      this.$axios.post('IndustrysCon/update', this.$qs.stringify(this.updateInduList))
        .then(response => {
          if (response != null) {
            this.$message({
              showClose: true,
              message: '恭喜你，修改成功',
              type: 'success'
            })
            this.updatevisible = false
            this.showIndu()
          } else {
            this.$message({
              showClose: true,
              message: '修改失败！',
              type: 'error'
            })
          }
        })
    },
    showPermissionDialog: function (row) {
      console.log(row)
      this.updateInduList = row
    },
    /* 删除 */
    deleteIndu: function (row) {
      this.$axios.post('IndustrysCon/delete?indu_id=' + row.indu_id)
        .then(response => {
          if (response != null) {
            this.$message({
              showClose: true,
              message: '恭喜你，删除成功',
              type: 'success'
            })
            this.showIndu()
          } else {
            this.$message({
              showClose: true,
              message: '删除失败！',
              type: 'error'
            })
          }
        })
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
    },
    // 设置表头的颜色
    rowClass () {
      return 'background:#545c64;color:white'
    },
    // 设置指定行、列、具体单元格颜色
    cellStyle () {
      return 'background:#545c64;color:white'
    }
  }
}
</script>

<style scoped>

</style>
