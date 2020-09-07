<template>
  <div>
    <el-input prop="spe_name" v-model="spe_name" type="text" placeholder="请输入" style="width:200px;height:30px;"></el-input>
    <el-button type="primary" @click="findAll()">搜索</el-button>
    <el-button type="primary" @click="showDialog1()">添加</el-button>
    <!-- data:绑定数据  height:声明之后会固定表头-->
    <el-table :data="pageInfo.slice((currentPage-1)*PageSize,currentPage*PageSize) " style="width: 100%;margin-bottom: 20px;"
              :header-cell-style="rowClass"
              :cell-style="cellStyle">
      <el-table-column type="selection" width="55" ref="multipleTable"></el-table-column>
      <!-- prop显示绑定的数据的属性 -->
      <el-table-column prop="spe_id" label="编号"></el-table-column>
      <el-table-column prop="spe_name" label="特长"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit" @click="showDialog(scope.row)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" class="el-icon-delete" @click="deleleById(scope.row)">删除</el-button>
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

    <el-dialog width="40%" title="特长修改" :visible="dialogVisible" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="speciality" class="form" :rules="rules" ref="fm">
        <el-form-item label="编号" prop="spe_id" >
          <!-- 必须去声明绑定的数据模型 -->
          <el-input :disabled="true" v-model="speciality.spe_id"></el-input>
        </el-form-item>
        <el-form-item label="特长" prop="spe_name">
          <el-input v-model="speciality.spe_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit()">确 定</el-button>
        <el-button type="success" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="40%" title="添加特长" :visible="dialogVisible1" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="speciality" class="form" :rules="rules" ref="fm">
        <!--<el-form-item hidden label="编号" prop="id">-->
        <!--&lt;!&ndash; 必须去声明绑定的数据模型 &ndash;&gt;-->
        <!--<el-input ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item  hidden label="编号" prop="spe_id" >
          <!-- 必须去声明绑定的数据模型 -->
          <el-input  v-model="speciality.spe_id"></el-input>
        </el-form-item>
        <el-form-item label="特长" prop="spe_name">
          <el-input v-model="speciality.spe_name"></el-input>
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
  name: 'speciality',
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      speciality: {
        spe_name: ''
      },
      spe_name: '',
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
      this.$axios.post('Speciality/mhquery?spe_name=' + this.spe_name)
        .then(response => {
          this.pageInfo = response
          this.total = this.pageInfo.length
        })
    },
    showDialog: function (row) {
      // 显示模态窗口
      this.dialogVisible = true
      this.speciality = row
    },
    showDialog1: function () {
      // 显示模态窗口
      this.dialogVisible1 = true
      this.speciality = {}
    },
    findJy: function () {
      this.$axios.post('Speciality/query').then(response => {
        this.list = response.data
      })
    },
    add: function () {
      this.$axios('Speciality/queryl').then(response => {
        this.list = response
        for (var i = 0; i < this.list.length; i++) {
          var name1 = this.list[i].spe_name
          if (this.speciality.spe_name === name1) {
            this.$message({
              message: '相同的不能重复添加',
              type: 'error'
            })
            return false
          }
        }
        if (this.speciality.spe_name == null) {
          this.$message({
            message: '所有字段不能为空',
            type: 'error'
          })
          return false
        } else {
          this.$axios.post('Speciality/add', this.speciality)
            .then(response => {
              this.dialogVisible1 = false
              this.list = response
              this.findAll()
            })
        }
      })
    },
    edit: function (row) {
      this.$axios.post('Speciality/update', this.speciality)
        .then(response => {
          this.dialogVisible = false
          this.list = response
          this.findAll()
        })
    },
    deleleById: function (row) {
      this.$confirm('确定删除编号为' + row.spe_id + '的数据？').then(_ => {
        this.$axios.post('Speciality/delete?spe_id=' + row.spe_id)
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
