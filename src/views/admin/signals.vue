<template>
    <div class="admin p-4">
        <h2 v-bind:class="{'text-light':true}">Usuarios</h2>
        <b-table striped dark hover :items="items" :fields="fields">
            <template #cell(actions)="row">
                <b-button class="btn-warning" @click="editUser(row.item._id)">Editar</b-button>
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
    </div>
</template>

<script>
import {
    getAllSignals,
    createSignal,
    updateSignal,
    deleteSignal
} from '@/helpers/API.js';
export default {
    name:"Señales",
    components: {

    },
    data() {
        return {
            items: [],
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
            currentId:null,
            currentField:null
        }
    },
    mounted() {
        var that = this;
        getAllSignals()
            .then((result)=>{
                that.items = result.data.map((signal)=>{
                    let newSignal = signal;
                    if(signal.logo.indexOf("\\")!=-1) {
                        let logoBits = signal.logo.split("\\");
                        newSignal.logo = logoBits.join("/");
                    }
                    return newSignal;
                });
            }).catch((e)=>{
                console.log(e);
            })
    },
    methods: {
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