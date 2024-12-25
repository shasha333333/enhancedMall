<template>
  <div class="contact-manager">
    <!-- 联系人列表 -->
    <div class="contact-list">
      <div class="header">
        <h2>我的联系人</h2>
        <el-button @click="showAddForm" v-if="!showContactForm" type="primary" size="small" class="add-contact-btn">添加联系人</el-button>
      </div>
      
      <el-table :data="contacts" v-if="contacts.length" style="width: 100%">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="电话" prop="telephone"></el-table-column>
        <el-table-column label="地址" prop="address"></el-table-column>
        <el-table-column label="标签" prop="tag"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editContact(scope.row)" type="primary" size="mini">编辑</el-button>
            <el-button @click="deleteContact(scope.row.id)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p v-else class="empty-state">没有联系人，请添加联系人。</p>
    </div>

    <!-- 添加/编辑联系人 -->
    <el-dialog :visible.sync="showContactForm" :title="editingContact ? '编辑联系人' : '添加联系人'" width="50%">
      <el-form :model="contactForm" ref="form" label-width="80px">
        <el-form-item label="姓名" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
          <el-input v-model="contactForm.name" required></el-input>
        </el-form-item>
        <el-form-item label="电话" :rules="[{ required: true, message: '请输入电话', trigger: 'blur' }]">
          <el-input v-model="contactForm.telephone" required></el-input>
        </el-form-item>
        <el-form-item label="地址" :rules="[{ required: true, message: '请输入地址', trigger: 'blur' }]">
          <el-input type="textarea" v-model="contactForm.address" required></el-input>
        </el-form-item>
        <el-form-item label="标签" :rules="[{ required: true, message: '请输入标签', trigger: 'blur' }]">
          <el-input v-model="contactForm.tag" required></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="saveContact">{{ editingContact ? '更新' : '添加' }} 联系人</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
export default {
  data() {
    return {
      contacts: [], // 联系人列表
      contactForm: { // 用于添加或编辑的联系人表单数据
        name: '',
        telephone: '',
        address: '',
        tag: '',
        id: '',
      },
      showContactForm: false, // 控制联系人表单的显示
      editingContact: null // 当前正在编辑的联系人
    };
  },
  created() {
    this.fetchContacts(); // 获取联系人列表
  },
  methods: {
    // 获取联系人列表
    fetchContacts() {
      axios
        .get('/api/contact/list', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
          this.contacts = response.data;
        })
        .catch(error => {
          console.error('获取联系人列表失败:', error);
        });
    },
    // 显示添加联系人表单
    showAddForm() {
      this.showContactForm = true;
      this.contactForm = { name: '', telephone: '', address: '', tag: '' }; // 清空表单
      this.editingContact = null;
    },
    // 编辑联系人
    editContact(contact) {
      this.showContactForm = true;
      this.contactForm = { ...contact }; // 填充表单数据
      this.editingContact = contact;
    },
    // 保存联系人（添加或更新）
    saveContact() {
      if (this.editingContact) {
        // 编辑联系人
        axios
          .put(`/api/contact/${this.contactForm.id}`, this.contactForm, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          .then(response => {
            if (response.data.code == 200) {
              this.$message.success(response.data.message);
              this.fetchContacts(); // 刷新联系人列表
              this.cancelEdit(); // 关闭表单
            } else {
              this.$message.warning(response.data.message);
            }
          })
          .catch(error => {
            console.error('更新联系人失败:', error);
          });
      } else {
        // 添加新联系人
        axios
          .post('/api/contact', this.contactForm, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          .then(response => {
            this.fetchContacts(); // 刷新联系人列表
            this.cancelEdit(); // 关闭表单
          })
          .catch(error => {
            console.error('添加联系人失败:', error);
          });
      }
    },
    // 取消编辑
    cancelEdit() {
      this.showContactForm = false;
      this.contactForm = { name: '', telephone: '', address: '', tag: '' }; // 清空表单
      this.editingContact = null;
    },
    // 删除联系人
    deleteContact(id) {
      MessageBox.confirm('你确定要删除这个联系人吗？删除后无法恢复', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        axios
          .delete(`/api/contact/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          .then(response => {
            this.fetchContacts(); // 刷新联系人列表
            Message.success('联系人已成功删除');
          })
          .catch(error => {
            console.error('删除联系人失败:', error);
            Message.error('删除失败，请稍后再试');
          });
      })
      .catch(() => {
        // 用户点击取消后执行的逻辑（如果需要）
        Message.info('取消删除操作');
      });
    }
  }
};
</script>

<style scoped>
.contact-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.contact-list .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-list h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.add-contact-btn {
  margin-left: 20px;
}

.empty-state {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
}

.el-table {
  width: 100%;
  margin-top: 20px;
}

.el-table-column {
  padding: 10px;
}

.el-dialog {
  width: 50%;
}

.el-form-item {
  margin-bottom: 20px;
}

.dialog-footer {
  text-align: right;
}


</style>
