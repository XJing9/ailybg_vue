<template>
  <div>
    <el-button
      @click="tableData={};addvisible=true"
      size="mini"
      icon="el-icon-plus"
      type="primary"
      style="float: left;background-color: cadetblue;border-color: cadetblue"
    >新增一级菜单</el-button>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="per_id"

      :header-cell-style="rowClass"
      :cell-style="cellStyle"
      :tree-props="{children: 'listTwo', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="per_id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="per_name"
        label="名称"

        width="180">
      </el-table-column>
      <el-table-column
        prop="per_url"
        label="地址"
        width="180">
      </el-table-column>
      <el-table-column
        prop="per_icon"
        label="图标"
        show-overflow-tooltip>
        <template slot-scope="{row}">
          <i :class="row.per_icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-row>
            <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit" @click="updatevisible=true;showPermissionDialog(scope.row)"></el-button>
            <el-button style="background-color: indianred;border-color: indianred" type="danger" size="mini" class="el-icon-delete" @click="deletePermission(scope.row)"></el-button>
            <el-button v-if="scope.row.per_parent ==0" type="primary" size="mini" icon="el-icon-plus"
                        class="add" @click="addtwovisible=true;showTwoMenu(scope.row)">添加子级
            </el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!--添加一级菜单-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="addvisible"
               title="添加菜单">
      <el-form ref="configForm" :model="tableData" size="small" label-width="100px"
               style="width: 50%" class="form">

        <el-form-item label="菜单名称" prop="per_name">
          <el-input clearable v-model="tableData.per_name" name="per_name" size="small" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单路径" prop="per_url">
          <el-input clearable v-model="tableData.per_url" name="per_url" size="small" placeholder="请输入菜单路径"/>
        </el-form-item>
        <el-form-item label="图标" prop="per_icon">
          <el-input clearable v-model="tableData.per_icon" name="per_icon" size="small" placeholder="请输入图标"/>
        </el-form-item>
        <el-form-item label="点击事件名称" prop="per_click">
          <el-input clearable v-model="tableData.per_click" name="per_click" size="small" placeholder="请输入点击事件名称"/>
        </el-form-item>
        <el-form-item>
          <el-button :loading="addBtnLoading" type="primary" size="small"
                     @click="addPermission">立即提交
          </el-button>
        </el-form-item>
        <el-form-item label="" prop="per_parent">
          <el-input type="hidden" clearable name="per_parent" size="small" v-model="tableData.per_parent"/>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--添加二级菜单-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="addtwovisible"
               title="添加菜单">

      <el-form ref="configForm" :model="twolist" size="small" label-width="100px"
               style="width: 50%" class="form">
        <el-form-item label="上级菜单" prop="">
          <el-input :disabled="true" clearable v-model="onelist.name" name="" size="small" placeholder=""/>
        </el-form-item>

        <el-form-item label="菜单名称" prop="per_name">
          <el-input clearable v-model="twolist.per_name" name="per_name" size="small" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单路径" prop="per_url">
          <el-input clearable v-model="twolist.per_url" name="per_url" size="small" placeholder="请输入菜单路径"/>
        </el-form-item>
        <el-form-item label="图标" prop="per_icon">
          <el-input clearable v-model="twolist.per_icon" name="per_icon" size="small" placeholder="请输入图标"/>
        </el-form-item>
        <el-form-item label="点击事件名称" prop="per_click">
          <el-input clearable v-model="twolist.per_click" name="per_click" size="small" placeholder="请输入点击事件名称"/>
        </el-form-item>
        <el-form-item>
          <el-button :loading="addBtnLoading" type="primary" size="small"
                     @click="addTwoPermission">立即提交
          </el-button>
        </el-form-item>
        <el-form-item label="" prop="per_parent">
          <el-input clearable type="hidden" name="per_parent" size="small" v-model="twolist.per_parent"/>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--修改菜单-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="updatevisible"
               title="修改菜单">
      <el-form ref="configForm" :model="tableData" size="small" label-width="100px"
               style="width: 50%" class="form">

        <el-form-item label="菜单名称" prop="per_name">
          <el-input clearable v-model="tableData.per_name" name="per_name" size="small" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单路径" prop="per_url">
          <el-input clearable v-model="tableData.per_url" name="per_url" size="small" placeholder="请输入菜单路径"/>
        </el-form-item>
        <el-form-item label="图标" prop="per_icon">
          <el-input clearable v-model="tableData.per_icon" name="per_icon" size="small" placeholder="请输入图标"/>
        </el-form-item>
        <el-form-item label="点击事件名称" prop="per_click">
          <el-input clearable v-model="tableData.per_click" name="per_click" size="small" placeholder="请输入点击事件名称"/>
        </el-form-item>
        <el-form-item>
          <el-button :loading="addBtnLoading" type="primary" size="small"
                     @click="updatePermission">立即提交
          </el-button>
        </el-form-item>
        <el-form-item label="" prop="per_parent">
          <el-input type="hidden" clearable name="per_parent" size="small" v-model="tableData.per_parent"/>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'permission',
  data () {
    return {
      tableData: this.$route.query.menu_one,
      addvisible:false,
      addBtnLoading:false,
      updatevisible:false,
      addtwovisible:false,
      onelist:{
        name:''
      },
      twolist:{}
    }
  },
  methods: {
    // 设置表头的颜色
    rowClass () {
      return 'background:#545c64;color:white'
    },
    // 设置指定行、列、具体单元格颜色
    cellStyle () {
      return 'background:#545c64;color:white'
    },
    showPermissionDialog:function(row){
      console.log(row)
      this.tableData=row;
    },
    showTwoMenu:function(row){
      this.twolist.per_parent=row.per_id
      this.onelist.name=row.per_name
    },
    addTwoPermission:function(){
      console.log(this.twolist)
      this.$axios.post('PermissionCon/menu_insert',this.$qs.stringify(this.twolist))
        .then(response=>{
          if(response>=1){
            this.$message({
              showClose: true,
              message: '恭喜你，添加成功',
              type: 'success'
            });
            this.addtwovisible=false;
          }else{
            this.$message({
              showClose: true,
              message: '添加失败！',
              type: 'error'
            });
          }
        })
    },
    addPermission:function () {
      this.tableData.per_parent=0;
      this.$axios.post('PermissionCon/menu_insert',this.$qs.stringify(this.tableData))
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
    updatePermission:function () {
      this.$axios.post('PermissionCon/permission_update',this.$qs.stringify(this.tableData))
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
    deletePermission:function (row) {
      console.log(row.per_id);
      this.$axios.post('PermissionCon/permission_delete?per_id='+row.per_id)
        .then(response=>{
          if(response>=1){
            this.$message({
              showClose: true,
              message: '恭喜你，删除成功',
              type: 'success'
            });
            this.updatevisible=false;
          }else{
            this.$message({
              showClose: true,
              message: '删除失败！',
              type: 'error'
            });
          }
        })
    }
  }
}
</script>

<style scoped>
  .el-table [class*=el-table__row--level] .el-table__expand-icon {
    display:inline-block;
    width:20px;
    line-height:20px;
    height:20px;
    text-align:center;
    margin-right:3px;
    color: white;
  }


</style>
