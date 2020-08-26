<template>
  <div>
    <el-button
      @click="role={};addRolevisible=true"
      size="mini"
      icon="el-icon-plus"
      type="primary"
      style="float: left;background-color: cadetblue;border-color: cadetblue"
    >新增</el-button>
    <el-table
      ref="multipleTable"
      :data="this.$route.query.RoleQuery.slice((currentPage-1)*PageSize,currentPage*PageSize)"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="rowClass"
      :cell-style="cellStyle">
      <el-table-column
        type="selection"
        width="60">
      </el-table-column>
      <el-table-column
        prop="rol_id"
        label="编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="rol_name"
        label="角色名"
        show-overflow-tooltip>
      </el-table-column>
      <!--<el-table-column show-overflow-tooltip prop="rol_state" label="状态" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.status == 1 ? '正常' : '禁用' }}
          <el-switch v-model="row.status" size="small"
                     @change="setStatus(row)"/>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-row>
            <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit" @click="updateRolevisible=true;showUpdateDialog(scope.row)"></el-button>
            <el-button style="background-color: indianred;border-color: indianred" type="danger" size="mini" class="el-icon-delete" @click="deleteRole(scope.row)"></el-button>
            <el-button type="success" size="mini" icon="el-icon-share" @click="authorityVisible=true;setAuthority(scope.row)">权限</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  <!--分页-->
    <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizes" :page-size="PageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
    </el-pagination>
    <!--修改角色-->
    <!-- 编辑表单 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="updateRolevisible"
               title="编辑角色">
      <el-form ref="configForm" :model="role" size="small" label-width="100px"
               style="width: 50%" class="form">

        <el-form-item label="角色名" prop="rol_name">
          <el-input clearable v-model="role.rol_name" name="rol_name" size="small" placeholder="请输入角色名"/>
        </el-form-item>

        <el-form-item>
          <el-button :loading="addBtnLoading" type="primary" size="small"
                     @click="updateRole()">立即提交
          </el-button>
        </el-form-item>
        <el-form-item label="" prop="rol_id">
          <el-input type="hidden" clearable v-model="role.rol_id" name="rol_id" size="small" placeholder=""/>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--添加角色-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="addRolevisible"
               title="添加角色">
      <el-form ref="configForm" :model="role" size="small" label-width="100px"
               style="width: 50%" class="form">

        <el-form-item label="角色名" prop="rol_name">
          <el-input clearable v-model="role.rol_name" name="rol_name" size="small" placeholder="请输入角色名"/>
        </el-form-item>

        <el-form-item>
          <el-button :loading="addBtnLoading" type="primary" size="small"
                     @click="addRole()">立即提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--权限分配-->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="authorityVisible"
               title="编辑角色">
      <el-form ref="configForm" :model="role" size="small" label-width="100px"
               style="width: 50%" class="form">
        <el-tree
          :data="authorityList"
          show-checkbox
          default-expand-all
          node-key="per_id"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
        <el-form-item>
          <el-button :loading="addBtnLoading" type="primary" size="small"
                     @click="getCheckedKeys()">立即提交
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'role',
    data(){
      return {
        updateRolevisible:false,
        addRolevisible:false,
        role:{},
        authorityVisible:false,
        authorityList:{},
        addBtnLoading:false,
        defaultProps: {
          children: 'listTwo',
          label: 'per_name'
        },
        rol_id:0,
        currentPage: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: this.$route.query.RoleQuery.length,
        // 个数选择器（可修改）
        pageSizes: [5, 9, 15, 30],
        // 默认每页显示的条数（可修改）
        PageSize: 5
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
      handleSizeChange (val) {
        // 改变每页显示的条数
        this.PageSize = val
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.currentPage = 1
      },
      // 显示第几页
      handleCurrentChange (val) {
        // 改变默认的页数
        this.currentPage = val
      },
      getCheckedKeys() {
        let str='';
        for (let p=0;p<this.$refs.tree.getCheckedKeys().length;p++) {
          console.log(this.$refs.tree.getCheckedKeys()[p]);
          if(p<this.$refs.tree.getCheckedKeys().length-1){
            str+=this.$refs.tree.getCheckedKeys()[p]+','
          }else{
            str+=this.$refs.tree.getCheckedKeys()[p]
          }
        }
        this.$axios.get('RoleCon/setAuthority',{
          params:{rol_id:this.rol_id,per_id:str}
        })
          .then(response=>{
            if(response>=1){
              this.$message({
                showClose: true,
                message: '恭喜你，修改成功',
                type: 'success'
              });
              this.authorityVisible=false;
            }else{
              this.$message({
                showClose: true,
                message: '修改失败！',
                type: 'error'
              });
            }
          })
      },
      // 设置状态
      /*setStatus(data) {
        console.log(data);
      }*/
      showUpdateDialog:function (row) {
        console.log(row)
        this.role=row

      },
      setAuthority:function(row){
        this.rol_id=row.rol_id;
        this.$axios.post('PermissionCon/menu_query')
          .then(response=>{
            if(response.length>0){
              this.authorityList=response;
              this.$axios.post('RoleCon/queryRol_id?rol_id='+this.rol_id)
                .then(response2=>{
                  for (let p=0;p<response2.length;p++){
                    console.log(response2[p].per_id)
                    this.$refs.tree.setChecked(response2[p].per_id, true, false)
                  }
                })
            }
          })
      },
      updateRole:function () {
        this.$axios.post('RoleCon/role_update',this.$qs.stringify(this.role))
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
      },
      deleteRole:function (row) {
        this.$axios.post('RoleCon/role_delete?rol_id='+row.rol_id)
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
      addRole:function () {
        this.$axios.post('RoleCon/role_insert',this.$qs.stringify(this.role))
          .then(response=>{
            if(response>=1){
              this.$message({
                showClose: true,
                message: '恭喜你，添加成功',
                type: 'success'
              });
              this.addRolevisible=false;
            }else{
              this.$message({
                showClose: true,
                message: '添加失败！',
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
