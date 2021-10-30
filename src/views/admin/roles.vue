<template>
    <div class="admin p-4">
        <h2 class="text-light">Roles</h2>
        <b-table striped dark hover :items="items" :fields="fields" :tbody-tr-class="rowClass">
            <template #head()="data">
                <span class="d-flex flex-row justify-content-center align-items-center" v-html="data.label"></span>
            </template>
            <template #cell(name)="row">
                <b-form-input v-model="row.item.name" v-if="row.index==items.length-1"/>
                <span v-if="row.index!=items.length-1">{{row.item.name}}</span>
                <b-spinner variant="success" class="canal13 ml-2 mt-2 position-absolute top-0 end-0" label="Spinning" v-if="loading&&currentId==row.item._id"></b-spinner>
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
            <template #cell(allowShare)="row">
                <b-form-checkbox v-model="row.item.allowShare">
                    
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
            <template #cell(clips)="data">
                <b-form-checkbox v-model="selectedViews.clips[data.index]" @change="toggleSelectedViews('clips',data.index)">
                    
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
            <template #cell(catalog)="data">
                <b-form-checkbox v-model="selectedViews.catalog[data.index]" @change="toggleSelectedViews('catalog',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(c13)="data">
                <b-form-checkbox v-model="selectedSignals.c13[data.index]" @change="toggleSelectedSignals('c13',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(chv)="data">
                <b-form-checkbox v-model="selectedSignals.chv[data.index]" @change="toggleSelectedSignals('chv',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(mega)="data">
                <b-form-checkbox v-model="selectedSignals.mega[data.index]" @change="toggleSelectedSignals('mega',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(tvn)="data">
                <b-form-checkbox v-model="selectedSignals.tvn[data.index]" @change="toggleSelectedSignals('tvn',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(c13c)="data">
                <b-form-checkbox v-model="selectedSignals.c13c[data.index]" @change="toggleSelectedSignals('c13c',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(t13movil)="data">
                <b-form-checkbox v-model="selectedSignals.t13movil[data.index]" @change="toggleSelectedSignals('t13movil',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(tvmas)="data">
                <b-form-checkbox v-model="selectedSignals.tvmas[data.index]" @change="toggleSelectedSignals('tvmas',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(canalnuevo)="data">
                <b-form-checkbox v-model="selectedSignals.canalnuevo[data.index]" @change="toggleSelectedSignals('canalnuevo',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(canalmasnuevo)="data">
                <b-form-checkbox v-model="selectedSignals.canalmasnuevo[data.index]" @change="toggleSelectedSignals('canalmasnuevo',data.index)">
                    
                </b-form-checkbox>
            </template>
            <template #cell(otrocanal)="data">
                <b-form-checkbox v-model="selectedSignals.otrocanal[data.index]" @change="toggleSelectedSignals('otrocanal',data.index)">
                    
                </b-form-checkbox>
            </template>
        </b-table>
    </div>
</template>

<script>
import {
    getViews,
    getallSignal,
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
            signals:[],
            fields: [
                { key:'name',label:'Nombre',sortable:false},
                { key:'allowRating',label:'Rating',sortable:false,tdClass:'functions'},
                { key:'allowCrop',label:'Recortes',sortable:false,tdClass:'functions'},
                { key:'allowShare',label:'Compartir',sortable:false,tdClass:'functions'}
            ],
            items: [],
            selectedViews: {},
            selectedSignals: {},
            hasAtLeastOneView: false,
            hasAtLeastOneSignal: false,
            loading: false,
            currentId: null
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
                        that.fillSelectedViews();
                        getallSignal()
                            .then((response)=>{
                                that.signals = that.processSignals(response.data).map((signal)=>{
                                    if(signal.idRating=='13c') signal.idRating = 'c13c';
                                    return signal;
                                });
                                that.signals.forEach((signal)=>{
                                    that.selectedSignals[signal.idRating] = new Array(that.items.length).fill(false);
                                    let field = {
                                        "key" : signal.idRating,
                                        "label" : '<div class="signal-logo mx-auto" style="background-image:url('+signal.logo+');"></div>',
                                        "tdClass" : 'signals'
                                    }
                                    that.fields.push(field);
                                })
                                let lastField = {
                                    "key" : 'actions',
                                    "label" : 'Acciones'
                                }
                                that.fields.push(lastField);
                                that.fillSelectedSignals();
                            }).catch((e)=>{
                                console.log(e);
                            })
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
        fillSelectedSignals() {
            var that = this;
            for(let i=0;i<that.items.length-1;i++) {
                for(let j=0;j<that.items[i].signals.length;j++) {
                    let currentSignal = that.items[i].signals[j];
                    let found = that.signals.find((signal)=>{
                        return signal._id == currentSignal;
                    })
                    console.log(found);
                    if(found!=undefined&&that.selectedSignals.hasOwnProperty(found.idRating)) {
                        that.selectedSignals[found.idRating][i] = true;
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
        toggleSelectedSignals(element,index) {
            var that = this;
            that.$set(that.selectedSignals[element],index,that.selectedSignals[element][index]);
            console.log(that.selectedSignals);
            that.hasAtLeastOneSignal = false;
            for(const selectedSignal in that.selectedSignals) {
                if(that.selectedSignals[selectedSignal][that.items.length-1]) {
                    that.hasAtLeastOneSignal = true;
                }
            }
        },
        newRole() {
            var that = this;
            that.items.push({ name:'Nuevo Rol',status:'newRow'});
            for(const view in that.selectedViews) {
                that.selectedViews[view].push(false);
            }
            for(const signal in that.selectedSignals) {
                that.selectedSignals[signal].push(false);
            }
            that.hasAtLeastOneView = false;
            that.hasAtLeastOneSignal = false;
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
                for(const signal in that.selectedSignals) {
                    that.selectedSignals[signal].splice(index,1);
                }
                deleteRole(roleToDelete._id)
                    .then((response)=>{
                        console.log(response);
                    }).catch((e)=>{
                        console.log(e);
                    })
            }            
        },
        async createRole(index,newRoleFlag = true) {
            var that = this;
            try {
                let newRole = that.items[index];
                newRole.views = [];
                newRole.signals = [];

                that.loading = true;
                that.currentId = newRole._id;

                for(const selectedView in that.selectedViews) {
                    if(that.selectedViews[selectedView][index]) {
                        let currentView = that.views.find((view)=>{
                            return view.slug==selectedView;
                        });
                        newRole.views.push(currentView._id);
                    }
                }

                for(const selectedSignal in that.selectedSignals) {
                    if(that.selectedSignals[selectedSignal][index]) {
                        let currentSignal = that.signals.find((signal)=>{
                            return signal.idRating==selectedSignal;
                        });
                        newRole.signals.push(currentSignal._id);
                    }
                }

                let response = null;

                if(newRoleFlag) {
                    response = await createRole(newRole);
                } else {
                    response = await updateRole(newRole._id,newRole);
                }
                that.$set(that.items,index,response.data);

                setTimeout(()=>{
                    that.loading = false;
                    that.currentId = null;
                },500);
            } catch(e) {
                console.log(e);
                setTimeout(()=>{
                    that.loading = false;
                    that.currentId = null;
                },500);
            }
        }
    }
}
</script>

<style lang="scss">
.canal13
{
    color: #F86423 !important;
}

.table > :not(caption) > * > * {
    vertical-align: middle;
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

tr.new-row
{ 
    padding-top:10px;
    box-sizing: border-box;
    height: 90px;
    vertical-align: middle;

    td,
    td:hover
    {
        background-color: rgba(40,20,0,0.6) !important;
        box-shadow: unset !important;
        vertical-align: middle;
        border-top: 3px solid white;
        border-bottom: 3px solid white;
        z-index: 2;

        &.functions,
        &.admins
        {
            background-color: rgba(40,20,0,0.8) !important;
            box-shadow: none !important;
        }
    }
}

.signal-logo
{
    width:100%;
    min-width: 40px;
    aspect-ratio: 1/1;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
}
</style>