/*++++++++++++++++++++++++++++++++++++
<script id="queryEditorTa" data-linklabel = "Query Editor" data-charlimit="40" data-before="advanced" src="http://gss.ebscohost.com/jknight/qe2/queryEditorTa-v1.1a.js"></script>
++++++++++++++++++++++++++++++++++++
data-linkLabel == Text to display (if omitted or blank, default is Query Editor)
data-before == Display before basic, advanced or history (if omitted or blank, default is to display before advanced)
data-css == Use custom CSS, use  data-css="URL_TO_CSS"  (if omitted or blank, default is to use http://widgets.ebscohost.com/prod/simplekey/bigsearchbox/bigsearchbox.css)
data-charLimit == Allow big search box to appear if the default search box hits a specific character limit. (if omitted or blank or 0, requires user to click the link.
++++++++++++++++++++++++++++++++++++*/


var trackQEcall = setInterval(function() {
    console.log('running trackQEcall');
    if (window.jQuery) {
        clearInterval(trackQEcall);
        queryEditor2();
    }
}, 10);

function queryEditor2() {
    if (QueryString('sdb') == 'edspub') return; // stop custom application if this is ftf
    // used to ensure the code is run only once.
    if (jQuery('body').data('queryEditor') == 1) {
        console.log(jQuery('body').data('queryEditor'));
        return;
    } else { jQuery('body').attr('data-queryEditor', '1'); }

    // let's process those data attributes
    var qops = jQuery('#queryEditorTa').data() || {};
    var beforeWhat = { "basic": "basicItem", "history": "historyItem", "advanced": "advancedItem" };
    qops.linklabel = qops.linklabel || 'Query Editor',
        qops.before = beforeWhat[qops.before] || beforeWhat['advanced'],
        qops.css = qops.css || 'http://widgets.ebscohost.com/prod/simplekey/queryEditor/css/queryEditor.css',
        qops.charlimit = qops.charlimit || 40;

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
        var searchTerm = jQuery('#SearchTerm1, #Searchbox1').val();
        jQuery('#big-textarea').val(searchTerm);
        jQuery('#big-search').show();
        jQuery('#SearchTerm1, #Searchbox1').css({
            background: '#dadada'
        });
    });

    jQuery('#SearchTerm1, #Searchbox1').keyup(function() {
        // experimental
        if (jQuery('#SearchTerm1, #Searchbox1').val().length > qops.charlimit) {
            var searchTerm = jQuery('#SearchTerm1, #Searchbox1').val();
            jQuery('#big-textarea').val(searchTerm);
            jQuery('#big-search').show();
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


// Used to control the display of content in specific pages.
function DisplayMe(blocks, id) {
    if (QueryString('sdb') == 'edspub') return; // stop custom application if this is ftf
    //basic,advanced,detail,results,resultsadvanced
    var displayBlocks = blocks.split(",")
    for (i = 0; i < displayBlocks.length; i++) {
        if (document.URL.indexOf("/" + displayBlocks[i] + "?") > -1) {
            document.getElementById(id).style.display = "block";
        }
    }
}
/* EXAMPLE - ensure DisplayMe loads first.
    <span id="linklist" style="display:none;">
        <script>DisplayMe('basic',"linklist")</script>
    <!—INSERT CONTENT HERE -->
    </span>
*/

function QueryString(key) {
    var re = new RegExp('(?:\\?|&)' + key + '=(.*?)(?=&|$)', 'gi');
    var r = [],
        m;
    while ((m = re.exec(document.location.search)) != null) r.push(m[1]);
    return r;
}
