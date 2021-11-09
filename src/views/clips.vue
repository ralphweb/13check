<template>
    <div class="admin p-4">
        <h2 v-bind:class="{'text-light':true}" v-if="!isAdmin">Mis clips</h2>
        <h2 v-bind:class="{'text-light':true}" v-if="isAdmin">Todos los clips</h2>
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
                    <b-button class="btn-danger" @click="deleteCrop(row.item._id)"><i class="fa fa-2x fa-trash"></i></b-button>
                </div>
            </template>
            <template #cell(signal)="row">
                <div class="signal-logo mx-auto" :style="'background-image:url(http://localhost:4100'+row.item.signal.logo+');'"></div>
            </template>
            <template #cell(author_formatted)="row">
                <div v-html="row.item.author_formatted" class="date"></div>
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
                <!--a class="btn btn-primary" :href="'http://'+row.item.signal.ipServer+':7900/crop/'+encodeURIComponent(row.item.author.email)+'/'+encodeURIComponent(row.item.fileid)" v-if="row.item.output"><i class="fa fa-2x fa-play"></i></a-->
                <b-button class="btn-primary" @click="playVideo(row.item._id)" v-if="row.item.output"><i class="fa fa-2x fa-play"></i></b-button>
                <a class="btn btn-success ml-2" :href="'http://'+row.item.signal.ipServer+':7900/crop/'+encodeURIComponent(row.item.author.email)+'/'+encodeURIComponent(row.item.fileid)+'/download'" v-if="row.item.output"><i class="fa fa-2x fa-download"></i></a>
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
            <template #cell(share)="row" class="flex-column">
                <div class="row">
                    <div v-bind:class="{'col-md-6':row.item.share,'col-12':true}">
                        <toggle-button v-model="row.item.share"
                            color="#F86423"
                            :sync="true"
                            :labels="{checked: 'Compartir', unchecked: 'No compartir'}"
                            :width="110"
                            @change="saveToggle(row.item._id,'share',row.item.share)"
                        />
                        <b-spinner variant="success" class="canal13 ml-2 mt-2 position-absolute top-0 end-0" label="Spinning" v-if="loading&&currentId==row.item._id&&currentField=='share'"></b-spinner>
                    </div>
                    <div v-bind:class="{'col-md-6':row.item.share,'col-12':true}" v-if="row.item.share">
                        <toggle-button v-model="row.item.download"
                            color="#198754"
                            :sync="true"
                            :labels="{checked: 'Descarga', unchecked: 'Sin descarga'}"
                            :width="110"
                            @change="saveToggle(row.item._id,'download',row.item.download)"
                        />
                        <b-spinner variant="success" class="canal13 ml-2 mt-2 position-absolute top-0 end-0" label="Spinning" v-if="loading&&currentId==row.item._id&&currentField=='download'"></b-spinner>
                    </div>
                </div>
                <div class="row d-flex flex-nowrap w-100 mx-auto mt-2" v-if="row.item.share">
                    <div v-bind:class="{'col-md-9':row.item.share,'col-12':true}">
                        <div class="input-group">
                            <input type="text" dir="rtl" v-bind:class="{'form-control clipboard text-right':true,'loading':row.item.copying=='loading'}" id="inlineFormInputGroup" placeholder="Link para compartir" v-model="row.item.share_link.permalink" readonly>
                            <div class="input-group-prepend">
                                <b-button class="btn-primary input-group-text rounded-right" alt="Copiar link" @click="copyLink(row.item)"><i class="fa fa-copy" v-if="!row.item.copying||row.item.copying=='idle'"></i><i class="fas fa-circle-notch fa-spin" v-if="row.item.copying=='loading'"></i><i class="fas fa-check" v-if="row.item.copying=='done'"></i></b-button>
                            </div>
                        </div>
                    </div>
                    <div v-bind:class="{'col-md-3':row.item.share,'col-12 d-flex flex-column':true}">
                        <small>Vistas:</small>
                        <span><strong>{{row.item.views}}</strong></span>
                    </div>
                </div>
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


        <b-modal id="player" title="BootstrapVue" class="backdropblur" size="xl" @hidden="closeModal()">
            <template #modal-header="{ close }">
                <span>Reproductor de video</span>
                <b-button size="sm" variant="outline-warning" @click="closeModal(close)">
                    X
                </b-button>
            </template>

            <video-player :options="videoOptions" :muted="false" :url="currentUrl" :controls="true"/>

            <template #modal-footer="{ close }">
                    <!-- Emulate built in modal footer ok and cancel button actions -->
                    <div class="d-flex justify-content-between w-100">
                        <b-button class="ml-auto" size="md" variant="primary" @click="closeModal(close)">
                            Cerrar
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
    getAllCrops,
    updateCrop,
    deleteCrop
} from '@/helpers/API.js';
import VideoPlayer from "@/components/VideoPlayer.vue";

export default {
    name:"Usuarios",
    components: {
        VideoPlayer
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
                { key:'share',label:'Compartir',sortable:true},
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
            currentField:null,
            videoOptions: {
                // videojs and plugin options
                height: '1080',
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true
                }
            },
            currentUrl: null,
            isAdmin: false
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
            that.editingIndex = that.items.findIndex((item)=>{
                return item._id == id;
            });
            console.log(that.editingIndex);
            let newValues = {};
            newValues[field] = value;
            updateCrop(id,newValues)
                .then((result)=>{
                    if(field=='share'&&value==true) that.items[that.editingIndex].share_link.permalink = result.data.share_link.permalink;
                    setTimeout(()=>{
                        that.loading = false;
                    },500);
                }).catch((err)=>{
                    console.log(err);
                })
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        async deleteCrop(index) {
            let that = this;
            that.editingIndex = that.items.findIndex((item)=>{
                return item._id == index;
            });
            setTimeout(async()=>{
                let r = confirm("¿Está seguro que desea eliminar el clip?");
                if(r) {
                    let response = await deleteCrop(that.items[that.editingIndex]._id);
                    that.items.splice(that.editingIndex,1);
                    that.editingIndex = null;
                    that.filter = "";
                }
            },1);
        },
        playVideo(index) {
            let that = this;
            that.currentId = index;
            that.editingIndex = that.items.findIndex((item)=>{
                return item._id == index;
            });
            that.currentUrl = 'http://'+that.items[that.editingIndex].signal.ipServer+':7900/crop/'+encodeURIComponent(that.items[that.editingIndex].author.email)+'/'+encodeURIComponent(that.items[that.editingIndex].fileid)
            that.$bvModal.show("player");

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
                        item.fileid = link.data._id;
                        await updateCrop(item._id,item);
                    }
                    if(that.isAdmin&&item.author) {
                        item.author_formatted = "<p>"+item.author.name+" "+item.author.lastName+"</p><span>"+item.author.email+"</span>"
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
        },
        copyLink(element) {
            let that = this;
            const body = document.querySelector('body');
            const area = document.createElement('textarea');
            body.appendChild(area);
            
            let editingIndex = that.items.findIndex((item)=>{
                return item._id == element._id;
            });

            that.$set(that.items[editingIndex], 'copying', 'loading')
            setTimeout(()=>{
                that.$set(that.items[editingIndex], 'copying', 'done')
                setTimeout(()=>{
                    that.$set(that.items[editingIndex], 'copying', 'idle')
                },1000)
            },1000)

            console.log("editingindex:",editingIndex)

            area.value = element.share_link.permalink;
            area.select();
            document.execCommand('copy');

            body.removeChild(area);
        }
    },
    mounted() {
        var that = this;
        if(!that.isAdmin) {
            getCropsByUser(that.user._id)
                .then(async (result)=>{
                    that.items = await that.processCrops(result.data);
                    that.totalRows = that.items.length;
                }).catch((e)=>{
                    console.log(e);
                })
        } else {
            that.fields.splice(1,0,{ key:'author_formatted',label:'Usuario',sortable:true})
            getAllCrops()
                .then(async (result)=>{
                    console.log(result);
                    that.items = await that.processCrops(result.data);
                    that.totalRows = that.items.length;
                }).catch((e)=>{
                    console.log(e);
                })
        }
    },
    created() {
        var that = this;
        if(that.$route.path=='/allclips') {
            that.isAdmin = true;
        }
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
.clipboard
{
    background: linear-gradient(90deg, rgba(#F86423,1) 0%, rgba(#F86423,1) 47%, rgba(255,255,255,1) 47%, rgba(255,255,255,1) 100%);
    background-repeat: no-repeat;
    background-size: 300% 200%;
    background-position-x: 100%;
    transition: 900ms all ease-in-out;

    &.loading
    {
        background-position-x: 0%;
        color: white;
    }
}

.video-js {
    width: 100% !important;
    height: 100% !important;
    min-height: 70vh !important;
}
</style>