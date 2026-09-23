<template>
  <view class="custom-tabbar">
    <view class="tabbar-content">
      <view
        v-for="(item, index) in tabList"
        :key="index"
        class="tabbar-item"
        @click="switchTab(item, index)"
      >
        <image
          class="tabbar-icon"
          :src="currentIndex === index ? item.activeIcon : item.icon"
          mode="aspectFit"
        ></image>
        <text
          class="tabbar-text"
          :class="{ active: currentIndex === index }"
        >{{ item.text }}</text>
      </view>
    </view>
    <view class="safe-area-bottom"></view>
  </view>
</template>

<script>
import { getTabbarConfig } from '../../api/index.js';

export default {
  name: 'CustomTabbar',
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: 0,
      tabList: [
        // 默认配置（当API不可用时使用本地图片）
        {
          text: '首页',
          pagePath: '/pages/home/index',
          icon: '/static/tabbar/home.png',
          activeIcon: '/static/tabbar/home-active.png'
        },
        {
          text: '订单',
          pagePath: '/pages/orders/index',
          icon: '/static/tabbar/order.png',
          activeIcon: '/static/tabbar/order-active.png'
        },
        {
          text: '我的',
          pagePath: '/pages/profile/index',
          icon: '/static/tabbar/me.png',
          activeIcon: '/static/tabbar/me-active.png'
        }
      ]
    };
  },
  watch: {
    current: {
      immediate: true,
      handler(val) {
        this.currentIndex = val;
      }
    }
  },
  created() {
    this.loadTabbarConfig();
  },
  methods: {
    loadTabbarConfig() {
      // 先从缓存读取
      const cached = uni.getStorageSync('tabbar_config');
      if (cached && Array.isArray(cached) && cached.length > 0) {
        this.updateTabList(cached);
      }

      // 再从API获取最新配置
      getTabbarConfig()
        .then((res) => {
          if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            this.updateTabList(res.data);
            uni.setStorageSync('tabbar_config', res.data);
          }
        })
        .catch(() => {
          // API失败，使用默认配置
        });
    },
    updateTabList(data) {
      this.tabList = data.map((item) => ({
        text: item.name || item.text,
        pagePath: '/' + (item.pagePath || item.page_path || ''),
        icon: item.iconPath || item.icon_path || '/static/tabbar/home.png',
        activeIcon: item.selectedIconPath || item.selected_icon_path || item.iconPath || '/static/tabbar/home-active.png'
      }));
    },
    switchTab(item) {
      const url = item.pagePath;
      // 判断是否为tabbar页面
      const tabPaths = [
        '/pages/home/index',
        '/pages/orders/index',
        '/pages/profile/index'
      ];

      if (tabPaths.indexOf(url) !== -1) {
        uni.switchTab({ url });
      } else {
        uni.navigateTo({ url });
      }
    }
  }
};
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.tabbar-content {
  display: flex;
  flex-direction: row;
  height: 100rpx;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rpx 0;
}

.tabbar-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 4rpx;
}

.tabbar-text {
  font-size: 20rpx;
  color: #9ca3af;
  line-height: 1;
}

.tabbar-text.active {
  color: #16a34a;
}

.safe-area-bottom {
  height: env(safe-area-inset-bottom);
  height: constant(safe-area-inset-bottom);
  background-color: #ffffff;
}
</style>
