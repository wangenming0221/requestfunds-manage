<template>
  <div class="app-container">
    <div class="home">
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="home-card">
            <div class="home-card_title">欢迎您，XXX，工作辛苦了</div>
            <div class="home-card_subtitle">您有 <span class="num"> 222</span>   条审批待办需处理，请及时查看</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <div class="home-deal">
            <div class="home-deal_title">
              <div class="left">
                <img :src="require('@/assets/images/home2.png')" alt="">
                <span>合同待办</span>
              </div>
              <div class="right">
                全部待办(1个)
              </div>
            </div>
            <div class="home-deal_content">
              <div class="item">
                <div class="item-text">
                  1111111111
                </div>
                <div class="item-time">
                  2022-1-1 18-18-18
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="home-deal">
            <div class="home-deal_title">
              <div class="left">
                <img :src="require('@/assets/images/home2.png')" alt="">
                <span>合同待办</span>
              </div>
              <div class="right">
                全部待办(1个)
              </div>
            </div>
            <div class="home-deal_content">
              <div class="item">
                <div class="item-text">
                  1111111111
                </div>
                <div class="item-time">
                  2022-1-1 18-18-18
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>


  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {
  },
  data() {
    return {
      aa: null
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    min-height: calc(100vh - 84px);
    background: #f0f2f5;
    .home {
      .home-card {
        margin-bottom: 20px;
        padding: 50px 40px;
        background: url('../../assets/images/home1.png') left top;
        background-size: 100% 100%;
        .home-card_title {
          font-size: 24px;
          color: #333539;
          margin-bottom: 20px;
          .num {
            color: #6672FB;
          }
        }
        .home-card_subtitle {
          font-size: 16px;
          color: #4D4D4D;
          .num {
            color: #6672FB;
          }
        }
      }
      .home-deal {
        padding: 14px 16px;
        background: #fff;
        .home-deal_title {
          overflow: hidden;
          margin-bottom: 20px;
          .left {
            float: left;
            font-size: 16px;
            color: #3F3F3F;
            img {
              width: 18px;
              height: 18px;
              vertical-align: middle;
              display: inline-block;
              margin-right: 8px;
            }
            span{
              vertical-align: middle;
            }
          }
          .right {
            float: right;
            font-size: 12px;
            color: #5971D6;
            margin-top: 6px;
            cursor: pointer;
          }
        }
        .home-deal_content {
          .item {
            display: flex;
            justify-content: space-between;
            .item-text {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .item-time {
              width: 80px;
              text-align: right;
              margin-left: 12px;
              color: #99A1AA;
            }
          }
        }

      }
    }
  }
</style>
