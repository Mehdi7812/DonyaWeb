<script setup>
import { ref } from 'vue'

useHead({
  title: 'پشتیبانی | دنیاوب'
})


</script>

<template>
  <div>
    <!-- Hero -->
    <SupportHero />

    <!-- Contact Channels -->
    <SupportContact />

    <!-- Ticket Form + FAQ -->
    <SupportTicket />
  </div>
</template>