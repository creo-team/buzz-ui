#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const componentsDir = path.join(process.cwd(), 'app', 'components')

function addApiLinkToComponent(filePath: string) {
	const content = fs.readFileSync(filePath, 'utf8')
	
	// Check if it already has an API link
	if (content.includes('Full API:') || content.includes('See the full API:')) {
		return false
	}
	
	// Extract component name from path
	const componentName = path.basename(path.dirname(filePath))
	
	// Create the API link HTML
	const apiLink = `\n\t\t<div className="mt-8">
\t\t\t<p className="text-sm text-[var(--c-text-secondary)]">
\t\t\t\tFull API: <Link className="text-[var(--c-link)] hover:underline" href="/components/${componentName}/api">/components/${componentName}/api</Link>
\t\t\t</p>
\t\t</div>`
	
	// Add the API link before the closing div
	const updatedContent = content.replace(
		/(\s*<\/div>\s*<\/div>\s*)$/,
		`${apiLink}$1`
	)
	
	// If no replacement was made, try a different pattern
	if (updatedContent === content) {
		const updatedContent2 = content.replace(
			/(\s*<\/div>\s*)$/,
			`${apiLink}$1`
		)
		if (updatedContent2 !== content) {
			fs.writeFileSync(filePath, updatedContent2)
			return true
		}
		return false
	}
	
	fs.writeFileSync(filePath, updatedContent)
	return true
}

function processComponentPages(dir: string) {
	const items = fs.readdirSync(dir)
	
	for (const item of items) {
		const fullPath = path.join(dir, item)
		const stat = fs.statSync(fullPath)
		
		if (stat.isDirectory() && item !== '[slug]') {
			const pagePath = path.join(fullPath, 'page.tsx')
			if (fs.existsSync(pagePath)) {
				const updated = addApiLinkToComponent(pagePath)
				if (updated) {
					console.log(`✓ Added API link to ${item}`)
				} else {
					console.log(`- ${item} already has API link`)
				}
			}
		}
	}
}

console.log('Adding API links to component pages...')
processComponentPages(componentsDir)
console.log('Done!')
