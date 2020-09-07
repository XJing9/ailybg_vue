<template>
  <div>
    <el-button size="mini"
               icon="el-icon-plus"
               type="primary"
               style="float: left;background-color: cadetblue;border-color: cadetblue"
               @click="showDialog1()">添加</el-button>
    <!--<el-button class="small" type="warning" size="small" @click="removeBatch()">批量删除</el-button>-->
    <!-- data:绑定数据  height:声明之后会固定表头-->
    <el-table :data="pageInfo.slice((currentPage-1)*PageSize,currentPage*PageSize) "
              style="width: 100%;margin-bottom: 20px;"
              :header-cell-style="rowClass"
              :cell-style="cellStyle"
              ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- prop显示绑定的数据的属性 -->
      <el-table-column prop="pho_id" label="编号"></el-table-column>
      <el-table-column prop="pho_photo" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.pho_photo" style="width: 40px;height: 40px;vertical-align: middle;">
        </template>
      </el-table-column>
      <el-table-column prop="pho_state" label="状态">
        <template slot-scope="{row: {pho_state}}">
          <span v-if="+pho_state === 1">显示</span>
          <span v-else-if="+ pho_state=== 2">未显示</span>
        </template>
      </el-table-column>
     <!-- <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" @click="showDialog(scope.row)">更改图片</el-button>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-delete" @click="deleleById(scope.row)"></el-button>
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

    <!--<el-dialog width="40%" title="物品修改" :visible="dialogVisible" :before-close="handleClose">
      <el-form label-width="100px" label-suffix="：" :model="welfare" class="form" :rules="rules" ref="fm">
        <el-form-item label="编号" prop="wel_id" >
          &lt;!&ndash; 必须去声明绑定的数据模型 &ndash;&gt;
          <el-input :disabled="true" v-model="welfare.wel_id"></el-input>
        </el-form-item>
        <el-form-item label="物品名称" prop="wel_name">
          <el-input v-model="welfare.wel_name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="wel_state">
          <el-input v-model="welfare.wel_state"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit()">确 定</el-button>
        <el-button type="success" @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>-->
    <el-dialog width="40%" title="添加物品" :visible="dialogVisible1" :before-close="handleClose">
      <el-form label-width="120px" label-suffix="：" :model="photo" class="form" :rules="rules" ref="fm">
        <el-form-item  hidden label="编号" prop="pho_id" >
          <el-input  v-model="photo.pho_id"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="photo.pho_photo">
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :auto-upload="false"
            :multiple="false"
            :limit="1"
            :http-request="httpRequest">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" prop="pho_state">
          <el-input v-model="photo.pho_state"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">确 定</el-button>
        <el-button type="success" @click="dialogVisible1 = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'welfare',
  data () {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      photo: {
        pho_id: '',
        pho_photo: '',
        pho_state: ''
      },
      pageInfo: [],
      pageSizes: [1, 2, 3, 4, 6],
      // 每页显示的条数
      PageSize: 6,
      // 默认显示第几页
      currentPage: 1,
      total: 0,
      rules: {},
      list: [],
      multipleSelection: [], // 多选的数据
      msg: '', // 记录每一条的信息 便于记录id
      logIds: ''
    }
  },
  created: function () {
    this.findAll()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    removeBatch () {
      const length = this.multipleSelection.length
      console.info(length)
      for (let i = 0; i < length; i++) {
        this.logIds += this.multipleSelection[i].pho_id + ','
      }
      this.logIds.substring(0, this.logIds.length - 1)
      console.info(this.logIds)
      this.$confirm('此操作将批量删除信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
          .post('Photo/deleteBatchLogs', {pho_id: this.logIds}).then(resp => {
            if (resp && resp.status === 200) {
              this.findAll()
            }
          })
      }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 文件上传
    httpRequest (param) {
      let fd = new FormData()// FormData 对象
      fd.append('file', param.file)// 文件对象图片
      fd.append('pho_state', this.photo.pho_state)// 类型
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      console.log(fd)
      // 上传 一般上传图片用 $axios2
      this.$axios.post('Photo/insertadphoto', fd).then(response => {
        if (response === 1) {
          this.dialogVisible = false
          this.photo = {}
          this.findAll()
        }
      })
    },
    submitForm: function () {
      this.$refs.upload.submit()
      this.dialogVisible1 = false
    },
    findAll: function (row) {
      this.$axios.post('Photo/query')
        .then(response => {
          this.pageInfo = response
          this.total = this.pageInfo.length
        })
    },
    showDialog: function (row) {
    // 显示模态窗口
      this.dialogVisible = true
      this.photo = row
    },
    showDialog1: function () {
    // 显示模态窗口
      this.dialogVisible1 = true
      this.photo = {}
    },
    add: function () {
      this.$axios.post('Photo/insertadphoto', this.photo)
        .then(response => {
          this.dialogVisible1 = false
          this.list = response
          this.findAll()
        })
    },
    edit: function (row) {
      console.log(this.welfare.wel_id)
      this.$axios.post('Welfare/update', this.welfare)
        .then(response => {
          this.dialogVisible = false
          this.list = response
          console.log(this.list)
          this.findAll()
        })
    },
    deleleById: function (row) {
    // alert(row.wel_id)
      this.$confirm('确定删除编号为' + row.pho_id + '的数据？').then(_ => {
        this.$axios.post('Photo/delete?pho_id=' + row.pho_id)
          .then(response => {
            if (response > 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.findAll()
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭?').then(_ => {
        this.dialogVisible = false
        this.dialogVisible1 = false
      }).catch(_ => {
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
    }
  }
}
</script>

<style scoped>

</style>
