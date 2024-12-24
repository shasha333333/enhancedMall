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
      <img :src="user.avatar" style="width: 250px;" />
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

      <!-- 购物车模块 -->
      <el-card style="flex: 1;">
        <div v-if="carts.length" class="cart"  style="flex: 1;">
          <div class="list"  style="flex: 1;">
              <el-row type="flex" justify="space-between" class="cart-header">
                <el-col :span="4" class="img">&nbsp;</el-col>
                <el-col :span="6" class="name">商品名称</el-col>
                <el-col :span="4" class="price">单价</el-col>
                <el-col :span="4" class="num">数量</el-col>
                <el-col :span="4" class="total">小计</el-col>
                <el-col :span="2" class="action">              
                  <router-link :to="{ path: '/cart' }">
                    查看更多<i class="el-icon-arrow-right" style="color: blue;"></i> 
                  </router-link>
                </el-col>
              </el-row>

            <el-row class="cart-body">
              <el-row v-for="(cart) in carts.slice(0, 3)" :key="cart.id" class="item" style="display: flex; align-items: center; margin-bottom: 10px; padding: 10px 0;">
                <!-- 图片 -->
                <el-col :span="4" class="img" style="display: flex; justify-content: center; align-items: center; max-height: 100px; overflow: hidden;">
                  <img :src="cart.image" :alt="cart.pname + ' ' + cart.name" style="max-height: 100px; object-fit: contain; width: auto;"/>
                </el-col>
                
                <!-- 商品名称 -->
                <el-col :span="6" class="name" style="display: flex; align-items: center; padding-left: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <router-link :to="{ path: '/productDetail/' + cart.pid }" style="display: block; width: 100%;">
                    <h3 :title="cart.pname + ' ' + cart.name" style="margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      {{ cart.pname + " " + cart.name }}
                    </h3>
                  </router-link>
                </el-col>
                
                <!-- 单价 -->
                <el-col :span="4" class="price" style="display: flex; align-items: center; justify-content: center;">
                  {{ cart.sale_price }} 元
                </el-col>
              
                <!-- 数量 -->
                <el-col :span="4" class="num" style="display: flex; align-items: center; justify-content: center;">
                  ×{{ cart.quantity }}
                </el-col>
              
                <!-- 小计 -->
                <el-col :span="4" class="total" style="display: flex; align-items: center; justify-content: center;">
                  {{ (cart.quantity * cart.sale_price).toFixed(2) }} 元
                </el-col>
              </el-row>
              
              
            </el-row>
          </div>
        </div>
        <div v-else class="empty">
          <h2>您的购物车还是空的！</h2>
          <el-button
            type="primary"
            @click="$router.push({ path: '/productList' })"
            >马上去购物</el-button
          >
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserCenter",
  data() {
    return {
      carts: [],
      user: {},
    };
  },
  mounted() {
    this.loadUser();
    this.loadCartList();
  },
  methods: {
    loadCartList() {
      axios
        .get("/api/cart/list", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then((res) => {
          console.log("购物车",res);
          this.carts = res.data;
          // this.carts = {}
        })
        .catch((err) => {
          console.log(err);
        });
    },
    totalPrice() {
      let total = 0;
      this.carts.forEach((e) => {
        total += e.quantity * e.sale_price * e.checked;
      });
      return total.toFixed(2);
    },
    loadUser() {
      axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          this.user = res.data.message; // 设置用户信息
          console.log(this.user);
        })
        .catch(err => {
          console.log(err);
          this.$message.error('获取用户信息失败');
        });
    },
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
