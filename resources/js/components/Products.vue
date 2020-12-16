<template>
    <div class="container">
        <button style="position: absolute;top: 10px;z-index: 99999 !important;right: 28px;" class="btn btn-success"  @click="newModel">Add New Product <i class="fas fa-plus"></i></button>
        <div class="row"> <!-- mt- from 1 to 5 -->
          <div class="col-lg-3 col-md-6 col-sm-12 mt-3" v-for="product in products" :key="product.id">
            <div  class="card" style="width: 17rem; height:444.444px;">
                <img class="card-img-top"  style="height:250px; object-fit:contain; margin-top:20px;" :src="'./img/products/' + product.image" alt="Card image cap">
                <div class="card-body">
                    <h3 class="card-title" style="height:40px;">{{product.name | str_limit(47)}}</h3>
                    <h5 class="card-text" style="color:blue;">Price: {{product.price}}</h5>
                    
                    <p class="card-text"></p>
                    <a href="#" @click="editProduct(product)" class="btn btn-outline-success pr-4 pl-4">Edit</a>
                    <a href="#" @click="deleteProduct(product.id)" class="btn btn-outline-danger pr-3 pl-3 float-right">Delete</a>
                </div>
            </div>

          </div>
        </div>

     <!--
        <div v-if="!$gate.isAdmin()">
            <not-found></not-found>
        </div>
    -->

        <!-- Modal -->
        <div class="modal fade" id="addProduct" tabindex="-1" role="dialog" aria-labelledby="addProductLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 v-if="!editMode" class="modal-title" id="addProductLabel">Add Newss Product</h5>
                <h5 v-if="editMode" class="modal-title" id="addProductLabel">Update The Product</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        <form @submit.prevent="editMode ? updateProduct() : addProduct()">
            <div class="modal-body">
                <div class="form-group">
                    <input v-model="form.name" type="text" name="name" required placeholder="Product Name" class="form-control" >
                </div>

                <div class="form-group">
                    <input v-model="form.price" type="text" name="price" required placeholder="Product Price" class="form-control" >
                </div>


                <div class="form-group">
                    <select name="type" onfocus='this.size=8;' onblur='this.size=1;' onchange='this.size=1; this.blur();' id="type" class="form-control type" v-model="form.type">
                        <option  value="">Select Proudct Category</option>
                        <option  value="fashion">Fashion</option>
                        <option  value="health">Health</option>
                        <option  value="phones">Phones</option>
                        <option  value="computing">Computing</option>
                        <option  value="accessories">Accessories</option>
                        <option  value="clothing">Clothing</option>                        
                        <option  value="other">Other</option>                        
                    </select>
                </div>

                <div class="form-group">
                    <input type="file" @change="updateProfile" name="image" id="image" placeholder="">
                </div>
                <div class="form-group">
                    <div class="col-form-label">
                        <button v-if="!editMode" type="submit" class="btn btn-success">Save</button>
                        <button v-if="editMode" type="submit" class="btn btn-success">Update</button>
                    </div>
                </div>
            </div>
        </form>
            </div>
        </div>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                editMode: false,
                products:{},
                form: new Form({
                    id:'',
                    name:'',
                    price:'',
                    image: '',
                    type: '',                    
                })
            }
        },
        methods:{
            addProduct(){
              if(this.form.image == "" || this.form.name == ""){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter product name and insert photo!',
                })
              }
              else{
                this.$Progress.start();
                this.form.post('api/products')
                .then(() => {
                    this.$Progress.finish();
                    $('#addProduct').modal('hide'); //hide modal
                    this.loadProducts();
                })
                .catch(() => {
                    this.$Progress.fail();
                });
              }
          },
            loadProducts(){
                if(this.$gate.isAdmin()){
                    axios.get("api/products").then(({data}) => (this.products = data.data));
                }
                else if(this.$gate.isUser()){
                    axios.get("api/products/user").then(({data}) => (this.products = data));
                }
            },
            newModel(){
                this.editMode = false;
                this.form.reset();
                document.getElementById('image').value= ''; //delete input field of image
                $('#addProduct').modal('show'); //show modal
            },
            updateProfile(e){ // Profile image
                let file = e.target.files[0];
                let reader = new FileReader();

                if(file['size'] < 2097152){ // if the file less than 2MB then convert the image to Base46
                    reader.onloadend = (file) => {
                    //console.log('RESULT', reader.result);
                    this.form.image = reader.result;
                    }
                    reader.readAsDataURL(file);
                }else{ // You should upload image less than 2MB
                    Swal.fire({
                        icon:'error',
                        title:'Oops...',
                        text:'Your image must be less than 2MB',
                    })
                }
          },
          deleteProduct(id){
                Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {

                    // Send request to the server
                    if (result.isConfirmed) {
                        this.form.delete('api/products/'+id)
                        .then(()=>{

                                Swal.fire(
                                'Deleted!',
                                'One user has been deleted.',
                                'success'
                                )
                                this.loadProducts(); //reload the users to add the new one

                        })
                        .catch(()=>{
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',
                            })
                        })

                }
                })
            },
            editProduct(product){
                this.editMode = true;
                this.form.reset();
                $('#addProduct').modal('show'); //show modal
                this.form.fill(product);
            },
            updateProduct(){
                 if(this.form.name == ""){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please enter product name!',
                    })
                 }
                 else{
                    this.$Progress.start(); // start progress bar
                    this.form.put('api/products/'+ this.form.id)
                    .then(() => {
                        $('#addProduct').modal('hide'); //hide modal
                        Swal.fire(
                            'Updated!',
                            'One user has been updated.',
                            'success'
                            )
                            this.$Progress.finish(); // finish progress bar
                            this.loadProducts(); //reload the users to add the new one
                    })
                    .catch(() => {
                        this.$Progress.fail(); // fail progress bar
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        })
                    })
                 }
            },
        },
        created() {
            this.loadProducts();
        }

    }
</script>

<style>

</style>