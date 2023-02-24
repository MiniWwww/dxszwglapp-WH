<template>
  <view class="content">
    <uni-table border stripe emptyText="暂无更多数据">
      <!-- 星期 -->
      <uni-tr>
        <uni-th width="1"></uni-th>
        <uni-th align="center" v-for="item in weekdays" :keyt="item.id" width="1">{{ item.title }}</uni-th>
      </uni-tr>
      <!-- 表格数据行 -->
      <uni-tr v-for="item in duration">
        <uni-td style="font-size: 8px;">
          <view>第{{ item.index }}节</view>
          <view>{{ item.title }}</view>
        </uni-td>
        <uni-td v-for="n in 5" :key="n" @click="$event => handleTDClick(item.index, n)" style="padding: 0; margin: 0;">
          <Card v-if="singleBox[item.index + '_' + n]" :data="singleBox[item.index + '_' + n]"></Card>
        </uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script setup>
  import {
    onMounted,
    reactive,
    ref,
    toRefs
  } from 'vue'
  import {
    getInitialData
  } from './scripts/service.js'
  import {
    useInitialData
  } from './scripts/hooks.js'
  import weekdays from './data/week.js'
  import Card from './Card.vue'
  import IconAdd from './IconAdd.vue'

  const [
    data,
    setInitialData,
    setSchedule
  ] = useInitialData()

  onMounted(async () => {
    setInitialData(await getInitialData())
  })

  const handleTDClick = (index, weekday) => {
    console.log(index + ' ' + weekday + ' ');
  }
  const {
    duration,
    singleBox
  } = toRefs(data)
</script>
