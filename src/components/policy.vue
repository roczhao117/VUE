<template>
    <div>
        <div class="block">
            <span class="demonstration">密码长度 [{{ formdata.pwdlen }} 位]</span>
            <el-slider v-model="formdata.pwdlen" :marks="pwdlenmarks" :min="3" :max="17"></el-slider>
        </div>
        <div class="block">
            <span class="demonstration">失效天数 [{{ formdata.daylen }} 天]</span>
            <el-slider v-model="formdata.daylen" :marks="daylenmarks" :min="30" :max="360"></el-slider>
        </div>
        <div class="block">
            <span class="demonstration">错误次数锁定 [{{ formdata.errors }} 次]</span>
            <el-slider v-model="formdata.errors" :marks="errorsmarks" :min="3" :max="10"></el-slider>
        </div>
        <div class="block">
            <span class="demonstration">锁定时间 [{{ formdata.lockedhours }} 分钟]</span>
            <el-slider v-model="formdata.lockedmins" :min="0" :max="60"></el-slider>
        </div>
        <div class="block">
            <span class="demonstration">密码不重复次数 [{{ formdata.newtimes }} 次]</span>
            <el-slider v-model="formdata.newtimes" :marks="newtimesmarks" :min="1" :max="10"></el-slider>
        </div>
        <div class="block">
            <span class="demonstration">密码等级 [{{ formdata.pwdlevel }} 级]</span>
            <el-slider v-model="formdata.pwdlevel" :marks="pwdlevelmarks" :min="1" :max="5"></el-slider>
        </div>
        <div class="block">
            <span class="demonstration">自动生成密码</span>

            <el-slider v-model="formdata.autopwd" :marks="formdata.autopwdmarks" :min="0" :max="2"></el-slider>
        </div>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveform">确 定</el-button>
        </span>
    </div>
</template>


<script>
import { AX } from '../utils/api'

export default {
    data() {
        return {
            pwdlenmarks: {

                6: '6',
                12: '12',

            },
            daylenmarks: {

                60: '60',
                180: '180',
                240: '240'

            },
            errorsmarks: {
                3: '3',
                8: '8'
            },
            newtimesmarks: {
                3: '3',
                8: '8'
            },
            autopwdmarks: {

                0: '否', 1: '自动', 2: '否'

            },
            pwdlevelmarks: {
                1: '数字',
                2: '数字+字母',
                3: '数字+小字母+大写字母',
                4: {
                    style: {
                        color: '#1989FA'
                    },
                    label: '数字+小写字母+大写字母+符号[!@#$%^&*_-]'
                },
                5: '无'



            },
            formdata: {

                pwdlen: 6,
                daylen: 90,
                errors: 6,
                lockedmins: 10,
                newtimes: 5,
                autopwd: 1,
                pwdlevel: 2,

            },
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        saveform() {


            // console.log(this.formdata)

            AX('post', '/policy', this.formdata).then(res => {
                console.log(res)
                if (res.code == 2000) {
                    this.$message.success("提交成功");
                }
            })
                .catch(e => console.log(e.message))


        },

        load() {


            AX('get', '/policy').then(res => {
                console.log(res)
                if (res) {
                    Object.assign(this.formdata, res.data[0]);
                }
            })
                .catch(e => console.log(e.message))

        }

    },
}
</script>
<style scoped>
.block {
    padding: 10px 0;
    overflow: hidden;
    border-bottom: 1px solid #eff2f6;
    display: block;
    text-align: left;
    margin-left: 25px;
}
.demonstration {
    font-size: 14px;
    color: #8492a6;
    line-height: 44px;
}
.el-slider {
    float: right;
    width: 80%;
    margin-right: 20px;
}
.el-switch {
    float: right;
    width: 80%;
    margin-right: 20px;
}
.dialog-footer {
    margin-top: 40px;
    padding: 20px 20px;
    width: 42px;
    display: inline-flex;
}
</style>