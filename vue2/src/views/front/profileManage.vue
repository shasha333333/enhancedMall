<template>
  <div class="profile">
    <el-form :model="userForm" ref="userForm" label-width="120px">
      <!-- 用户名 -->
      <el-form-item label="用户名">
        <el-input v-model="userForm.username" placeholder="请输入用户名" />
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱">
        <el-input v-model="userForm.email" placeholder="请输入邮箱" />
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码">
        <el-input-password v-model="userForm.password" placeholder="请输入密码" />
      </el-form-item>

      <!-- 头像 -->
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="/api/upload-avatar"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">上传头像</el-button>
        </el-upload>
        <div v-if="avatarUrl" class="avatar">
          <img :src="avatarUrl" alt="头像" />
        </div>
      </el-form-item>

      <!-- 更新按钮 -->
      <el-form-item>
        <el-button type="primary" @click="updateUserInfo">更新信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      userForm: {
        username: '',
        password: '',
        email: '',
      },
      avatarUrl: '', // 用户头像 URL
    };
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    loadUser() {
      axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          this.user = res.data.message; // 设置用户信息
        })
        .catch(err => {
          console.log(err);
          this.$message.error('获取用户信息失败');
        });
    },
    // 头像上传之前的处理
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片文件！');
      }
      return isImage;
    },

    // 头像上传成功的处理
    handleAvatarSuccess(response, file) {
      // 假设响应中返回了头像的 URL
      this.avatarUrl = response.url; // 更新头像 URL
    },

    // 更新用户信息（用户名、密码、邮箱）
    async updateUserInfo() {
      const updatedData = { ...this.userForm };

      try {
        // 更新用户名和邮箱
        await this.updateUsernameAndEmail(updatedData.username, updatedData.email);

        // 更新密码
        if (updatedData.password) {
          await this.updatePassword(updatedData.password);
        }

        // 如果头像已更新
        if (this.avatarUrl) {
          await this.updateAvatar(this.avatarUrl);
        }

        this.$message.success('个人信息更新成功');
      } catch (error) {
        this.$message.error('更新失败，请稍后重试');
      }
    },

    // 调用API更新用户名和邮箱
    updateUsernameAndEmail(username, email) {
      return this.$axios.post('/api/update-username-email', { username, email });
    },

    // 调用API更新密码
    updatePassword(password) {
      return this.$axios.post('/api/update-password', { password });
    },

    // 调用API更新头像
    updateAvatar(avatarUrl) {
      return this.$axios.post('/api/update-avatar', { avatar: avatarUrl });
    }
  },
};
</script>
<style scoped>
.avatar {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-uploader {
  display: inline-block;
}


</style>
