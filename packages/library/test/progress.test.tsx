import React from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from '../src/feedback/progress'
import { CircularProgress } from '../src/feedback/circular-progress'

describe('Progress', () => {
	it('renders basic progress bar', () => {
		render(<Progress value={50} />)
		const progressBar = screen.getByRole('progressbar')
		expect(progressBar).toBeInTheDocument()
		expect(progressBar).toHaveAttribute('aria-valuenow', '50')
		expect(progressBar).toHaveAttribute('aria-valuemin', '0')
		expect(progressBar).toHaveAttribute('aria-valuemax', '100')
	})

	it('renders with label', () => {
		render(<Progress value={75} showLabel label="Loading files" />)
		expect(screen.getByText('Loading files')).toBeInTheDocument()
		expect(screen.getByText('75%')).toBeInTheDocument()
	})

	it('clamps values to 0-100 range', () => {
		const { rerender } = render(<Progress value={150} />)
		let progressBar = screen.getByRole('progressbar')
		expect(progressBar).toHaveAttribute('aria-valuenow', '100')
		
		rerender(<Progress value={-50} />)
		progressBar = screen.getByRole('progressbar')
		expect(progressBar).toHaveAttribute('aria-valuenow', '0')
	})

	it('applies size styling hooks correctly', () => {
		const { rerender } = render(<Progress value={50} size="xs" />)
		expect(screen.getByRole('progressbar').closest('.bz-progress')).toHaveAttribute('data-size', 'xs')
		
		rerender(<Progress value={50} size="xl" />)
		expect(screen.getByRole('progressbar').closest('.bz-progress')).toHaveAttribute('data-size', 'xl')
	})

	it('applies variant styling hooks correctly', () => {
		const { rerender } = render(<Progress value={50} variant="success" />)
		let bar = screen.getByRole('progressbar').querySelector('.bz-progress__bar')
		expect(bar).toHaveAttribute('data-variant', 'success')
		
		rerender(<Progress value={50} variant="danger" />)
		bar = screen.getByRole('progressbar').querySelector('.bz-progress__bar')
		expect(bar).toHaveAttribute('data-variant', 'danger')
	})

	it('renders indeterminate state', () => {
		render(<Progress indeterminate />)
		const progressBar = screen.getByRole('progressbar')
		expect(progressBar).not.toHaveAttribute('aria-valuenow')
		expect(progressBar.querySelector('.bz-progress__bar')).toHaveAttribute('data-indeterminate')
	})

	it('applies striped styling hook when striped prop is true', () => {
		render(<Progress value={50} striped />)
		const progressBar = screen.getByRole('progressbar')
		expect(progressBar.querySelector('.bz-progress__bar')).toHaveAttribute('data-striped')
	})
})

describe('CircularProgress', () => {
	it('renders circular progress indicator', () => {
		render(<CircularProgress value={60} />)
		const svg = document.querySelector('svg')
		expect(svg).toBeInTheDocument()
		expect(svg).toHaveAttribute('width', '48')
		expect(svg).toHaveAttribute('height', '48')
	})

	it('displays percentage label when showLabel is true', () => {
		render(<CircularProgress value={75} showLabel />)
		expect(screen.getByText('75%')).toBeInTheDocument()
	})

	it('applies custom size', () => {
		render(<CircularProgress value={50} size={80} />)
		const svg = document.querySelector('svg')
		expect(svg).toHaveAttribute('width', '80')
		expect(svg).toHaveAttribute('height', '80')
	})

	it('applies variant styling hooks', () => {
		render(<CircularProgress value={50} variant="success" />)
		const circles = document.querySelectorAll('circle')
		// Second circle is the progress circle
		expect(circles[1]).toHaveAttribute('data-variant', 'success')
	})

	it('handles indeterminate state with spinning animation', () => {
		render(<CircularProgress indeterminate />)
		const svg = document.querySelector('svg')
		expect(svg).toHaveAttribute('data-indeterminate')
	})

	it('clamps values to 0-100 range', () => {
		const { rerender } = render(<CircularProgress value={150} showLabel />)
		expect(screen.getByText('100%')).toBeInTheDocument()
		
		rerender(<CircularProgress value={-50} showLabel />)
		expect(screen.getByText('0%')).toBeInTheDocument()
	})
})
