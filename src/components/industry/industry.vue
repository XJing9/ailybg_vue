<template>
  <div>
    <el-button
      @click="updateIndList={};addvisible=true;addInit()"
      size="mini"
      icon="el-icon-plus"
      type="primary"
      style="float: left;background-color: cadetblue;border-color: cadetblue"
    >新增</el-button>
    <el-table
      :data="indList.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      style="width: 100%;margin-bottom: 20px;"
      :header-cell-style="rowClass"
      :cell-style="cellStyle">
      <el-table-column
        prop="ind_id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="ind_name"
        label="名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="indu_name"
        label="行业类型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="ind_state" fixed="right" label="状态" align="center" width="120">
        <template slot-scope="{row}">
          <!--{{ row.cus_state === 0 ? '正常' : '禁用' }}-->
          <el-switch v-model="row.ind_state" :active-value="1"
                     :inactive-value="2" size="small"
                     @change="setStatus(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-row>
            <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit" @click="updatevisible=true;showPermissionDialog(scope.row)"></el-button>
            <el-button style="background-color: indianred;border-color: indianred" type="danger" size="mini" class="el-icon-delete" @click="deleteInd(scope.row)"></el-button>
            <el-button v-if="scope.row.per_parent ==0" type="primary" size="mini" icon="el-icon-plus"
                       class="add" @click="addtwovisible=true;showTwoMenu(scope.row)">添加子级
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

    <!--添加职业类型-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="addvisible"
               title="添加职业类型">
      <el-form ref="configForm" :model="updateIndList" size="small" label-width="100px"
               style="width: 50%" class="form">

        <el-form-item label="职业类型名称" prop="ind_name">
          <el-input clearable v-model="updateIndList.ind_name" name="ind_name" size="small" placeholder="请输入行业类型"/>
        </el-form-item>

        <el-form-item label="行业类型" prop="indu_id">

          <el-select v-model="updateIndList.indu_id" placeholder="请选择">
            <el-option
              v-for="item in induList"
              :key="item.indu_id"
              :label="item.indu_name"
              :value="item.indu_id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-button :loading="addBtnLoading" type="primary" size="small"
                     @click="addInd">立即提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--修改职业类型-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="updatevisible"
               title="修改职业类型">
      <el-form ref="configForm" :model="updateIndList" size="small" label-width="100px"
               style="width: 50%" class="form">

        <el-form-item label="职业类型名称" prop="ind_name">
          <el-input clearable v-model="updateIndList.ind_name" name="ind_name" size="small" placeholder="请输入职业类型名称"/>
        </el-form-item>
        <el-form-item label="行业类型" prop="indu_id">

          <el-select v-model="updateIndList.indu_id" placeholder="请选择">
            <el-option
              v-for="item in induList"
              :key="item.indu_id"
              :label="item.indu_name"
              :value="item.indu_id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-button :loading="updateBtnLoading" type="primary" size="small"
                     @click="updateInd()">立即提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'industry',
  data () {
    return {
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [5, 9, 15, 30],
      // 默认每页显示的条数（可修改）
      PageSize: 5,
      indList: {},
      updateIndList: {
        ind_name: ''
      },
      induList: {},
      addvisible: false,
      updatevisible: false,
      addBtnLoading: false,
      updateBtnLoading: false
    }
  },
  created: function () {
    this.showInd()
  },
  methods: {
    /* 显示数据 */
    showInd: function () {
      this.$axios.post('Indus/query')
        .then(response => {
          this.indList = response
          this.totalCount = response.length
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
    },
    /* 添加初始化 */
    addInit () {
      this.$axios.post('IndustrysCon/queryAll')
        .then(response => {
          this.induList = response
        })
    },
    addInd: function () {
      if (this.updateIndList.ind_name == null || this.updateIndList.ind_name === '') {
        this.$message({
          message: '不能为空',
          type: 'error'
        })
        return false
      } else {
        this.$axios.post('Indus/insert', this.$qs.stringify(this.updateIndList))
          .then(response => {
            if (response != null) {
              this.$message({
                showClose: true,
                message: '恭喜你，添加成功',
                type: 'success'
              })
              this.addvisible = false
              this.showInd()
            } else {
              this.$message({
                showClose: true,
                message: '添加失败！',
                type: 'error'
              })
            }
          })
      }
    },
    updateInd: function () {
      console.log(this.updateIndList)
      this.$axios.post('Indus/update', this.$qs.stringify(this.updateIndList))
        .then(response => {
          if (response != null) {
            this.$message({
              showClose: true,
              message: '恭喜你，修改成功',
              type: 'success'
            })
            this.updatevisible = false
            this.shouInd()
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
      this.updateIndList = row
      this.addInit()
    },
    /* 修改状态 */
    setStatus: function (row) {
      this.$axios.post('Indus/updateState', this.$qs.stringify(row))
        .then(response => {
          if (response >= 1) {
            this.$message({
              showClose: true,
              message: '恭喜你，修改成功',
              type: 'success'
            })
            this.showInd()
          } else {
            this.$message({
              showClose: true,
              message: '修改失败！',
              type: 'error'
            })
          }
        })
    },
    /* 删除 */
    deleteInd: function (row) {
      this.$axios.post('Indus/delete?ind_id=' + row.ind_id)
        .then(response => {
          if (response != null) {
            this.$message({
              showClose: true,
              message: '恭喜你，删除成功',
              type: 'success'
            })
            this.showInd()
          } else {
            this.$message({
              showClose: true,
              message: '删除失败！',
              type: 'error'
            })
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
