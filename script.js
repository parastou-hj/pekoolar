 $(document).ready(function() {
    const headerMoving = () => {
 
      const $header = $('header');
      const $headerContainer = $('.header-container');
      const $mainHeader = $('.header-back');
      const $downHeader = $('.header-down');
      const $advertise = $('.advertise');
      const $resSearch = $('.res-search');
      
      
      const resSearchHeight = $resSearch.outerHeight() || 0;
      const downHeaderHeight = $downHeader.outerHeight() || 0;
      const mainHeaderHeight = $mainHeader.outerHeight() || 0;
      const adHeaderHeight = $advertise.outerHeight() || 0;
  
     
      let lastScrollTop = 0;
      let isHeaderVisible = true;
      
      
      $mainHeader.removeClass('lg-header-up');
      $downHeader.removeClass('header-hidden');
      $resSearch.removeClass('header-hidden');
      
      
      if (window.innerWidth > 992) {
        console.log("Desktop mode activated");
        
        const headerHeight = mainHeaderHeight + downHeaderHeight;
        const totalHeight = headerHeight + adHeaderHeight;
        
       
        $headerContainer.css('height', headerHeight);
        $('body').css('padding-top', totalHeight);
        
        // Scroll handler for desktop
        $(window).off('scroll.headerDesktop').on('scroll.headerDesktop', function() {
          const currentScroll = $(this).scrollTop();
          
       
          if (currentScroll > 50) {
           
            if (currentScroll > lastScrollTop && isHeaderVisible) {
              $mainHeader.addClass('lg-header-up');
              $downHeader.addClass('header-hidden');
              $headerContainer.css('height', mainHeaderHeight);
              isHeaderVisible = false;
              console.log("Desktop: Hiding header-down");
            } 
            
            else if (currentScroll < lastScrollTop && !isHeaderVisible) {
              $mainHeader.removeClass('lg-header-up');
              $downHeader.removeClass('header-hidden');
              $headerContainer.css('height', headerHeight);
              isHeaderVisible = true;
              console.log("Desktop: Showing header-down");
            }
          } else {
            
            $mainHeader.removeClass('lg-header-up');
            $downHeader.removeClass('header-hidden');
            $headerContainer.css('height', headerHeight);
            isHeaderVisible = true;
          }
          
          lastScrollTop = currentScroll;
        });
      } 
      
      else {
        console.log("Mobile mode activated");
        
        const headerHeight = mainHeaderHeight + resSearchHeight;
        const totalHeight = headerHeight + adHeaderHeight;
        
       
        $headerContainer.css('height', headerHeight);
        $('body').css('padding-top', totalHeight);
        
       
        $(window).off('scroll.headerMobile').on('scroll.headerMobile', function() {
          const currentScroll = $(this).scrollTop();
          
          if (currentScroll > 50) {
            
            if (currentScroll > lastScrollTop && isHeaderVisible) {
              $mainHeader.addClass('lg-header-up');
              $resSearch.addClass('header-hidden');
              $headerContainer.css('height', mainHeaderHeight);
              isHeaderVisible = false;
              console.log("Mobile: Hiding res-search");
            } 
            
            else if (currentScroll < lastScrollTop && !isHeaderVisible) {
              $mainHeader.removeClass('lg-header-up');
              $resSearch.removeClass('header-hidden');
              $headerContainer.css('height', headerHeight);
              isHeaderVisible = true;
              console.log("Mobile: Showing res-search");
            }
          } else {
            
            $mainHeader.removeClass('lg-header-up');
            $resSearch.removeClass('header-hidden');
            $headerContainer.css('height', headerHeight);
            isHeaderVisible = true;
          }
          
          lastScrollTop = currentScroll;
        });
      }
    };
  
    headerMoving();
    
    let resizeTimer;
    $(window).on('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        console.log("Window resized - reinitializing header behavior");
        headerMoving();
      }, 250);
    });
  });



  //mega-menu


  $(document).ready(function() {

    // --- DOM Manipulation Logic ---
    const $megamenus = $('.has-megamenu');
    
    function restructureForMobile() {
        $megamenus.each(function() {
            const $menu = $(this);
            if ($menu.data('isMobile')) return;

            const $categories = $menu.find('.category-item');
            const $subcontents = $menu.find('.subcategory-content');

            $categories.each(function() {
                const $category = $(this);
                const categoryId = $category.data('category');
                const $contentToMove = $subcontents.filter(`#${categoryId}`);
                $category.after($contentToMove);
                  $categories.first().removeClass('active');
            });
            
            $menu.data('isMobile', true);
        });
    }

    function restoreForDesktop() {
        $megamenus.each(function() {
            const $menu = $(this);
            if (!$menu.data('isMobile')) return;

            const $subcategoriesColumn = $menu.find('.subcategories-column');
            const $subcontents = $menu.find('.subcategory-content'); // Now they are scattered
            $subcategoriesColumn.append($subcontents);
            
            $menu.data('isMobile', false);
        });
    }

    // --- Initial State and Resize Handler ---
    let isMobileView = window.innerWidth <= 991;

    if (isMobileView) {
        restructureForMobile();
        
    }

    $(window).on('resize', function() {
        const wasMobile = isMobileView;
        isMobileView = window.innerWidth <= 991;

        if (isMobileView && !wasMobile) {
            restructureForMobile();
        } else if (!isMobileView && wasMobile) {
            restoreForDesktop();
        }

        if (!isMobileView) {
            closeMenu();
            $('.sub-menu-content, .megamenu-container, .subcategory-content').css('display', '');
            $('.nav-item, .category-item').removeClass('is-open is-active');
            
            $('.has-megamenu').each(function() {
                 const $firstCategory = $(this).find('.category-item').first();
                 if ($firstCategory.length) {
                     $(this).find('.category-item').removeClass('active');
                     $(this).find('.subcategory-content').removeClass('active');
                     $firstCategory.addClass('active');
                     const categoryId = $firstCategory.data('category');
                     $(this).find(`#${categoryId}`).addClass('active');
                 }
            });
        }
    });

    // --- Event Handlers ---
    function openMenu() {
        $('.main-nav').addClass('is-open');
        $('.menu-overlay').addClass('is-visible');
        $('body').addClass('no-scroll');
    }

    function closeMenu() {
        $('.main-nav').removeClass('is-open');
        $('.menu-overlay').removeClass('is-visible');
        $('body').removeClass('no-scroll');
        // Reset accordion state on menu close
        $('.nav-item.is-open').removeClass('is-open').children('.sub-menu-content, .megamenu-container').slideUp(0);
        $('.category-item.is-active').removeClass('is-active').next('.subcategory-content').slideUp(0);
    }

    $('.mobile-menu-toggle').on('click', openMenu);
    $('.sidebar-close-btn, .menu-overlay').on('click', closeMenu);

    $('.has-submenu > a, .has-megamenu > a').on('click', function(e) {
        if (window.innerWidth <= 991) {
            e.preventDefault();
            const $parentLi = $(this).parent();
            const $submenu = $parentLi.children('.sub-menu-content, .megamenu-container');
            $parentLi.toggleClass('is-open');
            $submenu.slideToggle(300);
            $parentLi.siblings('.is-open').removeClass('is-open')
                .children('.sub-menu-content, .megamenu-container').slideUp(300);
        }
    });

    // Use event delegation for click handler as DOM is changing
    $('.main-nav').on('click', '.category-item', function(e) {
        if (window.innerWidth <= 991) {
            e.preventDefault();
            e.stopPropagation();
            const $category = $(this);
            const $content = $category.next('.subcategory-content');
            $category.toggleClass('is-active');
            $content.slideToggle(300);
            $category.siblings('.category-item.is-active').removeClass('is-active')
                .next('.subcategory-content').slideUp(300);
        }
    });

    $('.has-megamenu').each(function() {
        const $menuContainer = $(this);
        const $categories = $menuContainer.find('.category-item');
        const $subcategories = $menuContainer.find('.subcategory-content');

        function activateDesktopCategory($category) {
            const categoryId = $category.data('category');
            $categories.removeClass('active');
            $menuContainer.find('.subcategory-content').removeClass('active');
            $category.addClass('active');
            $menuContainer.find(`#${categoryId}`).addClass('active');
        }

        if (window.innerWidth > 991) {
            $categories.first().addClass('active');
            $menuContainer.find(`#${$categories.first().data('category')}`).addClass('active');
        }

        $menuContainer.on('mouseenter', '.category-item', function() {
            if (window.innerWidth > 991) {
                activateDesktopCategory($(this));
            }
        });
    });
});

//baner-sec

$(document).ready(function(){
            var articlesCarousel = $('#baner-owl').owlCarousel({
                rtl: true,
                loop: true,
                margin: 10,
                nav: false,
                dots: true,
                center: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                smartSpeed: 1000,
                // stagePadding: 100,
                responsive: {
                    0: {
                        items: 1,
                        
                    },
                    
                  
                }
            });
            
            // Custom Navigation
            $('#baner-right').click(function() {
                articlesCarousel.trigger('prev.owl.carousel');
            });
            
            $('#baner-left').click(function() {
                articlesCarousel.trigger('next.owl.carousel');
            });
        });

         $(document).ready(function(){
            $('#most-sale-owl').owlCarousel({
                rtl: true, 
                loop: true, 
                // margin: 20, 
                nav: true, 
                dots: true, 
                 autoplay: true,
                autoplayTimeout: 4000,
                autoplayHoverPause: true,
                smartSpeed: 1000,
                navText: [">", "<"], 
                responsive:{
                    0:{
                        items:1 
                    },
                    600:{
                        items:2 
                    },
                    1000:{
                        items:5
                    }
                }
            });
        });



        //blog

  // Add animation to cards on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observerCareer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards
        document.querySelectorAll('.blog-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observerCareer.observe(card);
        });

$(document).ready(function() {
  const initializeOwlCarousel = () => {
      const advantagesContainer=$('.blog-cards-container')
      if (window.innerWidth > 991) {
          if (typeof advantagesContainer.data('owl.carousel') != 'undefined') {
              advantagesContainer.data('owl.carousel').destroy();
            }
            advantagesContainer.removeClass('owl-carousel');
          
      } else if(window.innerWidth <= 991) {
          if (!$('.blog-cards-container').hasClass('owl-carousel')) {
              $('.blog-cards-container').addClass('owl-carousel').owlCarousel({
                  rtl: true,
                  items: 1,
                //   margin:10,
                  dots: true,
                  loop: true,
                //   autoplay: true,
                //   autoplayTimeout: 3000,
                  autoplayHoverPause: true,
                  // navText: [
                  //     '<i class="fa-solid fa-chevron-right"></i>',
                  //     '<i class="fa-solid fa-chevron-left"></i>'
                  // ],
                  responsive: {
                    0:{
                        items:1.5
                    },
                    800:{
                        items:2
                    }
                     
                      
                  }
              });
             

              
          }
      }
  };

  initializeOwlCarousel();
  $(window).resize(initializeOwlCarousel);


});

$(document).ready(function(){
    $('#brands-owl').owlCarousel({
        rtl: true,             
        loop: true,               
        // margin: 20,               
        autoplay: true,          
        autoplayTimeout: 3000,    
        autoplayHoverPause: true, 
        nav: false,             
        dots: false,            
        responsive:{
            0:{
                items: 2 
            },
            600:{
                items: 4 
            },
            1000:{
                items: 6 
            }
        }
    });
});

 $('.user').on('mouseenter',function(){
    $('.user-menu').addClass('active'); 
  })

   $('body').on('mouseover',function(e){
    if(!e.target.closest('.user')){
    $('.user-menu').removeClass('active');
    // $('.cart-menu-container').removeClass('active');
    }
  })





  //footer


var tabs=$('.footer-tab');
    tabs.on('click', function(){
        // $(this).addClass('active');
        $('#'+$(this).data('tab')).toggleClass('active')
    })
