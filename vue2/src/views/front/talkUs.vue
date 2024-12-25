<template>
  <div class="contact-us">
    <h2>联系我们</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">姓名</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          placeholder="请输入您的姓名"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          placeholder="请输入您的邮箱"
          required
        />
      </div>
      <div class="form-group">
        <label for="message">留言</label>
        <textarea
          id="message"
          v-model="form.message"
          placeholder="请输入您的留言"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <button type="submit" :disabled="isSubmitting">提交</button>
      </div>
    </form>
    <div v-if="submissionStatus" class="status-message">
      <p :class="submissionStatus.success ? 'success' : 'error'">
        {{ submissionStatus.message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      isSubmitting: false,
      submissionStatus: null
    };
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true;
      this.submissionStatus = null;

      try {
        // 模拟 API 请求
        await this.submitForm(this.form);
        this.submissionStatus = {
          success: true,
          message: '感谢您的留言，我们会尽快回复您！'
        };
        this.form.name = '';
        this.form.email = '';
        this.form.message = '';
      } catch (error) {
        this.submissionStatus = {
          success: false,
          message: '提交失败，请稍后再试。'
        };
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitForm(form) {
      // 在这里进行真正的 API 请求
      // 例如：
      // await axios.post('/api/contact', form);
      return new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟延迟
    }
  }
};
</script>

<style scoped>
.contact-us {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.status-message {
  margin-top: 20px;
  text-align: center;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
