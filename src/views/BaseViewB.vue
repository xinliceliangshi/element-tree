<template>
	<Tree
	 :data="list"
   :label="label"
   :children ="children"
   show-checkbox
   
	/>
</template>
<script setup>
import Tree from '../components/TreeView'
const list = [
{
   
    label: "Level one 1",
    children: [
      {
       
        label: "Level two 1-1",
        children: [
          {
            parentData:"Level two 1-1",
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
 
    label: "Level one 2",
    children: [
      {
        
        label: "Level two 2-1",
        children: [
          { parentData:"Level two 2-1",
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        label: "Level two 2-2",
      },
    ],
  },
  {
    label: "Level one 3",
    children: [
      {
        label: "Level two 3-1",
        children: [
          {
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        label: "Level two 3-2",
        children: [
          {
            
            label: "Level three 3-2-1",
          },
        ],
      },
    ],
  },
];




</script>
