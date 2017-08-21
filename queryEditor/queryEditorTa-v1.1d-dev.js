/*++++++++++++++++++++++++++++++++++++
<script id="queryEditorTa" data-linklabel = "Query Editor" data-charlimit="40" data-before="advanced" src="http://gss.ebscohost.com/jknight/qe2/queryEditorTa-v1.1b.js"></script>
++++++++++++++++++++++++++++++++++++
data-linkLabel == Text to display (if omitted or blank, default is Query Editor)
data-before == Display before basic, advanced or history (if omitted or blank, default is to display before advanced)
data-css == Use custom CSS, use  data-css="URL_TO_CSS"  (if omitted or blank, default is to use http://widgets.ebscohost.com/prod/simplekey/bigsearchbox/bigsearchbox.css)
data-charLimit == Allow big search box to appear if the default search box hits a specific character limit. (if omitted or blank or 0, requires user to click the link.
++++++++++++++++++++++++++++++++++++
version: 1.1b
revisions:
    1.1 -- add data- attributes as listed above
    1.1a -- optional shim for IE placeholder issues
    1.1b -- jquery picks up input[placeholder] as val() -- corrected
    1.1b -- set new defaults for 0, blank or missing charlimit attribute
    1.1c -- added code to fix focus/cursor issue in textarea for IE browsers (see https://goo.gl/tc7p2v)
*/

var trackQEcall = setInterval(function() {
    if (window.jQuery) {
        clearInterval(trackQEcall);

        // helper function for solving placeholder v. val() issue in searchterms
        jQuery.fn.pVal = function() {
            var $this = $(this),
                val = $this.eq(0).val();
            if (val == $this.attr('placeholder'))
                return '';
            else
                return val;
        }

        console.log('Running : ' + jQuery('#queryEditorTa').attr('src'));
        queryEditor2();
    }
}, 10);

function queryEditor2() {
    if (QueryString('sdb') == 'edspub') return; // stop custom application if this is ftf
    // used to ensure the code is run only once.
    if (jQuery('body').data('queryEditor') == 1) {
        return;
    } else { jQuery('body').attr('data-queryEditor', '1'); }

    // let's process those data attributes
    var qops = jQuery('#queryEditorTa').data() || {};
    console.log("data-charlimit was set to : '" + qops.charlimit + "'");
    var beforeWhat = { "basic": "basicItem", "history": "historyItem", "advanced": "advancedItem" };
    qops.linklabel = qops.linklabel || 'Query Editor',
        qops.before = beforeWhat[qops.before] || beforeWhat['advanced'],
        qops.css = qops.css || '//gss.ebscohost.com/jknight/qe2/css/queryEditor.css',
        qops.charlimit = (qops.charlimit <= 0 || qops.charlimit == undefined) ? 0 : qops.charlimit;
    console.log("qops.charlimit set to : " + qops.charlimit);

    // create and assemble the big-search box
    var theQEBox = jQuery('<div />', { class: 'xbox', id: 'big-search', style: 'display:none;' })
        .append(jQuery('<div />', { id: 'close-xbox' })
            .append(jQuery('<span />', { title: 'click to close the query editor textarea' })))
        .append(jQuery('<textarea />', { autofocus: '', name: 'the-big-search', id: 'big-textarea', placeholder: 'Enter extended search expression here' }));

    jQuery('.find-field-inputs-row, .find-field-position').before(jQuery(theQEBox));

    // place the xbox search link inline w/ other search options; place big-search after the SearchTerm1 box
    jQuery('#' + qops.before).before('<li id="xboxItem" class="find-field-link"><a href="#" id="xboxAnchor" alt="Edit lengthy query expressions" title="Opens a separate textarea for editing long and complex query expressions">' + qops.linklabel + '</a></li>');
    jQuery('#xboxItem').css('cursor', 'pointer');

    // attach event listener
    jQuery('#xboxItem').on('click', function(e) {
        e.preventDefault();
        var searchTerm = jQuery('#SearchTerm1, #Searchbox1').pVal();
        jQuery('#big-textarea').val(searchTerm);
        jQuery('#big-search').show();

        // jQuery('#big-textarea').focus();
        // v1.1c - this version of focus() helps IE place cursor at end of string
        var html = $('#big-textarea').val();
        jQuery('#big-textarea').focus().val('').val(html);

        jQuery('#SearchTerm1, #Searchbox1').css({
            background: '#dadada'
        });
    });

    // display #big-search if string is != 0 and > qops.charlimit
    console.log('fixed big-textarea, using show(function() and setTimeout');
    jQuery('#SearchTerm1, #Searchbox1').keyup(function(e) {
        e.preventDefault;

        var searchTerm = jQuery('#SearchTerm1, #Searchbox1').val();
        jQuery('#big-textarea').val(searchTerm);

        if ((qops.charlimit > 0) && (jQuery('#SearchTerm1, #Searchbox1').val().length > qops.charlimit)) {

            jQuery('#big-search').show();
            // jQuery('#big-textarea').focus();
            // v1.1c - this version of focus() helps IE place cursor at end of string
            var html = $('#big-textarea').val();
            jQuery('#big-textarea').focus().val('').val(html);

            jQuery('#SearchTerm1, #Searchbox1').css({
                background: '#dadada'
            });
        }
    });

    jQuery('#big-textarea').keyup(function() {
        var keyval = jQuery(this).val();
        jQuery('#SearchTerm1, #Searchbox1').val(keyval);
    }).keyup();

    jQuery('#SearchTerm1, #Searchbox1').focus(function() {
        jQuery('#big-search').hide();
        jQuery('#SearchTerm1, #Searchbox1').css({ background: '#fff' });
    });

    jQuery('#close-xbox').on('click', function(e) {
        e.preventDefault();
        jQuery('#big-search').hide();
        jQuery('#SearchTerm1, #Searchbox1').css({ background: '#fff' });
    });

    // }

    // Add CSS
    jQuery('head').append(jQuery('<link />', { rel: "stylesheet", type: "text/css", href: qops.css }));

    // shim to fix IE placeholder issue w/ jQuery
    if (window.navigator.userAgent.indexOf('MSIE ') > 0) {
        jQuery('[placeholder]').focus(function() {
            var input = jQuery(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = jQuery(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    }
}

function QueryString(key) {
    var re = new RegExp('(?:\\?|&)' + key + '=(.*?)(?=&|$)', 'gi');
    var r = [],
        m;
    while ((m = re.exec(document.location.search)) != null) r.push(m[1]);
    return r;
}