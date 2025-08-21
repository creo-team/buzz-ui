// Force dynamic rendering to avoid styled-jsx context issues during prerendering
export const dynamic = 'force-dynamic'

export default function NotFound() {
	return (
		<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<div style={{ textAlign: 'center' }}>
				<h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
				<p style={{ marginBottom: '1.5rem' }}>This page could not be found.</p>
				<a 
					href="/" 
					style={{ 
						display: 'inline-flex', 
						alignItems: 'center', 
						justifyContent: 'center', 
						padding: '0.5rem 1rem', 
						backgroundColor: '#3b82f6', 
						color: 'white', 
						borderRadius: '0.5rem', 
						textDecoration: 'none' 
					}}
				>
					Go Home
				</a>
			</div>
		</div>
	)
}
