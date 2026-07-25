<script setup lang="ts">
const series = [
{
name:"واریز",
data:[120,180,210,280,320,410,520]
},
{
name:"برداشت",
data:[80,90,110,130,170,220,260]
}
]

const options = {
chart:{
toolbar:{show:false},
zoom:{enabled:false}
},
stroke:{
curve:"smooth",
width:3
},
legend:{
position:"top"
},
grid:{
borderColor:"#ececec"
},
xaxis:{
categories:[
"شنبه",
"یکشنبه",
"دوشنبه",
"سه شنبه",
"چهارشنبه",
"پنجشنبه",
"جمعه"
]
}
}
</script>

<template>

<div class="rounded-2xl border border-default bg-default p-6">

<h3 class="font-black mb-6">

گردش مالی هفتگی

</h3>

<ClientOnly>

<apexchart
height="340"
type="line"
:options="options"
:series="series" />

</ClientOnly>

</div>

</template>