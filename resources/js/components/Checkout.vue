<template>
  <div class="container">
      <div class="checkout pb-4">
        <div class="row">
        <div class="col-md-8">
          <h2 class="text-left header4">Shopping Cart ({{totalquantity()}})<a class="fas fa-shopping-cart"></a></h2>
          <ul class="ul">
              <p class="Empty" v-if="this.$store.state.cart.length == 0">Shopping cart is currently empty
                   <br>Add items to your cart and view them here before you checkout.
                   <br> <router-link to="/Dashboard">Shopping Now!</router-link>
              </p>
              <li v-for="(item,index) in this.$store.state.cart" :key="index" class="media">
                  <img :src=" '/img/products/' + item.image" alt="" width="65px;" height="65px;" style="margin-top:15px;object-fit:contain;">
                  <div class="media-body text-left">
                    <h5 class="mt-0">{{item.name | str_limit(52)}}
                      <span class="fa fa-times float-right remove-item" @click="$store.commit('removefromcart',item)"></span>
                    </h5>
                    <p class="mt-0" style="font-size:15px;color:blue;">Price: {{item.price }}</p>
                    <p class="mt-0" style="font-size:15px;">Quantity : {{item.quantity}}</p>
                  </div>
              </li>
          </ul>
        </div>
        <div class="col-md-4">
            <div class="text-center total_price">
                <h2 style="font-weight:bolder;"> Total Price </h2>
                <h4 >{{this.totalprice()}}</h4>
                <button class="btn btn-primary checkout_button" @click="buy" >Checkout</button>
            </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
export default {
  methods: {
    totalprice(){
      var total = 0;
      for (var i=0;i<this.$store.state.cart.length;i++){
        total = total + (this.$store.state.cart[i].quantity * this.$store.state.cart[i].price)
      }
        return total;
    },
    totalquantity(){
      var quantity = 0 ;
      for (var i=0;i<this.$store.state.cart.length;i++){
        quantity = quantity + (this.$store.state.cart[i].quantity)
      }
      return quantity;
    },
    buy(){
        alert('Coming Soon..');
    }
  }
}
</script>


<style scoped lang="scss">

.header4 {
    margin-bottom: 30px;
    margin-top: 30px;
    margin-left: 50px;
    font-weight: bolder;
    color: #5f5e5e;
}
.media {
    padding: 10px;
    height: 150px;
}
.media-body {
    padding-left: 20px;
    padding-top: 10px;
}
.ul {
    margin-bottom: 0px;
}
.media-body p {
    margin-bottom: 5px !important;
}
.media-body h5 {
    margin-bottom: 10px;
}
.remove-item:hover {
    cursor: pointer;
}
.checkout li {
    background: #FFF;
    margin: 10px;
    padding: 25px;
    border: 1px solid #ddd;
}
.Empty {
    text-align: left;
    font-size: 20px;
    padding: 20px;
    background: #DDD
}
.total_price {
    margin-top:30px;
    font-weight: bolder;
    color: #5f5e5e;
}
.checkout_button {
    margin-top:20px;
    font-size: 18px;
    padding: 5px 40px;
}
</style>