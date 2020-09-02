<template>
  <div>
    <el-button
      @click="updatePosList={};addvisible=true;addInit()"
      size="mini"
      icon="el-icon-plus"
      type="primary"
      style="float: left;background-color: cadetblue;border-color: cadetblue"
    >新增</el-button>
    <el-table
      :data="posList.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      style="width: 100%;margin-bottom: 20px;"
      :header-cell-style="rowClass"
      :cell-style="cellStyle">
      <el-table-column
        prop="pos_id"
        label="ID"
        width="180">
    </el-table-column>
      <el-table-column
        prop="pos_name"
        label="名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="ind_name"
        label="职业类型"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="Pos_state" fixed="right" label="状态" align="center" width="120">
        <template slot-scope="{row}">
          <!--{{ row.cus_state === 0 ? '正常' : '禁用' }}-->
          <el-switch v-model="row.pos_state" :active-value="1"
                     :inactive-value="2" size="small"
                     @change="setStatus(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-row>
            <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit" @click="updatevisible=true;showPermissionDialog(scope.row)"></el-button>
            <el-button style="background-color: Posianred;border-color: Posianred" type="danger" size="mini" class="el-icon-delete" @click="deletePos(scope.row)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="PageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
    </el-pagination>
    <!--添加职业信息-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="addvisible"
               title="添加职业信息">
      <el-form ref="configForm" :model="updatePosList" size="small" label-width="100px"
               style="width: 50%" class="form">

        <el-form-item label="职业名称" prop="pos_name">
          <el-input clearable v-model="updatePosList.pos_name" name="pos_name" size="small" placeholder="请输入职业名称"/>
        </el-form-item>
        <el-form-item label="职业类型" prop="ind_id">

          <el-select v-model="updatePosList.ind_id" placeholder="请选择">
            <el-option
              v-for="item in indList"
              :key="item.ind_id"
              :label="item.ind_name"
              :value="item.ind_id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-button :loading="addBtnLoading" type="primary" size="small"
                     @click="addPos">立即提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--修改职业信息-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="updatevisible"
               title="修改职业信息">
      <el-form ref="configForm" :model="updatePosList" size="small" label-width="100px"
               style="width: 50%" class="form">

        <el-form-item label="职业名称" prop="pos_name">
          <el-input clearable v-model="updatePosList.pos_name" name="pos_name" size="small" placeholder="请输入职业名称"/>
        </el-form-item>
        <el-form-item label="职业类型" prop="ind_id">

          <el-select v-model="updatePosList.ind_id" placeholder="请选择">
            <el-option
              v-for="item in indList"
              :key="item.ind_id"
              :label="item.ind_name"
              :value="item.ind_id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-button :loading="updateBtnLoading" type="primary" size="small"
                     @click="updatePos()">立即提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'position',
  data () {
    return {
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [5, 9, 15, 30],
      // 默认每页显示的条数（可修改）
      PageSize: 5,
      posList: {},
      updatePosList: {},
      indList: {},
      addvisible: false,
      updatevisible: false,
      updateBtnLoading: false,
      addBtnLoading: false
    }
  },
  created: function () {
    this.showPos()
  },
  methods: {
    /* 显示数据 */
    showPos: function () {
      this.$axios.post('PosCon/pos_query')
        .then(response => {
          this.posList = response
          console.log(this.posList)
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
      this.$axios.post('Indus/query')
        .then(response => {
          this.indList = response
          console.log(this.indList)
        })
    },
    addPos: function () {
      this.$axios.post('PosCon/pos_add', this.$qs.stringify(this.updatePosList))
        .then(response => {
          if (response != null) {
            this.$message({
              showClose: true,
              message: '恭喜你，添加成功',
              type: 'success'
            })
            this.addvisible = false
            this.showPos()
          } else {
            this.$message({
              showClose: true,
              message: '添加失败！',
              type: 'error'
            })
          }
        })
    },
    updatePos: function () {
      console.log(this.updatePosList)
      this.$axios.post('PosCon/pos_update', this.$qs.stringify(this.updatePosList))
        .then(response => {
          if (response != null) {
            this.$message({
              showClose: true,
              message: '恭喜你，修改成功',
              type: 'success'
            })
            this.updatevisible = false
            this.shouPos()
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
      this.updatePosList = row
      console.log(row)
      this.addInit()
    },
    /* 修改状态 */
    setStatus: function (row) {
      this.$axios.post('PosCon/updateState', this.$qs.stringify(row))
        .then(response => {
          if (response >= 1) {
            this.$message({
              showClose: true,
              message: '恭喜你，修改成功',
              type: 'success'
            })
            this.showPos()
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
    deletePos: function (row) {
      this.$axios.post('PosCon/pos_delete', this.$qs.stringify(row))
        .then(response => {
          if (response != null) {
            this.$message({
              showClose: true,
              message: '恭喜你，删除成功',
              type: 'success'
            })
            this.showPos()
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
