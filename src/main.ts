import {createApp} from 'vue'
import App from './App.vue'
import {SlashBalanced} from '~';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import SlashBalancedOption, {ProxyAlgorithmEnum} from "~/SlashBalancedOption";

let app = createApp(App);
app.config.globalProperties.$systemName = '用户管理系统'
console.log(SlashBalanced)
app.use(ElementPlus)
SlashBalanced.init({
    enable: false,
    proxyOptions: [

    ]
} as unknown as SlashBalancedOption)
app.mount('#app')

window.console.log = function () {

}
