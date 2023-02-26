<template>
  <view class="container">
    <uni-section :title="formType" type="line" class="FormCard">
      <uni-card>周{{ weekday }} &nbsp;&nbsp;&nbsp;第{{ index }}节</uni-card>
      <view class="example">
        <uni-forms ref="customForm" :rules="customRules" :modelValue="customFormData">
          <uni-forms-item label="课程" required name="course">
            <uni-easyinput v-model="customFormData.course" :value="course" placeholder="请输入课程名" />
          </uni-forms-item>
          <uni-forms-item label="老师" required name="teacher">
            <uni-easyinput v-model="customFormData.teacher" :value="teacher" placeholder="请输入老师" />
          </uni-forms-item>
          <uni-forms-item label="教室" required name="adress">
            <uni-easyinput v-model="customFormData.adress" :value="adress" placeholder="请输入教室" />
          </uni-forms-item>
          <uni-forms-item label="学分" required name="score">
            <uni-easyinput v-model="customFormData.score" :value="score" placeholder="请输入学分" />
          </uni-forms-item>
        </uni-forms>
        <view class="button-group">
          <button type="default" @click="handleCancelClick">{{ btnCancelText }}</button>
          <button type="warn" @click="handleDeleteClick" v-if="formType === '编辑课程'">{{ btnDeleteText }}</button>
          <button type="primary" @click="handleConfirmClick">{{ btnConfirmText }}</button>
        </view>
      </view>
    </uni-section>
  </view>
</template>
<script setup>
  import {
    defineExpose,
    reactive
  } from 'vue'
  const props = defineProps({
    formType: {
      type: String,
      default: ""
    },
    weekday: {
      type: Number,
      default: 1
    },
    index: {
      type: Number,
      default: 1
    },
    course: {
      type: String,
    },
    teacher: {
      type: String,
    },
    adress: {
      type: String,
    },
    score: {
      type: Number,
    },
    btnCancelText: {
      type: String,
      default: 'Cancel'
    },
    btnConfirmText: {
      type: String,
      default: 'Confirm'
    },
    btnDeleteText: {
      type: String,
      default: 'Delete'
    }
  })
  //表单状态
  const state = reactive({
    visible: false,
    type: 'CONFIRM'
  })
  // 自定义表单数据
  const customFormData = reactive({
    course: '',
    teacher: '',
    adress: '',
    score: 0
  })
  // 自定义表单校验规则
  const customRules = reactive({
    course: {
      rules: [{
        required: true,
        errorMessage: '课程名不能为空'
      }]
    },
    teacher: {
      rules: [{
        required: false
      }]
    },
    adress: {
      rules: [{
        required: false
      }]
    },
    score: {
      rules: [{
        required: false,
        pattern: /-?[1-9]\d*/,
        errorMessage: '学分为数字'
      }]
    }
  })

  function handleCancelClick() {
    state.type = 'CANCEL'
    state.visible = false
  }

  function handleConfirmClick() {
    state.type = 'CONFIRM'
    state.visible = false
  }

  function handleDeleteClick() {
    state.type = 'DELETE'
    state.visible = false
  }

  function setVisible(isVisible) {
    state.visible = isVisible
  }
  defineExpose({
    state,
    setVisible
  })
</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 999;
    background-color: rgba(0, 0, 0, .3);

    .FormCard {
      margin-bottom: 60px;
    }

    .example {
      padding: 15px;
      background-color: #fff;

      .segmented-control {
        margin-bottom: 15px;
      }

      .button-group {
        margin-top: 15px;
        display: flex;
        justify-content: space-evenly;
      }

      .form-item {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
