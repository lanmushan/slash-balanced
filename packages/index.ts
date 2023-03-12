import SlashBalanced from "~/SlashBalanced";
import ProxyAlgorithmServiceFactory from "~/ProxyAlgorithmServiceFactory";
import SlashBalancedContext from "~/SlashBalancedContext";
import SlashUtil from "~/SlashUtil";
import SlashXMLHttpRequest from "~/SlashXMLHttpRequest";
import SlashBalancedOption, { ProxyAlgorithmEnum } from "~/SlashBalancedOption";

export default SlashBalanced
const init = function (options: SlashBalancedOption) {
    SlashBalanced.init(options);
}
const stop = function () {
    SlashBalanced.stop();
}
const start=function (){
    SlashBalanced.start();
}
export {SlashBalanced, ProxyAlgorithmServiceFactory, SlashBalancedContext, SlashUtil, SlashXMLHttpRequest,ProxyAlgorithmEnum, init,stop,start}
