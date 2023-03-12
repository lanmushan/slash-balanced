import SlashXMLHttpRequest from "~/SlashXMLHttpRequest";
import SlashBalancedOption, {SlashBalancedRunOptions} from "~/SlashBalancedOption";
import SlashBalancedContext from "~/SlashBalancedContext";

export default class SlashBalanced {
    public static init(options: SlashBalancedOption) {
        (globalThis as any).OriginXMLHttpRequest = XMLHttpRequest;
        console.log("SlashBalanced初始化")
        if (!options.enable) {
            return
        }
        SlashBalanced.start();
        SlashBalancedContext.init(options as SlashBalancedRunOptions);

    }
    public static config(options: SlashBalancedOption)
    {
        SlashBalancedContext.init(options as SlashBalancedRunOptions);
    }

    static stop() {
        if ((globalThis as any).OriginXMLHttpRequest!=undefined) {
            console.log("关闭分发代理");
            (globalThis as any).XMLHttpRequest = (globalThis as any).OriginXMLHttpRequest
        }
    }

    static start() {
        (globalThis as any).XMLHttpRequest = SlashXMLHttpRequest;
    }
}
