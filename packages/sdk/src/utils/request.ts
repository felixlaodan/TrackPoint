export const sendRequest = (url: string, data: any) => {
  // 将数据转为 JSON 字符串
  const body = JSON.stringify(data);

  // 1. 优先使用 navigator.sendBeacon (适合在页面卸载时发送数据，无阻塞)
  if (navigator.sendBeacon) {
    // sendBeacon 默认发送 text/plain，如果要后端识别为 JSON，可以使用 Blob 包装
    const blob = new Blob([body], { type: "application/json" });
    const success = navigator.sendBeacon(url, blob);
    if (success) return;
  }

  // 2. 降级方案：使用 fetch API (开启 keepalive 保证页面关闭时请求也能发出去)
  if (typeof fetch === "function") {
    fetch(url, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true, // 关键：允许在页面卸载后继续发送请求
    }).catch((err) => {
      console.error("TrackPoint SDK 上报失败:", err);
    });
  }
};
