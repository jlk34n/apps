/*++++++++++++++++++++++++++++++++++++
<script id="BigSearchBox" data-charLimit="40" data-linkLabel="Query Editor" data-before="advanced" src="//widgets.ebscohost.com/prod/simplekey/bigsearchbox/bigsearchbox.js"></script>
++++++++++++++++++++++++++++++++++++
data-linkLabel == Text to display (if omitted or blank, default is Query Editor)
data-before == Display before basic, advanced or history (if omitted or blank, default is to display before advanced)
data-css == Use custom CSS, use  data-css="URL_TO_CSS"  (if omitted or blank, default is to use http://widgets.ebscohost.com/prod/simplekey/bigsearchbox/bigsearchbox.css)
data-charLimit == Allow big search box to appear if the default search box hits a specific character limit. (if omitted or blank or 0, requires user to click the link.
++++++++++++++++++++++++++++++++++++*/


var trackBigSearchBox = setInterval(function () {
        if (window.jQuery) {
            clearInterval(trackBigSearchBox);
            jQuery(document).ready(function () {
                bigSearchBox();
            });
        }
    }, 500);

function bigSearchBox() {
    var searchInput = "SearchTerm1";
    var charLimit = jQuery('#BigSearchBox').attr('data-charLimit');
	charLimit = charLimit.trim();
    if (typeof charLimit === "undefined" || charLimit == "") {
        charLimit = 0;
    }
    var linkLabel = jQuery('#BigSearchBox').attr('data-linkLabel');
	linkLabel = linkLabel.trim();
    if (typeof linkLabel === "undefined" || linkLabel == "") {
        linkLabel = 'Query Editor';
    }
    var css = jQuery('#BigSearchBox').attr('data-css');
	css = css.trim();
    if (typeof css === "undefined" || css == "") {
        css = '//widgets.ebscohost.com/prod/simplekey/bigsearchbox/bigsearchbox.css';
    }
    var elementInsert = "";
    var beforeWhat = jQuery('#BigSearchBox').attr('data-before');
	beforeWhat = beforeWhat.trim();
    if (typeof beforeWhat === "undefined" || beforeWhat == "") {
        beforeWhat = 'advanced';
    }
    if (beforeWhat == 'basic') {
        elementInsert = "basicItem";
    } else if (beforeWhat == 'history') {
        elementInsert = "historyItem";
    } else {
        elementInsert = "advancedItem";
    }

    jQuery('body').append('<link href="' + css + '" rel="stylesheet" type="text/css"><div class="xbox" id="big-search"></div>');

    if (jQuery("#guidedfindfieldRows").is(":visible")) {
        console.log("guidedstyle");
        searchInput = "Searchbox1";
    }

    // place the xbox search link inline w/ other search options; place big-search after the '+searchInput+' box
    jQuery('#'+elementInsert+'').before('<li id="xboxItem" class="find-field-link"><a href="#" id="thexbox" alt="Edit lengthy query expressions" title="Opens a separate textarea for editing long and complex query expressions">' + linkLabel + '</a></li>');
    jQuery('#xboxItem').css('cursor', 'pointer');

    // assemble the big-search box
    jQuery('#big-search').html('<div id="close-xbox"><span></span></div><textarea autofocus name="the-big-search" id="big-textarea" placeholder="Enter extended search expression here"></textarea>');

    // move the big-search box into the '+searchInput+' container
    if ((document.location.href.indexOf('/search/basic') > -1)
         || (document.location.href.indexOf('/eds/results') > -1)
         || (document.location.href.indexOf('/eds/resultsadvanced'))) {
        jQuery('.find-field-inputs-row').before(jQuery('#big-search'));
    } else if (document.location.href.indexOf('/search/advanced') > -1) {
        jQuery('.guided-find-fields-row').css({
            position : 'relative'
        });
        jQuery('.guided-find-fields-row').before(jQuery('#big-search'));
    } else {
        // nada
    }

    // attach event listener
    jQuery('#xboxItem').on('click', function (e) {
        e.preventDefault();
        var searchTerm = jQuery('#' + searchInput + '').val();
        jQuery('#big-textarea').text('');
        jQuery('#big-textarea').text(searchTerm);
        jQuery('#big-search').show();
        jQuery('#' + searchInput + '').css("background-color", "#dadada");
    });

    //also run above when character limit reaches charLimit unless charLimit has been set to 0
    if (charLimit !== 0) {
        jQuery('#' + searchInput + '').keyup(function () {
            var searchLength = jQuery('#' + searchInput + '').val();
            if (searchLength.length > charLimit) {
                var searchTerm = jQuery('#' + searchInput + '').val();
                jQuery('#big-textarea').text('');
                jQuery('#big-textarea').text(searchTerm);
                jQuery('#big-search').show();
                jQuery('#' + searchInput + '').css("background-color", "#dadada");
            }
        });
    }

    jQuery('#big-textarea').keyup(function () {
        var keyval = jQuery(this).val();
        jQuery('#' + searchInput + '').val(keyval);
    }).keyup();

    jQuery('#' + searchInput + '').focus(function () {
        jQuery('#big-search').hide();
        jQuery('#' + searchInput + '').removeAttr('style');
    });
    jQuery('#close-xbox').on('click', function (e) {
        e.preventDefault();
        jQuery('#big-search').hide();
        jQuery('#' + searchInput + '').removeAttr('style');
    });

}