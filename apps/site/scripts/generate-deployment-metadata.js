import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Generate deployment metadata
const metadata = {
	deploymentTime: new Date().toISOString(),
	buildId: process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || 'local',
	environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
}

// Write to deployment-metadata.json
const outputPath = path.join(__dirname, '..', 'deployment-metadata.json')
fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2))

console.log('Generated deployment metadata:', metadata)
