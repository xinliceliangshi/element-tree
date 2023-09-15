import { ExtractPropTypes } from "vue";

export const TreeProps = {
  data: {
    type: Array,
    default: () => [],
  },
  uid:{
   type:Number,
  
  },
  label: {
    type: String,
    default: "label",
  },
  isshowAccordion: {
    type: Boolean,
    default: false,
  },
  children: {
    type: String,
    default: "children",
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  nodeKey: {
    type: String,
    default: "",
  },
  // 默认展开项
  defaultExpandedKeys: {
    type: Array,
    default: () => [],
  },
  // 默认选中项
  defaultCheckedKeys: {
    type: Array,
    default: () => [],
  },
  // 默认展开所有
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  // 自定义渲染函数
  renderContent: {
    type: Function,
  },
  parentData: {
    type: Array,
  }
};

export type TreeProps = ExtractPropTypes<typeof TreeProps>;