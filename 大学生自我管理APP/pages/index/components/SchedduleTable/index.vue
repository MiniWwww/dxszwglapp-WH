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
        <uni-td v-for="n in 5" :key="n" @click.self="$event => addCourse(item.index, n, '新增课程')"
          style="padding: 0; margin: 0;">
          <Card v-if="singleBox[item.index + '_' + n]" :data="singleBox[item.index + '_' + n]"
            @click.self="$event => editCourse(item.index, n, '编辑课程', singleBox[item.index + '_' + n])"></Card>
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
  import weekdays from '../../data/week.js'
  import Card from './Card.vue'
  import MyMessageBox from '../MessageBox/index.js'

  const [
    data,
    setInitialData,
    setSchedule
  ] = useInitialData()

  onMounted(async () => {
    setInitialData(await getInitialData())
  })

  let cardData = reactive({
    course: '',
    teacher: '',
    adress: '',
    score: ''
  })

  const addCourse = (index, weekday, formType) => {
    MyMessageBox({
      formType,
      weekday,
      index,
      btnCancelText: '取消',
      btnConfirmText: '确定',
      confirm() {
        console.log('Confirm');
      },
      cancel() {
        console.log('Cancel');
      }
    })
  }

  const editCourse = (index, weekday, formType, singleBoxData) => {
    MyMessageBox({
      formType,
      weekday,
      index,
      course: singleBoxData.course,
      teacher: singleBoxData.teacher,
      adress: singleBoxData.adress,
      score: singleBoxData.score,
      btnCancelText: '取消',
      btnConfirmText: '确定',
      btnDeleteText: '删除',
      confirm() {
        console.log('Confirm')
      },
      cancel() {
        console.log('Cancel')
      },
      remove() {
        console.log('Delete')
      }
    })
  }
  const {
    duration,
    singleBox
  } = toRefs(data)
</script>
