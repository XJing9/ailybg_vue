<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="this.$route.query.Ph.rows"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="rowClass"
      :cell-style="cellStyle">
      <el-table-column
        type="selection"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cus_id"
        label="编号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cus_name"
        label="用户名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cus_pwd"
        label="密码"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cus_truename"
        label="真实姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="cus_sex"
        label="性别"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_birthday"
        label="出生日期"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_address"
        label="地址"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_phone"
        label="手机"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_registertime"
        label="注册日期"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_logintime"
        label="最近登录日期"
        width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_email"
        label="邮箱"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_idcard"
        label="身份证号"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_height"
        label="身高"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_marital"
        label="婚否"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_koseki"
        label="户籍"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_nativeplace"
        label="籍贯"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="cus_introduce"
        label="自我介绍"
        width="100"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="cus_state" fixed="right" label="账号状态" align="center" width="120">
        <template slot-scope="{row}">
          <!--{{ row.cus_state === 0 ? '正常' : '禁用' }}-->
          <el-switch v-model="row.cus_state" :active-value="0"
                     :inactive-value="1" size="small"
                     @change="setStatus(row)"/>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-row>
            <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button style="background-color: indianred;border-color: indianred" type="danger" size="mini" class="el-icon-delete"></el-button>
          </el-row>
        </template>
      </el-table-column>-->
      <!--<el-table-column
        fixed="right"
        label="操作"
        prop="cus_state"
        width="150">
        <el-row>
          <el-tooltip :content="'Switch value: ' + value" placement="top">
            <el-switch
              v-model="value"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              inactive-value="1">
            </el-switch>
          </el-tooltip>
        </el-row>-->
        <!--<template slot-scope="scope">
          <el-row>
            <el-button style="background-color:darkgrey;border-color: darkgrey" type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button style="background-color: indianred;border-color: indianred" type="danger" size="mini" class="el-icon-delete"></el-button>
          </el-row>
        </template>-->
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      align="center"
      @current-change="handleCurrentChange"
      :page-size="this.$route.query.Ph.pageSize"
      :pager-count="11"
      layout="prev, pager, next"
      :total="this.$route.query.Ph.totalCount">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'customer',
    data(){
      return {
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
      handleCurrentChange(val) {
        this.$axios.post('CustomerCon/customer_selectAll?pageNum=' + val + '')
          .then(response => {
            this.$router.push({name: 'customer', query: {Ph:response}})
          })
      },
      setStatus:function (row) {
        this.$axios.post('CustomerCon/customer_update',this.$qs.stringify(row))
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
