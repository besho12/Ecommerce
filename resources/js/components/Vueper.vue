<template>
    <div class="container">
        
    <div class="product pt-4">
        <div class="row">
            <div class="col-md-0.5"><i @click.prevent="slidePrev" class="fas fa-chevron-left arrow"></i></div>
            <div class="col-md-11" style="padding:0;">
                <hooper ref="carousel" @slide="updateCarousel" :mouseDrag="true" :itemsToShow="6" :infiniteScroll="true" :wheelControl="false">            
                    <slide class="col-lg-2 col-md-2 col-sm-6 col-6" v-for="product in products" :key="product.id">
                        <a href="/dashboard">
                        <div  class="card" style="height:276px;">
                            <img class="card-img-top"  style="height:180px; margin-top:20px; object-fit:contain;" :src="'./img/products/' + product.image" alt="Card image cap">
                            <div class="card-body">
                                <h4 style="color:#474747!important" class="card-title">{{product.name | str_limit(35) }}</h4>                                
                            </div>
                        </div>
                        </a>
                    </slide>                    
                </hooper>
            </div>
            <div class="col-md-0.5"><i @click.prevent="slideNext" class="fas fa-chevron-right arrow"></i></div>
        </div>
    </div>


    </div>
</template>





<script>
import { Hooper, Slide } from 'hooper';
import 'hooper/dist/hooper.css';


export default {
  components: {
    Hooper,
    Slide,
  },
 props: {
    category: String
  },
  data(){
    return{
        searchText:'',
        products:{},
    }
  },
   methods: {
    slidePrev() {
      this.$refs.carousel.slidePrev();
    },
    slideNext() {
      this.$refs.carousel.slideNext();
    },
    updateCarousel(payload) {
      this.myCarouselData = payload.currentSlide;
    },
    loadProducts(){
      axios.get("api/products/category/"+ this.category).then(({data}) => (this.products = data));
    },
  },
    created() {
        this.loadProducts();
    }
}
</script>

<style>
.hooper {
    height: auto;
}
.hooper-slide {
    padding:5px;
}
.hooper-slide:hover {
    filter: drop-shadow(0 0 0.3rem rgba(30,119,165,.9));
}
.arrow {
    font-size: 30px;
    margin-top: 105px;
    color:#777;
    filter: drop-shadow(0 0 2rem rgba(30,119,165));
}
.arrow:hover {
    color:#000;
}
.arrow:hover {
    cursor: pointer;
}
.product {
    padding: 20px 0px;
}
@media screen and (max-width: 992px) {
  .arrow {
      display: none;
  }
}
</style>