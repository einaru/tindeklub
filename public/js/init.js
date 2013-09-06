///* Normalized hide address bar for iOS & Android (c) Scott Jehl, scottjehl.com MIT License */
//(function(a){var b=a.document;if(!location.hash&&a.addEventListener){window.scrollTo(0,1);var c=1,d=function(){return a.pageYOffset||b.compatMode==="CSS1Compat"&&b.documentElement.scrollTop||b.body.scrollTop||0},e=setInterval(function(){if(b.body){clearInterval(e);c=d();a.scrollTo(0,c===1?0:1)}},15);a.addEventListener("load",function(){setTimeout(function(){if(d()<20){a.scrollTo(0,c===1?0:1)}},0)})}})(this);
//
///*! A fix for the iOS orientationchange zoom bug. Script by @scottjehl, rebound by @wilto.MIT License.*/
//(function(m){var l=m.document;if(!l.querySelector){return}var n=l.querySelector("meta[name=viewport]"),a=n&&n.getAttribute("content"),k=a+",maximum-scale=1",d=a+",maximum-scale=10",g=true,j,i,h,c;if(!n){return}function f(){n.setAttribute("content",d);g=true}function b(){n.setAttribute("content",k);g=false}function e(o){c=o.accelerationIncludingGravity;j=Math.abs(c.x);i=Math.abs(c.y);h=Math.abs(c.z);if(!m.orientation&&(j>7||((h>6&&i<8||h<8&&i>6)&&j>5))){if(g){b()}}else{if(!g){f()}}}m.addEventListener("orientationchange",f,false);m.addEventListener("devicemotion",e,false)})(this); 

(function(w) {
    var sw = document.body.clientWidth,
        sh = document.body.clientHeight,
        breakpoint = 650,
        speed = 800,
        mobile = true;
        
    $(document).ready(function() {
        //checkMobile();
        setImg();
    });
        
    $(w).resize(function(){ //Update dimensions on resize
        sw = document.body.clientWidth;
        sh = document.body.clientHeight;
        //checkMobile();
    });
    
    //Check if Mobile
    function checkMobile() {
        mobile = (sw > breakpoint) ? false : true;
    }
    
    //Set up Image Carousel
    function setImg() {
        var container = $("#img-container"),
            nav = $("#images").find("nav"),
            imgList = Object,
            current = 0,
            swipeEnabled = false;
        
        function buildGallery() {
            container.html("<div id='img-list'><ul></div>");
            imgList = $("#img-list");
            nav.find("li:first").addClass("active");
            
            var arr = "";
            
            //For Each Navigation Link
            nav.find("a").each(function() {
                var $this = $(this),
                    href = $this.attr("href");
                    
                //Prepare list item with image source in data attribute
                arr += "<li data-imgsrc='" + href + "'></li>";
            });
            
            //Append to #img-list
            imgList.find("ul").append(arr);
            
            //Nav Thumbnail Click
            nav.on("click", "a", function(e) {
                var pos = $(this).parent().index();
                e.preventDefault();
                loadImg(pos);

                if (swipeEnabled) {
                    mySwipe.slide(pos, 300);
                }

                updateNav(pos);
            });
            
            Modernizr.load({
              test: /*Modernizr.touch && */Modernizr.csstransitions,
              yep : "js/swipe.js",
              complete : function() {
                    if (w.Swipe) {
                        swipeEnabled = true;
                        buildSwipe();
                    }
              }
            });
            loadImg(0); // Load initial image
        }
        
        // Build Swipe Carousel
        function buildSwipe() {
            // Initialize Swipe.js
            var imgList = document.getElementById("img-list");
            w.mySwipe = new Swipe(imgList, {
                callback: function(event, index, elem) {
                    updateNav(index);
                    loadImg(index + 1);
                }   
            });
            imgList.addEventListener("touchstart", function(event) {
                loadImg(w.mySwipe.getPos() + 1);
            }, false);
        }
        
        // Dynamically Load Images
        function loadImg(index) {
            var lis = imgList.find("li"),
                li = lis.eq(index),
                imgSrc = li.attr("data-imgsrc");
            if (!swipeEnabled) {
                lis.hide();
                li.show();
            }
            
            if(li.html() === "") { //If li is empty
                var img = new Image();
                imgList.addClass("loading");
                $(img).load(function () { //Load image
                    $(this).hide();
                    li.removeClass("loading");
                    $(this).fadeIn();
                }).error(function () {
                    // notify the user that the image could not be loaded
                }).attr("src", imgSrc);
                $("<img/>").attr("src",imgSrc).appendTo(li);
            }
        }
        
        //Update Image Thumbnail Navigation
        function updateNav(pos) {
            nav.find("li").removeClass("active");
            nav.find("li:eq("+pos+")").addClass("active");
        }
        
        buildGallery();
    }
})(this);
