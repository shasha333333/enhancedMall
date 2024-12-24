<template>
    <div>
        <div class="tan-page-header">
            <div class="container">
                <h2>确认订单</h2>
            </div>
        </div>
        <div class="buy container">
            <div class="body">
                <div class="address">
                    <h3 class="header">收货地址</h3>
                    <!--这里插入从服务端获取的收货地址列表-->
                    <ul class="tan-contact-list">
                        <li v-for="contact in contacts" :key="contact.id" class="tan-contact-list-item"
                            :class="{ active: currentContact && contact.id == currentContact.id }"
                            @click="currentContact = contact">
                            <div class="tan-contact-info">
                                <div class="tan-contact-info-name">
                                    {{ contact.name }}
                                    <span>{{ contact.tag }}</span>
                                </div>
                                <span class="tan-contact-info-tel">{{ contact.telephone }}</span>
                                <span class="tan-contact-info-address">{{ contact.address }}</span>
                            </div>
                            <div class="tan-contact-action">
                                <span>删除</span>
                                <span>修改</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="products">
                    <h3 class="header">商品</h3>
                    <!--这里插入购物车中勾选的商品信息-->
                    <ul class="list">
                        <li v-for="cart in carts" :key="cart.id" class="item" v-if="cart.checked">
                            <div class="img">
                                <img :src="cart.image">
                            </div>
                            <div class="name" :title="cart.name + ' ' + cart.pname">{{ cart.name + " " + cart.pname }}
                            </div>
                            <div class="price-box">
                                <span class="price">{{ cart.sale_price }} × {{ cart.quantity }}</span>
                                <span class="total">{{ (cart.sale_price * cart.quantity).toFixed(2) }}元</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="total-price">
                    <!--这里统计购物车中选中的商品总价-->
                    <h3 class="header">小计</h3>
                    <div class="price">
                        <span class="text">应付总额：</span>
                        <span class="money">
                            <em>{{ totalPrice }}</em>
                            元
                        </span>
                    </div>
                </div>
            </div>
            <div class="footer">
                <!--这里显示选中的收获地址信息-->
                <div v-if="currentContact" class="address">
                    <div class="info">{{ currentContact.name + " " + currentContact.telephone }}</div>
                    <div class="description">{{ currentContact.address }}</div>
                </div>
                <div class="btns">
                    <el-button width="160px" height="40px" @click="$router.go(-1)">返回购物车</el-button>
                    <el-button type="primary" width="160px" height="40px" @click="buy">立即下单</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="确认付款" :visible.sync="visible" @cancel="closePay">
            <div>
                <h2>立即支付？</h2>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" width="160px" height="40px" @click="pay">立即支付</el-button>
                <el-button width="160px" height="40px" @click="closePay">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "Buy",
    data() {
        return {
            contacts: [],           // 收货地址列表
            currentContact: null,   // 当前选择的收货地址
            carts: [],           // 购物车数据
            visible: false,
            orderId: null,
        }
    },
    computed: {
        totalPrice() {
            let total = 0
            this.carts.forEach(e => {
                total += e.quantity * e.sale_price * e.checked
            })
            return total.toFixed(2)
        }
    },
    mounted() {
        this.getContactList();
        this.getCarts();
    },
    methods: {
        getContactList() {
            axios.get("/api/contact/list", {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
                .then(res => {
                    this.contacts = res.data;
                });
        },
        getCarts() {
            axios.get("/api/cart/list", {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
                .then(res => {
                    this.carts = res.data
                })
        },
        buy() {
            if (!this.currentContact) {
                this.$message.warning("请选择联系人")
                return
            }
            axios.post("/api/order/buy",
                {
                    contactId: this.currentContact.id,
                    products: this.carts
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                })
                .then(res => {
                    if (res.data.code == 200) {
                        this.orderId = res.data.data;
                        this.visible = true;
                    }
                    else this.$message.warning(res.data.message)
                })
        },
        pay() {
            axios
                .post("/api/order/pay",
                    {
                        orderId: this.orderId,
                    },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    })
                .then(res => {
                    if (res.data.code == 200) this.$message.success(res.data.message)
                    else this.$message.warning(res.data.message)
                    this.$router.push({ path: "/order" })
                })
        },
        closePay() {
            this.visible = false
            this.$router.push({ path: "/order" })
        }

    },
}
</script>


<style>
.tan-page-header {
    height: 63px;
    color: #616161;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 5px 5px rgb(0 0 0 / 7%);
    width: 100%;
    background-color: #fff;
    position: relative;
    z-index: 999;
}

.tan-page-header h2 {
    color: #424242;
    font-size: 18px;
    font-weight: 400;
    line-height: 60px;
}

.container {
    width: 1226px;
    margin: 0 auto;
}

.tan-contact-list {
    display: flex;
    flex-wrap: wrap;
}

.tan-contact-list-item {
    width: 268px;
    height: 178px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    line-height: 22px;
    color: #757575;
    position: relative;
    transition: all .3s;
}

.tan-contact-list-item:not(:nth-child(4n + 4)) {
    margin: 0 17px 20px 0;
}

.tan-contact-list>.tan-contact-list-item.active {
    border-color: #ff6700;
}

.tan-contact-info {
    padding: 15px 24px 0;
}

.tan-contact-info-name {
    font-size: 18px;
    color: #333;
    line-height: 30px;
    margin-bottom: 10px;
    position: relative;
}

.tan-contact-info-name>span {
    position: absolute;
    right: 0;
    color: #b0b0b0;
}

.tan-contact-info-tel,
.tan-contact-info-address {
    display: block;
}

.tan-contact-action {
    position: absolute;
    right: 24px;
    bottom: 10px;
    color: #ff6700;
    opacity: 0;
    transition: all .3s;
}

.tan-contact-action>span {
    margin-left: 10px;
}

.tan-contact-list-item:hover {
    border-color: #b0b0b0;
}

.tan-contact-list-item:hover>.tan-contact-action {
    opacity: 1;
}

.buy {
    margin: 40px auto;
    background-color: #fff;
    padding-top: 30px;
}

.buy>.body {
    padding: 0 24px;
}

.buy>.body .header {
    color: #333;
    font-size: 18px;
    line-height: 20px;
    font-weight: 400;
    margin-bottom: 20px;
}

.buy>.body>.products>.list>.item {
    display: flex;
    padding: 15px 0;
    align-items: center;
}

.buy>.body>.products>.list>.item>.img {
    margin-right: 10px;
}

.buy>.body>.products>.list>.item>.img>img {
    width: 30px;
    height: 30px;
}

.buy>.body>.products>.list>.item>.name {
    width: 650px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1;
    color: #424242;
}

.buy>.body>.products>.list>.item>.price-box>span {
    display: inline-block;
}

.buy>.body>.products>.list>.item>.price-box>.price {
    width: 150px;
    text-align: center;
}

.buy>.body>.products>.list>.item>.price-box>.total {
    width: 290px;
    text-align: right;
    color: #ff6700;
}

.buy>.body>.total-price {
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.buy>.body>.total-price>.header {
    padding: 20px 0;
    margin-bottom: 0;
}

.buy>.body>.total-price>.price {
    padding: 0 48px 10px 0;
}

.buy>.body>.total-price>.price>.money {
    color: #ff6700;
}

.buy>.body>.total-price>.price>.money>em {
    font-size: 30px;
}

.buy>.footer {
    min-height: 40px;
    padding: 20px 48px;
    border-top: 2px solid #f5f5f5;
    display: flex;
    position: relative;
}

.buy>.footer>.address {
    line-height: 20px;
    color: #424242;
}

.buy>.footer>.btns {
    position: absolute;
    right: 48px;
}

.buy>.footer>.btns>button:last-child {
    margin-left: 30px;
}
</style>
