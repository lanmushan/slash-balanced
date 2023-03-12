<template>
  <div>
    <h1>
      网络加载测试(这个测试工具只能测个大概)
    </h1>
    <p>
      注意测试时一定要保证服务端性能足够，并开启跨域访问
    </p>
    <LoadDemo></LoadDemo>
  </div>

</template>
<script lang="ts" setup>
import LoadDemo from "@/demos/LoadDemo.vue";

components:{
  LoadDemo
}


</script>

<style>
#app {
  width: 1200px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin: 60px auto;
}
</style>
