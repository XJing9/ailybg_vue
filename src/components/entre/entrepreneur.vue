<template>
  <div>
    <el-input prop="ent_name" v-model="ent_name" type="text" placeholder="请输入" style="width:200px;height:30px;"></el-input>

    <el-button icon="el-icon-search" circle @click="findAll()"></el-button>

    <el-button type="warning" @click="showDialog1()">添加</el-button>


    <el-table :data="pageInfo.slice((currentPage-1)*PageSize,currentPage*PageSize) "
              style="width: 100%;margin-bottom: 20px;"
              :header-cell-style="rowClass"
              :cell-style="cellStyle">
      <el-table-column type="expand" >
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="行业logo ：">
              <span>{{ props.row.ent_photo }}</span>
            </el-form-item>
            <el-form-item label="注册资金 ：">
              <span>{{ props.row.ent_capital }}</span>
            </el-form-item>
            <el-form-item label="企业网址 ：">
              <span>{{ props.row.ent_url }}</span>
            </el-form-item>
            <el-form-item label="企业简介 ：">
              <span>{{ props.row.ent_intro }}</span>
            </el-form-item>
            <el-form-item label="企业介绍 ：">
              <span>{{ props.row.ent_introduce }}</span>
            </el-form-item>
            <el-form-item label="最近登录时间 ：">
              <span>{{ props.row.ent_logintime }}</span>
            </el-form-item>
            <el-form-item label="营业执照 ：">
              <span>{{ props.row.ent_license }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="ent_id" label="编号"></el-table-column>
      <el-table-column prop="ent_name" label="企业名称"></el-table-column>
      <el-table-column prop="ent_abbreviation" label="企业简称"></el-table-column>
      <el-table-column prop="ent_nature" label="企业性质"></el-table-column>
      <el-table-column prop="ent_scale" label="企业规模"></el-table-column>
      <el-table-column prop="are_name" label="所在地区"></el-table-column>
      <el-table-column prop="ind_name" label="所属行业"></el-table-column>
      <el-table-column prop="ent_authentication" label="企业认证状态">
        <template slot-scope="{row: {ent_authentication}}">
          <span v-if="+ent_authentication===1">已认证</span>
          <span v-else-if="+ent_authentication===2">未认证</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="ent_state" fixed="right" label="状态" align="center" width="120">
        <template slot-scope="{row}">
          <el-switch v-model="row.ent_state" :active-value="1"
                     active-color="#13ce66"
                     inactive-color="#ff4949"
                     :inactive-value="2" size="small"
                     @change="setStatus(row)"/>
          <span v-if="+row.ent_state===1">已启用</span>
          <span v-else-if="+row.ent_state===2">以禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="showDialog(scope.row)">修改</el-button>
          <el-button type="text" @click="deleleById(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column  prop="ent_id" label="查看" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" round @click="showDialog2(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog width="40%" title="发布职位信息" :visible="dialogVisible2" :before-close="handleClose">
      <el-table :data="listissent" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="学历要求 ：">
                <span>{{ props.row.iss_education }}</span>
              </el-form-item>
              <el-form-item label="工作经验 ：">
                <span>{{ props.row.iss_experience }}</span>
              </el-form-item>
              <el-form-item label="年龄要求范围 ：">
                <span>{{ props.row.iss_age }}</span>
              </el-form-item>
              <el-form-item label="工作地点 ：">
                <span>{{ props.row.iss_address }}</span>
              </el-form-item>
              <el-form-item label="职位描述 ：">
                <span>{{ props.row.iss_describe }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="iss_id"></el-table-column>
        <el-table-column label="职位名称" prop="iss_name"></el-table-column>
        <el-table-column label="企业名称" prop="ent_name"></el-table-column>
        <el-table-column label="工作性质" prop="iss_worknature"></el-table-column>
        <el-table-column label="招聘人数" prop="iss_count"></el-table-column>
        <el-table-column label="招聘部门" prop="iss_department"></el-table-column>
        <el-table-column prop="iss_state" label="状态">
          <template slot-scope="{row: {iss_state}}">
            <span v-if="+iss_state===1">在职</span>
            <span v-else-if="+iss_state===0">离职</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100px">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" @click="deleleById2(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


    <el-dialog width="50%" title="添加物品" :visible="dialogVisible1" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="entreprenenur" class="form" :rules="rules" ref="fm">
        <!--<el-form-item hidden label="编号" prop="id">-->
        <!--&lt;!&ndash; 必须去声明绑定的数据模型 &ndash;&gt;-->
        <!--<el-input ></el-input>-->
        <!--</el-form-item>-->
        <el-form-item  hidden label="编号" prop="ent_id" >
          <el-input  v-model="entreprenenur.ent_id"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="ent_name">
          <el-input  v-model="entreprenenur.ent_name"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="ent_abbreviation">
          <el-input  v-model="entreprenenur.ent_abbreviation"></el-input>
        </el-form-item>
        <el-form-item label="企业性质" prop="ent_nature">
          <el-input  v-model="entreprenenur.ent_nature"></el-input>
        </el-form-item>
        <el-form-item label="企业规模" prop="ent_scale">
          <el-input  v-model="entreprenenur.ent_scale"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="are_id">
          <el-select v-model="entreprenenur.are_id" placeholder="请选择" >
            <el-option
              v-for="item in this.arelist"
              :key="item.are_id"
              :label="item.are_name"
              :value="item.are_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业" prop="ind_id">
          <el-select v-model="entreprenenur.ind_id" placeholder="请选择" >
            <el-option
              v-for="item in this.indlist"
              :key="item.ind_id"
              :label="item.ind_name"
              :value="item.ind_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="行业logo" prop="ent_photo">
          <el-input v-model="entreprenenur.ent_photo"></el-input>
        </el-form-item>
        <el-form-item label="注册资金" prop="ent_capital">
          <el-input v-model="entreprenenur.ent_capital"></el-input>
        </el-form-item>
        <el-form-item label="企业网址" prop="ent_url">
          <el-input v-model="entreprenenur.ent_url"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="ent_intro">
          <el-input v-model="entreprenenur.ent_intro"></el-input>
        </el-form-item>
        <el-form-item label="企业介绍" prop="ent_introduce">
          <el-input v-model="entreprenenur.ent_introduce"></el-input>
        </el-form-item>
        <el-form-item label="最近登录时间" prop="ent_logintime">
          <el-input v-model="entreprenenur.ent_logintime"></el-input>
        </el-form-item>
        <el-form-item label="营业执照" prop="ent_license">
          <el-input v-model="entreprenenur.ent_license"></el-input>
        </el-form-item>
        <el-form-item label="企业认证状态" prop="ent_authentication">
          <el-input v-model="entreprenenur.ent_authentication"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add()">确 定</el-button>
        <el-button type="success" @click="dialogVisible1 = false">取消</el-button>
      </div>
    </el-dialog>


    <el-dialog width="40%" title="物品修改" :visible="dialogVisible" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="entreprenenur" class="form" :rules="rules" ref="fm">
        <el-form-item label="编号" prop="ent_id" >
          <!-- 必须去声明绑定的数据模型 -->
          <el-input :disabled="true" v-model="entreprenenur.ent_id"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="ent_name">
          <el-input  v-model="entreprenenur.ent_name"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="ent_abbreviation">
          <el-input  v-model="entreprenenur.ent_abbreviation"></el-input>
        </el-form-item>
        <el-form-item label="企业性质" prop="ent_nature">
          <el-input  v-model="entreprenenur.ent_nature"></el-input>
        </el-form-item>
        <el-form-item label="企业规模" prop="ent_scale">
          <el-input  v-model="entreprenenur.ent_scale"></el-input>
        </el-form-item>
        <el-form-item label="所在地区" prop="are_id">
          <el-select v-model="entreprenenur.are_id" placeholder="请选择" >
            <el-option
              v-for="item in this.arelist"
              :key="item.are_id"
              :label="item.are_name"
              :value="item.are_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业" prop="ind_id">
          <el-select v-model="entreprenenur.ind_id" placeholder="请选择" >
            <el-option
              v-for="item in this.indlist"
              :key="item.ind_id"
              :label="item.ind_name"
              :value="item.ind_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="行业logo" prop="ent_photo">
          <el-input v-model="entreprenenur.ent_photo"></el-input>
        </el-form-item>
        <el-form-item label="注册资金" prop="ent_capital">
          <el-input v-model="entreprenenur.ent_capital"></el-input>
        </el-form-item>
        <el-form-item label="企业网址" prop="ent_url">
          <el-input v-model="entreprenenur.ent_url"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="ent_intro">
          <el-input v-model="entreprenenur.ent_intro"></el-input>
        </el-form-item>
        <el-form-item label="企业介绍" prop="ent_introduce">
          <el-input v-model="entreprenenur.ent_introduce"></el-input>
        </el-form-item>
        <el-form-item label="最近登录时间" prop="ent_logintime">
          <el-input v-model="entreprenenur.ent_logintime"></el-input>
        </el-form-item>
        <el-form-item label="营业执照" prop="ent_license">
          <el-input v-model="entreprenenur.ent_license"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit()">确 定</el-button>
        <el-button type="success" @click="dialogVisible = false">取 消</el-button>
      </div>
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
    name: 'entrepreneur',
    data(){
      return{
        dialogVisible: false,
        dialogVisible1: false,
        dialogVisible2:false,
        pageInfo: [],
        pageSizes: [1, 2, 3, 4, 6],
        // 每页显示的条数
        PageSize: 6,
        // 默认显示第几页
        currentPage: 1,
        total:0,
        ent_name:'',
        listissent:[],
        entreprenenur:{
          ent_name:'',
          ent_abbreviation:'',
          ent_nature:'',
          ent_scale:'',
          are_id:'',
          ind_id:'',
          ent_photo:'',
          ent_capital:'',
          ent_url:'',
          ent_intro:'',
          ent_introduce:'',
          ent_logintime:'',
          ent_license:'',
          ent_authentication:'',
          ent_state:''
        },
        arelist:[],
        indlist:[]

      }
    },
    created:function(){
      this.findAll();
    },
    methods:{
      /*显示数据*/
      showDialog: function (row) {
        // 显示模态窗口
        this.dialogVisible = true
        this.entreprenenur = row
        this.findare()
        this.findind()
      },
      showDialog1: function () {
        // 显示模态窗口
        this.dialogVisible1 = true
        this.entreprenenur = {}
        this.findare()
        this.findind()
      },
      showDialog2: function(row){
        //显示模态窗口
        //alert(row.ent_id)
        this.dialogVisible2=true
        this.entreprenenur=row
        this.findissent(row)
      },
      deleleById: function (row) {
        this.$confirm('确定删除编号为'+row.ent_id+'的数据？').then(_=> {
          this.$axios.post('Entrepreneur/delete?ent_id=' + row.ent_id)
            .then(response => {
              this.dialogVisible = false
              this.pageInfo = response
              this.findAll();
            })
        })
      },
      findAll: function () {
        this.$axios.post('Entrepreneur/query?ent_name='+this.ent_name)
          .then(response => {
            this.pageInfo = response;
            this.total=this.pageInfo.length;
          })
      },
      findissent:function(row){
        this.$axios.post('Entrepreneur/queryissent2?ent_id=' + row.ent_id)
          .then(response => {
            this.listissent = response
          })
      },
      findare: function () {
        this.$axios.post('Entrepreneur/queryare')
          .then(response => {
            this.arelist = response
          })
      },
      findind: function () {
        this.$axios.post('Entrepreneur/queryind')
          .then(response => {
            this.indlist = response
          })
      },
      add: function () {
        this.$axios.post('Entrepreneur/listquery').then(response=>{
          this.listquery=response
          for (var i=0;i<this.listquery.length;i++){
            var name1=this.listquery[i].ent_name
            if (this.entreprenenur.ent_name===name1){
              this.$message({
                message: '相同企业不能重复添加！',
                type: 'error'
              });
              return false
            }
          }
          if (this.entreprenenur.ent_name==null || this.entreprenenur.ent_abbreviation==null ||
            this.entreprenenur.ent_nature==null || this.entreprenenur.ent_scale==null ||
            this.entreprenenur.ent_photo==null || this.entreprenenur.ent_capital==null ||
            this.entreprenenur.ent_url==null || this.entreprenenur.ent_intro==null ||
            this.entreprenenur.ent_introduce==null || this.entreprenenur.ent_logintime==null ||
            this.entreprenenur.ent_license==null
          )
          {
            this.$message({
              message: '所有添加字段不能为空！',
              type: 'error'
            });
            return false
          }else{
            this.$axios.post('Entrepreneur/add', this.entreprenenur)
              .then(response => {
                this.dialogVisible1 = false
                this.list = response
                this.findAll();
              })
          }
        }).catch(error=>{
          alert(error)
        })
      },
      edit: function (row) {
        this.$axios.post('Entrepreneur/update', this.entreprenenur)
          .then(response => {
            this.dialogVisible = false
            this.list = response
            console.log(this.list)
            this.findAll();
          })
      },
      deleleById2: function (row) {
        //alert(row.iss_id)
        this.$confirm('确定删除编号为'+row.iss_id+'的数据？').then(_=>{
          this.$axios.post('Issue_position/delete?iss_id='+  row.iss_id)
            .then(response => {
              this.dialogVisible = false
              this.list = response
              //alert(1)
              this.findissent(row)
            })
        })
      },
      setStatus:function (row) {
        console.log(row)
        this.$axios.post('Entrepreneur/updzt',row)
          .then(response=>{
            if(response>0){
              console.info(response)
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.findAll()
            }else{
              console.info(response)
              this.$message({
                message: '修改失败！',
                type: 'error'
              });
            }
          })
      },
    handleSizeChange(val) {
      this.PageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1
    },
    handleCurrentChange(val) {
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
          this.dialogVisible2=false
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
