import axios from "axios";
//const ax=require("axios");
import {
    ElMessage
} from "element-plus";
import route from '../router';


axios.interceptors.response.use(success => {

        if (success.status && success.status == 200) {
            if (success.data.code == 500 || success.data.code == 401 || success.data.code == 402) {
                ElMessage.error({
                    message: success.data.message

                });
                return;
            }
            if (success.data.message) {
                ElMessage.success({
                    message: success.data.message
                })
            }
            return success.data;
        }
    },
    error => {
        if (error.response.code == 504 || error.response.code == 404) {
            ElMessage.error({
                message: 'servers has donw!'
            })
        } else if (error.response.code == 403) {
            ElMessage.error({
                message: 'miss permission.'
            })
        } else if (error.response.code == 401) {
            ElMessage.error({
                message: 'Please login in first.'
            });
            route.replace('/');
        } else {
            if (error.response.data.message) {
                ElMessage.error({
                    message: error.response.data.message
                })
            } else {
                ElMessage.error({
                    message: 'unkonwn error.'
                })
            }
            return;
        }
    });

const base = 'http://localhost:3000';

export const AX = (method,url, data) => {
    return axios({
        method,
        url:`${base}${url}`,
        data,
    });

}