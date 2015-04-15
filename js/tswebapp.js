$(document).ready(function() {
    "use strict";
    $('#sidebar').sidebar({
        transition       : 'overlay',
        mobileTransition : 'overlay'
    })
        .sidebar('attach events', '.view-sidebar', 'toggle')
    ;

});