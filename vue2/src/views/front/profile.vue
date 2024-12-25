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
      <el-menu-item index="2" @click="gotoProfileManage">个人信息</el-menu-item>
      <el-menu-item index="3" @click="gotoSafeManage">安全设置</el-menu-item>
      <el-menu-item index="4" @click="gotoContactManage">地址管理</el-menu-item>
      <el-menu-item index="5" @click="gotoTalkUs">联系我们</el-menu-item>
    </el-menu>

    <!-- 右侧内容 -->
    <div class="right">

      <!-- 购物车模块 -->
      <div class="cart-list">
        <el-card style="flex: 1;">
          <div v-if="carts.length" class="cart"  style="flex: 1;">
            <div class="list"  style="flex: 1;">
                <el-row type="flex" justify="space-between" class="cart-header">
                  <el-col :span="4" class="img" style="display: flex; align-items: center; justify-content: center;"><h1>购物车</h1></el-col>
                  <el-col :span="6" class="name" style="display: flex; align-items: center; justify-content: center;">商品名称</el-col>
                  <el-col :span="4" class="price"  style="display: flex; align-items: center; justify-content: center;">单价</el-col>
                  <el-col :span="4" class="num" style="display: flex; align-items: center; justify-content: center;">数量</el-col>
                  <el-col :span="3" class="total" style="display: flex; align-items: center; justify-content: center;">小计</el-col>
                  <el-col :span="3" class="action" style="display: flex; align-items: center; justify-content: center;">              
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
                    <strong>×{{ cart.quantity }}</strong>
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

      <!-- 订单模块 -->
      <div class="order-list">
        <el-card class="order-list" style="flex: 1;">
          <!-- 订单筛选部分 -->
          <div class="header" style="flex: 1;">
            <h1 class="title">我的订单</h1>
            <el-button-group>
              <el-button 
                :class="{ active: type === 0 }" 
                @click="type = 0" 
                size="small">全部订单</el-button>
              <el-button 
                :class="{ active: type === 1 }" 
                @click="type = 1" 
                size="small">已支付</el-button>
              <el-button 
                :class="{ active: type === 2 }" 
                @click="type = 2" 
                size="small">未支付</el-button>
            </el-button-group>
            <!-- 查看更多链接 -->
            <router-link :to="{ path: '/order' }">
              查看更多<i class="el-icon-arrow-right" style="color: blue;"></i>
            </router-link>

          </div>
      
          <!-- 订单内容 -->
          <div class="body" style="flex: 1;">

            <el-card 
              class="order-card" 
              v-for="order in orders" 
              :key="order.id" 
              style="margin-bottom: 20px;">
              <div class="order-header">
                <el-tag :type="order.paid ? 'success' : 'warning'" class="status">
                  {{ order.paid ? '已支付' : '未支付' }}
                </el-tag>
                <div class="info">
                  <span class="time">{{ order.create_time }}</span>
                  <span class="name">{{ order.contact_name }}</span>
                  <span class="order-id">订单号：<i>{{ order.id }}</i></span>
                  <span class="price">
                    实付金额：<em>{{ order.price }}</em> 元
                  </span>
                </div>
              </div>
      
              <!-- 订单详情 -->
              <el-row 
                v-for="detail in order.details" 
                :key="detail.detail_id" 
                class="detail-item" 
                style="margin-bottom: 10px;">
                <el-col :span="4" class="img">
                  <img :src="detail.image" alt="商品图片" style="max-width: 100px;"/>
                </el-col>
                <!-- <el-col :span="6" class="name" style="display: flex; align-items: center; padding-left: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <router-link :to="{ path: '/productDetail/' + cart.pid }" style="display: block; width: 100%;">
                    <h3 :title="cart.pname + ' ' + cart.name" style="margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      {{ cart.pname + " " + cart.name }}
                    </h3>
                  </router-link>
                </el-col> -->
                <el-col :span="14" class="info"  style="display: flex; align-items: center; padding-left: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <router-link 
                    :to="{ path: '/productDetail/' + detail.product_id }" 
                    class="name" style="display: block; width: 100%;">
                    <h3 :title="detail.product_name + ' ' + detail.detail_name" style="margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                      {{ detail.product_name + " " + detail.detail_name }}
                    </h3>
                  </router-link>
                  <div class="quantity" style="display: flex; align-items: center; justify-content: center;">{{ detail.sale_price }} * {{ detail.quantity }}</div>
                </el-col>
              </el-row>
            </el-card>
            
            <!-- 遮罩层 -->
            <div class="mask"></div>
          </div>
        </el-card>
      </div>
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
      // 全部的订单信息，默认不显示
      orders: [],
      _orders: [],
      type: 0,
    };
  },
  watch: {
    type(value) {
      switch (value) {
        case 0:
          this.orders = this._orders;
          break;
        case 1:
          this.orders = this._orders.filter(e => e.paid);
          break;
        case 2:
          this.orders = this._orders.filter(e => !e.paid);
          break;
      }
    }
  },
  mounted() {
    this.loadUser();
    this.loadCartList();
    this.loadOrders();
  },
  methods: {
    loadOrders() {
      axios
        .get('/api/order/list', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
          this._orders = res.data;
          this.orders = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
    gotoProfileManage() {
      this.$router.push({ path: '/profileManage' });
    },
    gotoSafeManage() {
      this.$router.push({ path: '/safeManage' });
    },
    gotoContactManage() {
      this.$router.push({ path: '/contactManage' });
    },
    gotoTalkUs() {
      this.$router.push({ path: '/talkUs' });
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
  flex-direction: column; /* 垂直排列子元素 */
  height: 90vh; /* 让父容器占据整个视口高度 */
}

.card-content {
  text-align: center;
  padding: 20px;
}

.card-content img {
  width: 50px;
  height: 50px;
}

.view-all-btn {
  float: right;
}
/* 整体订单列表 */
.cart-list{
  padding: 20px;
}
.order-list {
  padding: 20px;
}

/* 限制订单内容的显示区域 */
.order-list .body {
  height: 50vh; /* 设置卡片内容区域的高度 */
  overflow: hidden; /* 隐藏超出部分 */
  position: relative;
}

/* 模糊效果样式 */
.order-list .blur-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px; /* 控制模糊效果的高度 */
  background: linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0)); /* 渐变背景 */
  filter: blur(5px); /* 模糊效果 */
  pointer-events: none; /* 避免遮罩层拦截点击事件 */
}


/* 订单筛选部分 */
.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header .title {
  font-size: 24px;
  font-weight: bold;
}

.el-button-group .el-button.active {
  background-color: #409EFF;
  color: white;
}

/* 订单卡片 */
.order-card {
  padding: 20px;
  background-color: #f9f9f9;
  height: 100%;
}

/* 订单头部 */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status {
  margin-right: 10px;
}

.info {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.info .time, 
.info .name, 
.info .order-id,
.info .price {
  margin-right: 20px;
}

/* 订单商品详情部分 */
.detail-item {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.img img {
  max-width: 100px;
  max-height: 100px;
}

.info .name {
  font-weight: bold;
}

.quantity {
  font-size: 14px;
}


/* 查看更多链接 */
.view-more {
  margin-top: 20px;
  text-align: right;
}

.view-more a {
  font-size: 16px;
  color: #409EFF;
}

.view-more i {
  margin-left: 5px;
}

.card {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.card-body {
  flex: 1;
}

.content-item {
  margin-bottom: 10px;
}

.info-item {
  font-size: 16px;
  color: #666;
}

</style>
