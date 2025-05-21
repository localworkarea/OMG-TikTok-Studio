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

	// const lazyElements = document.querySelectorAll("[data-lazy]");

	// if (!("IntersectionObserver" in window)) {
	//   lazyElements.forEach(el => loadLazyElement(el));
	//   return;
	// }

	// const observerMap = new Map();

	// lazyElements.forEach(originalEl => {
	//   const el = originalEl.tagName === "SOURCE" ? originalEl.parentElement : originalEl;

	//   const marginValue = originalEl.getAttribute("data-lazy") || "200";
	//   const rootMargin = `${marginValue}px`;

	//   if (!observerMap.has(rootMargin)) {
	//     const observer = new IntersectionObserver((entries, obs) => {
	//       entries.forEach(entry => {
	//         if (entry.isIntersecting) {
	//           loadLazyElement(entry.target);
	//           obs.unobserve(entry.target);
	//         }
	//       });
	//     }, {
	//       rootMargin,
	//       threshold: 0,
	//     });

	//     observerMap.set(rootMargin, observer);
	//   }

	//   observerMap.get(rootMargin).observe(el);
	// });

	// function loadLazyElement(el) {
	//   if (!el) return;

	//   if (el.hasAttribute("data-src")) {
	//     el.setAttribute("src", el.getAttribute("data-src"));
	//     el.removeAttribute("data-src");
	//     el.removeAttribute("data-lazy");
	//     return;
	//   }

	//   const sources = el.querySelectorAll("source[data-src]");
	//   if (sources.length > 0) {
	//     sources.forEach(source => {
	//       source.setAttribute("src", source.getAttribute("data-src"));
	//       source.removeAttribute("data-src");
	//       source.removeAttribute("data-lazy");
	//     });

	//     el.load();

	//     el.play?.().catch(() => {});
	//   }

	//   if (el.hasAttribute("data-lazy")) {
	//     el.removeAttribute("data-lazy");
	//   }
	// }



	// Учитывает уже загруженные элементы, добавляет data-lazy-id чтобы учитывать уже кешированные элементы, 
	// 
	const lazyElements = document.querySelectorAll("[data-lazy]");
	let lazyIdCounter = 0;

	const observerMap = new Map();

	lazyElements.forEach(originalEl => {
	  assignLazyIdIfMissing(originalEl);

	  const el = originalEl.tagName === "SOURCE" ? originalEl.parentElement : originalEl;
	  const marginValue = originalEl.getAttribute("data-lazy") || "200";
	  const rootMargin = `${marginValue}px`;
	  const lazyId = originalEl.getAttribute("data-lazy-id");

	  if (shouldSkipLazyLoad(el, lazyId)) {
	    loadLazyElement(el, lazyId);
	    return;
	  }

	  if (!observerMap.has(rootMargin)) {
	    const observer = new IntersectionObserver((entries, obs) => {
	      entries.forEach(entry => {
	        if (entry.isIntersecting) {
	          const targetEl = entry.target;
	          const targetId = targetEl.getAttribute("data-lazy-id");
	          loadLazyElement(targetEl, targetId);
	          obs.unobserve(targetEl);
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

	// --- Helpers ---

	function assignLazyIdIfMissing(el) {
	  if (!el.hasAttribute("data-lazy-id")) {
	    el.setAttribute("data-lazy-id", `lazy-${lazyIdCounter++}`);
	  }
	}

	function maybeLoadImmediately(el) {
	  const lazyId = el.getAttribute("data-lazy-id");
	  if (shouldSkipLazyLoad(el, lazyId)) {
	    loadLazyElement(el, lazyId);
	  }
	}

	function shouldSkipLazyLoad(el, lazyId) {
	  if (lazyId && sessionStorage.getItem(`lazy-${lazyId}`)) {
	    return true;
	  }

	  if (el.tagName === "IMG" && el.complete && el.getAttribute("data-src")) {
	    return true;
	  }

	  return false;
	}

	function loadLazyElement(el, lazyId = null) {
	  if (!el) return;

	  if (lazyId) {
	    sessionStorage.setItem(`lazy-${lazyId}`, "1");
	  }

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

	    el.load?.();
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


	// == Подсчет четного количества элементов, если четное то выводим класс _items-even =
	const listEmoji = document.querySelector(".list-emoji__list");
	if (!listEmoji) return;

	const itemsEmojji = listEmoji.querySelectorAll(".list-emoji__item");
	const itemsCount = itemsEmojji.length;

	// Если общее количество чётное — добавляем класс списку
	if (itemsCount % 2 === 0) {
	  listEmoji.classList.add("_items-even");

	  // И отдельно отмечаем последний элемент как чётный
	  const lastItem = itemsEmojji[itemsCount - 1];
	  lastItem.classList.add("_even-last");
	}
	// =======================


	// Открытие/закрытие контента карточек 	.article-cases ==================
	const articlesCases = document.querySelectorAll('.article-cases');
	if (articlesCases.length > 0) {
		articlesCases.forEach(article => {
			// Hover
			article.addEventListener('mouseenter', () => {
				article.classList.add('_open');
			});
			article.addEventListener('mouseleave', () => {
				article.classList.remove('_open');
			});
	
			// Click — toggle _open
			article.addEventListener('click', (e) => {
				if (e.target.closest('a')) return;
				// e.stopPropagation(); // предотвращаем всплытие до document
				closeAllArticlesExcept(article);
				article.classList.toggle('_open');
			});
		});
	
		// Закрываем все открытые статьи, кроме переданной
		function closeAllArticlesExcept(current) {
			articlesCases.forEach(article => {
				if (article !== current) {
					article.classList.remove('_open');
				}
			});
		}
	
		// Глобальный клик — закрываем, если клик вне article
		document.addEventListener('click', (e) => {
			articlesCases.forEach(article => {
				if (!article.contains(e.target)) {
					article.classList.remove('_open');
				}
			});
		});
	}
	// ==============================================================

	
});

let inputmaskLoaded = false;

document.addEventListener("focusin", async function (event) {
  const input = event.target;

  if (input.hasAttribute("data-mask") && !input.dataset.masked) {
    if (!inputmaskLoaded) {
      try {
        await loadInputMask();
        inputmaskLoaded = true;
      } catch (e) {
        console.error("Не удалось загрузить Inputmask:", e);
        return;
      }
    }

    // Получаем язык документа
    const lang = document.documentElement.lang;

    // Выбираем маску в зависимости от языка
    const mask = (lang === "uk" || lang === "ru") 
      ? "+38 (999) 99 99"
      : "+99 999 99 99";

    Inputmask({
      mask: mask,
      showMaskOnHover: false,
      showMaskOnFocus: true
    }).mask(input);

    input.dataset.masked = "true";
  }
});

function loadInputMask() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/inputmask@5.0.9/dist/inputmask.min.js";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}




const videoElements = document.querySelectorAll('video');

if (videoElements.length > 0) {

  // Добавляем геттер "playing" ко всем HTMLMediaElement
  Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function () {
      return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
  });

  // Убедимся, что у всех видео есть playsinline
  videoElements.forEach(videoElement => {
    if (!videoElement.hasAttribute('playsinline')) {
      videoElement.setAttribute('playsinline', '');
    }
  });

  // Функция безопасного воспроизведения
  function attemptPlay(videoElement) {
    if (!videoElement.playing && videoElement.hasAttribute('autoplay')) {
      videoElement.play().catch(error => {
        console.warn('Failed to play video:', error);
      });
    }
  }

  // Пользовательские события
  document.body.addEventListener('click', () => {
    videoElements.forEach(videoElement => attemptPlay(videoElement));
  });

  document.body.addEventListener('touchstart', () => {
    videoElements.forEach(videoElement => attemptPlay(videoElement));
  });

  // Фокус окна
  window.addEventListener('focus', () => {
    videoElements.forEach(videoElement => attemptPlay(videoElement));
  });

  // Возврат вкладки в активное состояние
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      videoElements.forEach(videoElement => attemptPlay(videoElement));
    }
  });
}


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

