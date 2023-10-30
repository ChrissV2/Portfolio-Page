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
let hamburgerBtn
let navMenu
let navMenuItems
let aboutmeTextBox
let contactInputs
let nameInput
let mailInput
let errorCount = 0
let errorMsgName
let errorMsgMail
let errorMsgTextArea
let contactFromBtn
let contactForm
let modal
let closeModalBtn

const main = () => {
	prepareDOMElements()
	prepareDOMEvents()
	checkUrlParameters()
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
	hamburgerBtn = document.querySelector('.nav__btn')
	navMenu = document.querySelector('.nav__menu')
	navMenuItems = document.querySelectorAll('.nav__menu-item')
	aboutmeTextBox = document.querySelector('.aboutme__textBox')
	contactInputs = document.querySelectorAll('.contact__form-input')
	nameInput = document.querySelector('.contact__form-input--name')
	mailInput = document.querySelector('.contact__form-input--mail')
	errorMsgName = document.querySelector('.contact__form-errorMsg--name')
	errorMsgMail = document.querySelector('.contact__form-errorMsg--mail')
	errorMsgTextArea = document.querySelector('.contact__form-errorMsg--message')
	contactFromBtn = document.querySelector('.contact__form-btn')
	contactForm = document.querySelector('.contact__form')
	modal = document.querySelector('.contact__modal')
	closeModalBtn = document.querySelector('.contact__modal-closeBtn')
}

const prepareDOMEvents = () => {
	body.addEventListener('click', handleContactAnimation)
	body.addEventListener('focus', handleContactAnimation)
	window.addEventListener('scroll', elementInViewport)
	portfolioCarousel.setControls()
	portfolioCarousel.useControls()
	portfolioCarousel.startAutoSlide()
	hamburgerBtn.addEventListener('click', handleNavAnimation)
	hamburgerBtn.addEventListener('click', () => {
		const currentState = hamburgerBtn.getAttribute('data-state')

		if (!currentState || currentState === 'closed') {
			hamburgerBtn.setAttribute('data-state', 'opened')
			hamburgerBtn.setAttribute('aria-expanded', 'true')
		} else {
			hamburgerBtn.setAttribute('data-state', 'closed')
			hamburgerBtn.setAttribute('aria-expanded', 'false')
		}
	})
	contactInputs.forEach(input => {
		input.addEventListener('focus', handleContactAnimation)
	})
	contactFormTextArea.addEventListener('focus', handleContactAnimation)
	contactFromBtn.addEventListener('click', countErrors)
	closeModalBtn.addEventListener('click', closeModal)
}

class Carousel {
	constructor(container, items, controls) {
		this.carouselContainer = container
		this.carouselControls = controls
		this.carouselArray = [...items]
		this.slideInterval = null
		this.slideDelay = 3000
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
			// this.carouselArray.push(this.carouselArray.shift())
			this.carouselArray.unshift(this.carouselArray.pop())
		} else {
			// this.carouselArray.unshift(this.carouselArray.pop())
			this.carouselArray.push(this.carouselArray.shift())
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
				this.stopAutoSlide()
			})
		})
	}

	startAutoSlide() {
		this.slideInterval = setInterval(() => {
			this.setCurrentState(this.carouselControls[0])
		}, this.slideDelay)
	}

	stopAutoSlide() {
		clearInterval(this.slideInterval)
	}
}

window.onpointermove = event => {
	const { clientX, clientY } = event

	if (innerWidth > 577) {
		if (scrollY <= 3100 && blob) {
			blob.animate(
				{
					left: `${clientX}px`,
					top: `${clientY + window.scrollY}px`,
				},
				{ duration: 3000, fill: 'forwards' }
			)
		}
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

		if (inputElement.value.trim() === '') {
			label.classList.remove('contact__form-label--moved')
		}
	})

	if (contactFormTextArea.value.trim() === '') {
		contactFormTextAreaLabel.classList.remove('contact__form-label--msgMoved')
	}
}

const handleNavAnimation = () => {
	navMenu.classList.toggle('nav__menu--active')
	body.classList.toggle('overflowHidden')
	navMenuItems.forEach(item => {
		item.addEventListener('click', () => {
			navMenu.classList.remove('nav__menu--active')
			hamburgerBtn.setAttribute('data-state', 'closed')
			hamburgerBtn.setAttribute('aria-expanded', 'false')
			body.classList.remove('overflowHidden')
		})
	})
}

const clearInputs = () => {
	nameInput.value = ''
	mailInput.value = ''
	contactFormTextArea.value = ''
}

const validateName = () => {
	if (nameInput.value === '') {
		errorMsgName.classList.add('contact__form-errorMsg--active')
		errorCount++
	} else {
		errorMsgName.classList.remove('contact__form-errorMsg--active')
	}
}

const validateMail = () => {
	const reg =
		/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,4})$/i

	if (reg.test(mailInput.value)) {
		errorMsgMail.classList.remove('contact__form-errorMsg--active')
	} else {
		errorMsgMail.classList.add('contact__form-errorMsg--active')
		errorCount++
	}
}

const validateTextArea = () => {
	if (contactFormTextArea.value === '') {
		errorMsgTextArea.classList.add('contact__form-errorMsg--active')
		errorCount++
	} else {
		errorMsgTextArea.classList.remove('contact__form-errorMsg--active')
	}
}

const countErrors = e => {
	e.preventDefault()

	validateName()
	validateMail()
	validateTextArea()

	if (errorCount !== 0) {
		errorCount = 0
	} else if (errorCount === 0) {
		contactForm.submit()
		clearInputs()
		errorCount = 0
	}
}

const checkUrlParameters = () => {
	if (document.location.search === '?mail_status=sent') {
		modal.classList.add('contact__modal--active')
		body.classList.add('overflowHidden')
	} else if (document.location.search === '?mail_status=error') {
		alert('Błąd wysyłania wiadomości')
		console.log('Błąd')
	}

	setTimeout(() => {
		const newUrl = window.location.pathname + window.location.search.replace('?mail_status=sent', '')
		window.history.replaceState({}, document.title, newUrl)
	}, 3000)
}

const closeModal = () => {
	modal.classList.remove('contact__modal--active')
	body.classList.remove('overflowHidden')
}

document.addEventListener('DOMContentLoaded', main)
