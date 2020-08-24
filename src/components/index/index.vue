<template>
  <div id="con">
    <div id="left">
      <h2 style="color:white;font-weight: bold;font-style: oblique ;">爱洛阳人才网</h2>
      <el-menu
        default-active="2"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#red">
        <el-submenu :index="value.per_url" v-for="(value, key, index) in menu_one">
          <template slot="title">
            <i :class='value.per_icon'style="color:white"></i>
            <span>{{value.per_name}}</span>
          </template>
          <el-menu-item v-if="value.listTwo" v-for="(child,index) in value.listTwo" :index="child.per_url">
            <template slot="title">
              <i :class='child.per_icon' style="color:white;font-size: small"></i>
              <span style="font-size: small" @click="Mg(child.per_click)">{{child.per_name}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div id="right">
      <div id="head">
        <el-header>
          <el-dropdown style="float: right" @command="handlerCommand">
            <i class="el-icon-user-solid" style="color: white"></i>
            <span class="a" style="color: white"><!--{{$route.query.admins[0].adm_name}}--></span>
            <i class="el-icon-arrow-down" style="color: white"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="personal">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
      </div>
      <el-divider></el-divider>
      <div id="main">
        <router-view></router-view>
      </div>
    </div>
    <!--个人中心-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="personal_visible"
               title="个人中心">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="个人配置" name="config">
          <el-form ref="configForm" :model="admins" size="small" label-width="100px"
                   style="width: 50%" class="form">

            <el-form-item label="用户名">
              <el-input :disabled="true" clearable v-model="admins.adm_name" size="small" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="手机号" prop="adm_phone" :rules="[
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          {min: 11, max: 11, message: '长度11位', trigger: 'blur'}
          ]">
              <el-input clearable v-model="admins.adm_phone" size="small"
                        placeholder="请输入手机号"/>
            </el-form-item>
            <el-form-item label="权限">
              <el-input :disabled="true" clearable v-model="admins.rol_name" size="small" placeholder=""/>
            </el-form-item>

            <el-form-item>
              <el-button :loading="addBtnLoading" type="primary" size="small"
                         @click="updateAdminsPhone()">立即提交
              </el-button>
            </el-form-item>
            <el-form-item label="" prop="adm_id">
              <el-input type="hidden" clearable v-model="admins.adm_id" size="small" placeholder=""/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="password">
          <el-form ref="passwordForm" :model="passwordForm" size="small" label-width="100px"
                   style="width: 50%" class="form">
            <el-form-item label="原密码" prop="oldPassword" :rules="[
          {required: true, message: '原密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度6-20位', trigger: 'blur'}
          ]">
              <el-input show-password type="password" clearable v-model="passwordForm.oldPassword" size="small"
                        placeholder="请输入原密码"/>
            </el-form-item>
            <el-form-item label="新密码" prop="password" :rules="[
          {required: true, message: '新密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度6-20位', trigger: 'blur'}
          ]">
              <el-input show-password type="password" clearable v-model="passwordForm.password" size="small"
                        placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item label="确认新密码" prop="rePassword" :rules="[
          {required: true, message: '确认新密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度6-20位', trigger: 'blur'}
          ]">
              <el-input show-password type="password" clearable v-model="passwordForm.rePassword" size="small"
                        placeholder="请输入确认新密码"/>
            </el-form-item>
            <el-form-item>
              <el-button :loading="addBtnLoading" type="primary" size="small"
                         @click="updateAdminsPwd">立即提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="log"></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      menu_one: this.$route.query.menu_one,
      admins:this.$route.query.admins[0],
      personal_visible: false,
      addBtnLoading:false,
      passwordForm: {
        oldPassword: '',
        password: '',
        rePassword: '',
      },
      activeName:'config'
    }
  },
  created: function () {
  },
  methods: {
    handlerCommand:function (command) {
      if(command=='personal'){
        this.personal_visible=true;
      }
    },
    Mg:function(clickname){
      console.log(clickname)
      if(clickname=='AdminsMg'){
        this.$axios.post('http://localhost:8089/ailybg/AdminsCon/admins_query')
          .then(response=>{
            if(response.data.length>=1){
              this.$router.push({name:'admins',query:{AdminsQuery:response.data}})
            }
          })
      }else if(clickname=='RoleMg'){
        this.$axios.post('http://localhost:8089/ailybg/RoleCon/role_query')
          .then(response=>{
            if(response.data.length>=1){
              this.$router.push({name:'role',query:{RoleQuery:response.data}})
            }
          })
      }else if(clickname=='PermissionMg'){
        this.$axios.post('http://localhost:8089/ailybg/PermissionCon/menu_query')
          .then(response=>{
            console.log(response.data)
            this.$router.push({name:'permission',query:{menu_one:response.data}})
          })
      }else if(clickname=='CustomerMg'){
        this.$axios.post('http://localhost:8089/ailybg/CustomerCon/customer_selectAll')
          .then(response=>{
            console.log(response.data)
            this.$router.push({name:'customer',query:{customer:response.data}})
          })
      }
    },
    showPersonaldialog: function () {
      this.personal_visible = true
    },
    updateAdminsPwd:function(){
      this.addBtnLoading=true
      if(this.passwordForm.password!=this.passwordForm.rePassword){
        this.$message({
          showClose: true,
          message: '两次密码不一致哦！',
          type: 'error'
        });
        this.addBtnLoading=false
      }else if(this.passwordForm.oldPassword!=this.admins.adm_pwd){
        this.$message({
          showClose: true,
          message: '原密码不正确哦！',
          type: 'error'
        });
        this.addBtnLoading=false
      } else{
        this.adminsupdatestate=true;
        this.admins.adm_pwd=this.passwordForm.password
        this.$axios.post('http://localhost:8089/ailybg/AdminsCon/admins_update',this.$qs.stringify(this.admins))
          .then(response=>{
            if(response.data>=1){
              this.$message({
                showClose: true,
                message: '恭喜你，修改成功,请重新登录',
                type: 'success'
              });
              this.$router.push({name:'login'})
            }
          })
      }
    },
    updateAdminsPhone:function () {
        this.$axios.post('http://localhost:8089/ailybg/AdminsCon/admins_update',this.$qs.stringify(this.admins))
          .then(response=>{
            if(response.data>=1){
              this.$message({
                showClose: true,
                message: '恭喜你，修改成功',
                type: 'success'
              });
              this.addBtnLoading=false
            }
          })
      }
  }
}
</script>

<style scoped>
  #con{

    width:100%;
    height:800px;
    background-color: #545c64;
  }
  /*#imgs{
    background-image: url(../../assets/img/logo_home.png);
    width:300px;
    height:70px;
  }*/
  #left{
    width:15%;
    height:800px;
    background-color: #545c64;
    float:left;
  }
  #right{
    width:85%;
    heigth:800px;
    background-color: #545c64;
    float:left;
  }
  #head{
    height:30px;
    background-color: #545c64;
    line-height:55px;
  }
  #main{
    height:750px;
    background-color: #545c64;
    margin:10px 30px;
  }

</style>
