<template>
    <div class="admin p-4">
        <h2 v-bind:class="{'text-light':true}">Señales</h2>
        <b-row>
            <b-col lg="6" v-bind:class="{'my-3':true}">
                <b-button class="btn-warning" size="lg" @click="newSignal">Crear nueva señal</b-button>
            </b-col>
            <b-col lg="6" v-bind:class="{'my-3':true}">
                
            </b-col>
        </b-row>
        <b-table striped dark hover :items="items" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc">
            <template #cell(actions)="row">
                <b-button class="btn-warning" @click="editSignal(row.item._id)">Editar</b-button>
            </template>
            <template #cell(logo)="row">
                <div class="signal-logo mx-auto" :style="'background-image:url('+row.item.logo+');'"></div>
            </template>
            <template #cell(colorBorde)="row">
                <div class="signal-logo mx-auto" :style="'background-color:'+row.item.colorBorde+';'"></div>
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

        <b-modal id="editing" title="BootstrapVue" class="backdropblur" size="xl" @hidden="closeModal()">
            <template #modal-header="{ close }">
                <span v-if="tempSignal&&currentId">Editar Señal: <strong>{{tempSignal.name}}</strong></span>
                <span v-if="!currentId">Crear nueva señal:</span>
                <b-button class="d-none" size="sm" variant="outline-danger" @click="closeModal(close)">
                    X
                </b-button>
            </template>

            <button ref="startloadingfile" class="d-none" @click="startLoadingFile">loadingfile</button>
            <vue-dropzone ref="myVueDropzone" id="dropzone" class="col-12 col-md-10 offset-md-1 d-flex flex-column text-center align-items-center justify-content-center" :options="dropzoneOptions" @vdropzone-success="vsuccess" @vdropzone-complete="vcomplete" @vdropzone-error="verror" @vdropzone-file-added="vfileadded"></vue-dropzone>

            <b-form v-if="editingIndex!=null" @submit.stop.prevent="onSubmit">

                <b-form-group id="example-input-group-1" label="Nombre(s):" label-for="example-input-1">
                    <b-form-input
                    id="example-input-1"
                    name="example-input-1"
                    placeholder="Ingrese nombre..."
                    v-model="items[editingIndex].name"
                    v-validate="{ required: true, min: 2, regex: /^[A-Za-z0-9_@./#&+-]*$/ }"
                    :state="validateState('example-input-1')"
                    aria-describedby="input-1-live-feedback"
                    data-vv-as="Nombre(s)"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback">{{ veeErrors.first('example-input-1') }}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-2" label="ID Rating:" label-for="example-input-2">
                    <b-form-input
                    id="example-input-2"
                    name="example-input-2"
                    placeholder="Ingrese ID rating..."
                    v-model="items[editingIndex].idRating"
                    v-validate="{ required: true, min: 2, alpha_dash: true }"
                    :state="validateState('example-input-2')"
                    aria-describedby="input-2-live-feedback"
                    data-vv-as="ID Rating"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-2-live-feedback">{{ veeErrors.first('example-input-2') }}</b-form-invalid-feedback>
                </b-form-group>

                <b-form-group id="example-input-group-3" label="IP Servidor:" label-for="example-input-3">
                    <b-form-input
                    id="example-input-3"
                    name="example-input-3"
                    placeholder="Ingrese IP servidor..."
                    v-model="items[editingIndex].ipServer"
                    v-validate="{ required: false, ip: true }"
                    :state="validateState('example-input-3')"
                    aria-describedby="input-3-live-feedback"
                    data-vv-as="IP Servidor"
                    ></b-form-input>

                    <b-form-invalid-feedback id="input-3-live-feedback">{{ veeErrors.first('example-input-3') }}</b-form-invalid-feedback>
                </b-form-group>
                
                <b-form-group id="example-input-group-4" label="Color borde:" label-for="example-input-4">
                    <div class="d-flex justify-content-start">
                            <v-swatches v-model="items[editingIndex].colorBorde" swatches="text-advanced"></v-swatches>

                            <b-form-input
                            id="example-input-4"
                            name="example-input-4"
                            class="ml-3"
                            placeholder="Ingrese color borde HEX..."
                            v-model="items[editingIndex].colorBorde"
                            v-validate="{ required: true }"
                            :state="validateState('example-input-4')"
                            aria-describedby="input-4-live-feedback"
                            data-vv-as="Color borde"
                            ></b-form-input>
                       
                    </div>

                    <b-form-invalid-feedback id="input-4-live-feedback">{{ veeErrors.first('example-input-4') }}</b-form-invalid-feedback>
                </b-form-group>

                <!--

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

                -->

                <b-form-checkbox
                id="checkbox-1"
                v-model="items[editingIndex].active"
                name="checkbox-1"
                :value="true"
                :unchecked-value="false"
                >
                Señal activa.
                </b-form-checkbox>
                

                <hr class="my-4"/>
                <div class="d-flex justify-content-between w-100">
                    <b-button type="submit" variant="success" class="mx-auto" size="lg">Guardar cambios</b-button>
                </div>
            </b-form>

            <template #modal-footer>
                    <!-- Emulate built in modal footer ok and cancel button actions -->
                    <div class="d-flex justify-content-between w-100">
                        <b-button size="md" variant="danger" @click="deleteSignal(editingIndex)"  v-if="tempSignal&&currentId">
                            Eliminar señal
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
import {
    getAllSignals,
    createSignal,
    updateSignal,
    deleteSignal
} from '@/helpers/API.js';
import VSwatches from 'vue-swatches'
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import config from '../../app.config';

export default {
    name:"Señales",
    components: { 
        VSwatches,
        vueDropzone: vue2Dropzone 
    },
    data() {
        return {
            items: [],
            sortBy: 'active',
            sortDesc: true,
            fields: [
                { key:'actions',label:'Acciones'},
                { key:'logo',label:'Logo',sortable:false},
                { key:'colorBorde',label:'Color',sortable:true},
                { key:'name',label:'Nombre',sortable:true},
                { key:'idRating',label:'ID Rating',sortable:true},
                { key:'ipServer',label:'IP',sortable:true},
                { key:'active',label:'Activo',sortable:true},
            ],
            loading:false,
            editingIndex: null,
            tempSignal: null,
            currentId:null,
            currentField:null,
            dropzoneOptions: {
                autoProcessQueue: false,
                url: 'http://localhost:4100/api/signal/upload/',
                withCredentials: false,
                method: "POST",
                headers: {
                    "Cache-Control": "",
                },
                thumbnailWidth: 150,
                maxFilesize: 1024,
                paramName: 'file',
                acceptedFiles: '.png,.jpg,.bmp,.gif',
                timeout: 999999999999,
                maxFiles:1,
                init: function() {
                        this.on("maxfilesexceeded", function(file) {
                            this.removeAllFiles();
                            this.addFile(file);
                        });
                },
                dictDefaultMessage: "<p>Haz click o arrastra una nueva imagen</p>",
                previewTemplate: `<div class="dz-preview dz-file-preview" style="pointer-events:none">
                                    <img data-dz-thumbnail />
                                    <p>Haz click o arrastra una nueva imagen</p>
                                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                                    <div class="dz-success-mark"><span>✔</span></div>
                                    <div class="dz-error-mark"><span>✘</span></div>
                                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                                </div>`
            }
        }
    },
    mounted() {
        var that = this;
        getAllSignals()
            .then((result)=>{
                that.items = that.processSignals(result.data);
            }).catch((e)=>{
                console.log(e);
            })
    },
    methods: {
        processSignals(data) {
            return data.map((signal)=>{
                    let newSignal = signal;
                    if(signal.logo.indexOf("\\")!=-1) {
                        let logoBits = signal.logo.split("\\");
                        newSignal.logo = logoBits.join("/");
                    }
                    return newSignal;
                });
        },
        startLoadingFile() {
            var that = this;
            let newURL = config.apiUrl+'signal/upload/'+that.currentId;
            that.$refs.myVueDropzone.options.url = newURL
            that.$refs.myVueDropzone.dropzone.options.url = newURL
            that.dropzoneOptions.url = newURL
            console.log(newURL);
            that.$refs.myVueDropzone.processQueue();
        },
        async vsuccess(file, response) {
            var that = this;
            console.log("vsuccess");
            console.log(response);   
            that.tempSignal = null;
            let result = await getAllSignals();
            that.items = that.processSignals(result.data);         
            that.$bvModal.hide("editing");
            that.editingIndex = null;
        },
        vcomplete(file) {
            var that = this;
            console.log("COMPLETE")
        },
        vfileadded(file) {
            var that = this;
            console.log("that.$refs.myVueDropzone.dropzone.files.length",that.$refs.myVueDropzone.dropzone.files.length);
        },
        verror(file,response) {
            var that = this;
            console.log(response);
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

                that.items[that.editingIndex].color = 'rgba('+that.items[that.editingIndex].colorBorde+',0.2)';

                if(that.editingIndex!=null&&that.currentId!=null) {
                    //EDIT                    
                    let response = await updateSignal(that.items[that.editingIndex]._id,that.items[that.editingIndex])
                    that.currentId = that.items[that.editingIndex]._id;
                    if(that.$refs.myVueDropzone.dropzone.files.length!=0&&!that.$refs.myVueDropzone.dropzone.files[0].manuallyAdded) {
                        that.startLoadingFile();
                    } else {
                        console.log(response);
                        that.tempSignal = null;
                        let result = await getAllSignals();
                        that.items = that.processSignals(result.data);
                        that.$bvModal.hide("editing");
                        that.editingIndex = null;
                    }
                }

                if(that.currentId==null) {
                    let response = await createSignal(that.items[that.editingIndex]);
                    that.currentId = response.data._id;
                    if(that.$refs.myVueDropzone.dropzone.files.length!=0&&!that.$refs.myVueDropzone.dropzone.files[0].manuallyAdded) {
                        that.startLoadingFile();
                    } else {
                        that.tempSignal = null;
                        let result = await getAllSignals();
                        that.items = that.processSignals(result.data);
                        that.$bvModal.hide("editing");
                        that.editingIndex = null;
                    }
                }                
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
            await updateSignal(id,newValues);
            setTimeout(()=>{
                that.loading = false;
            },500);
        },
        editSignal(index) {
            let that = this;
            that.currentId = index;
            that.editingIndex = that.items.findIndex((item)=>{
                return item._id == index;
            });
            that.tempSignal = JSON.parse(JSON.stringify(that.items[that.editingIndex]));
            that.$bvModal.show("editing");
            setTimeout(()=>{
                var file = { size: 123, name: "Logo", type: "image/png" };
                var url = that.items[that.editingIndex].logo;
                that.$refs.myVueDropzone.manuallyAddFile(file, url);
            },500)
        },
        newSignal() {
            let that = this;
            that.currentId = null;
            that.tempSignal = JSON.parse(JSON.stringify(that.items[0]));
            Object.keys(that.tempSignal).forEach((key)=>{
                switch(key) {
                    case 'active':
                        that.tempSignal[key] = true;
                        break;
                    case 'deleted':
                    case 'crops':
                    case 'logo':
                    case 'order':
                        delete that.tempSignal[key];
                        break;
                    case 'allowsGmail':
                        that.tempSignal[key] = false;
                        break;
                    default:
                        that.tempSignal[key] = null;
                }
            })
            that.items.unshift(that.tempSignal);
            that.editingIndex = 0;
            that.$bvModal.show("editing");
        },
        async deleteSignal(index) {
            let that = this;
            setTimeout(async()=>{
                let r = confirm("¿Está seguro que desea eliminar la señal: "+that.items[index].name+"?");
                if(r) {
                    console.log("delete",that.items[index].name+" "+that.items[index].lastName);
                    let response = await deleteSignal(that.items[that.editingIndex]._id);
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
            //if (item.index == that.editingIndex) return 'editing'
        },
        async closeModal(callback = null,type = 'cancel') {
            let that = this;
            if(that.tempSignal!=null&&that.currentId!=null) {
                Object.keys(that.items[that.editingIndex]).forEach((prop)=>{
                    if(that.items[that.editingIndex].hasOwnProperty(prop)) {
                        that.items[that.editingIndex][prop] = that.tempSignal[prop];
                    }
                });
            } 
            if(that.currentId==null) {
                if(that.items[0]._id==null) that.items.splice(0,1);
            }
            that.editingIndex = null;
            that.currentId = null;
            if(callback) callback();
            else that.$bvModal.hide("editing");
        }
    }
}
</script>

<style lang="scss">
.table > :not(caption) > * > * {
    vertical-align: middle;
    position: relative;
}

.canal13
{
    color: #F86423 !important;
}

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
</style>