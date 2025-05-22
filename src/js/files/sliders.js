/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

// import "../../scss/base/swiper.scss";

function initSliders() {
	if (document.querySelector('.slider-block__slider')) { 
		new Swiper('.slider-block__slider', { 
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			//autoHeight: true,
			speed: 300,

			//touchRatio: 0,
			//simulateTouch: false,
			//loop: true,
			//preloadImages: false,
			//lazy: true,


			navigation: {
				prevEl: '.slider-block__body .swiper-button-prev',
				nextEl: '.slider-block__body .swiper-button-next',
			},
			// Брейкпоінти
			breakpoints: {
				320: {
					slidesPerView: 1,
					// spaceBetween: 10,
				},
				768: {
					slidesPerView: 2,
					// spaceBetween: 20,
				},
				992: {
					slidesPerView: 3,
					// spaceBetween: 20,
				},
			},
			// Події
			on: {

			}
		});
	}
	if (document.querySelector('.reviews__slider')) { 
		new Swiper('.reviews__slider', { 
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			//autoHeight: true,
			speed: 300,

			//touchRatio: 0,
			//simulateTouch: false,
			//loop: true,
			//preloadImages: false,
			//lazy: true,


			navigation: {
				prevEl: '.reviews__body .swiper-button-prev',
				nextEl: '.reviews__body .swiper-button-next',
			},
			// Брейкпоінти
			breakpoints: {
				320: {
					slidesPerView: 1.1,
					spaceBetween: 10,
					centeredSlides: true,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
					centeredSlides: true,
				},
				992: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
			},
			// Події
			on: {

			}
		});
	}
}


window.addEventListener("load", function (e) {
	initSliders();
});