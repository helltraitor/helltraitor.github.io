<template>
  <div m-0 flex flex-grow flex-col p-0 font-sans>
    <Background />
    <Header />
    <main flex flex-grow flex-col p-4>
      <slot />
    </main>
    <Footer />
  </div>
</template>
