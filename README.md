# BasicJSX

Basic custom JSX functions so one can create HTML code without needing a react or similar library/framework. Because sometimes you want to create HTML in JavaScript without implementing a library or framework.

## Usage: Web

### deno.json

```json
{
	"compilerOptions": {
		"jsxFactory": "x",
		"jsxFragmentFactory": "y",
		"lib": [
			"ESNext",
			"dom"
		]
	}
}
```

### main.tsx

```tsx
import { build, Props, Tag, x } from 'https://deno.land/x/basic_jsx@v3.0.1/mod.tsx'

console.log(build(<div>
  <h1>Hello</h1>
</div>).outerHTML)

// You'll need to accept and pass the props and children here if you plan to allow this component to accept those stuff in use. If you don't then any provided will be created and voided.
function App(props: Props, ...tags: Tag[]) {
	return <main { ...props }>{ tags }</main>
}

console.log(build(<App class='potato'>
  <h1>Hello</h1>
</App>).outerHTML)

// Alternatively, you can create components like this for them to accept different things.
function User(name: string) {
  return <h1>{name}</h1>
}

console.log(build(<App>
  { User('BlackAsLight') }
</App>).outerHTML)
```

The available types used in this module.
```ts
type None = undefined | null
export type Props = Record<string, string> | None
export type Tag = {
	type: string,
	props: Props,
	children: [ string | Tag ] | None
}
export type Component = (props: Props, ...tags: [string | Tag]) => Tag
```

## Usage: Deno

If you'd like to use this inside Deno and not bundling for the web, then you'll need to define the global document variable for the above to work.

### Example

```tsx
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.32-alpha/deno-dom-wasm.ts'

// deno-lint-ignore no-explicit-any
globalThis.document = new DOMParser().parseFromString('<!DOCTYPE><html lang="en"><head></head><body></body></html>', 'text/html') as any
```
