<template>
    <div class="admin p-4">
        <h2 v-bind:class="{'text-light':true}">Mis clips</h2>
        <b-row>
            <b-col lg="6" v-bind:class="{'my-3':true}">
            </b-col>
            <b-col lg="6" v-bind:class="{'my-3':true}">
                <b-form-group
                label="Filter"
                label-for="filter-input"
                label-cols-sm="12"
                label-align-sm="left"
                label-size="sm"
                class="mb-0"
                >
                <b-input-group size="sm">
                    <b-form-input
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Filtrar clips..."
                    ></b-form-input>

                    <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                </b-input-group>
                </b-form-group>
            </b-col>
        </b-row>

        <b-table striped dark hover :filter="filter" :items="items" :fields="fields" :tbody-tr-class="rowClass" :per-page="perPage" :current-page="currentPage" @filtered="onFiltered">
            <template #cell(actions)="row">
                <div class="d-flex justify-content-evenly" v-if="row.item.hasOwnProperty('_id')">
                    <b-button class="btn-danger" @click="editUser(row.item._id)">Eliminar</b-button>
                    <b-button class="btn-success" @click="editUser(row.item._id)">Compartir</b-button>
                </div>
            </template>
            <template #cell(signal)="row">
                <div class="signal-logo mx-auto" :style="'background-image:url(http://localhost:4100'+row.item.signal.logo+');'"></div>
            </template>
            <template #cell(timestampStartFormat)="row">
                <div v-html="row.item.timestampStartFormat" class="date"></div>
            </template>
            <template #cell(timestampEndFormat)="row">
                <div v-html="row.item.timestampEndFormat" class="date"></div>
            </template>
            <template #cell(created_atFormat)="row">
                <div v-html="row.item.created_atFormat" class="date"></div>
            </template>
            <template #cell(duration)="row">
                <div v-html="row.item.duration" class="date"></div>
            </template>
            <template #cell(output)="row">
                <a class="btn btn-primary" :href="'http://'+row.item.signal.ipServer+':7900/getvideo/'+encodeURIComponent(row.item.output)" v-if="row.item.output"><i class="fa fa-2x fa-play"></i></a>
                <b-button class="btn-success ml-2" @click="editUser(row.item._id)" v-if="row.item.output"><i class="fa fa-2x fa-download"></i></b-button>
            </template>
            <template #cell(active)="row">
                <toggle-button v-model="row.item.active"
                    color="#F86423"
                    :sync="true"
                    :labels="{checked: 'Activo', unchecked: 'Inactivo'}"
                    :width="80"
                    @change="saveToggle(row.item._id,'active',row.item.active)"
                />
                <b-spinner variant="success" class="canal13 ml-2 mt-2 position-absolute top-0 end-0" label="Spinning" v-if="loading&&currentId==row.item._id&&currentField=='active'"></b-spinner>
            </template>
        </b-table>


        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          v-bind:class="{'my-0':true}"
          dark
        ></b-pagination>


        <b-modal id="editing" title="BootstrapVue" class="backdropblur" size="xl" @hidden="closeModal()">
            <template #modal-header="{ close }">
                <span v-if="tempUser&&currentId">Editar Usuario: <strong>{{tempUser.name}} {{tempUser.lastName}}</strong></span>
                <span v-if="!currentId">Crear Usuario:</span>
                <b-button class="d-none" size="sm" variant="outline-danger" @click="closeModal(close)">
                    X
                </b-button>
            </template>

            <b-form v-if="editingIndex!=null" @submit.stop.prevent="onSubmit">

                <b-form-group id="example-input-group-1" label="Nombre(s):" label-for="example-input-1">
                    <b-form-input
                    id="example-input-1"
                    name="example-input-1"
                    placeholder="Ingrese nombre(s)..."
                    v-model="items[editingIndex].name"
                    v-validate="{ required: true, min: 2, alpha_spaces: true }"
                    :state="validateState('example-input-1')"
                    aria-describedby="input-1-live-feedback"
                    data-vv-as="Nombre(s)"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback">{{ veeErrors.first('example-input-1') }}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-2" label="Apellido(s):" label-for="example-input-2">
                    <b-form-input
                    id="example-input-2"
                    name="example-input-2"
                    placeholder="Ingrese apellido(s)..."
                    v-model="items[editingIndex].lastName"
                    v-validate="{ required: true, min: 2, alpha_spaces: true }"
                    :state="validateState('example-input-2')"
                    aria-describedby="input-2-live-feedback"
                    data-vv-as="Apellido(s)"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-2-live-feedback">{{ veeErrors.first('example-input-2') }}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-3" label="Correo electrónico:" label-for="example-input-3">
                    <b-form-input
                    id="example-input-3"
                    name="example-input-3"
                    placeholder="Ingrese correo electrónico..."
                    v-model="items[editingIndex].email"
                    v-validate="{ required: true, email: true }"
                    :state="validateState('example-input-3')"
                    aria-describedby="input-3-live-feedback"
                    data-vv-as="Correo electrónico"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-3-live-feedback">{{ veeErrors.first('example-input-3') }}</b-form-invalid-feedback>
                </b-form-group>
                
                <b-form-group id="example-input-group-4" label="Teléfono:" label-for="example-input-4">
                    <b-form-input
                    id="example-input-4"
                    name="example-input-4"
                    placeholder="Ingrese teléfono (sin signo +) o anexo..."
                    v-model="items[editingIndex].phoneNumber"
                    v-validate="{ required: false, min: 4, max: 12 }"
                    :state="validateState('example-input-4')"
                    aria-describedby="input-4-live-feedback"
                    data-vv-as="Teléfono"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-4-live-feedback">{{ veeErrors.first('example-input-4') }}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-5" label="Rol:" label-for="example-input-5">
                    <b-form-select
                    id="example-input-5"
                    name="example-input-5"
                    v-model="items[editingIndex].role"
                    :options="roles.map((role)=>{ return { value: role._id, text: role.name} })"
                    v-validate="{ required: true }"
                    :state="validateState('example-input-5')"
                    aria-describedby="input-5-live-feedback"
                    data-vv-as="Rol"
                    ></b-form-select>

                    <b-form-invalid-feedback id="input-5-live-feedback">{{ veeErrors.first('example-input-5') }}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-checkbox
                id="checkbox-1"
                v-model="items[editingIndex].allowsGmail"
                name="checkbox-1"
                :value="true"
                :unchecked-value="false"
                >
                El usuario puede iniciar sesión con su cuenta Google.
                </b-form-checkbox>

                <hr class="my-4"/>

                <div class="pass">
                    <small class="d-block text-right w-100">Sólo rellenar si desea modificar contraseña</small>
                    <b-form-group id="example-input-group-6" label="Contraseña:" label-for="example-input-6">
                        <b-form-input
                        id="example-input-6"
                        name="example-input-6"
                        ref="example-input-6"
                        placeholder="Ingrese nueva contraseña..."
                        v-model="items[editingIndex].password"
                        v-validate="{ required: currentId==null }"
                        :state="validateState('example-input-6')"
                        aria-describedby="input-6-live-feedback"
                        data-vv-as="Contraseña"
                        @input="checkForNewPassword(items[editingIndex].password)"
                        ></b-form-input>

                        <b-form-invalid-feedback id="input-6-live-feedback">{{ veeErrors.first('example-input-6') }}</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group id="example-input-group-7" label="Confirmar contraseña:" label-for="example-input-7">
                        <b-form-input
                        id="example-input-7"
                        name="example-input-7"
                        placeholder="Ingrese nueva contraseña..."
                        v-model="tempPassword"
                        v-validate="{ required: newPassword, confirmed: 'example-input-6' }"
                        :state="validateState('example-input-7')"
                        aria-describedby="input-7-live-feedback"
                        data-vv-as="Contraseña"
                        ></b-form-input>

                        <b-form-invalid-feedback id="input-7-live-feedback">{{ veeErrors.first('example-input-7') }}</b-form-invalid-feedback>
                    </b-form-group>
                </div>

                <hr class="my-4"/>
                <div class="d-flex justify-content-between w-100">
                    <b-button type="submit" variant="success" class="mx-auto" size="lg">Guardar cambios</b-button>
                </div>
            </b-form>

            <template #modal-footer>
                    <!-- Emulate built in modal footer ok and cancel button actions -->
                    <div class="d-flex justify-content-between w-100">
                        <b-button size="md" variant="danger" @click="deleteUser(editingIndex)"  v-if="tempUser&&currentId">
                            Eliminar usuario
                        </b-button>
                        <b-button class="ml-auto" size="md" variant="warning" @click="closeModal()">
                            Cancelar
                        </b-button>
                        
                    </div>
                </template>
        </b-modal>
    </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
import {
    getCropsByUser,
    updateCrop
} from '@/helpers/API.js';

export default {
    name:"Usuarios",
    components: {

    },
    data() {
        return {
            items:[],
            fields: [
                { key:'actions',label:'Acciones'},
                { key:'signal',label:'Señal',sortable:true},
                { key:'timestampStartFormat',label:'Inicio',sortable:true},
                { key:'timestampEndFormat',label:'Final',sortable:true},
                { key:'duration',label:'Duración (HH:mm:ss)',sortable:true},
                { key:'created_atFormat',label:'Fecha de creación',sortable:true},
                { key:'output',label:'Archivo',sortable:true},
                { key:'active',label:'Activo',sortable:true},
            ],
            perPage: 15,
            currentPage: 1,
            filter: null,
            totalRows: 1,
            editingIndex: null,
            tempUser: null,
            tempPassword: "",
            newPassword: false,
            loading:false,
            currentId:null,
            currentField:null
        }
    },
    methods: {
        checkForNewPassword(pass) {
            var that = this;
            if(pass.length>0) that.newPassword = true;
            else that.newPassword = false;
        },
        validateState(ref) {
            if (
                this.veeFields[ref] &&
                (this.veeFields[ref].dirty || this.veeFields[ref].validated)
            ) {
                return !this.veeErrors.has(ref);
            }
            return null;
        },
        async onSubmit() {
            var that = this;
            that.$validator.validateAll().then(async result => {
                if (!result) {
                    return;
                }

                if(that.editingIndex!=null&&that.currentId!=null) {
                    if(that.items[that.editingIndex].password == "") delete that.items[that.editingIndex].password;
                    let response = await updateUser(that.items[that.editingIndex]._id,that.items[that.editingIndex])
                    console.log(response);
                    that.filter = that.items[that.editingIndex].email;
                    that.tempUser = null;
                }

                if(that.currentId==null) {
                    if(that.items[that.editingIndex].password == "") delete that.items[that.editingIndex].password;
                    let response = await createUser(that.items[that.editingIndex]);
                    that.currentId = response.data._id;
                    that.filter = that.items[that.editingIndex].email;
                    that.tempUser = null;
                    let result = await getUsers();
                    that.items = result.data;
                }

                that.$bvModal.hide("editing");
                that.editingIndex = null;
            }).catch((e)=>{
                console.log(e);
                that.$bvModal.hide("editing");
                that.editingIndex = null;
            });
        },
        async saveToggle(id,field,value) {
            var that = this;
            that.loading = true;
            that.currentId = id;
            that.currentField = field;
            let newValues = {};
            newValues[field] = value;
            await updateCrop(id,newValues);
            setTimeout(()=>{
                that.loading = false;
            },500);
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        editUser(index) {
            let that = this;
            that.currentId = index;
            that.editingIndex = that.items.findIndex((item)=>{
                return item._id == index;
            });
            that.tempUser = JSON.parse(JSON.stringify(that.items[that.editingIndex]));
            that.items[that.editingIndex].password = "";
            that.$bvModal.show("editing");
        },
        newUser() {
            let that = this;
            that.currentId = null;
            that.tempUser = JSON.parse(JSON.stringify(that.items[0]));
            Object.keys(that.tempUser).forEach((key)=>{
                switch(key) {
                    case 'active':
                        that.tempUser[key] = true;
                        break;
                    case 'allowsGmail':
                        that.tempUser[key] = false;
                        break;
                    default:
                        that.tempUser[key] = null;
                }
            })
            that.items.unshift(that.tempUser);
            that.editingIndex = 0;
            that.items[that.editingIndex].password = "";
            that.$bvModal.show("editing");
        },
        async deleteUser(index) {
            let that = this;
            setTimeout(async()=>{
                let r = confirm("¿Está seguro que desea eliminar el usuario: "+that.items[index].name+" "+that.items[index].lastName+"?");
                if(r) {
                    console.log("delete",that.items[index].name+" "+that.items[index].lastName);
                    let response = await deleteUser(that.items[that.editingIndex]._id);
                    that.items.splice(index,1);
                    that.editingIndex = null;
                    that.filter = "";
                }
                that.$bvModal.hide("editing");
            },1);
        },
        rowClass(item, type) {
            let that = this;
            if (!item || type !== 'row') return
            if (item.index == that.editingIndex) return 'editing'
        },
        async closeModal(callback = null,type = 'cancel') {
            let that = this;
            if(that.tempUser!=null&&that.currentId!=null) {
                Object.keys(that.items[that.editingIndex]).forEach((prop)=>{
                    if(that.items[that.editingIndex].hasOwnProperty(prop)) {
                        that.items[that.editingIndex][prop] = that.tempUser[prop];
                    }
                });
                delete that.items[that.editingIndex].password;
            } 
            if(that.currentId==null) {
                if(that.items[0]._id==null) that.items.splice(0,1);
            }
            that.editingIndex = null;
            that.currentId = null;
            that.tempPassword = "";
            that.newPassword = false;
            if(callback) callback();
            else that.$bvModal.hide("editing");
        },
        async processCrops(data) {
            let that = this;
            return await Promise.all(
                data.map(async (item) => {
                    if(!item.output) {
                        let link = await axios.get("http://"+item.signal.ipServer+":7900/cropfind/"+item.author.email+"/"+item.timestampStart+"/"+item.timestampEnd);
                        if(link.data.finished&&!link.data.processing) item.output = link.data.output;
                        else item.output = null;
                        item.finished = link.data.finished;
                        item.processing = link.data.processing;
                        await updateCrop(item._id,item);
                    }
                    if(item.timestampStart) {
                        item.timeStart = moment(item.timestampStart,'YYYY-MM-DD_HH-mm-ss');
                        item.timestampStartFormat = item.timeStart.format('[<p>]DD-MM-YYYY[<p/><span>]HH:mm:ss[</span>]');
                    }
                    if(item.timestampEnd) {
                        item.timeEnd = moment(item.timestampEnd,'YYYY-MM-DD_HH-mm-ss');
                        item.timestampEndFormat = item.timeEnd.format('[<p>]DD-MM-YYYY[<p/><span>]HH:mm:ss[</span>]');
                    }
                    item.duration = moment.utc(item.timeEnd.diff(item.timeStart)).format('[<span>]HH:mm:ss[</span>]');
                    if(item.created_at) {
                        item.created_atFormat = moment(item.created_at).format('[<p>]DD-MM-YYYY[<p/><span>]HH:mm:ss[</span>]')
                    }
                    if(item.signal.logo.indexOf("\\")!=-1) {
                        let logoBits = item.signal.logo.split("\\");
                        item.signal.logo = logoBits.join("/");
                    }
                    return item;
                })
            )
        }
    },
    mounted() {
        var that = this;
        getCropsByUser(that.user._id)
            .then(async (result)=>{
                that.items = await that.processCrops(result.data);
                that.totalRows = that.items.length;
            }).catch((e)=>{
                console.log(e);
            })
    },
    computed: {
        user: {
            get() {
                return this.$store.state.user;
            }
        }
    }
}
</script>

<style lang="scss">
.signal
{
    &-logo
    {
        width: 60px;
        height: 60px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }
}

.btn-primary
{
  background-color: #F86423 !important;
  border-color: #F86423 !important;
}

.table > :not(caption) > * > * {
    vertical-align: middle;
    position: relative;
}

.date
{
    p
    {
        margin: 0px;
        font-size: 14px;
    }

    span
    {
        font-size: 20px;
        font-weight: bold;
    }
}

.pagination
{
    .page-item
    {
        .page-link
        {
            background-color: #212529;
            border-color: #2e3338;
            color: white;
        }

        &.active
        {
            .page-link
            {
                background-color: #2e3338;
                border-color: #2e3338;
                color: #F86423;
            }
        }
    }
}

#editing
{
    backdrop-filter: blur(5px);

    .modal-content
    {
        background-color: #141414 !important;
        color: #ddd;
        border: 1px solid #333;

        .modal-header,
        .modal-footer
        {
            border-bottom: 1px solid #333;
            border-top: 1px solid #333;
        }

        strong
        {
            color: #F86423;
        }

        input,
        select
        {
            background-color: #000 !important;
            border: none;
            color: white;
        }
    }
    
    .pass
    {
        background-color: #2e3338;
        padding: 15px;
        border-radius: 15px;
    }
}
</style>