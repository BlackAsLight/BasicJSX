// deno-lint-ignore-file no-explicit-any
declare global {
	namespace JSX {
		interface Element {
			type: string,
			props: Props,
			children: [ string | Tag ]
		}
		interface IntrinsicElements {
			[ elemName: string ]: Props
		}
		interface ElementClass {
			render: any
		}
	}
}

type None = undefined | null
export type Props = Record<string, string> | None
// export type Child = string | Tag
export type Tag = {
	type: string,
	props: Props,
	children: [ string | Tag ] | None
}
export type Component = (props: Props, ...tags: [string | Tag]) => Tag

export function x(typeOrComponent: string | Component, props: Props, ...children: [string | Tag]): Tag {
	if (typeof typeOrComponent !== 'string')
		return typeOrComponent(props, ...children)
	return {
		type: typeOrComponent,
		props: props,
		children: children.flat()
	} as Tag
}

export function y(_props: Props, ...children: [ string | Tag ]): [ string | Tag ] {
	return children
}

export function build<T extends HTMLElement>(tag: Tag): T {
	const parentElement = createElement(tag)

	if (tag.children) {
		let element = parentElement
		const pos = [ 0 ]
		let children: [ string | Tag ]
		do {
			{
				let tempTag = tag
				for (let i = pos.length - 1; 0 < i; --i)
					// We can be sure that children exist as we are traveling down a path we've previously been.
					tempTag = (tempTag.children as Tag[])[ pos[ i ] ]
				children = tempTag.children as [ string | Tag ]
			}

			while (pos[ 0 ] < children.length) {
				// If child is a string, append it.
				if (typeof children[ pos[ 0 ] ] === 'string')
					element.append(children[ pos[ 0 ]++ ] as string)
				else {
					// Else move down a scope into the children.
					element.append(createElement(children[ pos[ 0 ] ] as Tag))
					element = element.lastChild as HTMLElement
					children = (children[ pos[ 0 ] ] as Tag).children ?? ([] as any)
					pos.unshift(0)
				}
			}
			// Move up a scope as current scope has run out of children.
			element = element.parentElement as HTMLElement
			pos.shift()
			++pos[ 0 ]
		} while (pos.length && element)
	}

	return parentElement as T
}

function createElement(tag: Tag): HTMLElement {
	const element = document.createElement(tag.type)
	if (tag.props) {
		const props = Object.entries(tag.props)
		for (let i = 0; i < props.length; ++i)
			element.setAttribute(props[ i ][ 0 ], props[ i ][ 1 ])
	}
	return element
}
