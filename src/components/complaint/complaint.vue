<template xmlns:el-table="http://www.w3.org/1999/html">
  <div>
    <el-select prop="cau_id" v-model="cau_id" placeholder="投诉标签编号">
      <el-option
        v-for="item in this.caulist"
        :key="item.cau_id"
        :label="item.cau_name"
        :value="item.cau_id"/>
    </el-select>

    <el-input prop="com_phone" v-model="com_phone" type="text" placeholder="请输入" style="width:200px;height:30px;"></el-input>
    <el-button @click="findAll()">搜索</el-button>
    <el-button type="text" @click="showDialog1()">添加</el-button>
    <el-button type="text" @click="listquanbu()">全部</el-button>
    <!-- data:绑定数据  height:声明之后会固定表头-->
    <el-table :data="pageInfo.slice((currentPage-1)*PageSize,currentPage*PageSize) " style="width: 100%;margin-bottom: 20px;"
              :header-cell-style="rowClass"
              :cell-style="cellStyle">
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- prop显示绑定的数据的属性 -->
      <el-table-column prop="com_id" label="编号"></el-table-column>
      <el-table-column prop="cus_name" label="用户编号"></el-table-column>
      <el-table-column prop="adm_name" label="管理员编号"></el-table-column>
      <el-table-column prop="iss_name" label="职位编号"></el-table-column>
      <el-table-column prop="cau_name" label="投诉标签编号"></el-table-column>
      <el-table-column prop="com_phone" label="联系电话"></el-table-column>
      <el-table-column show-overflow-tooltip prop="com_auditstate" fixed="right" label="复审核状态" align="center" width="120">
        <template slot-scope="{row}">
          <el-switch v-model="row.com_auditstate" :active-value="1"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     :inactive-value="2" size="small"
                     @change="setStatus1(row)"/>
          <span v-if="+row.com_auditstate===1">已审核</span>
          <span v-else-if="+row.com_auditstate===2">未审核</span>
        </template>
      </el-table-column>
      <el-table-column prop="com_result" label="处理结果"></el-table-column>
      <el-table-column show-overflow-tooltip prop="com_state" fixed="right" label="处理状态" align="center" width="120">
        <template slot-scope="{row}">
          <el-switch v-model="row.com_state" :active-value="1"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     :inactive-value="2" size="small"
                     @change="setStatus2(row)"/>
          <span v-if="+row.com_state===1">已处理</span>
          <span v-else-if="+row.com_state===2">未处理</span>
        </template>
      </el-table-column>
      <el-table-column prop="com_remark" label="备注说明"></el-table-column>
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
      <el-form label-width="100px" label-suffix="：" :model="complaint" class="form" :rules="rules" ref="fm">
        <el-form-item label="编号" prop="wel_id" >
          <!-- 必须去声明绑定的数据模型 -->
          <el-input :disabled="true" v-model="complaint.com_id"></el-input>
        </el-form-item>
        <el-form-item label="用户编号" prop="cus_id">
          <el-select v-model="complaint.cus_id" placeholder="请选择" >
            <el-option
              v-for="item in this.cuslist"
              :key="item.cus_id"
              :label="item.cus_name"
              :value="item.cus_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员编号" prop="adm_id">
          <el-select v-model="complaint.adm_id" placeholder="请选择" >
            <el-option
              v-for="item in this.admlist"
              :key="item.adm_id"
              :label="item.adm_name"
              :value="item.adm_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="职位编号" prop="iss_id">
          <el-select v-model="complaint.iss_id" placeholder="请选择" >
            <el-option
              v-for="item in this.isslist"
              :key="item.iss_id"
              :label="item.iss_name"
              :value="item.iss_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉标签号" prop="cau_id">
          <el-select v-model="complaint.cau_id" placeholder="请选择" >
            <el-option
              v-for="item in this.caulist"
              :key="item.cau_id"
              :label="item.cau_name"
              :value="item.cau_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="com_phone">
          <el-input v-model="complaint.com_phone"></el-input>
        </el-form-item>
        <el-form-item label="复审核状态" prop="com_auditstate">
          <el-input v-model="complaint.com_auditstate"></el-input>
        </el-form-item>
        <el-form-item label="处理结果" prop="com_result">
          <el-input v-model="complaint.com_result"></el-input>
        </el-form-item>
        <el-form-item label="处理状态" prop="com_state">
          <el-input v-model="complaint.com_state"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" prop="com_remark">
          <el-input v-model="complaint.com_remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit()">确 定</el-button>
        <el-button type="success" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog width="40%" title="添加物品" :visible="dialogVisible1" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="complaint" class="form" :rules="rules" ref="fm">
        <!--<el-form-item hidden label="编号" prop="id">-->
        <!--&lt;!&ndash; 必须去声明绑定的数据模型 &ndash;&gt;-->
        <!--<el-input ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item  hidden label="编号" prop="wel_id" >
          <el-input  v-model="complaint.com_id"></el-input>
        </el-form-item>
        <el-form-item label="用户编号" prop="cus_id">
          <el-select v-model="complaint.cus_id" placeholder="请选择" >
            <el-option
              v-for="item in this.cuslist"
              :key="item.cus_id"
              :label="item.cus_name"
              :value="item.cus_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员编号" prop="adm_id">
          <el-select v-model="complaint.adm_id" placeholder="请选择" >
            <el-option
              v-for="item in this.admlist"
              :key="item.adm_id"
              :label="item.adm_name"
              :value="item.adm_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="职位编号" prop="iss_id">
          <el-select v-model="complaint.iss_id" placeholder="请选择" >
            <el-option
              v-for="item in this.isslist"
              :key="item.iss_id"
              :label="item.iss_name"
              :value="item.iss_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉标签号" prop="cau_id">
          <el-select v-model="complaint.cau_id" placeholder="请选择" >
            <el-option
              v-for="item in this.caulist"
              :key="item.cau_id"
              :label="item.cau_name"
              :value="item.cau_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="com_phone">
          <el-input v-model="complaint.com_phone"></el-input>
        </el-form-item>
        <el-form-item label="复审核状态" prop="com_auditstate">
          <el-input v-model="complaint.com_auditstate"></el-input>
        </el-form-item>
        <el-form-item label="处理结果" prop="com_result">
          <el-input v-model="complaint.com_result"></el-input>
        </el-form-item>
        <el-form-item label="处理状态" prop="com_state">
          <el-input v-model="complaint.com_state"></el-input>
        </el-form-item>
        <el-form-item label="备注说明" prop="com_remark">
          <el-input v-model="complaint.com_remark"></el-input>
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
  name: 'complaint',
  components: {ElSelectDropdown},
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      complaint: {},
      com_phone: '',
      cau_id: '',
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
      cuslist: [],
      customer: {},
      admlist: [],
      admins: {},
      isslist: [],
      issue_position: {},
      caulist: [],
      cause: {},
      cljg: []
    }
  },
  created: function () {
    this.findAll()
    this.findcus()
    this.findadm()
    this.findiss()
    this.findcau()
    this.findcljg()
  },
  methods: {
    findAll: function () {
      console.log(this.com_phone)
      console.log(this.cau_id)
      this.$axios.post('Complaint/show?com_phone=' + this.com_phone + '&cau_id=' + this.cau_id)
        .then(response => {
          this.pageInfo = response
          this.total = this.pageInfo.length
          // alert(this.total)
        })
    },
    listquanbu: function () {
      this.$axios.post('Complaint/showlist1').then(response => {
        this.pageInfo = response
        this.total = this.pageInfo.length
      })
    },
    findcus: function () {
      this.$axios.post('Complaint/cus')
        .then(response => {
          this.cuslist = response
        })
    },
    findadm: function () {
      this.$axios.post('Complaint/adm')
        .then(response => {
          this.admlist = response
        })
    },
    findiss: function () {
      this.$axios.post('Complaint/iss')
        .then(response => {
          this.isslist = response
        })
    },
    findcau: function () {
      this.$axios.post('Complaint/cau')
        .then(response => {
          this.caulist = response
        })
    },
    showDialog: function (row) {
      // 显示模态窗口
      this.dialogVisible = true
      this.complaint = row
      this.findcus()
      this.findadm()
      this.findiss()
      this.findcau()
    },
    showDialog1: function () {
      // 显示模态窗口
      this.dialogVisible1 = true
      this.complaint = {}
      this.findcus()
      this.findadm()
      this.findiss()
      this.findcau()
    },
    add: function () {
      this.$axios.post('Complaint/add', this.complaint)
        .then(response => {
          this.dialogVisible1 = false
          this.list = response
          this.listquanbu()
        })
    },
    edit: function (row) {
      this.$axios.post('Complaint/update', this.complaint)
        .then(response => {
          this.dialogVisible = false
          this.list = response
          console.log(this.list)
          this.listquanbu()
        })
    },
    deleleById: function (row) {
      this.$confirm('确定删除编号为' + row.com_id + '的数据？').then(_ => {
        this.$axios.post('Complaint/delete?com_id=' + row.com_id)
          .then(response => {
            this.dialogVisible = false
            this.list = response
            // alert(1)
            this.listquanbu()
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
    setStatus1: function (row) {
      console.log(row)
      this.$axios.post('Complaint/updfhzt', row)
        .then(response => {
          if (response > 0) {
            console.info(response)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.listquanbu()
          } else {
            console.info(response)
            this.$message({
              message: '修改失败！',
              type: 'error'
            })
          }
        })
    },
    setStatus2: function (row) {
      console.log(row)
      this.$axios.post('Complaint/updclzt', row)
        .then(response => {
          if (response > 0) {
            console.info(response)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.listquanbu()
          } else {
            console.info(response)
            this.$message({
              message: '修改失败！',
              type: 'error'
            })
          }
        })
    },
    findcljg: function (row) {
      this.$axios.post('Complaint/queryqb1').then(response => {
        this.cljg = response
      })
    }
  }
}
</script>

<style scoped>

</style>
