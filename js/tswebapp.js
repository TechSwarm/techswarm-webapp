$(document).ready(function() {
    $('#sidebar').sidebar({
        transition       : 'overlay',
        mobileTransition : 'overlay'
    })
        .sidebar('attach events', '.view-sidebar', 'toggle')
    ;

});