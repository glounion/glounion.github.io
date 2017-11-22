//***********************************************************************************************************************
//CREATE HTML ELEMENTS FOR OLDER BROWSERS
//***********************************************************************************************************************
document.createElement('header');
document.createElement('nav');
document.createElement('section');
document.createElement('article');
document.createElement('aside');
document.createElement('footer');

//***********************************************************************************************************************
//CREATE AN ARRAY TO HOLD DROPDOWN TIMEOUT INFORMATION
//***********************************************************************************************************************
var dropdown_timeout = new Array();

//***********************************************************************************************************************
//CLEAN DOMAIN NAME FOR BUMP
//***********************************************************************************************************************
String.prototype.domainName = function() {
   return this.replace(/https?:\/\/(?:www\.)?/, '').replace(/\/.*$/, '').toLowerCase();
}

//***********************************************************************************************************************
//DOMAINS EXCLUDED FROM THE BUMP
//***********************************************************************************************************************
var exceptions = [
	'app7.vocusgr.com',
    'globalcu.org',
    'globalcu.com',
    'reorder.libertysite.com',
    'activatemycards.com',
    'reportmycards.com',
    'extraawards.com',
    'loanliner.com',
    'brokersite.com',
    'documatix.com',
    'globalcumobile.locatorsearch.com',
    'globalcu.locatorsearch.com',
    'fuzeqna.com',
    'mortgage-application.net',
	'0882367330.mortgage-application.net',
	'campaigns4.documatix.com',
	'campaign.documatix.com',
	'ws.loanspq.com',
	'yourmortgageonline.com',
	'myglobalcurewards.org',
	'na2.docusign.net',
	'globalcreditunion.cudlautosmart.com',
	'globalcu.hyrell.com',
	'dreampoints.com',
	'globalcuebranch.org',
	'yourmortgageonline.com/index43ab.html?conn=7FBBA041-80E9-4D44-A827-605F1BA8AD12',
	'sales.liveperson.net'	
];

//***********************************************************************************************************************
//SHOWS DROPDOWN MENU 
//***********************************************************************************************************************
function show_dropdown(index) {
	var pos = $('.dropdown').eq(index).position();
	var top = pos.top + 29;
	var left = pos.left -8;
	$('.dropdown_menu').eq(index).animate({ top: + top, left: + left }, 0).slideDown(200);	
}

//***********************************************************************************************************************
//HIDE THE DROPDOWN
//***********************************************************************************************************************
function hide_dropdown(index) {
	$('.dropdown_menu').eq(index).fadeOut('slow');
}

//***********************************************************************************************************************
//HIDE ALL DROPDOWNS EXCEPT THE ONE WITH CURRENT INDEX SUPPLIED
//***********************************************************************************************************************
function hide_all_dropdowns_but(index) {
	$('.dropdown_menu').not($('.dropdown_menu').eq(index)).fadeOut('slow');
}

//***********************************************************************************************************************
//CLEARS TIMEOUTS
//***********************************************************************************************************************/	
function clear_dropdown_timeouts(){  
   for(key in dropdown_timeout ){  
    	clearTimeout(dropdown_timeout[key]);  
   }   
} 

//***********************************************************************************************************************
//ITEMS TO RUN USING JQUERY LIBRARY AFTER THE DOM HAS LOADED
//***********************************************************************************************************************
$(document).ready(function() {
    
	//*******************************************************************************************************************
	//HOMEPAGE SLIDESDHOW USING THE CYCLE PLUGIN
	//*******************************************************************************************************************
   if ($('#slideshow').length > 0) {
			$('#slideshow').cycle({
				fx:     'fade',
				speed:   3000,
				timeout: 1500,
				pager:  '#nav',
				before: function() {
					$('#caption').html(this.alt);
				}
			});
		}
    
	//*******************************************************************************************************************
	//SENDS ALL OUTBOUND LINKS NOT IN EXCLUDED ARRAY TO BUMP
	//*******************************************************************************************************************
    $('a[href]').each(function(event) {
        var originalUrl = $(this).attr('href');
        if(!originalUrl.match(/^http/)) return;
        
        var domain = originalUrl.domainName();
        if($.inArray(domain, exceptions) < 0) {
            $(this).attr('href', 'bump5e9c.html?linkURL=' + originalUrl);
        }
    });

	//*******************************************************************************************************************
    //POSITIONING AND ANIMATION FOR THE MY ACCOUNT BOX THAT SLIDES DOWN FROM HEADER ON ALL PAGES
	//*******************************************************************************************************************
    $('#my_account_trigger').click(function(e) {
    	var slider = $('#my_account_popup');
    	var offset  = $('#my_account_trigger').offset();
    	slider.css({
                top: (offset.top + 20),
                left: (offset.left - 0)
            });

    	if(slider.is(':hidden') == true) {
    		slider.slideDown("fast");
    	} else {
    		slider.slideUp("fast");
    	}
   		return false;
    });
    
    $('.close_member').click(function() {
    	$('#my_account_popup').slideUp("fast");
    });
    
	//*******************************************************************************************************************
    //RANDOMIZING OF HOMEPAGE FEATURE SET 3 IMAGE AREA 
	//*******************************************************************************************************************
    function randomize() {
    	var images = $('.randomize');
    	if(images) {
    		images.hide();
    		var number = images.length;
    		var random = Math.floor((Math.random()*number));
  			images.eq(random).show();
  		}
    }
    
	//*******************************************************************************************************************
    //TRIGGER RANDOMIZING IMAGE EVENT IF RANDOM ELEMENTS EXIST
	//*******************************************************************************************************************
    randomize();
    
   	//*******************************************************************************************************************
	//CHANGE NAVIGATION STYLE ON MOUSEOVER / TRIGGER DROPDOWN MENU
	//*******************************************************************************************************************
  	// $('.dropdown').hover(function() {
  	// 	var index = $('.dropdown').index(this);
  	// 	hide_all_dropdowns_but(index);
  	// 	show_dropdown(index);
  	// }, function() {
	//   	var index = $('.dropdown').index(this);
	//   	dropdown_timeout['timeout'] = setTimeout("hide_dropdown("+index+")",100);
  	// });
	//
   	// //*******************************************************************************************************************
	// //IF MOUSEOVER DROPDOWN MENU THEN CLEAR TIMEOUT AND STAY ON IT IF YOU MOUSEOUT THEN KILL IT
	// //*******************************************************************************************************************
  	// $('.dropdown_menu').hover(function() {
  	// 	clear_dropdown_timeouts();
  	// }, function() {
  	// 	var index = $('.dropdown_menu').index(this);
  	// 	dropdown_timeout['timeout'] = setTimeout("hide_dropdown("+index+")",0);
  	// });
  	
  	
   	//*******************************************************************************************************************
	//HANDLES THE INTERACTION OF THE SIDE MENU WHEN THERE ARE SUB ITEMS
	//*******************************************************************************************************************  	
  	$('#interior_left a').click(function(e) {
  		
  		
  		if($(this).siblings().length) {
  			$('#interior_left li').removeClass("on");
  			$(this).parent("li").addClass("on");
  			e.preventDefault();
  		} 
  	});


	$('.interiorSidebar > ul > li > a').click(function(e) {
		var subNavigation = $(this).siblings('ul').length;
		if (subNavigation >= 1) {
			$(this).siblings('i').toggleClass('gcu-triangle-left').toggleClass('gcu-triangle-down');
			$(this).parent('li').siblings('i').toggleClass('gcu-triangle-left').toggleClass('gcu-triangle-down');
			$(this).parent('li').children('ul').slideToggle('fast');
			e.preventDefault();
		} else  {
			// Continue to link
		}
	});
	
	$('.interiorSidebar h2').click(function(e){
		var subNavigation = $(this).siblings('ul').length;
		if (subNavigation >= 1) {
			$(this).toggleClass('active').siblings('ul').slideToggle('fast');
			e.preventDefault();
		} else  {
			// Continue to link
		}
	});

if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
	$('.menuToggleWrapper').addClass('iphone');
}


	//*******************************************************************************************************************
	// Opens Navigation Menu
	//*******************************************************************************************************************
	$('.menuToggle').click(function(e) {
		$('nav').addClass('active').fadeIn('fast');
	});

	$('.closeToggle').click(function(e) {
			$('nav').removeClass('active').fadeOut('fast');
	});


	$('.loginToggle').click(function(e) {
		$(this).toggleClass('active');
		$('.loginFormWrapper').toggleClass('active');
	});

	$('.searchToggle').click(function(e) {
		$('#search_form').toggleClass('active');
	});


	//*******************************************************************************************************************
	// Triggers Modal
	//*******************************************************************************************************************

		$('#login_header button').click(function(e){
			$('.overlay').fadeIn(300);
			e.stopPropagation();
		});
		$('.overlay').click(function(){
			(this).fadeOut(300);
		});


	$('.quicklinks__link').click(function(e){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).children('i').removeClass('triangle-right');
			$(this).siblings('.quicklinks__sublist').removeClass('active').toggle(false);
		} else {
			$('.quicklinks__link').removeClass('active');
			$('.quicklinks__sublist').removeClass('active').toggle(false)
			$('.quicklinks__link').children('i').removeClass('triangle-right');


			$(this).addClass('active');
			$(this).children('i').addClass('triangle-right');
			$(this).siblings('.quicklinks__sublist').addClass('active').toggle(true);
		}


	})


	//*******************************************************************************************************************
	// Bootstrap Slider Code
	//*******************************************************************************************************************

	$('.carousel').carousel();

	// Add Swipe Functionality
	$(".carousel").swiperight(function() {
		$(this).carousel('prev');
	});
	$(".carousel").swipeleft(function() {
		$(this).carousel('next');
	});



	$('.zl_tracker').on('click',function(e) {
		if(typeof(ga) !== 'undefined'){
			e.preventDefault();

			var url = $(this).attr("href");
			var category = ($(this).data('category') !== undefined) ? $(this).data('category') : "";
			var action = ($(this).data('action') !== undefined) ? $(this).data('action') : "";
			var label = ($(this).data('label') !== undefined) ? $(this).data('label') : "";
			var value = ($(this).data('value') !== undefined) ? $(this).data('value') : 0; //SHOULD BE NUMERIC

			ga('send', 'event', {
				'eventCategory' : category,
				'eventAction' : action,
				'eventLabel' : label,
				'eventValue' : value,
				'transport': 'beacon',
				'hitCallback': function(){
					document.location = url;
				}
			});

		} else {
			console.log("You do not have Google Analytics or your version is out of date.");
		}
	});



});