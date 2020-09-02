<template>
  <div>
    <el-input prop="ent_name" v-model="res_education" type="text" placeholder="请输入" style="width:200px;height:30px;"></el-input>

    <el-button icon="el-icon-search" circle @click="findAll()"></el-button>

    <el-table :data="pageInfo.slice((currentPage-1)*PageSize,currentPage*PageSize) "
              style="width: 100%;margin-bottom: 20px;"
              :header-cell-style="rowClass"
              :cell-style="cellStyle">
      <el-table-column type="expand" >
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="期望职业 ：">
              <span>{{ props.row.res_job }}</span>
            </el-form-item>
            <el-form-item label="工作地点 ：">
              <span>{{ props.row.res_workaddress }}</span>
            </el-form-item>
            <el-form-item label="期望薪资 ：">
              <span>{{ props.row.res_pay }}</span>
            </el-form-item>
            <el-form-item label="照片/作品 ：">
              <span>{{ props.row.res_photo }}</span>
            </el-form-item>
            <el-form-item label="用户编号 ：">
              <span>{{ props.row.cus_name }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="res_id" label="编号"></el-table-column>
      <el-table-column prop="res_education" label="最高教育程度"></el-table-column>
      <el-table-column prop="res_jobstate" label="求职状态"></el-table-column>
      <el-table-column prop="res_workcategory" label="工作性质"></el-table-column>
      <el-table-column prop="res_industry" label="期望行业"></el-table-column>
      <el-table-column show-overflow-tooltip prop="res_state" fixed="right" label="状态" align="center" width="120">
        <template slot-scope="{row}">
          <el-switch v-model="row.res_state" :active-value="1"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     :inactive-value="2" size="small"
                     @change="setStatus(row)"/>
          <span v-if="+row.res_state===1">已启用</span>
          <span v-else-if="+row.res_state===2">已禁用</span>
        </template>
      </el-table-column>
      <el-table-column  label="查看" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" round @click="showDialog1(scope.row)">教育</el-button>
        </template>
      </el-table-column>

      <el-table-column  label="查看" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" round @click="showDialog2(scope.row)">工作</el-button>
        </template>
      </el-table-column>

      <el-table-column   label="查看" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" round @click="showDialog3(scope.row)">证书</el-button>
        </template>
      </el-table-column>

      <el-table-column  label="查看" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" round @click="showDialog4(scope.row)">能力</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog width="40%" title="教育经历" :visible="dialogVisible" :before-close="handleClose">
      <el-table :data="edulist" style="width: 100%">
        <el-table-column label="编号" prop="edu_id"></el-table-column>
        <el-table-column label="学校名称" prop="edu_schoolname"></el-table-column>
        <el-table-column label="专业名称" prop="edu_majorname"></el-table-column>
        <el-table-column label="学历" prop="edu_education"></el-table-column>
        <el-table-column label="毕业时间" prop="edu_graduatetime"></el-table-column>
        <el-table-column label="简历编号" prop="res_id"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog width="40%" title="工作经历" :visible="dialogVisible1" :before-close="handleClose">
      <el-table :data="worklist" style="width: 100%">
        <el-table-column label="编号" prop="wor_id"></el-table-column>
        <el-table-column label="公司名称" prop="wor_companyname"></el-table-column>
        <el-table-column label="职位名称" prop="wor_workname"></el-table-column>
        <el-table-column label="入职时间" prop="wor_action"></el-table-column>
        <el-table-column label="离职时间" prop="wor_dimission"></el-table-column>
        <el-table-column label="工作职责" prop="wor_workduty"></el-table-column>
        <el-table-column prop="res_id" label="简历编号"></el-table-column>
        <el-table-column  label="查看" fixed="right" width="100px">
          <template slot-scope="scope">
            <el-button type="primary" round @click="showDialog5(scope.row)">项目</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog width="40%" title="获得证书" :visible="dialogVisible2" :before-close="handleClose">
      <el-table :data="cerlist" style="width: 100%">
        <el-table-column label="编号" prop="cer_id"></el-table-column>
        <el-table-column label="证书名称" prop="cer_name"></el-table-column>
        <el-table-column label="获得时间" prop="cer_time"></el-table-column>
        <el-table-column label="简历编号" prop="res_id"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog width="40%" title="语言能力" :visible="dialogVisible3" :before-close="handleClose">
      <el-table :data="lanlist" style="width: 100%">
        <el-table-column label="编号" prop="lan_id"></el-table-column>
        <el-table-column label="语种" prop="lan_name"></el-table-column>
        <el-table-column label="熟悉程度" prop="lan_degree"></el-table-column>
        <el-table-column label="简历编号" prop="res_id"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog width="40%" title="项目经历" :visible="dialogVisible4" :before-close="handleClose">
      <el-table :data="prolist" style="width: 100%">
        <el-table-column label="编号" prop="pro_id"></el-table-column>
        <el-table-column label="项目名称" prop="pro_name"></el-table-column>
        <el-table-column label="担任角色" prop="pro_role"></el-table-column>
        <el-table-column label="项目开始时间" prop="pro_action"></el-table-column>
        <el-table-column label="项目结束时间" prop="pro_finish"></el-table-column>
        <el-table-column label="项目描述" prop="pro_describe"></el-table-column>
        <el-table-column label="工作编号" prop="wor_id"></el-table-column>
      </el-table>
    </el-dialog>

    <!--分页-->
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
  </div>
</template>

<script>
export default {
  name: 'resume',
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      pageInfo: [],
      pageSizes: [1, 2, 3, 4, 6],
      // 每页显示的条数
      PageSize: 6,
      // 默认显示第几页
      currentPage: 1,
      total: 0,
      res_education: '',
      resume: {},
      edulist: [],
      worklist: [],
      cerlist: [],
      lanlist: [],
      prolist: []
    }
  },
  created: function () {
    this.findAll()
  },
  methods: {
    /* 显示数据 */
    showDialog1: function (row) {
      // 显示模态窗口
      this.dialogVisible = true
      this.resume = row
      this.findEdu(row)
    },
    showDialog2: function (row) {
      // 显示模态窗口
      this.dialogVisible1 = true
      this.resume = row
      this.findWork(row)
    },
    showDialog3: function (row) {
      // 显示模态窗口
      // alert(row.ent_id)
      this.dialogVisible2 = true
      this.resume = row
      this.findCer(row)
    },
    showDialog4: function (row) {
      // 显示模态窗口
      // alert(row.ent_id)
      this.dialogVisible3 = true
      this.resume = row
      this.findLan(row)
    },
    showDialog5: function (row) {
      this.dialogVisible4 = true
      this.resume = row
      this.findPro(row)
    },

    findAll: function () {
      this.$axios.post('Resume/queryName?res_education=' + this.res_education)
        .then(response => {
          this.pageInfo = response
          this.total = this.pageInfo.length
        })
    },
    findEdu: function (row) {
      this.$axios.post('Edu_experience/query?res_id=' + row.res_id)
        .then(response => {
          this.edulist = response
        })
    },
    findWork: function (row) {
      this.$axios.post('Work_experience/query?res_id=' + row.res_id)
        .then(response => {
          this.worklist = response
        })
    },
    findCer: function (row) {
      this.$axios.post('Certificate/query?res_id=' + row.res_id)
        .then(response => {
          this.cerlist = response
        })
    },
    findLan: function (row) {
      this.$axios.post('Language/query?res_id=' + row.res_id)
        .then(response => {
          this.lanlist = response
        })
    },
    findPro: function (row) {
      this.$axios.post('Project_experience/query?wor_id=' + row.wor_id)
        .then(response => {
          this.prolist = response
        })
    },
    setStatus: function (row) {
      this.$axios.post('Resume/updatezt', row)
        .then(response => {
          if (response > 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.findAll()
          } else {
            console.info(response)
            console.info(row.res_state)
            this.$message({
              message: '修改失败！',
              type: 'error'
            })
          }
        })
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
    handleClose (done) {
      this.$confirm('确认关闭?').then(_ => {
        this.dialogVisible = false
        this.dialogVisible1 = false
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.dialogVisible4 = false
      }).catch(_ => {})
    }
  }
}
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
