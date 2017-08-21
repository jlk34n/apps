// queryEditor by jknight@ebsco.com (shoutout to Ariana Hazen for help w/ the auto popout and label customization)
// v1.1b
var trackQEcall = setInterval(function() {
    console.log('running trackQEcall');
    if (window.jQuery) {
        clearInterval(trackQEcall);
        queryEditor2();
    }
}, 10);

// Add Customisations here. Break out to functions where possible.
function queryEditor2() {
    if (QueryString('sdb') == 'edspub') return; // stop custom application if this is ftf
    // used to ensure the code is run only once.
    if (jQuery('body').data('queryEditor') == 1) {
        console.log(jQuery('body').data('queryEditor'));
        return;
    } else { jQuery('body').attr('data-queryEditor', '1'); }

    // Execute code only in the basic search or results page 
    // if ( (document.location.pathname == "/eds/results") || (document.location.pathname == "/eds/search/basic") || (document.location.pathname == "/eds/search/advanced") || (document.location.pathname == "/eds/resultsadvanced") ) {

    // create and assemble the big-search box
    var theQEBox = jQuery('<div />', { class: 'xbox', id: 'big-search', style: 'display:none;' })
        .append(jQuery('<div />', { id: 'close-xbox' })
            .append(jQuery('<span />', { title: 'click to close the query editor textarea' })))
        .append(jQuery('<textarea />', { autofocus: '', name: 'the-big-search', id: 'big-textarea', placeholder: 'Enter extended search expression here' }));

    console.log('.find-field-inputs-row, .find-field-position is : ' + jQuery('.find-field-inputs-row, .find-field-position'));
    jQuery('.find-field-inputs-row, .find-field-position').before(jQuery(theQEBox));

    // place the xbox search link inline w/ other search options; place big-search after the SearchTerm1 box
    console.log('#basicItem is : ' + jQuery('#basicItem'));
    jQuery('#basicItem').after('<li id="xboxItem" class="find-field-link"><a href="#" id="xboxAnchor" alt="Edit lengthy query expressions" title="Opens a separate textarea for editing long and complex query expressions">Query Editor</a></li>');
    jQuery('#xboxItem').css('cursor', 'pointer');
    // jQuery('.find-field-inputs-row').before(jQuery('#big-search'));

    // attach event listener
    jQuery('#xboxItem').on('click', function(e) {
        e.preventDefault();
        var searchTerm = jQuery('#SearchTerm1, #Searchbox1').val();
        // jQuery('#big-textarea').text('');
        // jQuery('#big-textarea').text(searchTerm);
        jQuery('#big-textarea').val(searchTerm);
        jQuery('#big-search').show();
        jQuery('#SearchTerm1, #Searchbox1').css({
            background: '#dadada'
        });
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
    jQuery('head').append('<link rel="stylesheet" type="text/css" href="http://gss.ebscohost.com/jknight/qe2/css/queryEditor.css">');

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
