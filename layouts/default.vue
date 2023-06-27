<template>
  <div m-0 min-h-screen min-w-screen flex flex-grow flex-col p-0 font-sans>
    <Header />
    <main flex flex-grow flex-col p-4>
      <slot />
    </main>
    <Footer />
  </div>
</template>
