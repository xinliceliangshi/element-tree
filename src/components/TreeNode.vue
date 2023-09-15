<template>
 <div >
  <ul class="tree-node" >
  
    <div :class="['tree-node__content']"
     @click.stop="handleToggle(items)"
     :draggable="true"
     @dragstart="onDragStart" 
     @dragover="onDragOver"
     @drop="onDrop"
     @dragend="onDragEnd"
     >
      <span >
        <i class="icon iconfont icon-xiala"></i>
      </span>
      <el-checkbox
      v-if="showCheckbox"
      v-model="items!.isChecked"
        :indeterminate="items.indeterminate"
        :disabled="items.disabled"
      @change="handleCheckChange"
      
      ></el-checkbox>
      <nodeContent :data="items" :render-content="renderContent" :parent-data="parentData" />
    </div>

      <div class="tree-ul-box" v-if="isShow" v-show="items.isOpen" >
     
        <tree-node
          v-for="(i, j) in items.children"
          :key="j"
          :items="i"
          :uid="uid"
          :level="level"
          :label="label"
          :children="children"
          :show-checkbox="showCheckbox"
          :index="index && index + 1"
          :node-key="nodeKey"
          :default-expanded-keys="defaultExpandedKeys"
          :default-checked-keys="defaultCheckedKeys"
          :default-expand-all="defaultExpandAll"
          :render-content="renderContent"
          :parent-data="items.children">
        </tree-node>
      </div>
  </ul>
</div>

</template>

<script setup lang="ts">
import { computed, onMounted, watch, inject, nextTick ,ref,toRaw ,Ref} from "vue";
import nodeContent from "@/components/NodeContent.vue";



// import draggable from "vuedraggable";



const props = defineProps({
  items: {
    type: Object,
    default: () => {},
  },
  uid:Number,
  level:Number,
  label: String,
  children: String,
  showCheckbox: Boolean,
  index: Number,
  showAccordion: Boolean,
  nodeKey: String,
  renderContent: Function,
  parentData: Array,
  // 默认展开项
  defaultExpandedKeys: Array,
  // 默认选中项
  defaultCheckedKeys: Array,
  // 默认展开所有
  defaultExpandAll: Boolean,
});

// console.log("allNodes",allNodes);
const checkboxChange = inject<() => void>("checkboxChange", () => {});
const toggleChange = inject<(param: any) => void>("toggle-change", () => {});
const checkedChange = inject<(param: any) => void>("checked-change", () => {});



const onDragStart = (event:any) => {
  event.dataTransfer.setData('item', JSON.stringify(props.items));
  const droppedItem = JSON.parse(event.dataTransfer.getData('item'));
  console.log("droppedTtem",droppedItem);
  console.log("当前拖拽节点的parentData ",props.parentData);
  //先获取所有数据，然后删除
  const rawData = toRaw(props.parentData);
  
  const updatedData = removeNode(droppedItem, props.parentData);
  const proxy = new Proxy (updatedData,{});
  event.target.classList.add("dragging");
  if (updatedData) {
 
    nextTick(() => {
    props.items.parentData = proxy;
   
  })
}
};


const onDragOver = (event:any) => {
  event.preventDefault();
};

const onDrop = (event:any) => {
  event.preventDefault();
  const droppedItem = JSON.parse(event.dataTransfer.getData('item'));
  // console.log("droppedItem");
  // console.log(droppedItem);
  // console.log("p", props.parentData);
  // console.log("tp",typeof props.parentData)
 
 
  if (!props.items.children) {
    props.items.children = [];
  }
 
  console.log(props.items.children);
  props.items.children = [...props.items.children, droppedItem];
  props.items.isOpen = true; // 展开目标节点

collapseOtherNodes(props.items); // 收缩其他节点

  // 更新 props.parentData

};

const onDragEnd = (event:any) => {
  event.dataTransfer.clearData('item');
  event.target.classList.remove("dragging");
};

const removeNode = (node: any, data: any):any =>{

  const rawData = toRaw(data);

  for (let i = 0; i < rawData.length; i++) {
    if (JSON.stringify(rawData[i]) === JSON.stringify(node)) {
      rawData.splice(i, 1);
      console.log("删除了");
      return rawData;
    } else if (rawData[i].children && rawData[i].children.length) {
      const result = removeNode(node, rawData[i].children);
      if (result) {
        // 如果子节点中找到并删除了目标节点，则停止搜索
        return result;
      }
    }
  }
  return false;
};

onMounted(() => {
  _initDefault();
});



const isShow = computed(() => {

  return props.items.children && props.items.children.length;
});


const handleToggle = (item: any) => {
  item.isOpen = !item.isOpen;
  // 展开/收起子节点时触发
  if(item.isOpen)
  {
    // collapseOtherNodes(item);
    collapseOtherlevelNodes(item);
  }
  toggleChange(item);
};

const collapseOtherlevelNodes = (item: any)=>{
  collapseOtherlevelNodesFromParent (item,props.parentData?props.parentData:[])
}




const handleCheckChange = (val: any) => {
  updateChildChecked(props.items, val); // 设置子级
  updateParentChecked(); // 设置父级
  checkedChange(props.items);
};
const collapseOtherlevelNodesFromParent = inject<(currentNode: any, parentData: any[]) => void>("collapse-other-level-nodes", () => {});

// console.l
const collapseOtherNodesFromParent = inject<(currentNode: any, parentData: any[]) => void>("collapse-other-nodes", () => {});
const collapseOtherNodes=(item: any) => 
{
   
 
    collapseOtherNodesFromParent(item,props.parentData?props.parentData:[]);
  
}

// 选中一个节点时，递归地遍历下面所属的所有子节点
const updateChildChecked = (item: any, val: any) => {
  item.isChecked = val;
  if (item.children && item.children.length) {
    item.children.forEach((el: any) => {
      updateChildChecked(el, val);
    });
  }
};

const updateParentChecked = () => {
  nextTick(() => {
    checkboxChange && checkboxChange();
  });
};



// 初始化默认的展开项和选中项
const _initDefault = () => {
  let {
    items,
    nodeKey,
    defaultExpandedKeys,
    defaultCheckedKeys,
    defaultExpandAll,
  } = props;
  const nodeKeyValue = nodeKey && items[nodeKey];
  const isExpand = defaultExpandedKeys!.includes(nodeKeyValue) || defaultExpandAll;
  const isChecked = defaultCheckedKeys!.includes(nodeKeyValue);
  items.isOpen = isExpand;
  items.isChecked = isChecked;
  nextTick(() => {
    // 设置默认节点，需要默认勾选对应的所有子节点
    if (isChecked) {
      updateChildChecked(props.items, isChecked);
    }
    updateParentChecked();
  });
};

</script>

<script lang="ts">
export default {
  name: "HTreeNode",
};
</script>
<style>
.tree-node {
  /* 左边距 */
  margin-left: 15px;
  margin-right: 15px;
}
.tree-node:hover {
  background-color: #f5f7fa;
}

.tree-node__content.dragging {
  /* 添加拖拽时的样式 */
  opacity: 0.5;
  background-color: #ebeef5;
  border-radius: 4px;
}
.tree-node__content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.tree-node__content:hover {
  background-color: #ebeef5;
}
.tree-ul-box {
  margin-left: 20px;
}
.icon-xiala {
  margin-right: 6px;
  transition: transform 0.3s;
}
.items.isOpen .icon-xiala {
  transform: rotate(90deg);
}
.el-checkbox {
  margin-right: 6px;
}
</style>