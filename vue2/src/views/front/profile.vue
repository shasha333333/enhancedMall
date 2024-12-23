<template>
  <div class="main">
    <!-- 左侧内容 -->
    <el-menu
      class="left"
      default-active="1"
      background-color="#f4f4f4"
      text-color="#333"
      active-text-color="#409EFF"
      vertical
    >
      <el-menu-item index="1">个人中心</el-menu-item>
      <el-menu-item index="2">消息通知</el-menu-item>
      <el-menu-item index="3">个人信息</el-menu-item>
      <el-menu-item index="4">安全设置</el-menu-item>
      <el-menu-item index="5">地址管理</el-menu-item>
    </el-menu>

    <!-- 右侧内容 -->
    <div class="right">
      <el-card class="card" :body-style="{ padding: '20px' }">
        <div slot="header" class="clearfix">
          <span>会员中心</span>
        </div>

      </el-card>

      <el-card class="card" :body-style="{ padding: '20px' }">
        <div slot="header" class="clearfix">
          <span>我的订单</span>
          <el-button type="text" @click="viewAllOrders" class="view-all-btn">查看全部 ></el-button>
        </div>
        <div>
          <!-- 在这里可以添加更多订单相关信息 -->
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCenter",
  methods: {
    viewAllOrders() {
      console.log("查看全部订单");
    },
  },
};
</script>

<style scoped>
.main {
  display: flex;
  height: 100vh;
}

.left {
  width: 250px; /* 左侧固定宽度 */
}

.right {
  flex: 1; /* 右侧占据剩余空间 */
  padding: 20px;
  overflow-y: auto;
}

.card-content {
  text-align: center;
  padding: 20px;
  margin: 10px 0;
}

.card-content img {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.view-all-btn {
  float: right;
}
</style>
