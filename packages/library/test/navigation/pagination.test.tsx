import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Pagination } from '../../src/navigation/pagination'
import { describe, it, expect, vi } from 'vitest'

describe('Pagination', () => {
	it('renders numbered pages with aria-current on the active page', () => {
		render(<Pagination page={5} pageCount={10} onPageChange={() => {}} />)
		expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
		const active = screen.getByRole('button', { name: '5' })
		expect(active).toHaveAttribute('aria-current', 'page')
	})

	it('collapses distant pages into ellipses while keeping edges', () => {
		render(<Pagination page={5} pageCount={20} onPageChange={() => {}} />)
		expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: '15' })).not.toBeInTheDocument()
	})

	it('navigates with prev/next and clamps at the edges', () => {
		const onPageChange = vi.fn()
		render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />)
		expect(screen.getByLabelText('Previous page')).toBeDisabled()
		fireEvent.click(screen.getByLabelText('Next page'))
		expect(onPageChange).toHaveBeenCalledWith(2)
	})

	it('jumps directly to a clicked page', () => {
		const onPageChange = vi.fn()
		render(<Pagination page={1} pageCount={10} onPageChange={onPageChange} />)
		fireEvent.click(screen.getByRole('button', { name: '10' }))
		expect(onPageChange).toHaveBeenCalledWith(10)
	})

	it('supports compact mode', () => {
		render(<Pagination page={2} pageCount={9} compact onPageChange={() => {}} />)
		expect(screen.getByText('2 / 9')).toBeInTheDocument()
		expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument()
	})
})
