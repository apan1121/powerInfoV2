<template>
    <div id="unit-filter-box" class="modal fade" tabindex="-1"
        role="dialog" aria-labelledby="unitFilterBox" aria-hidden="true"
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        過濾條件
                    </h5>
                    <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <fieldset v-if="type">
                        <legend>發電類型：</legend>
                        <div class="row">
                            <template v-for="(val, key) in UnitTypes">
                                <div :key="`uint-filter-type-${key}`"
                                    class="col-6 col-md-4 text-center"
                                >
                                    <toggle-button
                                        v-model="inputChooseTypes[key]"
                                        color="#82C7EB"
                                        :sync="true"
                                        :value="true"
                                        :labels="{checked: val, unchecked: val}"
                                        :font-size="16"
                                        :width="120"
                                        :height="40"
                                    ></toggle-button>
                                </div>
                            </template>
                        </div>
                    </fieldset>

                    <hr v-if="type && sort" />

                    <fieldset v-if="sort">
                        <legend>排序方式：</legend>

                        <draggable
                            :list="inputSortGroup"
                            handle=".handle"
                            class="row mb-3"
                            ghost-class="ghost"
                        >
                            <template v-for="sortKey in inputSortGroup">
                                <div :key="sortKey" class="col-12">
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text handle" style="cursor: pointer;">
                                                <i class="fas fa-bars"></i>
                                            </span>
                                        </div>
                                        <div class="form-control" v-text="SortNames[sortKey]"></div>
                                        <div v-if="inputSortGroup.length > 1" class="input-group-append">
                                            <span class="input-group-text" style="cursor: pointer;" @click="removeSortGroup(sortKey)">
                                                <i class="fas fa-trash-alt"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </draggable>
                        <div v-if="Object.keys(SortSelect).length > 0" class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text handle" style="cursor: pointer;">
                                    新增排序
                                </span>
                            </div>
                            <select v-model="chooseSortGroup" class="form-control">
                                <option value="">
                                    選取
                                </option>
                                <template v-for="(val, key) in SortSelect">
                                    <option :key="key" :value="key" v-text="val"></option>
                                </template>
                            </select>
                            <div v-if="!!chooseSortGroup" class="input-group-append">
                                <span class="input-group-text" style="cursor: pointer;" @click="addSortGroup">
                                    <i class="fas fa-plus"></i>
                                </span>
                            </div>
                        </div>

                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text handle" style="cursor: pointer;">
                                    顯示電量
                                </span>
                            </div>
                            <select v-model="inputShowVal" class="form-control">
                                <template v-for="(val, key) in showValSelect">
                                    <option :key="key" :value="key" v-text="val"></option>
                                </template>
                            </select>
                        </div>
                    </fieldset>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" :disabled="!canSave" @click="save">
                        設定條件
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ToggleButton } from 'vue-js-toggle-button';
import draggable from 'vuedraggable';

import { mapActions, mapMutations, mapGetters } from 'vuex';

import { module_name } from '../lib/store/index';

// import $ from 'jquery';
// import 'bootstrap';

// import 'app';
// import { string, jsVars, popup, trackJS, localStorage, ppPanel } from 'lib/common/util';

export default {
    components: {
        ToggleButton,
        draggable,
    },
    filters: {},
    props: {
        type: {
            type: Boolean,
            default: true,
        },
        sort: {
            type: Boolean,
            default: true,
        },
    },
    data(){
        return {
            inputChooseTypes: {},
            inputSortGroup: [],
            inputShowVal: '',
            chooseSortGroup: '',

            showValSelect: {
                used: '已發電量',
                capacity: '裝置容量',
            },
        };
    },
    computed: {
        ...mapGetters({
            lang: 'lang',
            chooseTypes: 'chooseTypes',
            sortGroup: 'sortGroup',
            showVal: 'showVal',
        }),
        UnitTypes(){
            return this.lang.type;
        },
        SortNames(){
            return this.lang.sortNames;
        },
        SortSelect(){
            const that = this;
            const SortNames = {};

            for (const key in this.lang.sortNames) {
                if (!this.inputSortGroup.includes(key)) {
                    SortNames[key] = this.lang.sortNames[key];
                }
            }

            return SortNames;
        },
        canSave(){
            const that = this;
            let canSave = false;

            if (that.type) {
                const inputChooseTypes = JSON.stringify(that.inputChooseTypes);
                let tmpChooseTypes = {};
                Object.keys(that.UnitTypes).forEach((key) => {
                    tmpChooseTypes[key] = that.chooseTypes.includes(key);
                });
                tmpChooseTypes = JSON.stringify(tmpChooseTypes);

                if (inputChooseTypes !== tmpChooseTypes) {
                    canSave = true;
                }
            }
            if (that.sort) {
                const sortGroup = JSON.stringify(that.sortGroup);
                const inputSortGroup = JSON.stringify(that.inputSortGroup);
                if (sortGroup !== inputSortGroup) {
                    canSave = true;
                }

                if (that.inputShowVal !== that.showVal) {
                    canSave = true;
                }
            }
            return canSave;
        },
    },
    watch: {
    },
    created(){},
    mounted(){
        const that = this;
        that.init();

        $('.modal').modal('hide');

        $(that.$el).modal('show');

        $(that.$el).on('shown.bs.modal', () => {
        });

        $(that.$el).on('hidden.bs.modal', () => {
            that.openFilterBox(false);
        });
    },
    updated(){},
    destroyed(){},
    methods: {
        ...mapActions({}),
        ...mapMutations({
            openFilterBox: `${module_name}/openFilterBox`,
            SetChooseTypes: 'SetChooseTypes',
            SetSortGroup: 'SetSortGroup',
            SetShowVal: 'SetShowVal',
        }),
        init(){
            const that = this;
            if (that.type) {
                const inputChooseTypes = {};
                Object.keys(that.UnitTypes).forEach((key) => {
                    inputChooseTypes[key] = that.chooseTypes.includes(key);
                });
                that.inputChooseTypes = inputChooseTypes;
            }
            if (that.sort) {
                that.inputSortGroup = JSON.parse(JSON.stringify(that.sortGroup));
                that.inputShowVal = that.showVal;
            }
        },
        save(){
            const that = this;

            if (that.type) {
                const chooseTypes = [];
                for (const key in that.inputChooseTypes) {
                    if (that.inputChooseTypes[key] === true) {
                        chooseTypes.push(key);
                    }
                }
                that.SetChooseTypes(chooseTypes);
            }

            if (that.sort) {
                const inputSortGroup = JSON.parse(JSON.stringify(that.inputSortGroup));
                that.SetSortGroup(inputSortGroup);
                const inputShowVal = JSON.parse(JSON.stringify(that.inputShowVal));
                that.SetShowVal(inputShowVal);
            }

            $(that.$el).modal('hide');
        },
        addSortGroup(){
            const that = this;
            if (!!that.chooseSortGroup && 1) {
                const inputSortGroup = JSON.parse(JSON.stringify(that.inputSortGroup));
                inputSortGroup.push(that.chooseSortGroup);
                that.inputSortGroup = inputSortGroup;
                that.chooseSortGroup = '';
            }
        },
        removeSortGroup(sortKey){
            const that = this;
            const inputSortGroup = JSON.parse(JSON.stringify(that.inputSortGroup));

            const index = inputSortGroup.indexOf(sortKey);
            if (index !== -1) {
                inputSortGroup.splice(index, 1);
            }

            that.inputSortGroup = inputSortGroup;
        },
    },
};
</script>
<style lang="scss" scoped>
</style>