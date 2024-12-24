<template>
  <div id="app">
    <header class="tan-site-header">
      <div class="tan-site-topbar">
        <div class="container">
          <div>
            <router-link to="/productList">MoreMall商城</router-link>
          </div>
          <div v-if="user.username">
            <img :src="user.avatar" style="width: 16px;height:16px;" />
            <span>{{ user.username }}</span>
            <span @click="dologout">退出</span>
            <router-link :to="{ path: '/cart' }">购物车</router-link>
            <router-link :to="{ path: '/profile' }">个人中心</router-link>
          </div>
          <div v-else>
            <span @click="loginFormVisible = true; loginform.name = ''; loginform.password = '';">登录</span>
            <span @click="regFormVisible = true;">注册</span>
          </div>
        </div>
      </div>
    </header>
    <router-view />
    <footer class="tan-site-footer">
      <ul class="tan-site-footer-top">
        <li>
          <img src="@/assets/icon1.png" alt="" />
          <span>30天无忧退换货</span>
        </li>
        <li>
          <img src="@/assets/icon2.png" alt="" />
          <span>满88元免邮费</span>
        </li>
        <li>
          <img src="@/assets/icon3.png" alt="" />
          <span>XX品质保证</span>
        </li>
      </ul>
      <div class="tan-site-footer-bottom">
        <ul>
          <li>关于我们</li>
          <li>帮助中心</li>
          <li>售后服务</li>
          <li>配送与验收</li>
          <li>商务合作</li>
          <li>企业采购</li>
          <li>开放平台</li>
          <li>搜索推荐</li>
          <li>友情链接</li>
        </ul>
        <p>XX公司版权所有 © 1996-2018 食品经营许可证：XXXXXXXXXXXXXXXXX</p>
      </div>
    </footer>
    <el-dialog title="登录" :visible.sync="loginFormVisible">
      <el-form :model="loginform" ref="loginform" :rules="loginrules" :label-width="formLabelWidth">
        <el-form-item label="用户名：" prop="name">
          <el-input v-model="loginform.name" placeholder="请输入用户名" prefix-icon="el-icon-key"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="loginform.password" placeholder="请输入密码" prefix-icon="el-icon-unlock"
            show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="loginFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doLogin">登 录</el-button>
      </div>
    </el-dialog>
    <el-dialog title="注册" :visible.sync="regFormVisible">
      <el-form :model="regform" :label-width="formLabelWidth">
        <el-form-item label="用户名：">
          <el-input v-model="regform.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="regform.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱：">
          <el-input v-model="regform.email" placeholder="请输入电子邮箱："></el-input>
        </el-form-item>
        <el-form-item label="头像：">
          <el-radio-group v-model="regform.avatar">
            <el-radio :label="item" v-for="(item, index) in avatars" :key="index">
              <img :src="item" style="width: 48px;height: 48px;" />
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="regFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doRegister">注 册</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
import axios from 'axios'
import { EventBus } from '@/utils/eventBus';
export default {
  name: "App",
  data() {
    return {
      formLabelWidth: "90px",
      loginFormVisible: false,
      loginform: {
        name: "",
        password: "",
      },
      loginrules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 3, message: "密码长度不少于3个字符", trigger: "change" },
        ],
      },
      user: {},
      avatars: [],
      regFormVisible: false,
      regform: {
        name: "",
        password: "",
        email: "",
        avatar: "",
      },

    }
  },
  mounted() {
    axios
      .get("/api/home/avatars")
      .then((res) => {
        console.log(res);
        this.avatars = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    this.loadUser();
    // 监听来自子组件的事件
    EventBus.$on('userUpdated', (updatedUser) => {
      this.loadUser();
    });
    EventBus.$on('safeUpdated', (safeUpdated) => {
      this.dologout();
    });
    //     // 每隔5分钟发送一次心跳请求
    // this.startHeartbeat();
  },
  computed: {
    // isAuthenticated() {
    //   return !!localStorage.getItem('token');
    // },
  },
  methods: {
    doLogin() {
      this.$refs["loginform"].validate((valid) => {
        if (valid) {
          axios
            .post("/api/user/login", {
              username: this.loginform.name,
              password: this.loginform.password,
            })
            .then(res => {
              if (res.data.code === 200) {
                // 保存 token
                localStorage.setItem('token', res.data.token);
                this.$message({
                    showClose: true,
                    message: '登录成功！',
                    type: 'success'
                    });
                this.loadUser();
                this.loginFormVisible = false;
              } else{
                  this.$message({
                  showClose: true,
                  message: res.data.message,
                  type: 'error'
                });
              }
            })
            .catch((err) => {
                console.log(err);
                this.$message.error(err.message);
            });
        } else {
          this.$message.error("登录数据填写有误！");
          return false;
        }
      });

    },
    loadUser() {
      axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
        .then(res => {
          this.user = res.data.message; // 设置用户信息
        })
        .catch(err => {
          console.log(err);
          this.$message.error('获取用户信息失败');
        });
    },
    doRegister() {
      axios
        .post("/api/user/register", {
          username: this.regform.name,
          password: this.regform.password,
          email: this.regform.email,
          avatar: this.regform.avatar,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: '注册成功！',
              type: 'success'
            });
            this.loginFormVisible = true;
            this.regFormVisible = false;
          } else {
            this.$message({
              showClose: true,
              message: "用户名或者email已存在!",
              type: 'error'
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    dologout() {
      axios
        .post("/api/user/logout")
        .then((res) => {
          // console.log(res);
          if (res.data.code == 200) {
            // 清除本地存储中的 token 和用户信息
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            this.user = {};
            console.log(res.session);
            // this.$message({
            //   showClose: true,
            //   message: '退出成功！',
            //   type: 'success'
            // });
            console.log(res.data.message);

            const currentPath = this.$route.path; // 获取当前路由路径
            // 如果当前路径不是主页面（'/')，则重定向到主页
            if (currentPath !== '/') {
              this.$router.push('/'); // 跳转到主页
            }
          } else {
            this.$message({
              showClose: true,
              message: res.data.message,
              type: 'error'
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    startHeartbeat() {
      this.heartbeatInterval = setInterval(() => {
        // 向后端发送心跳请求，刷新Session
        axios
          .get('/api/ping')
          .then(response => {
            if (response.data.code == 200) {
              console.log('Heartbeat response:', response.data);
              loadUser()
            }

          })
          .catch(error => {
            console.error('Error with heartbeat:', error);
          });
      }, 5 * 60 * 1000);  // 每5分钟发送一次心跳请求
    }
  }
}


</script>

<style>
.tan-site-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  ;
}


.tan-site-topbar {
  background-color: #333;
  height: 40px;
}

.tan-site-topbar>.container {
  display: flex;
  justify-content: space-between;
}

.tan-site-topbar a,
.tan-site-topbar span {
  color: #b0b0b0;
  line-height: 40px;
  font-size: 12px;
  cursor: pointer;
  padding: 0 5px;
  transition: all .3s;
}

.tan-site-topbar a:hover,
.tan-site-topbar span:hover {
  color: #fff;
}

.tan-site-footer {
  height: 230px;
  background-color: #414141;
  color: white;
  overflow: hidden;
}

.tan-site-footer-top {
  display: flex;
  padding: 36px 0;
  border-bottom: 1px solid #4f4f4f;
}

.tan-site-footer-top>li {
  display: flex;
  width: 33%;
  height: 60px;
  justify-content: center;
  align-items: center;
}

.tan-site-footer-top>li>span {
  vertical-align: middle;
  font-size: 18px;
  margin-left: 10px;
}

.tan-site-footer-top>img {
  vertical-align: middle;
}

.tan-site-footer-bottom {
  color: #aaa;
  font-size: 13px;
  text-align: center;
  margin-top: 30px;
}

.tan-site-footer-bottom>ul>li {
  display: inline-block;
  cursor: pointer;
  padding: 0 6px;
  border-right: 2px solid #aaa;
}

.tan-site-footer-bottom>ul>li:last-child {
  border-right: none;
}

.tan-site-footer-bottom>p {
  margin: 5px;
}


nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

ul {
  list-style: none;
}

a {
  text-decoration-line: none;
}
</style>
