<template>
    <div class="container">
        <div class="row" v-if="$gate.isAdmin()"> <!-- mt- from 1 to 5 -->
          <div class="col-md-12 mt-5">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" @click="newModel">Add New <i class="fas fa-user-plus"></i></button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Registered At</th>
                      <th>Modify</th>
                    </tr>
                  </thead>

                  <tbody>

                    <tr v-for="user in users.data" :key="user.id">
                      <td>{{user.id}}</td>
                      <td>{{user.name}}</td>
                      <td>{{user.email}}</td>
                      <td>{{user.type | upText}}</td>
                      <td>{{user.created_at | myDate}}</td>


                      <td>
                          <a href="#" @click="editModel(user)">
                              <i class="fa fa-edit blue" style="font-size:18px"></i>
                          </a>
                          /
                          <a href="#" @click="deleteUser(user.id)">
                              <i class="fa fa-trash red" style="font-size:18px"></i>
                          </a>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <pagination :limit="2" :data="users" @pagination-change-page="getResults"></pagination>
              </div>
            </div>
            <!-- /.card -->
          </div>
        </div>

        <div v-if="!$gate.isAdmin()">
            <not-found></not-found>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 v-if="!editMode" class="modal-title" id="addNewLabel">Add New User</h5>
                <h5 v-else-if="editMode" class="modal-title" id="addNewLabel">Update User Info</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
        <form @submit.prevent="editMode ? updateUser() : createUser()">
            <div class="modal-body">
                <div class="form-group">
                    <input v-model="form.name" type="text" name="name" required placeholder="User Name"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                    <has-error :form="form" field="name"></has-error>
                </div>

                <div class="form-group">
                    <input v-model="form.email" type="email" name="email" required placeholder="Email Address"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                    <has-error :form="form" field="email"></has-error>
                </div>

                <div class="form-group">
                    <textarea v-model="form.bio" name="bio" placeholder="Short bio for user (Optional)"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                    <has-error :form="form" field="bio"></has-error>
                </div>

                <div class="form-group">
                    <select name="type" id="type" class="form-control" v-model="form.type" :class="{ 'is-invalid': form.errors.has('type') }">
                        <option value="">Select User Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">Customer</option>
                    </select>
                    <has-error :form="form" field="type"></has-error>
                </div>

                <div class="form-group">
                    <input v-model="form.password" name="password" type="password" placeholder="Password"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                    <has-error :form="form" field="password"></has-error>
                </div>


            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                <button v-if="editMode" type="submit" class="btn btn-success">Update</button>
                <button v-else-if="!editMode" type="submit" class="btn btn-primary">Add User</button>

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
                users:{},
                form: new Form({
                    id:'',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: '',
                })
            }
        },
        methods:{
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
		    },
            updateUser(){
                 this.$Progress.start(); // start progress bar
                 this.form.put('api/user/'+this.form.id)
                 .then(() => {
                     $('#addNew').modal('hide'); //hide modal
                     Swal.fire(
                        'Updated!',
                        'One user has been updated.',
                        'success'
                        )
                        this.$Progress.finish(); // finish progress bar
                        this.loadUser(); //reload the users to add the new one
                 })
                 .catch(() => {
                     this.$Progress.fail(); // fail progress bar
                     Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                     })
                 })
            },
            editModel(user){
                this.editMode = true;
                this.form.reset();
                $('#addNew').modal('show'); //show modal
                this.form.fill(user);
            },
            newModel(){
                this.editMode = false;
                this.form.reset();
                $('#addNew').modal('show'); //show modal
            },
            deleteUser(id){
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
                        this.form.delete('api/user/'+id)
                        .then(()=>{

                                Swal.fire(
                                'Deleted!',
                                'One user has been deleted.',
                                'success'
                                )
                                this.loadUser(); //reload the users to add the new one

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
            loadUser(){
                if(this.$gate.isAdmin()){
                    axios.get("api/user").then(({data}) => (this.users = data));
                }
            },
            createUser(){
                this.$Progress.start(); // start progress bar
                this.form.post('api/user')
                .then(()=>{
                    $('#addNew').modal('hide'); //hide modal

                    Toast.fire({
                        icon: 'success',
                        title: 'User Created successfully'
                    })
                    this.$Progress.finish(); // finish progress bar

                    this.loadUser(); //reload the users to add the new one
                })
                .catch(() =>{

                })
            }

        },
        created() {
            Fire.$on('searching', () => {
                let query = this.$parent.search;
                axios.get('api/findUser?q=' + query)
                .then((data) => {
                    this.users = data.data;
                })
                .catch(() => {

                })
            });
            this.loadUser();
            //setInterval(() => this.loadUser(), 3000); //send request every 3 second to reload user data
        }
    }
</script>
