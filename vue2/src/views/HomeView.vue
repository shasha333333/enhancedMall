<template>
  <div class="home">
    <div class="tan-header container">
      <div class="tan-header-logo">
        <a><img src="@/assets/malllogo.png" /></a>
      </div>
      <div class="tan-header-search">
        <input class="tan-header-search-input" type="text" />
        <button class="tan-header-search-btn">&#128269;</button>
      </div>
    </div>
    <el-carousel :interval="4000" type="card" height="540px">
      <el-carousel-item v-for="item in pics" :key="item">
        <!-- <h3 class="medium">{{ item }}</h3> -->
         <img v-bind:src="item" class="medium" style="width: 100%; height: 100%; object-fit: cover;" >
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HomeView',
  components: {
  },
  data() {
    return {
      pics : []
    }
  },
  mounted() {
    axios.get("/api/home/pics")
    .then(res=>{
      console.log(res);
      this.pics = res.data;
    })
    .catch(err=>{
      console.log(err);
    })

  }
}
</script>
<style>
.tan-header {
    display: flex;
    height: 100px;
    align-self: center;
    position: relative;
}

.tan-header-nav {
    display: flex;
    margin-left: 100px;
}

.tan-header-nav-item {
    padding: 38px 12px;
}

.tan-header-nav-item > a {
    font-size: 16px;
    color: #333;
    text-decoration-line: none;
    transition: color .2s;
}

.tan-header-nav-item > a:hover {
    color: #ff6700;
}
.tan-header-logo img{
    height: 50px;
    padding-top:25px
}

.tan-header-search {
    display: flex;
    height: 50px;
    margin-top: 26px;
    position: absolute;
    right: 0;
}

.tan-header-search-input, 
.tan-header-search-btn {
    height: 48px;
    border: 1px solid #e0e0e0;
    outline: none;
    transition: all .3s;
}

.tan-header-search:hover > .tan-header-search-input,
.tan-header-search:hover > .tan-header-search-btn {
    border-color: #b0b0b0;
}

.tan-header-search > .tan-header-search-input:focus, 
.tan-header-search > .tan-header-search-input:focus + .tan-header-search-btn {
    border-color: #ff6700;
}

.tan-header-search-input {
    width: 223px;
    padding: 0 10px;
}

.tan-header-search-btn {
    width: 52px;
    height: 50px;
    color: #616161;
    background-color: #fff;
    position: relative;
    left: -1px;
    cursor: pointer;
    font-size: 22px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

</style>