var trackQEcall = setInterval(function() {
    console.log('running trackQEcall');
    if (window.jQuery) {
        clearInterval(trackQEcall);
        picoEditor();
    }
}, 10);

// Add Customisations here. Break out to functions where possible.
function picoEditor() {
    if (QueryString('sdb') == 'edspub') return; // stop custom application if this is ftf
    // used to ensure the code is run only once.
    if (jQuery('body').data('picoEditor') == 1) {
        console.log(jQuery('body').data('picoEditor'));
        return;
    } else { jQuery('body').attr('data-picoEditor', '1'); }

    // Execute code only in the basic search or results page 
    // if ( (document.location.pathname == "/eds/results") || (document.location.pathname == "/eds/search/basic") || (document.location.pathname == "/eds/search/advanced") || (document.location.pathname == "/eds/resultsadvanced") ) {

    // create and assemble the picoBox
    var thePicoBox = jQuery('<div />', { class: 'xbox', id: 'picoBox', style: 'display:none;' })
        .append(jQuery('<div />', { id: 'close-xbox' })
            .append(jQuery('<span />', { title: 'click to close the query editor textarea' })))
        .append(jQuery('<form />', {action: ''}));

    var theInputs = getTheInputs();
    jQuery(thePicoBox).find('form').append(jQuery(theInputs));

    jQuery('.find-field-inputs-row, .find-field-position').before(jQuery(thePicoBox));

    // place the xbox search link inline w/ other search options; place picoBox after the SearchTerm1 box
    jQuery('#basicItem').after('<li id="xboxItem" class="find-field-link"><a href="#" id="xboxAnchor" alt="Do a PICO search in EDS" title="Opens a separate form for entering a PICO expression">PICO Editor</a></li>');
    jQuery('#xboxItem').css('cursor', 'pointer');
    // jQuery('.find-field-inputs-row').before(jQuery('#picoBox'));

    jQuery('#SearchTerm1, #Searchbox1').focus(function() {
        jQuery('#picoBox').hide();
        jQuery('#SearchTerm1, #Searchbox1').css({ background: '#fff' });
    });

    jQuery('#close-xbox').on('click', function(e) {
        e.preventDefault();
        jQuery('#picoBox').hide();
        jQuery('#SearchTerm1, #Searchbox1').css({ background: '#fff' });
    });

    // }

    // Add CSS
    // jQuery('head').append('<link rel="stylesheet" type="text/css" href="http://widgets.ebscohost.com/prod/simplekey/picoEditor/css/picoEditor.css">');
    jQuery('head').append('<link rel="stylesheet" type="text/css" href="http://widgets101.sdn.ebscopub.com/prod/simplekey/picoEditor/css/picoEditor.css">');

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

function getTheInputs() {
    return '<fieldset react="PicoFieldSet">'+
                '<div class="picoField">'+
                    '<label for="picoPopulation">P</label>'+
                    '<input id="picoPopulation" placeholder="Population" type="text">'+
                    '<span class="help">?</span>'+
                '</div>'+
                '<div class="picoField">'+
                    '<label for="picoIntervention">I</label>'+
                    '<input id="picoIntervention" placeholder="Intervention" type="text">'+
                    '<span class="help">?</span>'+
                '</div>'+
                '<div class="picoField">'+
                    '<label for="picoCondition">C</label>'+
                    '<input id="picoCondition" placeholder="Condition" type="text">'+
                    '<span class="help">?</span>'+
                '</div>'+
                '<div class="picoField">'+
                    '<label for="picoOutcome">O</label>'+
                    '<input id="picoOutcome" placeholder="Outcome" type="text">'+
                    '<span class="help">?</span>'+
                '</div>'+
            '</fieldset>'+
            '<fieldset>'+
                '<input type="submit">'+
                '<input type="reset">'+
            '</fieldset>';
}