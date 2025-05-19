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



	// Lazy Load для iframe, video, img... ==============================

	const lazyElements = document.querySelectorAll("[data-lazy]");

	if (!("IntersectionObserver" in window)) {
	  lazyElements.forEach(el => loadLazyElement(el));
	  return;
	}

	const observerMap = new Map();

	lazyElements.forEach(originalEl => {
	  const el = originalEl.tagName === "SOURCE" ? originalEl.parentElement : originalEl;

	  const marginValue = originalEl.getAttribute("data-lazy") || "200";
	  const rootMargin = `${marginValue}px`;

	  if (!observerMap.has(rootMargin)) {
	    const observer = new IntersectionObserver((entries, obs) => {
	      entries.forEach(entry => {
	        if (entry.isIntersecting) {
	          loadLazyElement(entry.target);
	          obs.unobserve(entry.target);
	        }
	      });
	    }, {
	      rootMargin,
	      threshold: 0,
	    });

	    observerMap.set(rootMargin, observer);
	  }

	  observerMap.get(rootMargin).observe(el);
	});

	function loadLazyElement(el) {
	  if (!el) return;

	  if (el.hasAttribute("data-src")) {
	    el.setAttribute("src", el.getAttribute("data-src"));
	    el.removeAttribute("data-src");
	    el.removeAttribute("data-lazy");
	    return;
	  }

	  const sources = el.querySelectorAll("source[data-src]");
	  if (sources.length > 0) {
	    sources.forEach(source => {
	      source.setAttribute("src", source.getAttribute("data-src"));
	      source.removeAttribute("data-src");
	      source.removeAttribute("data-lazy");
	    });

	    el.load();

	    el.play?.().catch(() => {});
	  }

	  if (el.hasAttribute("data-lazy")) {
	    el.removeAttribute("data-lazy");
	  }
	}


	// ==============================================

	// File choose from device (Form) ===============================
	const fileInputs = document.querySelectorAll(".input-file");

	fileInputs.forEach(input => {
	  const label = input.closest(".file-input__label");
	  const labelText = label.querySelector(".input-file-att");
	  const removeBtn = label.querySelector(".file-input__remove");
	
	  input.addEventListener("change", () => {
	    if (input.files.length > 0) {
	      const file = input.files[0];
	      labelText.textContent = file.name;
	      label.classList.add("_file-attached");
	    } else {
	      labelText.textContent = "";
	      label.classList.remove("_file-attached");
	    }
	  });
	
	  removeBtn.addEventListener("click", (e) => {
	    e.preventDefault();
	    input.value = ""; // сбрасываем выбранный файл
	    labelText.textContent = "";
	    label.classList.remove("_file-attached");
	  });
	});

	// =======================================

	// == Вычисление длинны/ширины stroke для анимации
	document.querySelectorAll('.svg-arrow').forEach(svg => {
		const paths = svg.querySelectorAll('path');
		paths.forEach(path => {
			const length = path.getTotalLength();
			path.style.setProperty('--dasharray', length);
			path.style.setProperty('--dashoffset', length);
			path.style.strokeDasharray = length;
			path.style.strokeDashoffset = length;
		});
	});
	// ====================


});



// Ticker =================================

  const tickers = document.querySelectorAll("[data-ticker]");
if (tickers.length > 0) {
  tickers.forEach(ticker => {
    // Получаем скорость и направление из атрибутов data-ticker-speed и data-ticker-dir
    const speed = ticker.getAttribute("data-ticker-speed") || 80;
    const direction = ticker.getAttribute("data-ticker-dir") || "rtl";

    // Берем первый дочерний элемент тикера
    const firstChild = ticker.firstElementChild;
    if (firstChild) {
      // Клонируем первый элемент
      const clone = firstChild.cloneNode(true);

      // Предзагрузка всех изображений в клонированном элементе
      const images = clone.querySelectorAll("img");
      const promises = Array.from(images).map(img => {
        return new Promise(resolve => {
          const preloader = new Image();
          preloader.src = img.src;
          preloader.onload = resolve;
          preloader.onerror = resolve; // Разрешаем, даже если возникла ошибка загрузки
        });
      });

      // После предзагрузки изображений добавляем клонированный элемент и запускаем анимацию
      Promise.all(promises).then(() => {
        ticker.appendChild(clone);

        // Устанавливаем анимацию для всех дочерних элементов тикера
        Array.from(ticker.children).forEach(child => {
          const animationName = direction === "rtl" ? "scroll" : "scroll-rev";
          child.style.animation = `${animationName} ${speed}s linear infinite`;
        });
      });
    }
  });
}

// ====================================================

