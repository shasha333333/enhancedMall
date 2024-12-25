<template>
  <div class="main">
    <el-form 
      :model="userForm" 
      ref="userForm" 
      :rules="updaterules" 
      label-width="120px"
      class="user-form"
    >
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" placeholder="请输入用户名" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" placeholder="请输入邮箱" />
      </el-form-item>

      <!-- 头像 -->
      <el-form-item label="头像：">
        <el-radio-group v-model="userForm.avatar">
          <el-radio :label="item" v-for="(item, index) in avatars" :key="index">
            <img :src="item" class="avatar-img" />
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 更新按钮 -->
      <el-form-item>
        <el-button type="primary" @click="showConfirmDialog" class="update-btn">更新信息</el-button>
      </el-form-item>
    </el-form>

    <!-- 确认对话框 -->
    <el-dialog
      title="确认更新"
      :visible.sync="dialogVisible"
      width="400px"
      @close="dialogVisible = false"
    >
      <span>您确认要更新个人信息吗？</span>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="update">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '@/utils/eventBus';
export default {
  data() {
    return {
      userForm: {
        username: '',
        email: '',
        avatar: '',
        password: '',
      },
      updaterules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          },
        ],
      },
      avatars: [], // 头像选项
      dialogVisible: false, // 控制确认对话框的显示与隐藏
    };
  },
  mounted() {
    this.loadUser();
    this.loadAvatars();
  },
  methods: {
    showConfirmDialog() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          // 显示确认对话框
          this.dialogVisible = true;
        } else {
          this.$message.warning('数据填写有误！');
        }
      });
    },
    loadAvatars() {
      axios
        .get("/api/home/avatars")
        .then((res) => {
          console.log(res);
          this.avatars = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadUser() {
      axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          this.userForm = res.data.message; // 设置用户信息
        })
        .catch(err => {
          console.log(err);
          this.$message.error('获取用户信息失败');
        });
    },
    update() {
      this.$refs["userForm"].validate((valid) => {
        if (valid) {
          this.updateUserInfo();
        } else {
          this.$message.warning('数据填写有误！');
        }
      });
    },
    // 更新用户信息（用户名、密码、邮箱）
    async updateUserInfo() {
      const updatedData = { ...this.userForm };

      try {
        // 更新用户名
        if (updatedData.username) {
          await this.updateUsername(updatedData.username);
        }

        // 更新邮箱
        if (updatedData.email) {
          await this.updateEmail(updatedData.email);
        }

        // 更新密码
        if (updatedData.password) {
          await this.updatePassword(updatedData.password);
        }

        // 如果头像已更新
        if (updatedData.avatar) {
          await this.updateAvatar(updatedData.avatar);
        }

        // 通过 EventBus 通知其他组件更新用户数据
        EventBus.$emit('userUpdated', updatedData);
        this.$message.success('个人信息更新成功');
      } catch (error) {
        console.error('个人信息更新失败:', error);
        this.$message.error('更新失败，请稍后重试');
      }
    },

    // 调用API更新用户名
    async updateUsername(newName) {
      try {
        const res = await axios.post('/api/user/updateUsername',
          { username: newName },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        if (res.data.code === 200) {
          // this.$message.success(res.data.message);
          console.log(res.data.message);
        } else {
          this.$message.warning(res.data.message);
          console.log(res.data.message);
        }
      } catch (err) {
        console.log(err);
        this.$message.warning('更新用户名失败');
      }
    },

    // 调用API更新邮箱
    async updateEmail(email) {
      try {
        const res = await axios.post('/api/user/updateEmail',
          { email },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        if (res.data.code === 200) {
          // this.$message.success(res.data.message);
          console.log(res.data.message);
        } else {
          this.$message.warning(res.data.message);
          console.log(res.data.message);
        }
      } catch (err) {
        console.log(err);
        this.$message.warning('更新邮箱失败');
      }
    },

    // 调用API更新密码
    async updatePassword(password) {
      try {
        const res = await axios.post('/api/user/updatePassword',
          { password },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        if (res.data.code === 200) {
          // this.$message.success(res.data.message);
          console.log(res.data.message);
        } else {
          this.$message.warning(res.data.message);
          console.log(res.data.message);
        }
      } catch (err) {
        console.log(err);
        this.$message.warning('更新密码失败');
      }
    },

    // 调用API更新头像
    async updateAvatar(avatarUrl) {
      try {
        const res = await axios.post('/api/user/updateAvatar', { avatar: avatarUrl },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        if (res.data.code === 200) {
          // this.$message.success(res.data.message);
          console.log(res.data.message);
        } else {
          this.$message.warning(res.data.message);
          console.log(res.data.message);
        }
      } catch (err) {
        console.log(err);
        this.$message.warning('更新头像失败');
      }
    }
  },
};
</script>

<style scoped>
.main {
  width: 80vw;
  height: 80vh;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item label {
  font-size: 16px;
  color: #333;
}

.el-input,
.el-radio-group {
  width: 100%;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 5px;
  transition: transform 0.3s;
}

.avatar-img:hover {
  transform: scale(1.1);
}

.update-btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.update-btn:hover {
  background-color: #45a049;
  border-color: #45a049;
}

.el-dialog {
  padding: 20px;
  border-radius: 8px;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  font-size: 14px;
}
</style>