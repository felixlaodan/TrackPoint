import { Tracker } from "./src/core/Tracker";

const tracker = Tracker.getInstance();

// 1. 初始化
tracker.register({
  project_id: "test_project_001",
  requestUrl: "http://localhost:3000/api/track/upload",
  batchSize: 3, // 为了方便测试，我们设置满 3 条就上报
  batchDelay: 5000, // 或者等 5 秒上报
});

// 2. 添加通用参数
tracker.addCommonParams({
  user_vip_level: "V1",
  theme: "dark",
});

// 3. 模拟业务触发事件
console.log("--- 准备触发第 1 个事件 ---");
tracker.sendEvent("click_button", { button_id: "btn_login" });

setTimeout(() => {
  console.log("--- 准备触发第 2 个事件 ---");
  tracker.sendEvent("view_page", { page_name: "home" });
}, 1000);

setTimeout(() => {
  console.log("--- 准备触发第 3 个事件 (此时应触发上报!) ---");
  tracker.sendEvent("click_banner", { banner_id: "ad_001" });
}, 2000);

setTimeout(() => {
  console.log("--- 准备触发第 4 个事件 (进入新队列，等 5 秒后超时上报) ---");
  tracker.sendEvent("scroll_bottom");
}, 3000);
