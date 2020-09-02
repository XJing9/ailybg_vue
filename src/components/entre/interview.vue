<template xmlns:el-table="http://www.w3.org/1999/html">
  <div>
    <el-input prop="int_name" v-model="int_name" type="text" placeholder="请输入" style="width:200px;height:30px;"></el-input>
    <el-button @click="findAll()">搜索</el-button>
    <el-button type="text" @click="showDialog1()">添加</el-button>
    <!-- data:绑定数据  height:声明之后会固定表头-->
    <el-table :data="pageInfo.slice((currentPage-1)*PageSize,currentPage*PageSize) "
              style="width: 100%;margin-bottom: 20px;"
              :header-cell-style="rowClass"
              :cell-style="cellStyle">
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- prop显示绑定的数据的属性 -->
      <el-table-column prop="int_id" label="编号"></el-table-column>
      <el-table-column prop="int_name" label="联系人"></el-table-column>
      <el-table-column prop="int_email" label="邮箱"></el-table-column>
      <el-table-column prop="int_qq" label="QQ"></el-table-column>
      <el-table-column prop="int_reladdress" label="联系地址"></el-table-column>
      <el-table-column prop="ent_name" label="企业编号"></el-table-column>
      <el-table-column prop="int_state" label="状态">
        <template slot-scope="{row: {int_state}}">
          <span v-if="+int_state===1">在</span>
          <span v-else-if="+int_state===0">不在</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="showDialog(scope.row)">修改</el-button>
          <el-button type="text" @click="deleleById(scope.row)">删除</el-button>
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
      <el-form label-width="100px" label-suffix="：" :model="interview" class="form" :rules="rules" ref="fm">
        <el-form-item label="编号" prop="int_id" >
          <!-- 必须去声明绑定的数据模型 -->
          <el-input :disabled="true" v-model="interview.int_id"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="int_name">
          <el-input  v-model="interview.int_name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="int_email">
          <el-input  v-model="interview.int_email"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="int_qq">
          <el-input  v-model="interview.int_qq"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="int_reladdress">
          <el-input  v-model="interview.int_reladdress"></el-input>
        </el-form-item>
        <el-form-item label="企业编号" prop="ent_id">
          <el-select v-model="interview.ent_id" placeholder="请选择" >
            <el-option
              v-for="item in this.entlist"
              :key="item.ent_id"
              :label="item.ent_name"
              :value="item.ent_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="int_state">
          <el-input  v-model="interview.int_state"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit()">确 定</el-button>
        <el-button type="success" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog width="50%" title="添加物品" :visible="dialogVisible1" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="interview" class="form" :rules="rules" ref="fm">
        <!--<el-form-item hidden label="编号" prop="id">-->
        <!--&lt;!&ndash; 必须去声明绑定的数据模型 &ndash;&gt;-->
        <!--<el-input ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item  hidden label="编号" prop="int_id" >
          <el-input  v-model="interview.int_id"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="int_name">
          <el-input  v-model="interview.int_name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="int_email">
          <el-input  v-model="interview.int_email"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="int_qq">
          <el-input  v-model="interview.int_qq"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="int_reladdress">
          <el-input  v-model="interview.int_reladdress"></el-input>
        </el-form-item>
        <el-form-item label="企业编号" prop="ent_id">
          <el-select v-model="interview.ent_id" placeholder="请选择" >
            <el-option
              v-for="item in this.entlist"
              :key="item.ent_id"
              :label="item.ent_name"
              :value="item.ent_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="int_state">
          <el-input  v-model="interview.int_state"></el-input>
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
  name: 'interview',
  components: {ElSelectDropdown},
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
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
      interview: {},
      int_name: '',
      entlist: []
    }
  },
  created: function () {
    this.findAll()
  },
  methods: {
    findAll: function () {
      this.$axios.post('Interview/query?int_name=' + this.int_name)
        .then(response => {
          this.pageInfo = response
          this.total = this.pageInfo.length
          // alert(this.total)
        })
    },
    findent: function () {
      this.$axios.post('Interview/queryent')
        .then(response => {
          this.entlist = response
        })
    },
    showDialog: function (row) {
      // 显示模态窗口
      this.dialogVisible = true
      this.interview = row
      this.findent()
    },
    showDialog1: function () {
      // 显示模态窗口
      this.dialogVisible1 = true
      this.interview = {}
      this.findent()
    },
    add: function () {
      this.$axios.post('Interview/add', this.interview)
        .then(response => {
          this.dialogVisible1 = false
          this.list = response
          this.findAll()
        })
    },
    edit: function (row) {
      this.$axios.post('Interview/update', this.interview)
        .then(response => {
          this.dialogVisible = false
          this.list = response
          this.findAll()
        })
    },
    deleleById: function (row) {
      this.$confirm('确定删除编号为' + row.int_id + '的数据？').then(_ => {
        this.$axios.post('Interview/delete?int_id=' + row.int_id)
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
