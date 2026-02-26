// packages/sdk/src/utils/env.ts

import { EnvInfo } from "../types";
import { getOrGenerateUid } from "./uuid";

/**
 * 简单解析 userAgent 获取 OS 和 Browser 信息
 * @param ua navigator.userAgent
 */
const parseUserAgent = (ua: string) => {
  let os = "Unknown";
  let browser = "Unknown";

  // 粗略判断 OS
  if (ua.indexOf("Windows") > -1) os = "Windows";
  else if (ua.indexOf("Mac OS X") > -1) os = "macOS";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";

  // 粗略判断 Browser
  if (
    ua.indexOf("Chrome") > -1 &&
    ua.indexOf("Edg") === -1 &&
    ua.indexOf("OPR") === -1
  ) {
    browser = "Chrome";
  } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
    browser = "Safari";
  } else if (ua.indexOf("Firefox") > -1) {
    browser = "Firefox";
  } else if (ua.indexOf("Edg") > -1) {
    browser = "Edge";
  } else if (ua.indexOf("MicroMessenger") > -1) {
    browser = "Opera";
  } else if (ua.indexOf("Trident") > -1 || ua.indexOf("MSIE") > -1) {
    browser = "IE";
  }

  return { os, browser };
};

/**
 * 获取当前所有环境信息
 */
export const getEnvInfo = (): EnvInfo => {
  // 如果在 Node 环境（非浏览器环境），提供默认兜底值
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      url: "",
      referrer: "",
      os: "Node",
      browser: "Node",
      screen: "0x0",
      uid: "node-env-uid",
    };
  }

  const { os, browser } = parseUserAgent(navigator.userAgent);
  const screen = `${window.screen.width}x${window.screen.height}`;

  return {
    url: window.location.href,
    referrer: document.referrer,
    os,
    browser,
    screen,
    uid: getOrGenerateUid(),
  };
};
