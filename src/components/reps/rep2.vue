<template>
  <div>
    <Designer :template="template" @onDesigned="onDesigned"></Designer>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import "sv-print/dist/style.css"; // 一般在入口文件(index/main)添加
import { Designer } from "@sv-print/vue3";

let template = ref({});

const onDesigned = (e) => {
  console.log("onDesigned");
  console.log(e);
};
</script>
