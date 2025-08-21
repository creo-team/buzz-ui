#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.join(__dirname, '..', 'app', 'components')

// Component API definitions - these should match the actual component props
const componentApis = {
	accordion: [
		{ prop: "items", type: "AccordionItem[]", required: true, description: "Array of accordion items to display" },
		{ prop: "defaultOpen", type: "string[]", description: "Array of item keys that should be open by default" },
		{ prop: "allowMultiple", type: "boolean", default: "false", description: "Allow multiple items to be open simultaneously" },
		{ prop: "className", type: "string", description: "Additional CSS classes" }
	],
	skeleton: [
		{ prop: "className", type: "string", description: "Size/shape classes" }
	],
	// Add more component APIs as needed
}

function addApiTableAndLink(filePath, componentName) {
	const content = fs.readFileSync(filePath, 'utf8')
	let updated = false
	
	// Check if it already has an API table
	const hasApiTable = content.includes('ApiTable') || content.includes('<table')
	const hasApiLink = content.includes('Full API:') || content.includes('See the full API:')
	
	// Add imports if needed
	let newContent = content
	if (!content.includes('import { ApiTable }') && !hasApiTable) {
		newContent = newContent.replace(
			/import.*from.*['"]\.\.\/\.\.\/components\/code-block['"]/,
			`$&\nimport { ApiTable } from '../../../components/api-table'`
		)
	}
	
	if (!content.includes('import Link') && !hasApiLink) {
		newContent = newContent.replace(
			/import.*from.*['"]\.\.\/\.\.\/components\/code-block['"]/,
			`$&\nimport Link from 'next/link'`
		)
	}
	
	// Add API table if missing
	if (!hasApiTable && componentApis[componentName]) {
		const apiTable = `\n\n\t\t<h2 className="mt-12 text-2xl font-semibold text-[var(--c-text)]">API Reference</h2>
\t\t<ApiTable
\t\t\ttitle="${componentName.charAt(0).toUpperCase() + componentName.slice(1)} Props"
\t\t\tclassName="mt-4"
\t\t\trows={[
\t\t\t\t${componentApis[componentName].map(prop => `{
\t\t\t\t\tprop: "${prop.prop}",
\t\t\t\t\ttype: "${prop.type}",
\t\t\t\t\t${prop.required ? 'required: true,' : ''}
\t\t\t\t\t${prop.default ? `default: "${prop.default}",` : ''}
\t\t\t\t\tdescription: "${prop.description}"
\t\t\t\t}`).join(',\n\t\t\t\t\t')}
\t\t\t]}
\t\t/>`
		
		// Find the end of the main content and add the API table
		newContent = newContent.replace(
			/(\s*<\/div>\s*<\/div>\s*)$/,
			`${apiTable}$1`
		)
		
		// If no replacement was made, try a different pattern
		if (newContent === content) {
			newContent = newContent.replace(
				/(\s*<\/div>\s*)$/,
				`${apiTable}$1`
			)
		}
	}
	
	// Add API link if missing
	if (!hasApiLink) {
		const apiLink = `\n\n\t\t<div className="mt-8">
\t\t\t<p className="text-sm text-[var(--c-text-secondary)]">
\t\t\t\tFull API: <Link className="text-[var(--c-link)] hover:underline" href="/components/${componentName}/api">/components/${componentName}/api</Link>
\t\t\t</p>
\t\t</div>`
		
		// Add before the closing divs
		newContent = newContent.replace(
			/(\s*<\/div>\s*<\/div>\s*)$/,
			`${apiLink}$1`
		)
		
		// If no replacement was made, try a different pattern
		if (newContent === content) {
			newContent = newContent.replace(
				/(\s*<\/div>\s*)$/,
				`${apiLink}$1`
			)
		}
	}
	
	if (newContent !== content) {
		fs.writeFileSync(filePath, newContent)
		return true
	}
	
	return false
}

function processComponentPages(dir) {
	const items = fs.readdirSync(dir)
	
	for (const item of items) {
		const fullPath = path.join(dir, item)
		const stat = fs.statSync(fullPath)
		
		if (stat.isDirectory() && item !== '[slug]') {
			const pagePath = path.join(fullPath, 'page.tsx')
			if (fs.existsSync(pagePath)) {
				const updated = addApiTableAndLink(pagePath, item)
				if (updated) {
					console.log(`✓ Updated ${item}`)
				} else {
					console.log(`- ${item} already complete`)
				}
			}
		}
	}
}

console.log('Adding missing API tables and links to component pages...')
processComponentPages(componentsDir)
console.log('Done!')
