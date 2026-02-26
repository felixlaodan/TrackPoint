import { Tracker } from "./core/Tracker";
import { InitOptions } from "./types";

// 获取全局唯一的 Tracker 实例
const tracker = Tracker.getInstance();

/**
 * 初始化 SDK
 */
export const register = (options: InitOptions) => {
  tracker.register(options);
};

/**
 * 动态添加通用参数
 */
export const addCommonParams = (params: Record<string, any>) => {
  tracker.addCommonParams(params);
};

/**
 * 核心：发送埋点事件
 * @param eventName 事件名称 (如: 'click_button')
 * @param params 事件特有参数
 */
export const sendEvent = (eventName: string, params?: Record<string, any>) => {
  tracker.sendEvent(eventName, params);
};

// 暴露版本号
export const VERSION = "1.0.0";

// 导出所有的类型，方便在外部使用 ts 获得提示
export * from "./types";
