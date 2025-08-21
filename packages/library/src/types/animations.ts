import type { Variants, Transition } from 'framer-motion'

/**
 * Button-specific animation variants
 * Use standard Framer Motion Variants type with semantic keys
 */
export type ButtonAnimationVariants = Variants

/**
 * Modal-specific animation variants
 */
export interface ModalAnimationVariants {
	backdrop?: Variants
	panel?: Variants
}

/**
 * Dropdown-specific animation variants
 * Use standard Framer Motion Variants type
 */
export type DropdownAnimationVariants = Variants

/**
 * Tooltip-specific animation variants
 */
export interface TooltipAnimationVariants {
	initial?: any
	animate?: any
	exit?: any
	transition?: Transition
}

/**
 * Predefined elegant animation presets
 */
export const AnimationPresets = {
	// Button presets
	button: {
		subtle: {
			idle: { scale: 1 },
			hover: { scale: 1.02 },
			tap: { scale: 0.98 }
		},
		
		bouncy: {
			idle: { scale: 1, rotate: 0 },
			hover: { 
				scale: 1.1, 
				rotate: 2,
				transition: { 
					type: "spring", 
					stiffness: 400, 
					damping: 10 
				}
			},
			tap: { 
				scale: 0.9, 
				rotate: -2,
				transition: { 
					type: "spring", 
					stiffness: 600, 
					damping: 15 
				}
			}
		},
		
		glow: {
			idle: { 
				scale: 1, 
				boxShadow: "0 0 0 rgba(59, 130, 246, 0)" 
			},
			hover: { 
				scale: 1.05, 
				boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
				transition: { duration: 0.3 }
			},
			tap: { scale: 0.95 }
		},
		
		lift: {
			idle: { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
			hover: { 
				y: -3, 
				boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
				transition: { type: "spring", stiffness: 300 }
			},
			tap: { y: 0 }
		} as ButtonAnimationVariants
	},
	
	// Tooltip presets
	tooltip: {
		fade: {
			initial: { opacity: 0, scale: 0.95 },
			animate: { opacity: 1, scale: 1 },
			exit: { opacity: 0, scale: 0.95 },
			transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
		},
		
		bouncy: {
			initial: { opacity: 0, y: 10, scale: 0.8 },
			animate: { opacity: 1, y: 0, scale: 1 },
			exit: { opacity: 0, y: -10, scale: 0.8 },
			transition: { 
				type: "spring", 
				bounce: 0.4, 
				duration: 0.6 
			}
		},
		
		slide: {
			initial: { opacity: 0, x: -20 },
			animate: { opacity: 1, x: 0 },
			exit: { opacity: 0, x: 20 },
			transition: { 
				type: "spring",
				stiffness: 300,
				damping: 30
			}
		} as TooltipAnimationVariants
	},
	
	// Modal presets
	modal: {
		elegant: {
			backdrop: {
				hidden: { opacity: 0 },
				visible: { opacity: 1 },
				exit: { opacity: 0 }
			},
			panel: {
				hidden: { 
					opacity: 0, 
					scale: 0.95, 
					y: -20 
				},
				visible: { 
					opacity: 1, 
					scale: 1, 
					y: 0,
					transition: {
						type: "spring",
						damping: 25,
						stiffness: 500
					}
				},
				exit: { 
					opacity: 0, 
					scale: 0.95, 
					y: -20,
					transition: { duration: 0.2 }
				}
			}
		},
		
		dramatic: {
			backdrop: {
				hidden: { opacity: 0 },
				visible: { opacity: 1 },
				exit: { opacity: 0 }
			},
			panel: {
				hidden: { 
					opacity: 0, 
					scale: 0.8, 
					rotateX: -15,
					y: -50
				},
				visible: { 
					opacity: 1, 
					scale: 1, 
					rotateX: 0,
					y: 0,
					transition: {
						type: "spring",
						damping: 20,
						stiffness: 300
					}
				},
				exit: { 
					opacity: 0, 
					scale: 0.8, 
					rotateX: 15,
					y: 50,
					transition: { duration: 0.3 }
				}
			}
		} as ModalAnimationVariants
	},
	
	// Dropdown presets
	dropdown: {
		subtle: {
			hidden: { opacity: 0, scale: 0.95, y: -10 },
			visible: { 
				opacity: 1, 
				scale: 1, 
				y: 0,
				transition: {
					type: "spring",
					damping: 20,
					stiffness: 300,
					duration: 0.2
				}
			},
			exit: { 
				opacity: 0, 
				scale: 0.95, 
				y: -5,
				transition: { duration: 0.15 }
			}
		}
	}
} as const
