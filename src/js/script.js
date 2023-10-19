let blob
let photoContainer
let photos
let myElement
let bounding
let myElementHeight
let myElementWidth
let sliderContainer
let sliderItems
let sliderControlsContainer
let sliderControls
let body
let contactFormLabels
let contactFormTextArea
let contactFormTextAreaLabel
let label
let textAreaLabel
let portfolioCarousel

const main = () => {
	prepareDOMElements()
	prepareDOMEvents()
}

const prepareDOMElements = () => {
	blob = document.querySelector('.blob')
	photoContainer = document.querySelector('.aboutme__container')
	photos = document.querySelectorAll('.aboutme__container-photo')
	myElement = document.getElementById('aboutmePhoto')
	bounding = myElement.getBoundingClientRect()
	myElementHeight = myElement.offsetHeight - 400
	myElementWidth = myElement.offsetWidth
	sliderContainer = document.querySelector('.portfolio__list')
	sliderItems = document.querySelectorAll('.portfolio__list-item')
	sliderControlsContainer = document.querySelector('.portfolio__list-controls')
	sliderControls = ['previous', 'next']
	body = document.querySelector('body')
	contactFormLabels = document.querySelectorAll('.contact__form-label')
	contactFormTextArea = document.querySelector('.contact__form-textArea')
	contactFormTextAreaLabel = document.querySelector('.contact__form-label--msg')
	portfolioCarousel = new Carousel(sliderContainer, sliderItems, sliderControls)
}

const prepareDOMEvents = () => {
	body.addEventListener('click', handleContactAnimation)
	window.addEventListener('scroll', elementInViewport)
	portfolioCarousel.setControls()
	portfolioCarousel.useControls()
}

class Carousel {
	constructor(container, items, controls) {
		this.carouselContainer = container
		this.carouselControls = controls
		this.carouselArray = [...items]
	}

	updateGallery() {
		this.carouselArray.forEach(el => {
			el.classList.remove('portfolio__list-item--1')
			el.classList.remove('portfolio__list-item--2')
			el.classList.remove('portfolio__list-item--3')
		})

		this.carouselArray.slice(0, 3).forEach((el, i) => {
			el.classList.add(`portfolio__list-item--${i + 1}`)
		})
	}

	setCurrentState(direction) {
		if (direction.className == 'portfolio__list-controls-next') {
			// this.carouselArray.unshift(this.carouselArray.pop())
			this.carouselArray.push(this.carouselArray.shift())
		} else {
			// this.carouselArray.push(this.carouselArray.shift())
			this.carouselArray.unshift(this.carouselArray.pop())
		}
		this.updateGallery()
	}

	setControls() {
		this.carouselControls.forEach(control => {
			sliderControlsContainer.appendChild(
				document.createElement('button')
			).className = `portfolio__list-controls-${control}`
		})
	}

	useControls() {
		const triggers = [...sliderControlsContainer.childNodes]
		triggers.forEach(control => {
			control.addEventListener('click', e => {
				e.preventDefault()
				this.setCurrentState(control)
			})
		})
	}
}

window.onpointermove = event => {
	const { clientX, clientY } = event

	if (scrollY <= 3300 && blob) {
		blob.animate(
			{
				left: `${clientX}px`,
				top: `${clientY + window.scrollY}px`,
			},
			{ duration: 3000, fill: 'forwards' }
		)
	}
}

function elementInViewport() {
	const bounding = myElement.getBoundingClientRect()

	if (
		bounding.top >= -myElementHeight &&
		bounding.left >= -myElementWidth &&
		bounding.right <= (window.innerWidth || document.documentElement.clientWidth) + myElementWidth &&
		bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) + myElementHeight
	) {
		photoContainer.classList.add('aboutme__container-transformed')
		photos[0].classList.add('aboutme__container-photo-transformed--fourth')
		photos[1].classList.add('aboutme__container-photo-transformed--third')
		photos[2].classList.add('aboutme__container-photo-transformed--second')
		photos[3].classList.add('aboutme__container-photo-transformed--first')
	} else {
		photoContainer.classList.remove('aboutme__container-transformed')
		photos[0].classList.remove('aboutme__container-photo-transformed--fourth')
		photos[1].classList.remove('aboutme__container-photo-transformed--third')
		photos[2].classList.remove('aboutme__container-photo-transformed--second')
		photos[3].classList.remove('aboutme__container-photo-transformed--first')
	}
}

const handleContactAnimation = e => {
	if (e.target.matches('.contact__form-input')) {
		removeContactAnimation()
		label = e.target.closest('div').querySelector('.contact__form-label')
		label.classList.add('contact__form-label--moved')
	} else if (e.target.matches('.contact__form-textArea')) {
		removeContactAnimation()
		textAreaLabel = e.target.closest('div').querySelector('.contact__form-label')
		textAreaLabel.classList.add('contact__form-label--msgMoved')
	} else {
		removeContactAnimation()
	}
}

const removeContactAnimation = () => {
	contactFormLabels.forEach(label => {
		const inputId = label.getAttribute('for')
		const inputElement = document.getElementById(inputId)
		// console.log(inputId);
		// console.log(inputElement);

		if (inputElement.value.trim() === '') {
			label.classList.remove('contact__form-label--moved')
		}
	})

	if (contactFormTextArea.value.trim() === '') {
		contactFormTextAreaLabel.classList.remove('contact__form-label--msgMoved')
	}
}

const button = document.querySelector('.nav__btn')

button.addEventListener('click', () => {
	const currentState = button.getAttribute('data-state')

	if (!currentState || currentState === 'closed') {
		button.setAttribute('data-state', 'opened')
		button.setAttribute('aria-expanded', 'true')
	} else {
		button.setAttribute('data-state', 'closed')
		button.setAttribute('aria-expanded', 'false')
	}
})

document.addEventListener('DOMContentLoaded', main)
