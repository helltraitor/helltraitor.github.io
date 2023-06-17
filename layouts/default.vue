<template>
  <div m-0 min-h-screen min-w-screen flex flex-col p-0 font-sans>
    <Header />
    <main m-a flex flex-grow flex-col p-4>
      <slot />
    </main>
    <Footer />
  </div>
</template>
