
(function(w) {
    $(document).ready(function() {
        /* Animated scrolling to local anchors */
        var $root = $("html, body");
        $("a").click(function() {
            var href = $.attr(this, "href");
            $root.animate({
                scrollTop: $(href).offset().top
            }, 200, function() {
                window.location.hash = href;
            });
            return false;
        });

        /* Add close button to alerts */
        $(".alert[data-closeable]").each(function(index) {
            $(this).click(function() {
                $(this).hide();
                return false;
            });
        });

        /* Add touch swipe to image gallery */
        var elem = document.getElementById('mySwipe');
        window.mySwipe = Swipe(elem, {
            speed: 400,
            callback: function(index, elem) {}
        });

        /* Footable */
        $(".footable").footable();
    });
})(this);
