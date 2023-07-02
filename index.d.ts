interface CommonInjection {
  $headerHeight?: MaybeRefOrGetter<number>

}

declare module '#app' {
  interface NuxtApp extends CommonInjection {}
}

export {}
