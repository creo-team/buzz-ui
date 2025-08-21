import { render, screen } from './setup'
import React from 'react'
import { Card } from '../src/cards/card'

describe('Card', () => {
	it('renders header and children', () => {
		render(<Card header="Header"><div>Body</div></Card>)
		expect(screen.getByText('Header')).toBeInTheDocument()
		expect(screen.getByText('Body')).toBeInTheDocument()
	})
})


