<template>
  <div class="relative bg-slate-900 text-white">
    <div class="h-screen absolute left-0 right-0 overflow-x-clip">
        <BackgroundBlobs />
        <NavBar />
    </div>

    <main class="relative z-10">
      <slot />
    </main>

    <SiteFooter />
  </div>
</template>