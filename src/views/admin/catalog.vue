<template>
    <div class="admin overflow-hidden h-100 d-flex flex-column align-items-center justify-content-start">
        <nav class="pagination px-4 py-2 flex-grow-0 flex-shrink-0 d-flex justify-content-between w-100 bg-dark">
            <div v-bind:class="{'page-item':true, 'inactive': !hasPrev}">
                <button class="page-link" @click="prev">
                    <i class="fa fa-arrow-left"></i>
                </button>
            </div>
            <div v-bind:class="{'page-item':true,'active':horizontalPage==f}" v-for="(family,f) in cruds" v-bind:key="f">
                <button class="page-link" @click="onPageClick(f)">
                    {{family.name}}
                </button>
            </div>
            <div v-bind:class="{'page-item':true, 'inactive': !hasNext}">
                <button class="page-link" @click="next">
                    <i class="fa fa-arrow-right"></i>
                </button>
            </div>
        </nav>
        <vue-horizontal ref="horizontal" responsive class="flex-grow-1 flex-shrink-1 h-75 w-100 px-4 pb-4" @scroll-debounce="onScroll" :button="false">
            <b-row class="w-100 h-100 overflow-hidden mb-3 mx-1" v-for="(family,f) in cruds" v-bind:key="f">
                <b-col lg="12" class="h-100 grid">
                    <div class="grid-header">
                        <h3 class="text-light mt-4">{{family.name}}</h3>
                        <b-row class="align-items-center mt-2">
                            <b-col lg="4">
                                <b-button class="btn-warning" size="lg" @click="newItem(family.slug)">Agregar</b-button>
                            </b-col>
                            <b-col lg="8">
                                <b-form-group
                                        label-for="filter-input"
                                        label-cols-sm="12"
                                        label-align-sm="left"
                                        label-size="sm"
                                        class="mb-2"
                                        >
                                        <b-input-group size="sm">
                                            <b-form-input
                                            id="filter-input"
                                            v-model="family.filter"
                                            type="search"
                                            placeholder="Filtrar..."
                                            ></b-form-input>

                                            <b-input-group-append>
                                            <b-button :disabled="!family.filter" @click="family.filter = ''">Limpiar</b-button>
                                            </b-input-group-append>
                                        </b-input-group>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </div>
                    <div class="grid-middle overflow-y-auto overflow-x-hidden" :ref="family.slug+'table'" :id="family.slug+'table'">
                        <b-table striped dark hover show-emptys
                            :tbody-tr-class="rowClass"
                            :filter="family.filter"
                            :items="family.data"
                            :fields="family.fields"
                            :per-page="family.perPage"
                            :current-page="family.currentPage"
                            @filtered="family.onFiltered"
                            empty-text="No se han creado elementos aún"
                            empty-filtered-text="No encontramos elementos que coincidan con tu búsqueda"
                        >
                            <template #cell(actions)="row">
                                <div v-bind:class="{'d-flex':true,'justify-content-around':!row.item.edit,'justify-content-between':row.item.edit}">
                                    <b-button class="btn-danger" @click="cancelItem(family.slug,row.item._id,row.index)" v-if="row.item.edit">Cancelar</b-button>
                                    <b-button class="btn-warning" @click="editItem(family.slug,row.item._id,row.index)" v-if="row.item._id&&!row.item.edit">Editar</b-button>
                                    <b-button class="btn-danger" @click="deleteItem(family.slug,row.item._id,row.item.country_name?row.item.country_name:row.item.name)" v-if="row.item._id&&!row.item.edit">Eliminar</b-button>
                                    <b-button class="btn-success" @click="saveItem(family.slug,row.item._id,row.index)" v-if="row.item.edit">Guardar</b-button>
                                    <b-spinner variant="success" class="canal13 ml-2 mt-2 position-absolute top-0 end-0" label="Spinning" v-if="loading&&currentId==row.item._id&&currentField=='save'&&crud==family.slug"></b-spinner>
                                </div>
                            </template>
                            <template #cell(active)="row">
                                <toggle-button v-model="row.item.active"
                                    color="#F86423"
                                    :sync="true"
                                    :labels="{checked: 'Activo', unchecked: 'Inactivo'}"
                                    :width="80"
                                    @change="saveToggle(row.item._id,'active',row.item.active,family.slug)"
                                />
                                <b-spinner variant="success" class="canal13 ml-2 mt-2 position-absolute top-0 end-0" label="Spinning" v-if="loading&&currentId==row.item._id&&currentField=='active'&&crud==family.slug"></b-spinner>
                            </template>
                            <template #cell(country_name)="row">
                                <span v-if="row.item._id&&!row.item.edit">{{row.item.country_name}}</span>
                                <b-form-group :id="family.slug.toLowerCase()+'group-cname'+row.index" :label-for="family.slug.toLowerCase()+'input-cname'+row.index" v-if="row.item.edit" class="mb-0">
                                    <b-form-input
                                    :id="family.slug.toLowerCase()+'input-cname'+row.index"
                                    :name="family.slug.toLowerCase()+'input-cname'+row.index"
                                    placeholder="Ingrese nombre..."
                                    v-model="row.item.country_name"
                                    v-validate="{ required: true, min: 2, regex: /^[ A-Za-z0-9_@./#&+-]*$/ }"
                                    :state="validateState(family.slug.toLowerCase()+'input-cname'+row.index)"
                                    :aria-describedby="family.slug.toLowerCase()+'feedback-cname'+row.index"
                                    data-vv-as="Nombre"
                                    ></b-form-input>

                                    <b-form-invalid-feedback :id="family.slug.toLowerCase()+'feedback-cname'+row.index">{{ veeErrors.first(family.slug.toLowerCase()+'input-cname'+row.index) }}</b-form-invalid-feedback>
                                </b-form-group>
                            </template>
                            <template #cell(country_code)="row">
                                <span v-if="row.item._id&&!row.item.edit">{{row.item.country_code}}</span>
                                <b-form-group :id="family.slug.toLowerCase()+'group-code'+row.index" :label-for="family.slug.toLowerCase()+'input-code'+row.index" v-if="row.item.edit" class="mb-0">
                                    <b-form-input
                                    :id="family.slug.toLowerCase()+'input-code'+row.index"
                                    :name="family.slug.toLowerCase()+'input-code'+row.index"
                                    placeholder="Ingrese código..."
                                    v-model="row.item.country_code"
                                    v-validate="{ required: true, min: 2, max: 2, regex: /^[ A-Za-z0-9_@./#&+-]*$/ }"
                                    :state="validateState(family.slug.toLowerCase()+'input-code'+row.index)"
                                    :aria-describedby="family.slug.toLowerCase()+'feedback-code'+row.index"
                                    data-vv-as="Código"
                                    ></b-form-input>

                                    <b-form-invalid-feedback :id="family.slug.toLowerCase()+'feedback-code'+row.index">{{ veeErrors.first(family.slug.toLowerCase()+'input-code'+row.index) }}</b-form-invalid-feedback>
                                </b-form-group>
                            </template>
                            <template #cell(name)="row">
                                <span v-if="row.item._id&&!row.item.edit">{{row.item.name}}</span>
                                <b-form-group :id="family.slug.toLowerCase()+'group-name'+row.index" :label-for="family.slug.toLowerCase()+'input-name'+row.index" v-if="row.item.edit" class="mb-0">
                                    <b-form-input
                                    :id="family.slug.toLowerCase()+'input-name'+row.index"
                                    :name="family.slug.toLowerCase()+'input-name'+row.index"
                                    placeholder="Ingrese nombre..."
                                    v-model="row.item.name"
                                    v-validate="{ required: true, min: 2, alpha_spaces:true }"
                                    :state="validateState(family.slug.toLowerCase()+'input-name'+row.index)"
                                    :aria-describedby="family.slug.toLowerCase()+'feedback-name'+row.index"
                                    data-vv-as="Nombre"
                                    ></b-form-input>

                                    <b-form-invalid-feedback :id="family.slug.toLowerCase()+'feedback-name'+row.index">{{ veeErrors.first(family.slug.toLowerCase()+'input-name'+row.index) }}</b-form-invalid-feedback>
                                </b-form-group>
                            </template>
                            <template #empty="scope">
                                <h5 class="mt-4">{{ scope.emptyText }}</h5>
                                <p class="mb-4">Crea un elemento con el botón "Agregar" de más arriba</p>
                            </template>
                            <template #emptyfiltered="scope">
                                <h5 class="mt-4">{{ scope.emptyFilteredText }}</h5>
                                <p class="mb-4">Inténtalo nuevamente</p>
                            </template>
                        </b-table>
                    </div>
                    <b-pagination
                        v-model="family.currentPage"
                        :total-rows="family.totalRows"
                        :per-page="family.perPage"
                        align="fill"
                        size="sm"
                        v-bind:class="{'my-0':true}"
                        dark
                    ></b-pagination>
                </b-col>
            </b-row>
        </vue-horizontal>
    </div>
</template>

<script>
import {
    getallCountry,
    createCountry,
    updateCountry,
    deleteCountry,
    getallPerson,
    createPerson,
    updatePerson,
    deletePerson,
    getallShow,
    createShow,
    updateShow,
    deleteShow,
    getallTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    getallAge,
    createAge,
    updateAge,
    deleteAge,
    getallCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@/helpers/API.js';
import config from '../../app.config';
import VueHorizontal from "vue-horizontal";

export default {
    name:"Formulario",
    components: { 
        VueHorizontal
    },
    data() {
        return {
            hasPrev: false,
            hasNext: true,
            horizontalPage: 0,
            sortBy: 'order',
            sortDesc: false,
            cruds: [
                {
                    name:"Países",
                    slug:"Country",
                    fields:[
                        { key:'actions',label:'Acciones',class:'actions'},
                        { key:'country_code',label:'Código',sortable:true,class:'text'},
                        { key:'country_name',label:'Nombre',sortable:true,class:'text'},
                        { key:'active',label:'Activo',sortable:true},
                    ],
                    filter: null,
                    data:[],
                    originalData:{},
                    perPage:15,
                    currentPage: 1,
                    totalRows: 1,
                    onFiltered: (filteredItems)=> {
                        // Trigger pagination to update the number of buttons/pages due to filtering
                        let family = this.cruds.find((crud)=>{
                            return crud.slug == 'Country';
                        })
                        family.totalRows = filteredItems.length
                        family.currentPage = 1
                    },
                },
                {
                    name:"Rostros",
                    slug:"Person",
                    fields:[
                        { key:'actions',label:'Acciones',class:'actions'},
                        { key:'name',label:'Nombre',sortable:true},
                        { key:'active',label:'Activo',sortable:true},
                    ],
                    filter: null,
                    data:[],
                    originalData:{},
                    perPage:15,
                    currentPage: 1,
                    totalRows: 1,
                    onFiltered: (filteredItems)=> {
                        // Trigger pagination to update the number of buttons/pages due to filtering
                        let family = this.cruds.find((crud)=>{
                            return crud.slug == 'Person';
                        })
                        family.totalRows = filteredItems.length
                        family.currentPage = 1
                    }
                },
                {
                    name:"Programas",
                    slug:"Show",
                    fields:[
                        { key:'actions',label:'Acciones',class:'actions'},
                        { key:'name',label:'Nombre',sortable:true},
                        { key:'active',label:'Activo',sortable:true},
                    ],
                    filter: null,
                    data:[],
                    originalData:{},
                    perPage:15,
                    currentPage: 1,
                    totalRows: 1,
                    onFiltered: (filteredItems)=> {
                        // Trigger pagination to update the number of buttons/pages due to filtering
                        let family = this.cruds.find((crud)=>{
                            return crud.slug == 'Show';
                        })
                        family.totalRows = filteredItems.length
                        family.currentPage = 1
                    }
                },
                {
                    name:"Temas",
                    slug:"Topic",
                    fields:[
                        { key:'actions',label:'Acciones',class:'actions'},
                        { key:'name',label:'Nombre',sortable:true},
                        { key:'active',label:'Activo',sortable:true},
                    ],
                    filter: null,
                    data:[],
                    originalData:{},
                    perPage:15,
                    currentPage: 1,
                    totalRows: 1,
                    onFiltered: (filteredItems)=> {
                        // Trigger pagination to update the number of buttons/pages due to filtering
                        let family = this.cruds.find((crud)=>{
                            return crud.slug == 'Topic';
                        })
                        family.totalRows = filteredItems.length
                        family.currentPage = 1
                    }
                },
                {
                    name:"Clasificaciones de Edad",
                    slug:"Age",
                    fields:[
                        { key:'actions',label:'Acciones',class:'actions'},
                        { key:'name',label:'Nombre',sortable:true},
                        { key:'active',label:'Activo',sortable:true},
                    ],
                    filter: null,
                    data:[],
                    originalData:{},
                    perPage:15,
                    currentPage: 1,
                    totalRows: 1,
                    onFiltered: (filteredItems)=> {
                        // Trigger pagination to update the number of buttons/pages due to filtering
                        let family = this.cruds.find((crud)=>{
                            return crud.slug == 'Age';
                        })
                        family.totalRows = filteredItems.length
                        family.currentPage = 1
                    }
                },
                {
                    name:"Categorías",
                    slug:"Category",
                    fields:[
                        { key:'actions',label:'Acciones',class:'actions'},
                        { key:'name',label:'Nombre',sortable:true},
                        { key:'active',label:'Activo',sortable:true},
                    ],
                    filter: null,
                    data:[],
                    originalData:{},
                    perPage:15,
                    currentPage: 1,
                    totalRows: 1,
                    onFiltered: (filteredItems)=> {
                        // Trigger pagination to update the number of buttons/pages due to filtering
                        let family = this.cruds.find((crud)=>{
                            return crud.slug == 'Topic';
                        })
                        family.totalRows = filteredItems.length
                        family.currentPage = 1
                    }
                },
            ],
            loading:false,
            crud:null,
            editingIndex: null,
            tempSignal: null,
            currentId:null,
            currentField:null,
            API:{
                getallCountry,
                createCountry,
                updateCountry,
                deleteCountry,
                getallPerson,
                createPerson,
                updatePerson,
                deletePerson,
                getallShow,
                createShow,
                updateShow,
                deleteShow,
                getallTopic,
                createTopic,
                updateTopic,
                deleteTopic,
                getallAge,
                createAge,
                updateAge,
                deleteAge,
                getallCategory,
                createCategory,
                updateCategory,
                deleteCategory,
            }
        }
    },
    mounted() {
        var that = this;
        that.cruds.forEach(async(family)=>{
            let result = await that.API['getall'+family.slug]();
            family.data = result.data;
            family.totalRows = family.data.length;
        });
    },
    methods: {
        prev() {
            this.$refs.horizontal.prev()
        },
        next() {
            this.$refs.horizontal.next()
        },
        onScroll(data) {
            let left = (data.left / 1000).toFixed() * 1000;
            let width = (data.width / 1000).toFixed() * 1000;
            let scrollWidth = (data.scrollWidth / 1000).toFixed() * 1000;
            this.hasPrev = data.hasPrev;
            this.hasNext = left+width>=scrollWidth?false:true;
            this.horizontalPage = Math.ceil(left/width);
        },
        onPageClick(i) {
            this.$refs.horizontal.scrollToIndex(i); 
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
        async saveToggle(id,field,value,slug) {
            var that = this;
            that.loading = true;
            that.currentId = id;
            that.currentField = field;
            that.crud = slug;
            let newValues = {};
            newValues[field] = value;
            let family = this.cruds.find((crud)=>{
                return crud.slug == slug;
            })   
            let result = await that.API['update'+slug](id,newValues);  
            setTimeout(()=>{
                that.loading = false;
                that.crud = null;
            },500);
        },
        newItem(slug) {
            var that = this;
            let family = this.cruds.find((crud)=>{
                return crud.slug == slug;
            })
            family.filter = "";
            family.currentPage = 1;
            let tempData = {};
            if(family.data.length>0) {
                tempData = JSON.parse(JSON.stringify(family.data[0]));
            } else {
                let fields = JSON.parse(JSON.stringify(family.fields));
                fields.forEach((field)=>{
                    if(field.sortable) {
                        tempData[field.key] = null;
                    }
                })
            }
            Object.keys(tempData).forEach((key)=>{
                switch(key) {
                    case 'active':
                        tempData[key] = true;
                        break;
                    default:
                        tempData[key] = null;
                }
            }) 
            tempData.edit = true;
            family.data.unshift(tempData);
            const container = this.$el.querySelector("#"+slug+"table");
            container.scrollTop = 0;
        },
        async deleteItem(slug,id,name = null) {
            var that = this;
            let family = this.cruds.find((crud)=>{
                return crud.slug == slug;
            })
            if(!id) {
                //cancel
                family.data.splice(0,1);
            } else {
                //delete
                let r = confirm("¿Estás seguro que deseas eliminar: "+name+"?");
                if(r) {
                    try {
                        await that.API['delete'+slug](id);
                        let result = await that.API['getall'+slug]();
                        family.data = result.data;
                        family.filter = "";
                    } catch(e) {
                        console.log(e);
                    }
                }
            }
        },
        async cancelItem(slug,id,index) {
            var that = this;
            let family = this.cruds.find((crud)=>{
                return crud.slug == slug;
            })
            let newIndex = 0;
            if(family.filter!="") {
                //filtered
                newIndex = family.data.findIndex((item)=>{
                    return item._id == id;
                })
            } else {
                //regular
                newIndex = (family.currentPage-1)*family.perPage+index;
            }
            if(!family.data[newIndex]._id) {
                //cancel
                family.data.splice(newIndex,1);
            } else {
                let tempData = JSON.parse(JSON.stringify(family.originalData[newIndex]));
                tempData.edit = false;
                that.$set(family.data,newIndex,tempData);
                delete family.originalData[newIndex];
            }
        },
        async editItem(slug,id,index) {
            var that = this;
            let family = this.cruds.find((crud)=>{
                return crud.slug == slug;
            })
            let newIndex = 0;
            if(family.filter!="") {
                //filtered
                newIndex = family.data.findIndex((item)=>{
                    return item._id == id;
                })
            } else {
                //regular
                newIndex = (family.currentPage-1)*family.perPage+index;
            }
            let tempData = JSON.parse(JSON.stringify(family.data[newIndex]));
            family.originalData[newIndex] = JSON.parse(JSON.stringify(family.data[newIndex]));
            tempData.edit = true;
            that.$set(family.data,newIndex,tempData);
        },
        async saveItem(slug,id,index = 0) {
            var that = this;
            let family = this.cruds.find((crud)=>{
                return crud.slug == slug;
            })

            that.loading = true;
            that.currentId = id;
            that.currentField = 'save';
            that.crud = slug;

            /*
            that.$validator.validateAll().then(async result => {
                if (!result) {
                    return;
                }
            });
            */

            let newIndex = (family.currentPage-1)*family.perPage+index;

            if(!id) {
                //create
                delete family.data[newIndex]._id;
                let result = await that.API['create'+slug](family.data[newIndex]);
                family.data[newIndex] = result.data;
                that.$set(family.data,newIndex,result.data);
            } else {
                //save
                let result = await that.API['update'+slug](id,family.data[newIndex]);
                family.data[newIndex] = result.data;
                that.$set(family.data,newIndex,result.data);
                delete family.originalData[newIndex];
            }

            setTimeout(()=>{
                that.loading = false;
                that.crud = null;
            },500);
        },
        rowClass(item, type) {
            if (!item || type !== 'row') return
            if (item.edit) return 'table-editing'
        }
    }
}
</script>

<style lang="scss">
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

    &-color
    {
        width: 30px;
        height: 30px;
        border-radius: 60px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }
}

.grid
{
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 120px 1fr 30px;

    &-middle
    {
        overflow-x: hidden;
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

        &.inactive
        {
            pointer-events: none;
            opacity: 0.4;
            .page-link
            {
                background-color: #212529;
                border-color: #2e3338;
                color: white;
            }
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
</style>