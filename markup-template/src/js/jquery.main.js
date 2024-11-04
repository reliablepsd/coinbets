var $ = jQuery.noConflict();
jQuery(function () {
	isElementExist(".stars", starsClass);
	isElementExist("#entry-grid", initEntryNav);
	isElementExist(".menu-drop", initSmartMenu);
	isElementExist(".header", initHeaderOffset);
	isElementExist(".header", initScrollClass);
	isElementExist(".accordion", initAccordion);
	isElementExist("[data-tab-btn]", simpleTab);
	isElementExist(".fix-table", fixTable);
	isElementExist(".filter-r-bonus-copy", copyTextFromElement);
	isElementExist(".popup-show", popupInit);
	isElementExist(".rating", ratingHelper);

	// simple slider areas
	isElementExist(".blogs-slider", sliderBlogs);
	isElementExist(".c-slider", sliderCripto);
	isElementExist(".r-slider", sliderReview);
	isElementExist(".screen-slider", sliderScreenshots);

	// General function breakpointChecker for slider
	isElementExist(".g-reviews-s", gReviewsSlider);
	isElementExist(".g-experts-s", gExpertsSlider);
	isElementExist(".g-communitys-s", gCommunitySlider);

	// General function toggleParentClass
	isElementExist(".col-reviews", reviewOpenCloseMob);
	isElementExist(".g-trusted-i", trustedOpenCloseMob);
	isElementExist(".lang-w", langOpenClose);
	isElementExist(".header-login-w", loginOpenClose);
	isElementExist(".header-search-w", searchOpenClose);
	isElementExist(".filter-r-list", filterROpenClose);
	isElementExist(".filter-r-f-i", filterRFOpenClose);
	isElementExist(".filter-r-availible-more", availibleMoreOpenClose);
	isElementExist(".filter-r-availible-more", availibleMoreOpenClose);

	isElementExist(".filter-r-bottom-more-w", acceptedMoreOpenClose);
	isElementExist(".g-list-more", gListMoreOpenClose);
	isElementExist(".r-main-top-r-mob", rMainMobOpenClose);
	isElementExist(".mob-more", mobMoreOpenClose);

	jcfInit();
});

//-------- -------- -------- --------
//-------- js custom start
//-------- -------- -------- --------

// Helper if element exist then call function
function isElementExist(_el, _cb) {
	var elem = document.querySelector(_el);

	if (document.body.contains(elem)) {
		try {
			_cb();
		} catch (e) {
			console.log(e);
		}
	}
}

// initialize custom form elements (checkbox, radio, select) https://github.com/w3co/jcf
function jcfInit() {
	var customSelect = jQuery("select");
	var customCheckbox = jQuery('input[type="checkbox"]');
	var customRadio = jQuery('input[type="radio"]');
	var customFile = jQuery('input[type="file"]');

	customSelect.each(function () {
		$(this).find('option').first().addClass("placeholder")
	})

	// all option see https://github.com/w3co/jcf
	jcf.setOptions("Select", {
		wrapNative: false,
		wrapNativeOnMobile: false,
		fakeDropInBody: false,
		maxVisibleItems: 6,
	});

	jcf.setOptions("Checkbox", {});

	jcf.setOptions("Radio", {});

	jcf.setOptions('File', {
		buttonText: "No file",
		placeholderText: "Click to select file(s) or drag & drop here"
	});

	// init only after option
	jcf.replace(customSelect);
	jcf.replace(customCheckbox);
	jcf.replace(customRadio);
	jcf.replace(customFile);
}

// smart menu init
function initSmartMenu() {
	jQuery(".menu").smartmenus({
		collapsibleBehavior: "accordion",
		hideTimeout: 0,
		showTimeout: 0
	});

	// changed date attribute to a class (need to reverse last item menu)
	jQuery('.menu').children().last().addClass('menu-sm-reverse');

	jQuery("body").mobileNav({
		menuActiveClass: "menu-active",
		menuOpener: ".menu-opener",
		hideOnClickOutside: true,
		menuDrop: ".menu-drop"
	}), "ontouchstart" in document.documentElement || jQuery(window).on("resize orientationchange", function () {
		jQuery("body").removeClass("menu-active"), $.SmartMenus.hideAll();
	});
}

// gloabal variable for headerHeight
let globheaderHeight;
function initHeaderOffset() {
	let container = jQuery(".offset-header");
	let header = jQuery(".header");
	let adjustDebounced = debounce(function () {
		if (globheaderHeight != header.outerHeight()) {
			adjustHeightOffset();
		}
	}, 250);

	// let headerHeight;

	function adjustHeightOffset() {
		globheaderHeight = header.outerHeight();
		// container.css("padding-top", headerHeight);
		document.documentElement.style.setProperty("--offset-header", `${globheaderHeight}px`);
	}

	adjustHeightOffset();

	jQuery(window).on("resize", adjustDebounced);
}

function initScrollClass() {
	var $window = jQuery(window);
	var lastScrollTop = 0;
	var $header = jQuery('.header');


	if ($window.scrollTop() <= 0) {
		$header.removeClass('_sticked');
	}

	$window.scroll(function () {
		let windowTop = $window.scrollTop();

		if (!jQuery('body').hasClass("nav-active")) {

			if (windowTop > 1) {
				$header.addClass('_sticked');
			} else {
				$header.removeClass('_sticked');
				$header.removeClass('_showed');
			}

			if ($header.hasClass('_sticked')) {
				if (windowTop < lastScrollTop) {
					$header.addClass('_showed');
				} else {
					$header.removeClass('_showed');
				}
			}

		}

		lastScrollTop = windowTop;

	});
}

function initEntryNav() {
	const grid = document.querySelector("#entry-grid");
	const sidebar = grid.querySelector(".entry-grid__sidebar");
	const content = grid.querySelector(".entry-grid__content");
	const entry = content.querySelector(".entry");
	const blockTitles = jQuery(entry).find(".t-link");
	if (!sidebar || !blockTitles.length) return;
	const $nav = $('<nav class="entry-nav" id="entry-nav"></nav>');
	jQuery(entry).find(".t-link").each(function () {
		const nextH2 = $(this).nextAll(".t-link, .bg-yellow-l").first();
		const uid = generateUniqueId();
		const title = $(this).text();
		const $siblings = nextH2.length ? $(this).nextUntil(".t-link, .bg-yellow-l") : $(this).nextAll();
		$siblings.addBack().wrapAll(`<div id="${uid}" class="entry-block"></div>`);
		observeElement(uid);
		$nav.append(`<a class="entry-nav__link" href="#${uid}">${title}</a>`);
	});
	jQuery(sidebar).find(".entry-nav-w").append($nav);
	function handleIntersection(entries) {
		entries.forEach((entry) => {
			const entryId = entry.target.id;
			if (entry.intersectionRatio > 0) {
				$(`.entry-nav [href="#${entryId}"]`).addClass("_active");
			} else {
				$(`.entry-nav [href="#${entryId}"]`).removeClass("_active");
			}
		}
		);
	}
	function observeElement(elementId) {
		const element = document.getElementById(elementId);
		if (element) {
			const observer = new IntersectionObserver(handleIntersection, {
				root: null,
				threshold: 0,
				rootMargin: "0px",
			});
			observer.observe(element);
		} else {
			console.error("Element not found with id:", elementId);
		}
	}
	function getElementYPosition(elementId) {
		const element = document.getElementById(elementId);
		if (element) {
			const rect = element.getBoundingClientRect();
			return rect.top + window.scrollY;
		}
		return null;
	}
	function generateUniqueId() {
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let uniqueId = "";
		for (let i = 0; i < 10; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			uniqueId += characters.charAt(randomIndex);
		}
		return uniqueId;
	}

	jQuery(".entry-nav__link").on('click', function (e) {
		var elementClickId = jQuery(this).attr("href");
		const posY = getElementYPosition(elementClickId.slice(1));
		const currentPosY = window.scrollY;
		const destination = currentPosY < posY ? posY - 10 : posY - globheaderHeight - 10;

		jQuery("html,body").stop().animate({
			scrollTop: destination
		}, 1000);
		return false;
	});
}

// custom simple tab
function simpleTab() {
	jQuery('[data-tab-btn]').on('click', function(e) {
		e.preventDefault();

		// Cache the closest parent element with the class .contact-grid-tab
		let $currentTab = jQuery(this);

		// Get the value of data-tab and update the data-tabs attribute in the closest section
		let tab = $currentTab.data("tab-btn");
		$currentTab.closest("[data-tabs]").attr("data-tabs", tab);

		// Remove the _active-tab class from all tabs
		$currentTab.parent().find('[data-tab-btn]').removeClass("_active-tab");

		// Add the _active-tab class to the current tab
		$currentTab.addClass("_active-tab");
	});
}

// custom simple tab
function rTab() {
	jQuery('.contact-grid-tab .button').on('click', function(e) {
		e.preventDefault();

		// Cache the closest parent element with the class .contact-grid-tab
		let $currentTab = jQuery(this).closest(".contact-grid-tab");

		// Remove the _active-tab class from all tabs
		$currentTab.closest(".contact-grid-tabs").find(".contact-grid-tab").removeClass("_active-tab");

		// Add the _active-tab class to the current tab
		$currentTab.addClass("_active-tab");

		// Get the value of data-tab and update the data-tabs attribute in the closest section
		let tab = $currentTab.data("tab");
		$currentTab.closest("section").attr("data-tabs", tab);

	});
}

// sliders area
function sliderBlogs() {
	const swiper = new Swiper('.blogs-slider', {
		slidesPerView: 1.2,
		spaceBetween: 0,
		centeredSlides: true,
		loop: true,
		breakpoints: {
			640: {
				slidesPerView: 1.75,
			}
		}
	});
}

function sliderCripto() {
	jQuery( '.c-slider' ).each(function() {
		let $nextEl = $(this).closest("section").find(".c-swiper-button-next")[0];
		let $prevEl = $(this).closest("section").find(".c-swiper-button-prev")[0];

		const swiper = new Swiper(jQuery(this)[0], {
			slidesPerView: 1.2,
			spaceBetween: 10,
			centeredSlides: true,
			loop: true,
			navigation: {
				nextEl: $nextEl,
				prevEl: $prevEl,
			},
			breakpoints: {
				480: {
					slidesPerView: 1.5
				},
				880: {
					slidesPerView: 2.5
				},
				1200: {
					slidesPerView: 3.5
				},
				1570: {
					slidesPerView: 4,
					spaceBetween: 20
				}
			}
		});
	});
}

function sliderReview() {
	jQuery( '.r-slider' ).each(function() {
		let ver2 = $(this).closest(".r-slider-v2").length;
		let $nextEl = $(this).parent().find(".r-swiper-button-next")[0];
		let $prevEl = $(this).parent().find(".r-swiper-button-prev")[0];

		const swiper = new Swiper(jQuery(this)[0], {
			slidesPerView: ver2 ? 1.8 : 2.8,
			spaceBetween: 5,
			loop: true,
			navigation: {
				nextEl: $nextEl,
				prevEl: $prevEl,
			},
			breakpoints: {
				666: {
					slidesPerView: 1.8
				}
			}
		});
	});
}

function sliderScreenshots() {
	new Swiper('.screen-slider', {
		autoplay: {
			delay: 10,
			disableOnInteraction: false,
			pauseOnMouseEnter: false,
			stopOnLastSlide: false,
			waitForTransition: false
		},
		loop: true,
		centeredSlides: true,
		slidesPerView: 1.5,
		speed: 15000,
		spaceBetween: 16,
		allowTouchMove: false,
		mousewheelControl: false,
		keyboardControl: false,
		observer: true,
		observeParents: true,
		breakpoints: {
			640: {
				slidesPerView: 2.5,
			},
			1024: {
				slidesPerView: 3.5,
			},
		}
	});
}

// Object to store all swiper instances
const swiperInstances = {};

// General function to check the breakpoint and manage swiper initialization/destruction
function breakpointChecker(swiperName, swiperSelector, swiperOptions, mediaQuery = "(min-width:769px)") {
	// Define the breakpoint using the passed mediaQuery or default to "(min-width:769px)"
	const breakpoint = window.matchMedia(mediaQuery);

	// Function to enable the swiper and store it in the global swiperInstances object
	const enableSwiper = function () {
			swiperInstances[swiperName] = new Swiper(swiperSelector, swiperOptions);
	};

	// Function to destroy the swiper and remove it from the global swiperInstances object
	const destroySwiper = function () {
			if (swiperInstances[swiperName] !== undefined) {
					swiperInstances[swiperName].destroy(true, true);
					delete swiperInstances[swiperName]; // Remove the instance from the object
			}
	};

	// Function to perform actions based on the viewport width
	const check = function () {
			if (breakpoint.matches) {
					// If the viewport width matches the media query
					destroySwiper();
			} else {
					// If the viewport width does not match the media query
					enableSwiper();
			}
	};

	// Listen for changes in viewport size
	breakpoint.addEventListener("change", check);

	// Run the check on initial load
	check();
}

// Example of how to call with a different media query if needed
// function customSlider() {
// 	breakpointChecker('customInstance', ".custom-slider", {
// 			slidesPerView: 2,
// 			spaceBetween: 15,
// 	}, "(min-width:1024px)"); // Custom media query
// }

// Function to initialize the gReviewsSlider Swiper
function gReviewsSlider() {

	// Call the general breakpointChecker function
	breakpointChecker('gReviewsInstance', ".g-reviews-s", {
		loop: true,
		centeredSlides: true,
		slidesPerView: 1.3,
		spaceBetween: 10,
	});

		// Example: Access swiper instances globally
		// console.log(swiperInstances.gReviewsInstance); // Access the gReviewsInstance swiper instance

}

// Function to initialize the gExpertsSlider Swiper
function gExpertsSlider() {

	// Call the general breakpointChecker function
	breakpointChecker('gExpertsInstance', ".g-experts-s", {
		loop: true,
		centeredSlides: true,
		slidesPerView: 1.2,
		spaceBetween: 10
	});

	// Example: Access swiper instances globally
	// console.log(swiperInstances.gExpertsInstance); // Access the gExpertsInstance swiper instance

}

// Function to initialize the gExpertsSlider Swiper
function gCommunitySlider() {

	// Call the general breakpointChecker function
	breakpointChecker('gCommunityInstance', ".g-communitys-s", {
		loop: true,
		centeredSlides: true,
		slidesPerView: 1.8,
		spaceBetween: 10,
	});

	// Example: Access swiper instances globally
	// console.log(swiperInstances.gCommunityInstance); // Access the gExpertsInstance swiper instance

}

// General function to toggle class + slideToggle if needed
function toggleParentClass(parentClass, buttonClass, closeOnClickOutside = false, parentBlockClass, topBottomClass = false) {
	 // Remove previous click handlers to avoid duplication (fix bug after wp - ajax conflict)
	jQuery(document).off('click', buttonClass);
	jQuery(document).on('click', buttonClass, function(e) {
			e.preventDefault();

			var $parent = jQuery(this).closest(parentClass);
			$parent.toggleClass('js-active');

			// If parentBlockClass is provided, toggle the visibility of the block
			if (parentBlockClass) {
					$parent.find(parentBlockClass).slideToggle(300, "linear");
			}

			// If topBottomClass is set to true
			if (topBottomClass) {
					const windowHeight = jQuery(window).height();
					const clickY = e.clientY;

					$parent.removeClass('js-top js-bottom');

					if (clickY < windowHeight / 2) {
							$parent.addClass('js-top');
					} else {
							$parent.addClass('js-bottom');
					}
			}
	});

	// If closeOnClickOutside is set to true
	if (closeOnClickOutside) {
			// Remove previous click handler for clicks outside the element (fix bug after wp - ajax conflict)
			jQuery(document).off('click', closeOutsideHandler);
			jQuery(document).on('click', closeOutsideHandler);

			function closeOutsideHandler(e) {
					var $target = jQuery(e.target);
					// If the click happened outside of the parentClass element
					if (!$target.closest(parentClass).length) {
							jQuery(parentClass).removeClass('js-active');
							// If parentBlockClass is provided, hide the block
							if (parentBlockClass) {
									jQuery(parentBlockClass).slideUp();
							}
					}
			}
	}
}

// How to use
// toggleParentClass('parent', 'parent-btn', true, 'parent-block');

function reviewOpenCloseMob() {
	toggleParentClass('.col-reviews', '.col-more-btns a._btn-black');
}

function trustedOpenCloseMob() {
	toggleParentClass('.g-trusted-i', '.g-trusted-top');
}

function langOpenClose() {
	toggleParentClass('.lang-w', '.lang-btn', true, ".lang-block");
}

function loginOpenClose() {
	toggleParentClass('.header-login-w', '.header-login-btn', true, ".header-login");
}

function searchOpenClose() {
	toggleParentClass('.header-search-w', '.header-search-btn', true);
}

function filterROpenClose() {
	toggleParentClass('.filter-r-list', '.filter-r-list-opener', false, ".filter-r-list-hidden" );
}

function filterRFOpenClose() {
	toggleParentClass('.filter-r-f-i', '.filter-r-f-opener', false, ".filter-r-f-hidden" );
}

function availibleMoreOpenClose() {
	console.log('123');
	toggleParentClass('.filter-r-availible-more', '.filter-r-availible-btn', false, ".filter-r-availible-more-h", true );
}

function acceptedMoreOpenClose() {
	toggleParentClass('.filter-r-bottom-more-w', '.filter-r-bottom-more-btn', false, ".filter-r-bottom-more-h", true );
}

function gListMoreOpenClose() {
	toggleParentClass('.g-list-more', '.g-list-more-btn', false, ".g-list-more-h", true );
}

function rMainMobOpenClose() {
	toggleParentClass('.r-main-top-r-mob', '.r-main-top-r-mob-btn', false, ".r-main-top-r-mob-h");
}

function mobMoreOpenClose() {
	toggleParentClass('.mob-more', '.mob-more-btn');
}

// function accordion init
function initAccordion() {
	jQuery('.accordion').slideAccordion({
		activeClass:'active',
		opener: '>a.opener',
		slider: '>div.slide',
		animSpeed: 300
	});
}

// starsClass
function starsClass() {
	jQuery('.stars').each(function() {
		jQuery(this).addClass("_" + Math.floor(jQuery(this).css("--data-result")));
	})
}

// copyTextFromElement
function copyTextFromElement() {
	jQuery(document).on('click', '.filter-r-bonus-copy', function() {
		navigator.clipboard.writeText(jQuery(this).text());
	});
}


function popupInit() {
	jQuery('.popup-show').magnificPopup({
		type: 'inline',
		preloader: false,
		modal: true,
		fixedContentPos: true,
	});
	jQuery(document).on('click', '.m-close', function(e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
}

// fix-table
function fixTable() {
	jQuery(".fix-table table").each(function(){
		jQuery(this).wrap("<div class='table-w'></div>")
	})
}

// ratingHelper
function ratingHelper() {
	function getWordByValue(value) {
		const words = {
			1: "TERRIBLE",
			2: "BAD",
			3: "OK",
			4: "GOOD",
			5: "EXCELLENT"
		};
		return words[value] || "EXCELLENT";
	}

	jQuery(document).on('change', '.rating input[type="radio"]', function() {
		let radioVal = $(this).val();
		$(this).closest(".form-m-stars-w").find(".rating-num").html(radioVal);
		$(this).closest(".form-m-a-w").find(".form-m-a-about-t").html(getWordByValue(radioVal));
		$(this).closest(".rating").removeClass(function(index, className) {
			return (className.match(/_\d+/g) || []).join(' ');
		}).addClass("_" + radioVal);
	});
}



//-------- -------- -------- --------
//-------- js custom end
//-------- -------- -------- --------

//-------- -------- -------- --------
//-------- included js libs start
//-------- -------- -------- --------

// custom helper function for debounce - how to work see https://codepen.io/Hyubert/pen/abZmXjm
//= vendors/debounce.js

// library smartmenus (if you dont have menu in the project - just remove)
//= vendors/smartmenus.js

// jcf library select, radio, checkbox modules
//= vendors/jcf.js

// swiper library
//= vendors/swiper.js

// accordion library
//= vendors/accordion.js

// popup library https://dimsemenov.com/plugins/magnific-popup/
//= vendors/jquery.magnific-popup.min.js

//-------- -------- -------- --------
//-------- included js libs end
//-------- -------- -------- --------
