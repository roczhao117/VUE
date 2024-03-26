<template>
    <div>
        <el-row>
            <el-select
                v-model="roleid"
                @change="roleChange"
                style="display:flex"
                placeholder="请选择角色"
            >
                <el-option
                    v-for="item in roleData"
                    :key="item.code"
                    :label="item.itemname"
                    :value="item.itemid"
                ></el-option>
            </el-select>
            <el-item style="margin-left:50px;line-height: 40px;">
                <el-switch
                    v-model="is_fastselect"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="快速选择"
                    inactive-text="查询状态"
                ></el-switch>
            </el-item>
        </el-row>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" style="margin-top:10px">
            <el-tab-pane label="功能" name="menu">
                <el-tree
                    :data="menuData"
                    show-checkbox
                    node-key="id"
                    ref="menutree"
                    :props="menuProps"
                    :default-expand-all="true"
                    @check-change="checkChange"
                >
                    <template #default="{ node }">
                        <span class="custom-tree-node">
                            {{ node.label }}
                            <span>
                                <el-checkbox
                                    v-model="node.data.has_read"
                                    :disabled="true"
                                    style="color:#67C23A"
                                >读</el-checkbox>
                                <el-checkbox v-model="node.data.has_edit" style="color:#E6A23C">改</el-checkbox>
                                <el-checkbox v-model="node.data.has_delete" style="color:#F56C6C">删</el-checkbox>
                            </span>
                        </span>
                    </template>
                </el-tree>
                <el-button type="primary" style="margin-left:10px" @click="saveMenu">保存</el-button>
            </el-tab-pane>
            <el-tab-pane label="部门职位" name="second">
                <el-tree
                    :data="dpData"
                    show-checkbox
                    node-key="id"
                    :props="dpProps"
                    :default-expand-all="true"
                ></el-tree>
                <el-button type="primary" style="margin-left:10px" @click="saveDept">保存</el-button>
            </el-tab-pane>

            <el-tab-pane label="级别" name="fourth">
                <el-tree
                    :data="gradeData"
                    show-checkbox
                    node-key="id"
                    :props="gradeProps"
                    :default-expand-all="true"
                ></el-tree>
                <el-button type="primary" style="margin-left:10px">保存</el-button>
            </el-tab-pane>
            <el-tab-pane label="敏感内容" name="fifth">
                <el-tree
                    :data="otherrightData"
                    show-checkbox
                    node-key="id"
                    :props="otherrightProps"
                    :default-expand-all="true"
                ></el-tree>
                <el-button type="primary" style="margin-left:10px">保存</el-button>
            </el-tab-pane>
            <el-tab-pane label="单据权限" name="sixth">
                <el-tree
                    :data="docstatusData"
                    show-checkbox
                    node-key="id"
                    :props="docstatusProps"
                    :default-expand-all="true"
                ></el-tree>
                <el-button type="primary" style="margin-left:10px">保存</el-button>
            </el-tab-pane>
            <el-tab-pane label="薪资帐套" name="seventh">
                <el-tree
                    :data="prgrpData"
                    show-checkbox
                    node-key="id"
                    :props="prgrpProps"
                    :default-expand-all="true"
                ></el-tree>
                <el-button type="primary" style="margin-left:10px">保存</el-button>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>


<script>
import { AX } from '../utils/api'
export default {

    data() {
        return {
            roleData: [],
            menuData: [],

            menuChk: [],
            menuProps: {
                label: 'name',
                children: 'children',

            },
            is_fastselect: true,

            dpData: [],
            dpProps: {
                label: 'dpname',
                children: 'children',
            },

            gradeData: [],
            gradeProps: {
                label: 'itemname',
                children: 'children',
            },

            docstatusData: [],
            docstatusProps: {
                label: 'itemname',
                children: 'children',
            },
            prgrpData: [],
            prgrpProps: {
                label: 'itemname',
                children: 'children',
            },

            otherrightData: [],
            otherrightProps: {
                label: 'itemname',
                children: 'children',
            },


            roleid: '',
            activeName: 'menu'
        };
    },
    methods: {
        /**
         * 如果角色发生改变，这里后面需要考虑，角色改变以后，只对当前的 权限所需数据进行更新，
         * 比如：功能，级别，部门职位 的选项卡，选择相应的卡，才下载相应的数据，目前是全部下载。
         * 可以考虑在点选卡片的时候进行下载，而且最后不是每次点都下载，数据有了就不用下载了，可以考虑是用
         * vuex 的数据状态管理
         */
        roleChange() {
            /**
            * 
            */
            this.is_fastselect = false;
            /**
             * 初始化树钩的数组
             */
            this.menuChk.splice(0, this.menuChk.length);
            /**
             * 如果存在角色，就是选择到了角色，默认进来是空的
             */
            if (this.roleid) {

                AX('get', '/right/' + this.roleid).then(res => {

                    console.log(res);

                    this.iniTree(this.menuData);
                    /**
                      * 
                      * res.data.foreach 
                      */
                    res.data.forEach((item, idx) => {
                        console.log('res:', idx)
                        this.tree(this.menuData, item);
                    })


                })
                    .catch(e => console.log(e.message))
            }
        },
        /**
         * 初始化树
         */
        async iniTree(data) {
            console.log('initree')
            data.forEach(item => {
                /**
                 * 必须在下面设置之前进行打勾，否则下面的设置会改变所有的钩子
                 */
                this.$refs.menutree.setChecked(item.id, false);

                item.has_read = false;
                item.has_edit = false;
                item.has_delete = false;
                if (item.children) {
                    this.iniTree(item.children);
                }
            })
        },
        /**
         * 递归树，
         */
        async tree(data, res) {

            let id = res.itemid;

            data.forEach((item) => {
                if (id != item.mid) {

                    if (item.children) {
                        this.tree(item.children, res);
                    }

                } else {

                    //       this.menuChk.push(item.id)
                    /**
                     * 必须在下面设置之前进行打勾，否则下面的设置会改变所有的钩子
*/
                    //    console.log(this.menuChk)

                    //      this.$refs.menutree.setCheckedKeys(this.menuChk);
                    this.$refs.menutree.setChecked(item.id, true);
                    //  console.log(item.name, res.has_edit)
                    item.has_read = res.has_read;
                    item.has_edit = res.has_edit;
                    item.has_delete = res.has_delete;
                    return
                }
            })

        },


        checkChange(data, nodeChk) {

            /**
             * 如果不等于不再快速选择状态下，就失效，否则会影响查询的结果。
             */
            if (!this.is_fastselect) { return; }
            if (nodeChk) {
                data.has_read = true;
                data.has_edit = true;
                data.has_delete = true;
            } else {
                data.has_read = false;
                data.has_edit = false;
                data.has_delete = false;
            }

        },

        saveMenu() {
            if (!this.roleid) {

                this.$message.error('请选择角色！');
                return;
            }

            let lst = this.$refs.menutree.getCheckedNodes();
            let formdata = [];

            lst.forEach((val) => {
                let data = {};
                data.has_read = val.has_read;
                data.has_edit = val.has_edit;
                data.has_delete = val.has_delete;
                data.itemid = val.mid;
                data.roleid = this.roleid;
                data.type = 'menu';
                formdata.push(data);
            });
            if (formdata.length <= 0) {
                //删除代号role的所有权限数据
            }
            else {
                //删除代号role的所有数据，且弄好
                AX('post', '/right', formdata).then(res => {
                    console.log(res)
                })
                    .catch(e => console.log(e.message))

            }
            console.log(formdata);
        },

        handleClick(tab, event) {
            console.log(tab, event);
            if (!this.roleid) { return false }
        },
        getdic() {
            AX('get', '/dicm/roles').then(res => {
                this.roleData = res.data;
            })
                .catch(e => console.log(e.message))
        },
        listMain() {


            AX('get', '/menu').then((res) => {
                this.menuData = res.data;
            });
            AX('get', '/dept').then((res) => {
                this.dpData = res.data;
            });
            AX('get', '/dicm/hrgrade').then((res) => {
                this.gradeData = res.data;
            });
            AX('get', '/dicm/docstatus').then((res) => {
                this.docstatusData = res.data;
            });
            AX('get', '/dicm/pritemgcalgrp').then((res) => {
                this.prgrpData = res.data;
            });
            AX('get', '/treedic/otherright').then((res) => {
                this.otherrightData = res.data;
            });



        }
    },
    mounted() {
        this.getdic();

        this.listMain();
    }


}


</script>
<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.el-form-item {
    margin-bottom: 5px;
}
.el-tree {
    margin-top: 10px;
}
.el-tree .el-button,
.el-checkbox {
    margin-right: 5px;
    min-height: 20px;
    padding: 3px;
}
</style>