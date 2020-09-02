<template>
  <div>
    <el-input prop="wel_name" v-model="wel_name" type="text" placeholder="请输入" style="width:200px;height:30px;"></el-input>
    <el-button type="primary" @click="findAll()">搜索</el-button>
    <el-button type="primary" @click="showDialog1()">添加</el-button>
    <!-- data:绑定数据  height:声明之后会固定表头-->
    <el-table :data="pageInfo.slice((currentPage-1)*PageSize,currentPage*PageSize) "
              style="width: 100%;margin-bottom: 20px;"
              :header-cell-style="rowClass"
              :cell-style="cellStyle">
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- prop显示绑定的数据的属性 -->
      <el-table-column prop="wel_id" label="编号"></el-table-column>
      <el-table-column prop="wel_name" label="物品名称"></el-table-column>
      <el-table-column prop="wel_state" label="状态">
        <template slot-scope="{row: {wel_state}}">
          <span v-if="+wel_state === 1">有货</span>
          <span v-else-if="+ wel_state=== 0">没货</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-share" @click="showDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-delete" @click="deleleById(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="PageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>

    </div>

    <el-dialog width="40%" title="物品修改" :visible="dialogVisible" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="welfare" class="form" :rules="rules" ref="fm">
        <el-form-item label="编号" prop="wel_id" >
          <!-- 必须去声明绑定的数据模型 -->
          <el-input :disabled="true" v-model="welfare.wel_id"></el-input>
        </el-form-item>
        <el-form-item label="物品名称" prop="wel_name">
          <el-input v-model="welfare.wel_name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="wel_state">
          <el-input v-model="welfare.wel_state"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit()">确 定</el-button>
        <el-button type="success" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="40%" title="添加物品" :visible="dialogVisible1" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="welfare" class="form" :rules="rules" ref="fm">
        <!--<el-form-item hidden label="编号" prop="id">-->
        <!--&lt;!&ndash; 必须去声明绑定的数据模型 &ndash;&gt;-->
        <!--<el-input ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item  hidden label="编号" prop="wel_id" >
          <!-- 必须去声明绑定的数据模型 -->
          <el-input  v-model="welfare.wel_id"></el-input>
        </el-form-item>
        <el-form-item label="物品名称" prop="wel_name">
          <el-input v-model="welfare.wel_name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="wel_state">
          <el-input v-model="welfare.wel_state"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add()">确 定</el-button>
        <el-button type="success" @click="dialogVisible1 = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'welfare',
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      welfare: {},
      wel_name: '',
      pageInfo: [],
      pageSizes: [1, 2, 3, 4, 6],
      // 每页显示的条数
      PageSize: 6,
      // 默认显示第几页
      currentPage: 1,
      total: 0,
      rules: {},
      list: [
      ]
    }
  },
  created: function () {
    this.findAll()
  },
  methods: {
    findAll: function (row) {
      this.$axios.post('Welfare/mhquery?wel_name=' + this.wel_name)
        .then(response => {
          this.pageInfo = response
          this.total = this.pageInfo.length
          // alert(this.total)
        })
    },
    showDialog: function (row) {
      // 显示模态窗口
      this.dialogVisible = true
      this.welfare = row
    },
    showDialog1: function () {
      // 显示模态窗口
      this.dialogVisible1 = true
      this.welfare = {}
    },
    add: function () {
      this.$axios.post('Welfare/add', this.welfare)
        .then(response => {
          this.dialogVisible1 = false
          this.list = response
          this.findAll()
        })
    },
    edit: function (row) {
      console.log(this.welfare.wel_id)
      this.$axios.post('Welfare/update', this.welfare)
        .then(response => {
          this.dialogVisible = false
          this.list = response
          console.log(this.list)
          this.findAll()
        })
    },
    deleleById: function (row) {
      // alert(row.wel_id)
      this.$confirm('确定删除编号为' + row.wel_id + '的数据？').then(_ => {
        this.$axios.post('Welfare/delete?wel_id=' + row.wel_id)
          .then(response => {
            this.dialogVisible = false
            this.list = response
            this.findAll()
          })
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭?').then(_ => {
        this.dialogVisible = false
        this.dialogVisible1 = false
      }).catch(_ => {})
    },
    handleSizeChange (val) {
      this.PageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1
    },
    handleCurrentChange (val) {
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
