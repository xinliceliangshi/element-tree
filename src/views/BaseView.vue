<template>
	<Tree
	 :data="list"
    
	/>
</template>
<script setup>
import Tree from '../components/TreeView'
const list = [
  {
    uid:1,
    label: "Level one 1",
    level:1,
    children: [
      {
        uid:2,
        label: "Level two 1-1",
        level:2,
        children: [
          {
            uid:3,
            level:3,
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  { uid:4,
    level:1,
    label: "Level one 2",
    children: [
      { 
        uid:5,
        level:2,
        label: "Level two 2-1",
        children: [
          { 
            uid:6,
            level:3,
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        uid:7,
        level:2,
        label: "Level two 2-2",
      },
    ],
  },
  { 
    uid:8,
    level:1,
    label: "Level one 3",
    children: [
      { 
        uid:9,
        level:2,
        label: "Level two 3-1",
        children: [
          { 
            uid:10,
            level:3,
            label: "Level three 3-1-1",
          },
        ],
      },
      { 
        uid:11,
        level:2,
        label: "Level two 3-2",
        children: [
          {
            uid:12,
            level:3,
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];
</script>
