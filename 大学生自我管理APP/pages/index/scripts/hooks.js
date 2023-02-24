import {
  reactive
} from 'vue'

const data = reactive({
  singleBox: [],
  duration: [],
})

export function useInitialData() {
  function setInitialData({
    duration,
    singleBox
  }) {
    data.singleBox = singleBox
    data.duration = duration
  }

  function setSchedule({
    type,
    result
  }) {
    //TODO
  }

  return [data, setInitialData, setSchedule]
}
