#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.join(__dirname, '..', 'app', 'components')

function addApiLinkToComponent(filePath, componentName) {
	const content = fs.readFileSync(filePath, 'utf8')
	
	// Check if it already has an API link
	if (content.includes('Full API:') || content.includes('See the full API:')) {
		return false
	}
	
	// Add Link import if missing
	let newContent = content
	if (!content.includes('import Link')) {
		newContent = newContent.replace(
			/import.*from.*['"]@\/components\/api-table['"]/,
			`$&\nimport Link from 'next/link'`
		)
		// Also check for relative imports
		if (newContent === content) {
			newContent = newContent.replace(
				/import.*from.*['"]\.\.\/\.\.\/components\/api-table['"]/,
				`$&\nimport Link from 'next/link'`
			)
		}
	}
	
	// Create the API link HTML
	const apiLink = `\n\n\t\t\t\t<div className="mt-8">
\t\t\t\t\t<p className="text-sm text-[var(--c-text-secondary)]">
\t\t\t\t\t\tFull API: <Link className="text-[var(--c-link)] hover:underline" href="/components/${componentName}/api">/components/${componentName}/api</Link>
\t\t\t\t\t</p>
\t\t\t\t</div>`
	
	// Add the API link before the closing divs
	const updatedContent = newContent.replace(
		/(\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*)$/,
		`${apiLink}$1`
	)
	
	// If no replacement was made, try different patterns
	if (updatedContent === newContent) {
		const updatedContent2 = newContent.replace(
			/(\s*<\/div>\s*<\/div>\s*<\/div>\s*)$/,
			`${apiLink}$1`
		)
		if (updatedContent2 !== newContent) {
			newContent = updatedContent2
		} else {
			const updatedContent3 = newContent.replace(
				/(\s*<\/div>\s*<\/div>\s*)$/,
				`${apiLink}$1`
			)
			if (updatedContent3 !== newContent) {
				newContent = updatedContent3
			} else {
				const updatedContent4 = newContent.replace(
					/(\s*<\/div>\s*)$/,
					`${apiLink}$1`
				)
				if (updatedContent4 !== newContent) {
					newContent = updatedContent4
				}
			}
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
				const updated = addApiLinkToComponent(pagePath, item)
				if (updated) {
					console.log(`✓ Added API link to ${item}`)
				} else {
					console.log(`- ${item} already has API link`)
				}
			}
		}
	}
}

console.log('Adding missing API links to component pages...')
processComponentPages(componentsDir)
console.log('Done!')
