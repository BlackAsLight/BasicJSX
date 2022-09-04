// deno-lint-ignore-file no-explicit-any
declare global {
	namespace JSX {
		interface IntrinsicElements {
			[ elemName: string ]: any
		}
		interface ElementClass {
			render: any
		}
	}
}

export type Props = Record<string, string> | null
type Child = string | HTMLElement | undefined | Promise<string | HTMLElement | undefined>
export type Children = [ Child | Child[] ]
export function x<T extends HTMLElement>(typeOrFunc: string | ((props: Props, ...children: Children) => T), props: Props = null, ...children: Children) {
	if (typeof typeOrFunc !== 'string')
		return typeOrFunc(props, ...children)

	const parentTag = document.createElement(typeOrFunc) as T
	if (props)
		Object.entries(props).forEach(([ key, value ]) => parentTag.setAttribute(key, value))
	children.flat().forEach(async child => {
		if (child == undefined)
			return
		if (child.toString() !== '[object Promise]')
			return parentTag.append(child as string | HTMLElement)
		const divTag = <div /> as HTMLDivElement
		parentTag.append(divTag)
		child = await child
		if (child != undefined && divTag.parentElement)
			divTag.parentElement.insertBefore(typeof child === 'string' ? document.createTextNode(child) : child, divTag)
		divTag.remove()
	})
	return parentTag
}

export function y(_props: Props, ...children: Children) {
	return children
}
