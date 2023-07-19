<template >
  <div class="container">
    <nav>
      <el-menu :default-active="'/' + $route.path.split('/')[1]" mode="horizontal" class="menu" :router="true"
        :ellipsis="false" background-color="#00000000" active-text-color="var(--el-color-primary)"
        text-color="var(--el-text-color-secondary)">
        <el-menu-item index="/main">
          <div class="menu-item-text">
            <el-icon :size="24">
              <Setting />
            </el-icon>
            <span>Главная</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/actions">
          <div class="menu-item-text">
            <el-icon :size="24">
              <User />
            </el-icon>
            <span>Операции</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/plans">
          <div class="menu-item-text">
            <el-icon :size="24">
              <Close />
            </el-icon>
            <span>Планы</span>
          </div>
        </el-menu-item>
        <el-menu-item index="/analitic">
          <div class="menu-item-text">
            <el-icon :size="24">
              <Delete />
            </el-icon>
            <span>Аналитика</span>
          </div>
        </el-menu-item>
      </el-menu>
    </nav>
  </div>
</template>
<script>
import { shallowRef } from 'vue'
import { Setting, Close, User, Delete } from '@element-plus/icons-vue'

export default {
  components: {
    Setting,
    User,
    Close,
    Delete,
  },
  setup() {
    return {
      iconSetting: shallowRef(Setting),
      iconUser: shallowRef(User),
      iconExit: shallowRef(Close),
      iconDelete: shallowRef(Delete),
    }
  },
  computed: {},
  methods: {},
}
</script>
<style scoped>
.container {
  height: 100%;
  flex-grow: 1;
}

.menu.el-menu {
  --el-menu-item-height: calc(var(--footer-height-mobile) - 6.5px);
  border-bottom: none;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-bottom: 4px;
}

.menu.el-menu .el-menu-item {
  padding: 0;
}

.menu-item-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0 4px;
  width: 100%;
  height: calc(var(--footer-height-mobile) - 6.5px);
}

.menu-item-text>span {
  font-size: 12px;
  line-height: 1;
}

@media (min-width: 768px) {
  .menu.el-menu {
    display: none;
  }
}
</style>