<template xmlns:el-table="http://www.w3.org/1999/html">
  <div>
    <el-input prop="iss_name" v-model="iss_name" type="text" placeholder="请输入" style="width:200px;height:30px;"></el-input>
    <el-button @click="findAll()" type="primary">搜索</el-button>
    <!--<el-button type="primary" @click="showDialog1()">添加</el-button>-->
    <!-- data:绑定数据  height:声明之后会固定表头-->
    <el-table :data="pageInfo.slice((currentPage-1)*PageSize,currentPage*PageSize) "
              style="width: 100%;margin-bottom: 20px;"
              :header-cell-style="rowClass"
              :cell-style="cellStyle">
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- prop显示绑定的数据的属性 -->
      <el-table-column prop="iss_id" label="编号"></el-table-column>
      <el-table-column prop="iss_name" label="职位名称"></el-table-column>
      <el-table-column prop="ent_id" label="企业编号"></el-table-column>
      <el-table-column prop="iss_worknature" label="工作性质"></el-table-column>
      <el-table-column prop="iss_count" label="招聘人数"></el-table-column>
      <el-table-column prop="iss_department" label="招聘部门"></el-table-column>
      <el-table-column prop="iss_education" label="学历要求"></el-table-column>
      <el-table-column prop="iss_experience" label="工作经验"></el-table-column>
      <el-table-column prop="iss_age" label="年龄要求范围"></el-table-column>
      <el-table-column prop="iss_address" label="工作地点"></el-table-column>
      <el-table-column prop="iss_describe" label="职位描述"></el-table-column>
      <el-table-column show-overflow-tooltip prop="iss_state" fixed="right" label="状态" align="center" width="120">
        <template slot-scope="{row}">
          <el-switch v-model="row.iss_state" :active-value="1"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     :inactive-value="2" size="small"
                     @change="setStatus(row)"/>
          <span v-if="+row.iss_state===1">已审核</span>
          <span v-else-if="+row.iss_state===2">未审核</span>
        </template>
      </el-table-column>
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

    <el-dialog width="40%" title="物品修改" :visible="dialogVisible" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="issue_position" class="form" :rules="rules" ref="fm">
        <el-form-item label="编号" prop="iss_id" >
          <!-- 必须去声明绑定的数据模型 -->
          <el-input :disabled="true" v-model="issue_position.iss_id"></el-input>
        </el-form-item>
        <el-form-item label="职位名称" prop="iss_name">
          <el-input  v-model="issue_position.iss_name"></el-input>
        </el-form-item>
        <el-form-item label="企业编号" prop="ent_id">
          <el-select v-model="issue_position.ent_id" placeholder="请选择" >
            <el-option
              v-for="item in this.entlist"
              :key="item.ent_id"
              :label="item.ent_name"
              :value="item.ent_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工作性质" prop="iss_worknature">
          <el-input  v-model="issue_position.iss_worknature"></el-input>
        </el-form-item>
        <el-form-item label="招聘人数" prop="iss_count">
          <el-input  v-model="issue_position.iss_count"></el-input>
        </el-form-item>
        <el-form-item label="招聘部门" prop="iss_department">
          <el-input  v-model="issue_position.iss_department"></el-input>
        </el-form-item>
        <el-form-item label="学历要求" prop="iss_education">
          <el-input  v-model="issue_position.iss_education"></el-input>
        </el-form-item>
        <el-form-item label="工作经验" prop="iss_experience">
          <el-input  v-model="issue_position.iss_experience"></el-input>
        </el-form-item>
        <el-form-item label="年龄要求范围" prop="iss_age">
          <el-input  v-model="issue_position.iss_age"></el-input>
        </el-form-item>
        <el-form-item label="工作地点" prop="iss_address">
          <el-input  v-model="issue_position.iss_address"></el-input>
        </el-form-item>
        <el-form-item label="职位描述" prop="iss_describe">
          <el-input  v-model="issue_position.iss_describe"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="iss_state">
          <el-input  v-model="issue_position.iss_state"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit()">确 定</el-button>
        <el-button type="success" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog width="50%" title="添加物品" :visible="dialogVisible1" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="issue_position" class="form" :rules="rules" ref="fm">
        <!--<el-form-item hidden label="编号" prop="id">-->
        <!--&lt;!&ndash; 必须去声明绑定的数据模型 &ndash;&gt;-->
        <!--<el-input ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item  hidden label="编号" prop="iss_id" >
          <el-input  v-model="issue_position.iss_id"></el-input>
        </el-form-item>
        <el-form-item label="职位名称" prop="iss_name">
          <el-input  v-model="issue_position.iss_name"></el-input>
        </el-form-item>
        <el-form-item label="企业编号" prop="ent_id">
          <el-select v-model="issue_position.ent_id" placeholder="请选择" >
            <el-option
              v-for="item in this.entlist"
              :key="item.ent_id"
              :label="item.ent_name"
              :value="item.ent_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工作性质" prop="iss_worknature">
          <el-input  v-model="issue_position.iss_worknature"></el-input>
        </el-form-item>
        <el-form-item label="招聘人数" prop="iss_count">
          <el-input  v-model="issue_position.iss_count"></el-input>
        </el-form-item>
        <el-form-item label="招聘部门" prop="iss_department">
          <el-input  v-model="issue_position.iss_department"></el-input>
        </el-form-item>
        <el-form-item label="学历要求" prop="iss_education">
          <el-input  v-model="issue_position.iss_education"></el-input>
        </el-form-item>
        <el-form-item label="工作经验" prop="iss_experience">
          <el-input  v-model="issue_position.iss_experience"></el-input>
        </el-form-item>
        <el-form-item label="年龄要求范围" prop="iss_age">
          <el-input  v-model="issue_position.iss_age"></el-input>
        </el-form-item>
        <el-form-item label="工作地点" prop="iss_address">
          <el-input  v-model="issue_position.iss_address"></el-input>
        </el-form-item>
        <el-form-item label="职位描述" prop="iss_describe">
          <el-input  v-model="issue_position.iss_describe"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="iss_state">
          <el-input  v-model="issue_position.iss_state"></el-input>
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
import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'
export default {
  name: 'issue_position',
  components: {ElSelectDropdown},
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      complaint: {},
      pageInfo: [],
      pageSizes: [1, 2, 3, 4, 6],
      // 每页显示的条数
      PageSize: 6,
      // 默认显示第几页
      currentPage: 1,
      total: 0,
      rules: {},
      list: [
      ],
      issue_position: {
        iss_name: '',
        iss_worknature: '',
        iss_count: '',
        iss_department: '',
        iss_education: '',
        iss_experience: '',
        iss_age: '',
        iss_address: '',
        iss_describe: '',
        iss_state: ''
      },
      entlist: [],
      iss_name: ''
    }
  },
  created: function () {
    this.findAll()
  },
  methods: {
    findAll: function () {
      this.$axios.post('Issue_position/query?iss_name=' + this.iss_name)
        .then(response => {
          this.pageInfo = response
          this.total = this.pageInfo.length
        })
    },
    findent: function () {
      this.$axios.post('Issue_position/queryent')
        .then(response => {
          this.entlist = response
        })
    },
    showDialog: function (row) {
      // 显示模态窗口
      this.dialogVisible = true
      this.issue_position = row
      this.findent()
    },
    showDialog1: function () {
      // 显示模态窗口
      this.dialogVisible1 = true
      this.issue_position = {}
      this.findent()
    },
    add: function () {
      this.$axios.post('Issue_position/queryl').then(response => {
        this.list = response
        if (this.issue_position.iss_name == null || this.issue_position.iss_worknature == null ||
              this.issue_position.iss_count == null || this.issue_position.iss_department == null ||
              this.issue_position.iss_education == null || this.issue_position.iss_experience == null ||
              this.issue_position.iss_age == null || this.issue_position.iss_address == null ||
              this.issue_position.iss_describe == null || this.issue_position.iss_state == null) {
          this.$message({
            message: '所有字段不能为空',
            type: 'error'
          })
          return false
        } else {
          this.$axios.post('Issue_position/add', this.issue_position)
            .then(response => {
              this.dialogVisible1 = false
              this.list = response
              this.findAll()
            })
        }
      })
    },
    edit: function (row) {
      this.$axios.post('Issue_position/update', this.issue_position)
        .then(response => {
          this.dialogVisible = false
          this.list = response
          this.findAll()
        })
    },
    deleleById: function (row) {
      this.$confirm('确定删除编号为' + row.iss_id + '的数据？').then(_ => {
        this.$axios.post('Issue_position/delete?iss_id=' + row.iss_id)
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
    },
    setStatus: function (row) {
      console.log(row.iss_id)
      this.$axios.post('Issue_position/updzt1', row)
        .then(response => {
          if (response > 0) {
            console.info(response)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.findAll()
          } else {
            console.info(response)
            this.$message({
              message: '修改失败！',
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
