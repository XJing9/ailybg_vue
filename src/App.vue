<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  padding:0px;
}
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
