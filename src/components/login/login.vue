<template>
  <div class="login-container">
    <el-card class="box-card box">
      <div slot="header" class="clearfix">
        <span>系统登录</span>
      </div>
      <div>
        <el-form ref="form" :model="admins" label-width="0px">
          <el-form-item label="" prop="adm_name"
                        :rules="{
                    required: true, message: '用户名不能为空', trigger: 'blur'
                  }">
            <el-input placeholder="输入用户名" clearable  prefix-icon="el-icon-user-solid" v-model="admins.adm_name"></el-input>
          </el-form-item>
          <el-form-item prop="adm_pwd" label="" :rules="{
                    required: true, message: '密码不能为空', trigger: 'blur'
                  }">
            <el-input placeholder="输入密码" clearable show-password prefix-icon="el-icon-s-goods" type="password" v-model="admins.adm_pwd"
                      ></el-input>
          </el-form-item>
          <!--<el-form-item label="" prop="captcha" :rules="{
                    required: true, message: '验证码不能为空', trigger: 'blur'
                  }">
            <div style="display: flex">
              <el-input placeholder="输入验证码" style="width: 150px" clearable prefix-icon="el-icon-key"></el-input>
              <img :src="captchaImage" alt="" class="captcha">
            </div>
          </el-form-item>-->
          <el-button :loading="loginLoading" style="width: 100%" type="primary" @click="login">登录</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'login',
  data(){
    return {
      loginLoading:false,
      admins:{}
    }
  },
  methods:{
    login:function () {
      this.loginLoading=true
      console.log(this.admins)
      this.$axios.post('AdminsCon/admins_login',this.$qs.stringify(this.admins))
        .then(response=>{
            if(response.length>=1){
              this.$axios.post('PermissionCon/menu_one?rol_id='+response[0].rol_id)
                .then(response2=>{
                  this.$router.push({name:'index',query:{menu_one:JSON.stringify(response2),admins:response}})
                  sessionStorage.setItem("admins",response[0].adm_name);
                  this.$store.dispatch('setUser',response[0].adm_name);
                })
            }else{
              this.$message({
                showClose: true,
                message: '账户或密码错误哦！',
                type: 'error'
              });
              this.loginLoading=false
            }
        })
    }
  }
}
</script>

<style scoped>
  .login-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    background-position: center center;
    background-size: cover;
    background-image: url(../../assets/img/login2.jpg);

    .box {
      width: 350px;
      position: absolute;
      right: 40%;
      top: 30%;
    }
  }
  .login-container .box {
    width: 350px;
    position: absolute;
    right: 40%;
    top: 30%;
  }

</style>
