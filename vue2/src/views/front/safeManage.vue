<template>
  <div class="user-security">
    <el-form :model="securityForm" ref="securityForm" :rules="formRules" label-width="150px">
      <!-- 修改密码 -->
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="securityForm.oldPassword" placeholder="请输入旧密码" />
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="securityForm.newPassword" placeholder="请输入新密码" />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="securityForm.confirmPassword" placeholder="请确认新密码" />
      </el-form-item>

      <!-- 绑定手机 -->
      <el-form-item label="绑定手机" prop="phone">
        <el-input v-model="securityForm.phone" placeholder="功能尚未开发" :disabled="isFeatureDisabled" />
      </el-form-item>

      <el-form-item label="验证码" prop="captcha">
        <el-row>
          <el-col :span="16">
            <el-input v-model="securityForm.captcha" placeholder="功能尚未开发" :disabled="isFeatureDisabled" />
          </el-col>
          <el-col :span="8">
            <el-button :loading="isSendingCaptcha" :disabled="isFeatureDisabled" @click="sendCaptcha">
              发送验证码
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 双重身份验证 -->
      <el-form-item label="启用双重身份验证">
        <el-switch v-model="securityForm.twoFactorEnabled" active-text="启用" inactive-text="禁用" :disabled="isFeatureDisabled" />
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存设置</el-button>
      </el-form-item>

      <!-- 提示信息 -->
      <el-alert
        v-if="isFeatureDisabled"
        title="功能尚未开发"
        type="info"
        description="绑定手机、验证码和双重身份验证功能尚未开发。"
        show-icon
      />
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from '@/utils/eventBus';

export default {
  data() {
    return {
      securityForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        phone: '',
        captcha: '',
        twoFactorEnabled: false, // 双重身份验证是否启用
      },
      isSendingCaptcha: false,
      isFeatureDisabled: true, // 控制功能是否禁用
      formRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 3, message: '密码长度至少为6个字符', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: this.checkPasswordConfirmation, trigger: 'blur' },
        ],
        phone: [
          { required: false, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
        ],
        captcha: [
          { required: false, message: '请输入验证码', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    // 验证新密码与确认密码是否一致
    checkPasswordConfirmation(rule, value, callback) {
      if (value !== this.securityForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },

    // 发送验证码到绑定的手机
    sendCaptcha() {
      if (!this.securityForm.phone) {
        this.$message.error('请先输入手机号');
        return;
      }

      this.isSendingCaptcha = true;
      axios
        .post('/api/user/sendCaptcha', { phone: this.securityForm.phone })
        .then((response) => {
          this.$message.success('验证码已发送');
        })
        .catch((error) => {
          console.error(error);
          this.$message.error('发送验证码失败');
        })
        .finally(() => {
          this.isSendingCaptcha = false;
        });
    },

    // 提交表单
    handleSubmit() {
      this.$refs.securityForm.validate((valid) => {
        if (valid) {
          this.updatePassword();
          // 通过 EventBus 通知其他组件更新用户数据
          EventBus.$emit('safeUpdated', this.securityForm);
        } else {
          this.$message.warning('请确保所有信息填写正确');
        }
      });
    },

    // 更新用户安全设置
    updateSecuritySettings() {
      const updatedData = { ...this.securityForm };

      axios
        .post('/api/user/updateSecuritySettings', updatedData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message.success('安全设置更新成功');
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
          this.$message.error('更新安全设置失败');
        });
    },

    // 更新密码
    updatePassword() {
      const { oldPassword, newPassword } = this.securityForm;

      if (oldPassword && newPassword) {
        axios
          .post('/api/user/updatePassword', { oldPassword, newPassword }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((response) => {
            if (response.data.code === 200) {
              this.$message.success('密码更新成功');
            } else {
              this.$message.warning(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
            this.$message.error('更新密码失败');
          });
      }
    },

    // 更新绑定手机
    updatePhone() {
      const { phone, captcha } = this.securityForm;

      if (phone && captcha) {
        axios
          .post('/api/user/updatePhone', { phone, captcha }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((response) => {
            if (response.data.code === 200) {
              this.$message.success('绑定手机成功');
            } else {
              this.$message.warning(response.data.message);
            }
          })
          .catch((error) => {
            console.error(error);
            this.$message.error('绑定手机失败');
          });
      }
    },

    // 更新两步验证设置
    updateTwoFactor() {
      const { twoFactorEnabled } = this.securityForm;

      axios
        .post('/api/user/updateTwoFactor', { twoFactorEnabled }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          if (response.data.code === 200) {
            this.$message.success('双重身份验证设置更新成功');
          } else {
            this.$message.warning(response.data.message);
          }
        })
        .catch((error) => {
          console.error(error);
          this.$message.error('更新双重身份验证设置失败');
        });
    },
  },
};
</script>

<style scoped>
.user-security {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-alert {
  margin-top: 20px;
}
</style>
