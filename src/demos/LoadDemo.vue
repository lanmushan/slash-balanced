<template>
  <h3>配置</h3>
  <el-form :model="form" label-width="120px">
    <el-form-item label="源地址">
      <el-input v-model="form.baseUrl"/>
    </el-form-item>
    <el-form-item label="分发地址1">
      <el-input v-model="form.proxyPass1"/>
    </el-form-item>
    <el-form-item label="分发地址2">
      <el-input v-model="form.proxyPass2"/>
    </el-form-item>
    <el-form-item label="分发地址3">
      <el-input v-model="form.proxyPass3"/>
    </el-form-item>
    <el-form-item label="分发地址4">
      <el-input v-model="form.proxyPass4"/>
    </el-form-item>
  </el-form>

  <h3>测试</h3>
  <el-input
      v-model="form.testUrl"
      placeholder="请输入要测试的地址"
      class="input-with-select"
  >
    <template #prepend>
      <el-select v-model="form.selectCount" placeholder="Select" style="width: 115px">
        <el-option label="请求50次" value="50"/>
        <el-option label="请求200次." value="200"/>
        <el-option label="请求500次" value="500"/>
      </el-select>
    </template>
    <template #append>
      <el-button type="primary" @click="start()">开始</el-button>
    </template>
  </el-input>
  <h2>
    结果:{{ result }}
  </h2>
  <p>平均性能提升比例：{{ avg.toFixed(2) }}%</p>
  <el-table :data="dataTable" style="width: 100%">
    <el-table-column prop="testUrl" label="请求地址" width="600"/>
    <el-table-column prop="count" label="请求数量" width="100"/>
    <el-table-column prop="serialTime" label="串行总耗时" width="100">
      <template #default="scope">
        {{ scope.row.serialTime }}ms
      </template>
    </el-table-column>
    <el-table-column prop="serialTime" label="串行平均" width="100">
      <template #default="scope">
        {{ scope.row.serialTime / scope.row.count }}ms
      </template>
    </el-table-column>
    <el-table-column prop="parallelTime" label="并发总耗时" width="100">
      <template #default="scope">
        {{ scope.row.parallelTime }}ms
      </template>
    </el-table-column>

    <el-table-column prop="parallelTime" label="并发平均" width="100">
      <template #default="scope">
        {{ scope.row.parallelTime / scope.row.count }}ms
      </template>
    </el-table-column>
    <el-table-column prop="ratio" label="提升比率">
      <template #default="scope">
        {{ scope.row.ratio.toFixed(2) }}%
      </template>
    </el-table-column>

  </el-table>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import SlashBalanced from "~";
import SlashBalancedOption, {ProxyAlgorithmEnum} from "~/SlashBalancedOption";

const result = ref("");
const dataTable = ref([])
const avg = computed(() => {
  if (!dataTable.value.length) {
    return 0;
  }
  const sum = dataTable.value.map(it => {
    return it.ratio
  }).reduce(function (a, b) {
    return a + b;
  });
  return sum / dataTable.value.length;
})

async function config() {
  let proxyPass = [];
  if (form.proxyPass1) {
    proxyPass.push({
      target: form.proxyPass1,
      weight: 1
    },)
  }
  if (form.proxyPass2) {
    proxyPass.push({
      target: form.proxyPass2,
      weight: 1
    },)
  }
  if (form.proxyPass3) {
    proxyPass.push({
      target: form.proxyPass3,
      weight: 1
    },)
  }
  if (form.proxyPass4) {
    proxyPass.push({
      target: form.proxyPass4,
      weight: 1
    },)
  }
  SlashBalanced.config({
    enable: true,
    proxyOptions: [
      {
        baseUrl: form.baseUrl,
        algorithm: ProxyAlgorithmEnum.LeastConnections,
        hystrix: false,
        enable: true,
        proxyPass: proxyPass
      }
    ]
  } as unknown as SlashBalancedOption)

}

async function start() {
  await config();
  const time = await startSerial(form.selectCount, form.testUrl);
  const time2 = await startParallel(form.selectCount, form.testUrl);
  dataTable.value.push({
    testUrl: form.testUrl,
    count: form.selectCount,
    serialTime: time,
    parallelTime: time2,
    ratio: (((time - time2) / time) * 100.0)
  })
}

async function startSerial(N, url) {

  SlashBalanced.stop();
  return new Promise(
      function (resolve, reject) {
        let count = N;
        const timestamp = (new Date()).valueOf();
        for (let i = 0; i < N; i++) {
          $.ajax({
            url: url,
            cache: false,
            method: "GET",
            complete: () => {
              count--;
              const end = (new Date()).valueOf();
              result.value = "串行请求中剩余" + count;
              if (count <= 0) {
                resolve(end - timestamp);
              }
            }
          })
        }

      }
  )

}

async function startParallel(N, url) {
  SlashBalanced.start();
  return new Promise(
      function (resolve, reject) {
        let count = N;
        const timestamp = (new Date()).valueOf();
        for (let i = 0; i < N; i++) {
          $.ajax({
            url: url,
            method: "GET",
            cache: false,
            complete: () => {
              count--;
              const end = (new Date()).valueOf();
              result.value = "并行请求中,剩余" + count;
              if (count <= 0) {
                resolve(end - timestamp);
              }
            }
          })
        }

      }
  )

}

const form = reactive({
  baseUrl: '',
  proxyPass1: '',
  proxyPass2: '',
  proxyPass3: '',
  proxyPass4: "",
  testUrl: "",
  selectCount: '50',
  desc: '',
})

</script>

<style scoped>

</style>
