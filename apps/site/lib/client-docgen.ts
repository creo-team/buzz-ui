import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

// Client-side docgen that can work in real-time
export function parseComponentFromSource(sourceCode: string, componentName?: string) {
	try {
		// Parse the TypeScript/JSX code
		const ast = parse(sourceCode, {
			sourceType: 'module',
			plugins: ['typescript', 'jsx', 'decorators-legacy']
		})

		const components: any[] = []

		// Traverse the AST to find React components
		traverse(ast, {
			ExportNamedDeclaration(path) {
				const declaration = path.node.declaration
				if (t.isVariableDeclaration(declaration)) {
					declaration.declarations.forEach(declarator => {
						if (t.isVariableDeclarator(declarator) && t.isIdentifier(declarator.id)) {
							const name = declarator.id.name
							if (componentName && name !== componentName) return
							
							if (t.isCallExpression(declarator.init) && 
								t.isIdentifier(declarator.init.callee) && 
								declarator.init.callee.name === 'forwardRef') {
								// Handle forwardRef components
								const args = declarator.init.arguments
								if (args.length >= 2 && t.isFunction(args[0])) {
									const func = args[0]
									if (t.isFunction(func)) {
										const props = extractPropsFromFunction(func)
										components.push({
											displayName: name,
											props: props,
											description: extractDescription(func)
										})
									}
								}
							} else if (t.isFunctionDeclaration(declarator.init) || t.isArrowFunctionExpression(declarator.init)) {
								// Handle regular function components
								const props = extractPropsFromFunction(declarator.init)
								components.push({
									displayName: name,
									props: props,
									description: extractDescription(declarator.init)
								})
							}
						}
					})
				} else if (t.isFunctionDeclaration(declaration)) {
					const name = declaration.id?.name
					if (componentName && name !== componentName) return
					
					const props = extractPropsFromFunction(declaration)
					components.push({
						displayName: name || 'Anonymous',
						props: props,
						description: extractDescription(declaration)
					})
				}
			},
			ExportDefaultDeclaration(path) {
				const declaration = path.node.declaration
				if (t.isIdentifier(declaration)) {
					// Handle default exports
					const name = declaration.name
					if (componentName && name !== componentName) return
					
					// Look for the actual component definition
					const binding = path.scope.getBinding(name)
					if (binding && binding.path.node) {
						const node = binding.path.node
						if (t.isVariableDeclarator(node) && t.isIdentifier(node.id)) {
							if (t.isCallExpression(node.init) && 
								t.isIdentifier(node.init.callee) && 
								node.init.callee.name === 'forwardRef') {
								const args = node.init.arguments
								if (args.length >= 2 && t.isFunction(args[0])) {
									const func = args[0]
									const props = extractPropsFromFunction(func)
									components.push({
										displayName: name,
										props: props,
										description: extractDescription(func)
									})
								}
							}
						}
					}
				}
			}
		})

		return components
	} catch (error) {
		console.warn('Failed to parse component source:', error)
		return []
	}
}

function extractPropsFromFunction(func: t.Function): Record<string, any> {
	const props: Record<string, any> = {}
	
	// Extract props from function parameters
	if (func.params.length > 0) {
		const firstParam = func.params[0]
		if (t.isIdentifier(firstParam) && firstParam.name === 'props') {
			// Simple props parameter
			props['children'] = {
				type: { name: 'ReactNode' },
				required: false,
				description: 'Child elements'
			}
		} else if (t.isObjectPattern(firstParam)) {
			// Destructured props
			firstParam.properties.forEach(prop => {
				if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
					const key = prop.key.name
					const value = prop.value
					
					if (t.isIdentifier(value)) {
						props[key] = {
							type: { name: value.name },
							required: !prop.optional,
							description: ''
						}
					} else if (t.isTSTypeAnnotation(value) && t.isTSTypeReference(value.typeAnnotation)) {
						props[key] = {
							type: { name: value.typeAnnotation.typeName.name },
							required: !prop.optional,
							description: ''
						}
					}
				}
			})
		}
	}
	
	return props
}

function extractDescription(func: t.Function): string {
	// Look for JSDoc comments above the function
	if (func.leadingComments) {
		for (const comment of func.leadingComments) {
			if (comment.type === 'CommentBlock' && comment.value.trim().startsWith('*')) {
				return comment.value.replace(/^\s*\*\s*/gm, '').trim()
			}
		}
	}
	return ''
}

// Helper to get component source code (this would be your component source)
export async function getComponentSource(slug: string): Promise<string> {
	// In a real implementation, you'd fetch this from your component source
	// For now, return a placeholder
	return `
import React from 'react'

interface ${slug.charAt(0).toUpperCase() + slug.slice(1)}Props {
	children?: React.ReactNode
	className?: string
}

export const ${slug.charAt(0).toUpperCase() + slug.slice(1)} = React.forwardRef<HTMLDivElement, ${slug.charAt(0).toUpperCase() + slug.slice(1)}Props>(
	({ children, className, ...props }, ref) => {
		return (
			<div ref={ref} className={className} {...props}>
				{children}
			</div>
		)
	}
)

${slug.charAt(0).toUpperCase() + slug.slice(1)}.displayName = '${slug.charAt(0).toUpperCase() + slug.slice(1)}'
`
}
