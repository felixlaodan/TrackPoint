import { InitOptions } from "../types";
import { getEnvInfo } from "../utils/env";
import { sendRequest } from "../utils/request";

export class Tracker {
  private static instance: Tracker | null = null;
  private options: InitOptions | null = null;
  private commonParams: Record<string, any> = {};
  private envInfo: Record<string, any> = {};

  // --- 队列相关属性 ---
  private queue: any[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private batchSize: number = 5; // 默认 5 条
  private batchDelay: number = 3000; // 默认 3 秒

  private constructor() {}

  public static getInstance(): Tracker {
    if (!this.instance) {
      this.instance = new Tracker();
    }
    return this.instance;
  }

  public register(options: InitOptions) {
    this.options = options;
    // 覆盖默认的队列配置
    if (options.batchSize) this.batchSize = options.batchSize;
    if (options.batchDelay) this.batchDelay = options.batchDelay;

    // 初始化获取环境信息
    this.envInfo = getEnvInfo();

    // 监听页面卸载，确保遗留数据被清空上报
    this.initUnloadListener();

    console.log("TrackPoint SDK 注册成功", this.options);
    console.log("当前环境信息:", this.envInfo);
  }

  public addCommonParams(params: Record<string, any>) {
    this.commonParams = {
      ...this.commonParams,
      ...params,
    };
    console.log("添加通用参数成功", this.commonParams);
  }

  // --- 核心：发送事件 ---
  public sendEvent(eventName: string, params?: Record<string, any>) {
    if (!this.options) {
      console.error("TrackPoint SDK 尚未初始化，请先调用 register()");
      return;
    }

    // 1. 组装完整的一条埋点数据
    const eventData = {
      event_name: eventName,
      event_params: params || {},
      common_params: this.commonParams,
      env_info: this.envInfo,
      timestamp: Date.now(), // 记录事件发生的时间
    };

    // 2. 推入队列
    this.queue.push(eventData);

    // 3. 检查队列是否需要触发上报
    this.checkQueue();
  }

  // --- 队列检查逻辑 ---
  private checkQueue() {
    // 策略 1：达到最大缓存数量，立即上报
    if (this.queue.length >= this.batchSize) {
      this.flush();
      return;
    }

    // 策略 2：如果没有定时器，则开启一个定时器，倒计时结束后上报
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flush();
      }, this.batchDelay);
    }
  }

  // --- 立即清空队列并上报 ---
  public flush() {
    if (this.queue.length === 0 || !this.options) return;

    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // 拷贝当前队列数据，并清空原队列
    const dataToSend = [...this.queue];
    this.queue = [];

    console.log(`[TrackPoint] 触发上报，共 ${dataToSend.length} 条数据`);

    // 组装最终发给后端的 Payload 格式
    const payload = {
      project_id: this.options.project_id,
      logs: dataToSend,
    };

    // 调用底层请求函数
    sendRequest(this.options.requestUrl, payload);
  }

  // --- 监听页面卸载 ---
  private initUnloadListener() {
    // pagehide 比 beforeunload 更可靠，特别是在移动端
    window.addEventListener("pagehide", () => {
      this.flush();
    });
    // 兼容老浏览器
    window.addEventListener("beforeunload", () => {
      this.flush();
    });
  }
}
