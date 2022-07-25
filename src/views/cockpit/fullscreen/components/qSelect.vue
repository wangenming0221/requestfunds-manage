<template>
  <div class="ms">
    <select name="" id="ms-select">
      <option
        class="ms-option"
        v-for="(item, index) in options"
        :key="index"
        :value="item.deptName"
      >{{ item.deptName }}</option>
<!--      <option-->
<!--        value="">-->
<!--        {{ item.deptName }}-->
<!--      </option>-->
    </select>
  </div>
</template>

<script>
export default {
  name: "qSelect",
  props: {
    options: {
      type: Array,
      default: []
    }
  },
  data: {

  }
}
</script>

<style lang="scss" scoped>
.ms{
  #ms-select{
    width: 250px;
    height: 40px;
    background-color: #151D22;
    opacity: 0.3;
    outline: none;
    border: none;
    color: #ffffff;

    .ms-option{
      width: 250px;
      /*height: 40px;*/
      background-color: #151D22;
      opacity: 0.5;
      border: 1px solid #dfe4ed;
      color: #ffffff;
      padding: 15px 0px;
      line-height: 30px;
    }
  }
  #ms-select::-webkit-scrollbar{
    display: none;
  }
}
</style>
