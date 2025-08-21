#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const componentsDir = path.join(__dirname, '..', 'app', 'components')

// List of components that still need API links
const componentsNeedingLinks = [
	'footer', 'infotip', 'forms', 'progress', 'toast', 'chip', 
	'enums-usage', 'command-palette', 'table', 'menu', 'code-box', 
	'avatar', 'sidebar-nav', 'modal', 'sheet', 'top-nav', 'banner'
]

function addApiLinkToComponent(componentName) {
	const pagePath = path.join(componentsDir, componentName, 'page.tsx')
	
	if (!fs.existsSync(pagePath)) {
		console.log(`⚠ ${componentName}: page.tsx not found`)
		return false
	}
	
	const content = fs.readFileSync(pagePath, 'utf8')
	
	// Check if it already has an API link
	if (content.includes('Full API:') || content.includes('See the full API:')) {
		console.log(`- ${componentName}: already has API link`)
		return false
	}
	
	// Add Link import if missing
	let newContent = content
	if (!content.includes('import Link')) {
		// Find the last import statement and add Link after it
		const importMatch = content.match(/(import.*from.*['"][^'"]*['"];?\s*)+/g)
		if (importMatch) {
			const lastImport = importMatch[importMatch.length - 1]
			const linkImport = '\nimport Link from \'next/link\''
			newContent = content.replace(lastImport, lastImport + linkImport)
		}
	}
	
	// Find the end of the component and add the API link
	// Look for the closing divs and add before them
	const apiLink = `\n\n\t\t<div className="mt-8">
\t\t\t<p className="text-sm text-[var(--c-text-secondary)]">
\t\t\t\tFull API: <Link className="text-[var(--c-link)] hover:underline" href="/components/${componentName}/api">/components/${componentName}/api</Link>
\t\t\t</p>
\t\t</div>`
	
	// Try to add before the final closing divs
	let updated = false
	const patterns = [
		/(\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*)$/,
		/(\s*<\/div>\s*<\/div>\s*<\/div>\s*)$/,
		/(\s*<\/div>\s*<\/div>\s*)$/,
		/(\s*<\/div>\s*)$/
	]
	
	for (const pattern of patterns) {
		const updatedContent = newContent.replace(pattern, `${apiLink}$1`)
		if (updatedContent !== newContent) {
			newContent = updatedContent
			updated = true
			break
		}
	}
	
	if (updated) {
		fs.writeFileSync(pagePath, newContent)
		console.log(`✓ Added API link to ${componentName}`)
		return true
	} else {
		console.log(`⚠ ${componentName}: couldn't find insertion point`)
		return false
	}
}

console.log('Adding API links to remaining component pages...')
console.log('Components needing links:', componentsNeedingLinks.join(', '))
console.log('')

let successCount = 0
for (const component of componentsNeedingLinks) {
	if (addApiLinkToComponent(component)) {
		successCount++
	}
}

console.log(`\n✅ Successfully added API links to ${successCount} components`)
console.log('Done!')
