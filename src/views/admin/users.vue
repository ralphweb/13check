<template>
    <div class="admin p-4">
        <h2 class="text-light">Usuarios</h2>
        <b-col lg="6" offset="6" class="my-3">
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
                placeholder="Filtrar usuarios..."
                ></b-form-input>

                <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                </b-input-group-append>
            </b-input-group>
            </b-form-group>
        </b-col>
        <b-table striped dark hover :filter="filter" :items="items" :fields="fields" :tbody-tr-class="rowClass" :per-page="perPage" :current-page="currentPage" @filtered="onFiltered">
            <template #cell(actions)="row">
                <b-button v-bind:class="{'disabled':!hasAtLeastOneView}" v-if="row.index==items.length-1" @click="newRole()">Crear</b-button>
                <div class="d-flex justify-content-evenly" v-if="row.index!=items.length-1&&row.item.hasOwnProperty('_id')">
                    <b-button class="btn-warning" @click="createRole(row.index,false)">Editar</b-button>
                    <b-button class="btn-danger" @click="deleteRole(row.index)">Eliminar</b-button>
                </div>
            </template>
            <template #cell(role)="row">
                <select v-model="row.item.role">
                    <option v-for="(rol,r) in roles" v-bind:key="r" :value="rol._id">{{rol.name}}</option>
                </select>
            </template>
            <template #cell(allowsGmail)="row">
                <b-form-checkbox v-model="row.item.allowsGmail">
                    
                </b-form-checkbox>
            </template>
            <template #cell(active)="row">
                <toggle-button v-model="row.item.active"
                    color="#F86423"
                    :sync="true"
                    :labels="{checked: 'Activo', unchecked: 'Inactivo'}"
                    width="80"
                />
            </template>
        </b-table>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
          dark
        ></b-pagination>
    </div>
</template>

<script>
import {
    getUsers,
    getRoles
} from '@/helpers/API.js';

export default {
    name:"Usuarios",
    components: {

    },
    data() {
        return {
            items:[],
            roles:[],
            fields: [
                { key:'name',label:'Nombre',sortable:true},
                { key:'lastName',label:'Apellido',sortable:true},
                { key:'email',label:'Correo electrónico',sortable:true},
                { key:'phoneNumber',label:'Teléfono',sortable:true},
                { key:'role',label:'Rol',sortable:true},
                { key:'allowsGmail',label:'Gmail',sortable:true},
                { key:'active',label:'Activo',sortable:true},
                { key:'actions',label:'Acciones'},
            ],
            perPage: 15,
            currentPage: 1,
            filter: null,
            totalRows: 1
        }
    },
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        }
    },
    mounted() {
        var that = this;
        getRoles()
            .then((result)=>{
                that.roles = result.data;
            }).catch((e)=>{
                console.log(e);
            })

        getUsers()
            .then((result)=>{
                that.items = result.data;
                that.totalRows = that.items.length;
            }).catch((e)=>{
                console.log(e);
            })
    }
}
</script>

<style lang="scss">
.table > :not(caption) > * > * {
    vertical-align: middle;
}

.vue-js-switch
{
    margin-bottom: 0px;
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
</style>