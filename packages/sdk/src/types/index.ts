/**
 * SDK 初始化配置项
 */
export interface InitOptions {
  /**
   * 项目唯一标识
   */
  project_id: string;
  /**
   * 服务端数据接收接口的 URL
   */
  requestUrl: string;
  /**
   * 数据上报的采样率 (0 ~ 1，默认为 1，即 100% 上报)
   */
  upload_percent?: number;
  /**
   * 合并上报队列的最大等待时间 (毫秒)，默认 3000ms
   */
  batchWaitTime?: number;
  /**
   * 同时缓存的最大上报数量，默认 5 条
   */
  batchMaxLength?: number;

  // --- 新增队列相关配置 ---
  /** 达到多少条数据时触发上报 (默认 5 条) */
  batchSize?: number;
  /** 延迟上报的时间间隔，单位 ms (默认 3000 ms) */
  batchDelay?: number;
}

/**
 * 埋点数据的通用参数类型
 */
export interface CommonParams {
  // “任意键值对”的类型
  [key: string]: any;
}

export interface EnvInfo {
  /** 页面完整 URL */
  url: string;
  /** 页面来源 URL */
  referrer: string;
  /** 用户设备系统 (Windows/macOS/Android/iOS 等) */
  os: string;
  /** 浏览器类型及版本 (Chrome 114/Safari 16 等) */
  browser: string;
  /** 屏幕分辨率 (例如: 1920x1080) */
  screen: string;
  /** 用户唯一标识符 */
  uid: string;
}
