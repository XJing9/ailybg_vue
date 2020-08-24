<template>
    <div>
      <el-button
        @click="admins={};addvisible=true;showAddDialog()"
        size="mini"
        icon="el-icon-plus"
        type="primary"
        style="float: left;background-color: cadetblue;border-color: cadetblue"
      >新增</el-button>
      <el-table
        ref="multipleTable"
        :data="this.$route.query.AdminsQuery"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="rowClass"
        :cell-style="cellStyle">
        <el-table-column
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column
          prop="adm_id"
          label="编号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="adm_name"
          label="用户名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="adm_pwd"
          label="密码"
          width="150">
        </el-table-column>
        <el-table-column
          prop="adm_phone"
          label="手机号"
          width="170">
        </el-table-column>
        <el-table-column
          prop="rol_name"
          label="角色"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="adm_state" fixed="right" label="账号状态" align="center" width="120">
          <template slot-scope="{row}">
            <!--{{ row.cus_state === 0 ? '正常' : '禁用' }}-->
            <el-switch v-model="row.adm_state" :active-value="1"
                       :inactive-value="2" size="small"
                       @change="setStatus(row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200px">
          <template slot-scope="scope">
            <el-row>
              <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit" @click="updatevisible=true;showUpdateDialog(scope.row)"></el-button>
              <el-button style="background-color: indianred;border-color: indianred" type="danger" size="mini" class="el-icon-delete" @click="deleteAdmins(scope.row)"></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--编辑管理员-->
      <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="updatevisible"
                 title="编辑管理员">
        <el-form ref="configForm" :model="admins" size="small" label-width="100px"
                 style="width: 50%" class="form">

          <el-form-item label="名称" prop="adm_name">
            <el-input clearable v-model="admins.adm_name" name="adm_name" size="small" placeholder="请输入名称"/>
          </el-form-item>

          <el-form-item label="密码" prop="adm_pwd">
            <el-input clearable v-model="admins.adm_pwd" name="adm_pwd" size="small" placeholder="请输入密码"/>
          </el-form-item>

          <el-form-item label="角色" prop="rol_id">
            <el-radio v-model="admins.rol_id" v-for="v in role" :label="v.rol_id">{{v.rol_name}}</el-radio>
          </el-form-item>
          <el-form-item label="手机号" prop="adm_phone">
            <el-input :disabled="true" clearable v-model="admins.adm_phone" name="adm_phone" size="small" placeholder=""/>
          </el-form-item>

          <el-form-item>
            <el-button :loading="addBtnLoading" type="primary" size="small"
                       @click="updateAdmins">立即提交
            </el-button>
          </el-form-item>
          <el-form-item label="" prop="adm_id">
            <el-input type="hidden" clearable v-model="admins.adm_id" name="adm_id" size="small" placeholder=""/>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--添加管理员-->
      <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="addvisible"
                 title="编辑管理员">
        <el-form ref="configForm" :model="admins" size="small" label-width="100px"
                 style="width: 50%" class="form">

          <el-form-item label="名称" prop="adm_name">
            <el-input clearable v-model="admins.adm_name" name="adm_name" size="small" placeholder="请输入名称"/>
          </el-form-item>

          <el-form-item label="密码" prop="adm_pwd">
            <el-input clearable v-model="admins.adm_pwd" name="adm_pwd" size="small" placeholder="请输入密码"/>
          </el-form-item>

          <el-form-item label="角色" prop="rol_id">
            <el-radio v-model="admins.rol_id" v-for="v in role" :label="v.rol_id">{{v.rol_name}}</el-radio>
          </el-form-item>
          <el-form-item label="手机号" prop="adm_phone">
            <el-input clearable v-model="admins.adm_phone" name="adm_phone" size="small" placeholder=""/>
          </el-form-item>

          <el-form-item>
            <el-button :loading="addBtnLoading" type="primary" size="small"
                       @click="addAdmins">立即提交
            </el-button>
          </el-form-item>
          <el-form-item label="" prop="adm_id">
            <el-input type="hidden" clearable v-model="admins.adm_id" name="adm_id" size="small" placeholder=""/>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'admins',
    data(){
      return {
        addBtnLoading:false,
        updatevisible:false,
        addvisible:false,
        admins:{},
        role:{}
      }
    },
    methods: {
      //设置表头的颜色
      rowClass () {

        return 'background:#545c64;color:white'
      },
      //设置指定行、列、具体单元格颜色
      cellStyle () {
        return 'background:#545c64;color:white'
      },
      showUpdateDialog:function (row) {
        this.admins=row
        this.$axios.post('RoleCon/role_query')
          .then(response=>{
            if(response.length>=1){
              this.role=response
            }
          })
      },
      showAddDialog:function(){
        this.$axios.post('RoleCon/role_query')
          .then(response=>{
            if(response.length>=1){
              this.role=response
            }
          })
      },
      addAdmins:function(){
        this.$axios.post('AdminsCon/admins_insert',this.$qs.stringify(this.admins))
          .then(response=>{
            if(response>=1){
              this.$message({
                showClose: true,
                message: '恭喜你，添加成功',
                type: 'success'
              });
              this.addvisible=false;
            }else{
              this.$message({
                showClose: true,
                message: '添加失败！',
                type: 'error'
              });
            }
          })
      },
      updateAdmins:function () {
        this.$axios.post('AdminsCon/admins_update',this.$qs.stringify(this.admins))
          .then(response=>{
            if(response>=1){
              this.$message({
                showClose: true,
                message: '恭喜你，修改成功',
                type: 'success'
              });
              this.updatevisible=false;
            }else{
              this.$message({
                showClose: true,
                message: '修改失败！',
                type: 'error'
              });
            }
          })
      },
      deleteAdmins:function(row){
        this.$axios.post('AdminsCon/admins_delete',this.$qs.stringify(row))
          .then(response=>{
            if(response>=1){
              this.$message({
                showClose: true,
                message: '恭喜你，删除成功',
                type: 'success'
              });
              this.updateRolevisible=false;
            }else{
              this.$message({
                showClose: true,
                message: '删除失败！',
                type: 'error'
              });
            }
          })
      },
      setStatus:function (row) {
        this.$axios.post('AdminsCon/admins_update',this.$qs.stringify(row))
          .then(response=>{
            if(response>=1){
              this.$message({
                showClose: true,
                message: '恭喜你，修改成功',
                type: 'success'
              });
              this.updateRolevisible=false;
            }else{
              this.$message({
                showClose: true,
                message: '修改失败！',
                type: 'error'
              });
            }
          })
      }
    }
  }
</script>

<style scoped>
</style>
