<template>
    <div class="admin p-4">
        <h1>Roles</h1>
        <b-table striped dark hover :items="items" :fields="fields" :tbody-tr-class="rowClass">
            <template #head()="data">
                <span class="d-flex flex-row justify-content-center align-items-center" v-html="data.label"></span>
            </template>
            <template #cell(name)="row">
                <b-form-input v-model="row.item.name" v-if="row.index==items.length-1"/>
                <span v-if="row.index!=items.length-1">{{row.item.name}}</span>
            </template>
            <template #cell(actions)="row">
                <b-button v-bind:class="{'disabled':!hasAtLeastOneView}" v-if="row.index==items.length-1" @click="newRole()">Crear</b-button>
                <div class="d-flex justify-content-around" v-if="row.index!=items.length-1&&row.item.hasOwnProperty('_id')">
                    <b-button class="btn-success" @click="createRole(row.index,false)">Guardar</b-button>
                    <b-button class="btn-danger" @click="deleteRole(row.index)">Eliminar</b-button>
                </div>
            </template>
            <template #cell(allowRating)="row">
                <b-form-checkbox v-model="row.item.allowRating">
                    
                </b-form-checkbox>
            </template>
            <template #cell(allowCrop)="row">
                <b-form-checkbox v-model="row.item.allowCrop">
                    
                </b-form-checkbox>
            </template>
            <template #cell(catalogo)="data">
                <b-form-checkbox v-model="selectedViews.catalogo[data.index]" @change="toggleSelectedViews('catalogo',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(vistaunica)="data">
                <b-form-checkbox v-model="selectedViews.vistaunica[data.index]" @change="toggleSelectedViews('vistaunica',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(comparador)="data">
                <b-form-checkbox v-model="selectedViews.comparador[data.index]" @change="toggleSelectedViews('comparador',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(todas)="data">
                <b-form-checkbox v-model="selectedViews.todas[data.index]" @change="toggleSelectedViews('todas',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(signals)="data">
                <b-form-checkbox v-model="selectedViews.signals[data.index]" @change="toggleSelectedViews('signals',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(users)="data">
                <b-form-checkbox v-model="selectedViews.users[data.index]" @change="toggleSelectedViews('users',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(roles)="data">
                <b-form-checkbox v-model="selectedViews.roles[data.index]" @change="toggleSelectedViews('roles',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(form)="data">
                <b-form-checkbox v-model="selectedViews.form[data.index]" @change="toggleSelectedViews('form',data.index)">
                    
                </b-form-checkbox>
            </template>
        </b-table>
    </div>
</template>

<script>
import {
    getViews,
    getRoles,
    createRole,
    updateRole,
    deleteRole
} from '@/helpers/API.js';

export default {
    name:"Roles",
    components: {

    },
    data() {
        return {
            selected:false,
            views:[],
            fields: [
                { key:'name',label:'Nombre',sortable:true},
                { key:'allowRating',label:'Rating',sortable:true,tdClass:'functions'},
                { key:'allowCrop',label:'Recortes',sortable:true,tdClass:'functions'}
            ],
            items: [],
            selectedViews: {},
            hasAtLeastOneView: false
        }
    },
    mounted() {
        var that = this;
        getRoles()
            .then((result)=>{
                that.items = result.data;
                that.items.push({name:'Nuevo Rol',allowRating:false,allowCrop:false,status:'newRow'});
                getViews()
                    .then((response)=>{
                        that.views = response.data;
                        that.views.forEach((view)=>{
                            that.selectedViews[view.slug] = new Array(that.items.length).fill(false);
                            let field = {
                                "key" : view.slug,
                                "label" : view.name,
                                "tdClass" : 'views'
                            }
                            if(view.isAdmin) field.label = "<small>Admin</small>"+field.label;
                            if(view.isAdmin) field['tdClass'] = 'admins'
                            that.fields.push(field);
                        })
                        let lastField = {
                            "key" : 'actions',
                            "label" : 'Acciones'
                        }
                        that.fields.push(lastField);
                        that.fillSelectedViews();
                    }).catch((e)=>{
                        console.log(e);
                    })
            }).catch((e)=>{
                console.log(e);
            })
    },
    methods: {
        rowClass(item, type) {
            if (!item || type !== 'row') return
            if (item.status === 'newRow') return 'new-row'
        },
        fillSelectedViews() {
            var that = this;
            for(let i=0;i<that.items.length-1;i++) {
                for(let j=0;j<that.items[i].views.length;j++) {
                    let currentView = that.items[i].views[j];
                    let found = that.views.find((view)=>{
                        return view._id == currentView;
                    })
                    if(found!=undefined&&that.selectedViews.hasOwnProperty(found.slug)) {
                        that.selectedViews[found.slug][i] = true;
                    }
                }
            }
        },
        toggleSelectedViews(element,index) {
            var that = this;
            that.$set(that.selectedViews[element],index,that.selectedViews[element][index]);
            console.log(that.selectedViews);
            that.hasAtLeastOneView = false;
            for(const selectedView in that.selectedViews) {
                if(that.selectedViews[selectedView][that.items.length-1]) {
                    that.hasAtLeastOneView = true;
                }
            }
        },
        newRole() {
            var that = this;
            that.items.push({ name:'Nuevo Rol',status:'newRow'});
            for(const view in that.selectedViews) {
                that.selectedViews[view].push(false);
            }
            that.hasAtLeastOneView = false;
            that.createRole(that.items.length-2);
        },
        deleteRole(index) {
            var that = this;
            let roleToDelete = JSON.parse(JSON.stringify(that.items[index]));
            let r = confirm("¿Está seguro que desea eliminar el rol: '"+roleToDelete.name+"'?");
            if(r) {
                that.items.splice(index,1);
                for(const view in that.selectedViews) {
                    that.selectedViews[view].splice(index,1);
                }
                console.log(roleToDelete._id);
                deleteRole(roleToDelete._id)
                    .then((response)=>{
                        console.log(response);
                    }).catch((e)=>{
                        console.log(e);
                    })
            }            
        },
        createRole(index,newRoleFlag = true) {
            var that = this;
            let newRole = that.items[index];
            newRole.views = [];

            for(const selectedView in that.selectedViews) {
                if(that.selectedViews[selectedView][index]) {
                    let currentView = that.views.find((view)=>{
                        return view.slug==selectedView;
                    });
                    newRole.views.push(currentView._id);
                }
            }

            if(newRoleFlag) {
                createRole(newRole)
                    .then((response)=>{
                        console.log(response);
                        that.$set(that.items,index,response.data);
                    }).catch((e)=>{
                        console.log(e);
                    })
            } else {
                updateRole(newRole._id,newRole)
                    .then((response)=>{
                        console.log(response);
                        that.$set(that.items,index,response.data);
                    }).catch((e)=>{
                        console.log(e);
                    })
            }
        }
    }
}
</script>

<style lang="scss">
.table > :not(caption) > * > * {
    vertical-align: middle;
}

tr.new-row
{ 
    padding-top:10px;
    box-sizing: border-box;
    height: 90px;
    vertical-align: middle;
    border-top: 3px solid white;

    td,
    td:hover
    {
        background-color: #131313 !important;
        vertical-align: middle;
    }
}

tr 
{
    td
    {
        &.admins
        {
            background-color: #131313 !important;
            width: 120px;
        }
        &.functions
        {
            background-color: #131313 !important;
            width: 100px;
        }
        &.views
        {
            width: 120px;
        }
    }

    &:nth-of-type(odd) td
    {
        &.admins
        {
            background-color: #131313 !important;
            box-shadow: inset 0 0 0 9999px rgba(#557799,0.2) !important;
        }
        &.functions
        {
            background-color: #131313 !important;
            box-shadow: inset 0 0 0 9999px rgba(#557799,0.2) !important;
        }
    }
}
</style>