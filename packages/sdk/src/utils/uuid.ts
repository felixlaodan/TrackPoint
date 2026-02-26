// packages/sdk/src/utils/uuid.ts

/**
 * 生成一个符合 V4 规范的 UUID
 */
export const generateUUID = (): string => {
  let d = new Date().getTime();
  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = ((d + r) % 16) | 0;
      d = Math.floor(d / 16);
    } else {
      r = ((d2 + r) % 16) | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const TRACK_UID_KEY = "__track_point_uid__";

/**
 * 获取或生成唯一的 UID
 * 优先从 localStorage 读取，没有则生成并存储
 */
export const getOrGenerateUid = (): string => {
  try {
    let uid = localStorage.getItem(TRACK_UID_KEY);
    if (!uid) {
      uid = generateUUID();
      localStorage.setItem(TRACK_UID_KEY, uid);
    }
    return uid;
  } catch (e) {
    // 兼容不支持 localStorage 的环境（如隐身模式或非浏览器环境）
    return generateUUID();
  }
};
