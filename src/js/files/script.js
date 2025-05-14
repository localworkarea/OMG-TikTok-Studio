// Підключення функціоналу 
import { isMobile,_slideToggle, _slideUp, _slideDown, menuOpen, menuClose, bodyLockStatus, bodyLockToggle} from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

document.addEventListener("DOMContentLoaded", () => {
  const mediaQuery992max = window.matchMedia('(max-width: 62.061em)');
  const menuBody = document.querySelector('.menu__body');
  const menuIcon = document.querySelector('.icon-menu');
  const menuItemsWithSublist = document.querySelectorAll('.menu__item.has-sublist');
 
	const navFooterSublists = document.querySelectorAll('.nav-footer__item--sublist');

	navFooterSublists.forEach(sublist => {
		const navFooterLink = sublist.querySelector('.nav-footer__link');

		if (navFooterLink) {
			navFooterLink.addEventListener('click', function (e) {
				e.preventDefault();
			});
		}
	});

  function handleMenuVisibility() {
		// // sublist footer
		// if (navFooterSublist) { 
		// 		navFooterSublist.forEach(item => {
  	// 		const sublist = item.querySelector('.nav-footer__sublist');
  	// 		if (sublist && !sublist.hidden) {
  	// 			_slideUp(sublist, 0);
  	// 			item.classList.remove('_open');
  	// 		}
  	// 	});
		// }
		// menu__sublist + media
  	if (mediaQuery992max.matches) {
  		menuItemsWithSublist.forEach(item => {
  			const sublist = item.querySelector('.menu__sublist');
  			if (sublist && !sublist.hidden) {
  				_slideUp(sublist, 0);
  				item.classList.remove('_open');
  			}
  		});
      if (menuBody && !menuBody.hidden) {
  				_slideUp(menuBody, 0);
  		}
  	} else {
	    	if (menuBody && menuBody.hasAttribute('hidden')) {
	    		menuBody.removeAttribute('hidden');
	    	}
	    	menuItemsWithSublist.forEach(item => {
	    		const sublist = item.querySelector('.menu__sublist');
	    		if (sublist && sublist.hasAttribute('hidden')) {
	    			sublist.removeAttribute('hidden');
	    		}
	    	});
         if (bodyLockStatus) {
          menuClose();
         }
	    }
  }

  // Назначаем обработчик клика
  function setupMenuToggle() {
  	menuItemsWithSublist.forEach(item => {
  		const link = item.querySelector('.menu__link');
  		const sublist = item.querySelector('.menu__sublist');

  		if (link && sublist) {
  			link.addEventListener('click', e => {
					e.preventDefault();
  				if (mediaQuery992max.matches) {

  					if (sublist.hidden) {
  						_slideDown(sublist, 300);
  						item.classList.add('_open');
  					} else {
  						_slideUp(sublist, 300);
  						item.classList.remove('_open');
  					}
  				}
  			});
  		}
  	});
  	// navFooterSublist.forEach(item => {
  	// 	const link = item.querySelector('.nav-footer__link');
  	// 	const sublist = item.querySelector('.nav-footer__sublist');

  	// 	if (link && sublist) {
  	// 		link.addEventListener('click', e => {
  	// 				e.preventDefault();

  	// 				if (sublist.hidden) {
  	// 					_slideDown(sublist, 300);
  	// 					item.classList.add('_open');
  	// 				} else {
  	// 					_slideUp(sublist, 300);
  	// 					item.classList.remove('_open');
  	// 				}
  	// 		});
  	// 	}
  	// });
  }

  function toggleMobilemenuBody() {
	  menuIcon.addEventListener('click', e => {
  		if (mediaQuery992max.matches) {
  			e.preventDefault()
        if (bodyLockStatus && e.target.closest('.icon-menu')) {
          bodyLockToggle();
          document.documentElement.classList.toggle("menu-open");
          if (menuBody.hidden) {
            _slideDown(menuBody, 300);
          } else {
            _slideUp(menuBody, 300);
            setTimeout(() => {
              handleMenuVisibility();
            }, 300);
          }
        }
  		}
  	});
  }

  handleMenuVisibility();
  setupMenuToggle();
  toggleMobilemenuBody();
  mediaQuery992max.addEventListener('change', handleMenuVisibility);




});