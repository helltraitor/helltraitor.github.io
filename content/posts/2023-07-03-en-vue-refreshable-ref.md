---
title: Refreshable Ref for Vue
description: This article describes refreshable ref concept for Vue framework
language: English
created: 2023-07-03
modified: 2023-07-03
---

# Refreshable Ref for Vue

As you may know, Vue web framework already provided `Ref<T>`{lang=ts} and `ComputedRef<T>`{lang=ts} types
via `ref` and `computed` functions.

If you do, then you know that they don't updated with foreign source changing (e.g. DOM `HTMLElement`{lang=ts}).
And, in general usage, the changing detection requires `watch`, `watchEffect` or even `setInterval` functions.

But in case when we directly control changes (but cannot wrap object itself with `reactive`),
we can set exact value manually or use `computed` function with hidden variable for readonly one.

```ts []{4}
const internal = ref(0)
const wrapped = computed(() => {
  // Link computed to ref that will trigger re-evaluation
  const _ = internal.value
  // This getter may be anything
  return computedValueGetter()
})

// We can trigger re-evaluation via internal link
internal.value += 1
```

If you are satisfied with this workaround, then its fine. Maybe your journey is over right here.
But as for me, I like more general approach.

## General approach

Here is the code from my header component.

```ts [header.vue]{2}
const headerElement = ref<HTMLElement | undefined>()
const headerHeight = refreshed(() => headerElement.value?.clientHeight ?? 0)

useNuxtApp().$headerHeight = headerHeight
```

It defines "refreshed" `headerHeight` reactive variable, that can be refreshed when I manually change
header size. The header that you could see above not changing its sizes at all, but in case when
I want to (may be in future), I just need to add next line after last applied change.

```ts []{5}
if (!headerElement)
  return

headerElement.value.style.height = '100px'
headerHeight.refresh()
```

`RefreshedRef<T>`{lang=ts} described above is quite simple and its implementation provided early
as the solution with internal variable. I keep its interface and constructor in the composable file
that allows me to use it like `computed`.

```ts [refreshed.ts]{1, 20, 22, 25}
export interface RefreshedRef<T = any> extends Ref<T> {
  get value(): T

  /**
   * The function for value refreshing. Call emits recomputing.
   */
  refresh: () => void
}

/**
 * [`ComputedRef`](ComputedRef) over type [`T`](T) that supports refreshing.
 *
 * @param compute The function getter or computer, which will result fresh value
 * @returns [`RefreshedRef`](RefreshedRef) type over computer [`T`](T) type.
 */
export const refreshed = <T>(compute: () => T): RefreshedRef<T> => {
  const internal = ref(0)

  return {
    ...ref(),
    get value() {
      const _ = internal.value
      return compute()
    },
    refresh() { internal.value += 1 },
  }
}
```

Lets take a look at this code...

In the first line we define interface `RefreshedRef<T>`{lang=ts} that extends an existent one `Ref<T>`{lang=ts}
from Vue. We need this interface for properly using in typescript components \:D. Otherwise we will get an error
with `[RefSymbol]`{lang=ts} that is defined in internal vue parts. So extending interface allow us to use
a new reference type like its vue internal.

```ts
export interface RefreshedRef<T = any> extends Ref<T> {
  // ...
}
```

The second one makes possible the compatibility of returned object and actual interface. The `Ref<T>`{lang=ts} type
is the most simple and lightweight so its fine to destruct it for our needs.

```ts
return {
  ...ref(),
  // ...
}
```

The third line provides a binding internal reference to a general computed reference. In contrast to previous solution
we doesn't expose our guts to public.

```ts []{4}
return {
  // ...
  get value() {
    const _ = internal.value
    return compute()
  },
  // ...
}
```

And the last one is the trigger that allows us to refresh value whenever we want.

```ts
return {
  // ...
  refresh() { internal.value += 1 },
  // ...
}
```

## Usage example

The current implementation can work with `any`{lang=ts} object and can be used as guard
for always freshed reference. That is because the refreshed reference not only allows
to get fresh value, but also track internal changes like the `computed` do!

 \:D

Let's take a look at synthetic example, that I already checked.

```ts
const source = ref(0)
const proxy = computed(() => source.value)
const mixed = refreshed(() => proxy.value)

console.log(mixed.value)
// 0

// Set increase source value leads to reference update!
source.value += 1

console.log(mixed.value)
// 1
```

And one more example, which is more abstract that previous but shows the using in places
where we want to have only fresh value.

```ts
const refTime = refreshed(() => new Date().toTimeString())

// Somewhere in the code later
refTime.refresh()
console.log('Now is the', refTime)
// Now is the 02:56:00 GMT+0300 (Moscow Standard Time)
```

To be honest it's not correct example with time, but the most important that we don't use any
watch and evaluate value only **when we really need**.

What I can say for my protection, that is I really like small utils \:D
