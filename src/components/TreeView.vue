<template>
  <div class="f" >
    <div class="h-tree" >
      
    <tree-node
      v-for="(item, index) in copyData"
      :key="index"
      :uid="item.uid"
      :items="item"
      :level="item.level"
      :label="label"
      :children="children"
      :show-checkbox="showCheckbox"
      :index="0"
      :node-key="nodeKey"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="checkedKeys"
      :default-expand-all="defaultExpandAll"
      :render-content="renderContent"
      :parent-data="copyData"
      >
    </tree-node>
  
  </div>
  </div>
 
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from "vue";
import treeNode from "@/components/TreeNode.vue";
import { deepCopy } from "@/utils/tree";
export interface CustomObject {
  [key: string]: any;
}

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  uid:{
   type:Number,
  
  },
  level:{
    type:Number,
    default:0,
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
});

const uid =ref<any[]>([]);
const emits = defineEmits(["toggle-change", "checked-change"]);
const copyData = ref<any[]>([]);
const checkedKeys = ref(props.defaultCheckedKeys);

 
// watch(
//   () => props.data,
//   (newVal) => {
//     console.log(newVal);
//   },
//   { immediate: true },
// );

onMounted(() => {


 initFn(deepCopy(props.data), props.level);

});


let i  = ref<number>(0);
  const initFn = (data: any, level: number = 0) => {
  copyData.value = data.map((item: any, index: number) => {
    item.uid = i.value ++;
    item.children = item[props.children] || [];
    item.label = item[props.label];
    item.id = item[props.nodeKey];
    item.isOpen = false;
    item.isChecked = false;
    item.level = level;
    if (item.children && item.children.length) {
      initFn(item.children, level + 1);
    }
    return {
      uid:item.uid,
      id: item.id,
      label: item.label,
      children: item.children,
      isOpen: item.isOpen,
      isChecked: item.isChecked,
      disabled: item.disabled,
      level: item.level,
    };
  });
};

const checkboxChange = () => {
  updateChecked(copyData.value);
};

// 展开/收起子节点时触发
const toggleChange = (val: any) => {
  emits("toggle-change", val);
};

const checkedChange = (data: any) => {
  const checkedNodes = getCheckedNodes();
  emits("checked-change", checkedNodes, data);
};




// 子有一个选中，父为半选
// 子全选中，父为全选
// 子一个都没选中，父不选
const updateChecked = (data: any) => {
  data.forEach((item: any) => {
    let checked;
    let indeterminate;
    let checkedNodes;
    if (item.children && item.children.length) {
      updateChecked(item.children);
      const children = item.children;
      // 过滤出选中的
      checkedNodes = children.filter((child: any) => child.isChecked);
      if (checkedNodes.length === 0) {
        checked = false;
        indeterminate = false;
      } else if (checkedNodes.length === children.length) {
        checked = true;
        indeterminate = false;
      } else {
        checked = false;
        indeterminate = true;
      }
      item.isChecked = checked;
      item.indeterminate = indeterminate;
    }
  });
};
const collapseOtherlevelNodes=(currentNode: any, parentData: any[])=>{
  const collapselevelNodes = (nodes: any[]) => {
    nodes.forEach((node: any) => {
     if (node.level === currentNode.level && node.uid !== currentNode.uid) {
        node.isOpen = false;
      }
      if (node.children && node.children.length) {
        collapselevelNodes(node.children);
      }
    });
  };
  collapselevelNodes(parentData);

}
const collapseOtherNodes=(currentNode: any, parentData: any[])=>{
  const collapseNodes = (nodes: any[]) => {
    nodes.forEach((node: any) => {
      if (node !== currentNode ) {
        node.isOpen = false;
      }
    });
  };
  collapseNodes(parentData);
}

// 对外暴露，通过传入keys数组设置选中
const setCheckedKeys = (keys: any) => {
  if (!props.showCheckbox) return;
  checkedKeys.value = keys;
};

// 对外暴露，获取选中项的keys数组
const getCheckedKeys = () => {
  return getCheckedNodes().map((ele: any) => ele.id);
};

// 对外暴露，获取选中项的数据数组
const getCheckedNodes = () => {
  const checkedNodes: CustomObject[] = [];
  const traverse = function (copyData: any) {
    copyData.forEach((item: any) => {
      if (item.isChecked) {
        checkedNodes.push({
          id: item.id,
          label: item.label,
          children: item.children ? item.children : [],
        });
      }
      if (item.children && item.children.length) {
        traverse(item.children);
      }
    });
  };
  traverse(copyData.value);
  return checkedNodes;
};
const getAllNodes = () => {
  return copyData.value;
};

provide("collapse-other-nodes", collapseOtherNodes);
provide("checkboxChange", checkboxChange);
provide("toggle-change", toggleChange);
provide("checked-change", checkedChange);
provide("collapse-other-level-nodes",collapseOtherlevelNodes);

provide("get-all-nodes", getAllNodes);

defineExpose({
  setCheckedKeys,
  getCheckedKeys,
  getCheckedNodes,
  getAllNodes
});
</script>

<script lang="ts">
export default {
  name: "HTree",
};
</script>

<style>
.f{
  display:flex;
  justify-content:center;
  align-items:center;
}
.h-tree{

color: #606266;
width: 1000px;
height: 1000px;
border: 1px solid #ebebeb;
border-radius: 3px;
}

</style>