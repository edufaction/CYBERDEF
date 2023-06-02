/**
 * Author: Thus0
 *
 * Javascript for the toc_progress plugin for Reveal.js 4.x
 *      fork from TOC-Progress plugin by Igor Leturia, to be compatible with Reveal.js 4.x
 *
 * The plugin can be configured in reveal.json with toc_progress:{} json array 
 *
 * Warning: this plugin was not tested on Reveal.js 3.x for retro-compatibility
 *
 * License: GPL v3 (see LICENSE.md)
 *
 * credits:
 *   - Chalkboard by Asvin Goel https://github.com/rajgoel/reveal.js-plugins/
 *   - TOC-Progress by Igor Leturia https://github.com/lucarin91/Reveal.js-TOC-Progress/
 */

window.RevealTocProgress = window.RevealTocProgress || {
    id: 'reveal-toc-progress',
    init: function (deck) {
        initialize(deck);
    }
};

/**
 * Get plugin path
 */
function scriptPath() {
    // obtain plugin path from the script element
    var src;
    if ( document.currentScript ) {
        src = document.currentScript.src;
    } else {
        var sel = document.querySelector( 'script[src$="/toc-progress/toc-progress4x.js"]' )
        if ( sel ) {
            src = sel.src;
        }
    }
    var path = ( src === undefined ) ? "" : src.slice( 0, src.lastIndexOf( "/" ) + 1 );
    console.log("Path: " + path);
    return path;
}
var path = scriptPath();

/**
 * Init plugin FooterProgress
 */
const initialize = function(Reveal) {
    // Initialize default configuration
    var toc_progress_on = false;                    // indicate that TOC-Progress footer is displayed
    var background = 'rgba(0,0,127,0.1)';           // color of TOC footer background
    var current_background = 'rgb(70,70,100)';      // color of current slide title
    var current_bullet = 'red';                     // color of current slide title
    var hide_h2_title = true;                       // hide h2 title on secondary view
    var reduce_or_scroll = 'scroll';                // reduce | scroll
    var hotkey = "Q";                               // hotkey to toggle TOC-Progress footer
    var viewport = "body";                          // "html" for Reveal.js 3.x | "body" for Reveal.js 4.x

    // Load configuration file
    loadConfig();

    // Load stylesheet
    loadStylesheet(config);

    // Load key bindings
    loadKeyBindings(config);

    // Create hidden TOC-Progress footer
    create();

    // Display TOC-Progress footer on startup
    toggle();

    /**
     * EventListener: 'slidechanged'
     * Capture 'slidechanged' event to reduce or scroll the elements in the TOC-Progress footer if necessary
     */
    Reveal.addEventListener( 'slidechanged', function( event ) {
        reduceOrScrollIfNecessary(reduce_or_scroll);
    } );

    /**
     * Load configuration
     */
    function loadConfig() {
        config = Reveal.getConfig().toc_progress || {};
        if ( 'background' in config ) background = config.background;
        if ( 'current_background' in config ) current_background = config.current_background;
        if ( 'current_bullet' in config ) current_bullet = config.current_bullet;
        if ( 'hide_h2_title' in config ) hide_h2_title = config.hide_h2_title;
        if ( 'hotkey' in config ) hotkey = config.hotkey;
        if ( 'reduce_or_scroll' in config ) reduce_or_scroll = config.reduce_or_scroll;
        if ( 'toc_progress_on' in config ) toc_progress_on = config.toc_progress_on;
        if ( 'viewport' in config ) viewport = config.viewport;
    }

    /**
     * Load stylesheet
     */
    function loadStylesheet(config) { 
        var head = document.querySelector("head");

        // Add footer_process.css stylesheet
        var link = document.createElement("link");
        link.href = path + "toc-progress.css";
        link.type = "text/css";
        link.rel = "stylesheet";

        // Wrapper for callback to make sure it only fires once
        var finish = function() {
            if ( typeof callback === 'function' ) {
                callback.call();
                callback = null;
            }
        };
        link.onload = finish;
        // Internet Explorer
        link.onreadystatechange = function () {
            if ( readyState === 'loaded' ) {
                finish();
            }
        };
        // Normal browsers
        head.appendChild(link);
    }

    /**
     * Load key bindings
     * Capture 'Q' (81) key to toggle the diplay of the TOC-Progress footer
     */
    function loadKeyBindings(config) {
        // TODO: warn user if key is already set
        Reveal.addKeyBinding( { keyCode: hotkey.charCodeAt(0), key: hotkey, description: "Toggle TOC-Progress footer" }, function() {toggle()} ); 
    }

    /*
     * Function to obtain all child elements with any of the indicated tags
     * (from http://www.quirksmode.org/dom/getElementsByTagNames.html)
     */
    function getElementsByTagNames(list,obj) {
        if (!obj) {
            var obj=document;
        };
        var tagNames=list.split(',');
        var resultArray=new Array();
        for (var i=0;i<tagNames.length;i++) {
            var tags=obj.getElementsByTagName(tagNames[i]);
            for (var j=0;j<tags.length;j++) {
                resultArray.push(tags[j]);
            };
        };
        var testNode=resultArray[0];
        if (!testNode) {
            return [];
        };
        if (testNode.sourceIndex) {
            resultArray.sort(
                function (a,b) {
                    return a.sourceIndex-b.sourceIndex;
                }
            );
        } else if (testNode.compareDocumentPosition) {
            resultArray.sort(
                function (a,b) {
                    return 3-(a.compareDocumentPosition(b)&6);
                }
            );
        };
        return resultArray;
    };

    /**
     * Method to create the TOC-Progress footer
     */
    function create() {
        console.log("create");
        // Create the skeleton

        // Footer primary
        var toc_progress_footer = document.createElement("footer");
            toc_progress_footer.setAttribute('id','toc-progress-footer');
            toc_progress_footer.setAttribute('style','display: none');
        var toc_progress_footer_main=document.createElement('div');
            toc_progress_footer_main.setAttribute('id','toc-progress-footer-main');
            toc_progress_footer.appendChild(toc_progress_footer_main);
        var toc_progress_footer_main_inside=document.createElement('div');
            toc_progress_footer_main_inside.setAttribute('id','toc-progress-footer-main-inside');
            toc_progress_footer_main.appendChild(toc_progress_footer_main_inside);
        var toc_progress_footer_main_inside_ul=document.createElement('ul');
            toc_progress_footer_main_inside.appendChild(toc_progress_footer_main_inside_ul);

        // Footer secondary
        var toc_progress_footer_secondary=document.createElement('div');
            toc_progress_footer_secondary.setAttribute('id','toc-progress-footer-secondary');
            toc_progress_footer.appendChild(toc_progress_footer_secondary);
        var toc_progress_footer_secondary_inside=document.createElement('div');
            toc_progress_footer_secondary_inside.setAttribute('id','toc-progress-footer-secondary-inside');
            toc_progress_footer_secondary.appendChild(toc_progress_footer_secondary_inside);
        var toc_progress_footer_secondary_inside_ul=document.createElement('ul');
            toc_progress_footer_secondary_inside.appendChild(toc_progress_footer_secondary_inside_ul);
        var toc_progress_footer_secondary_inside_ul_ul=document.createElement('ul');
            toc_progress_footer_secondary_inside_ul.appendChild(toc_progress_footer_secondary_inside_ul_ul);

        // Footer tertiary
        // TODO : create footer tertiary only if we process <h4> header
        var toc_progress_footer_tertiary=document.createElement('div');
            toc_progress_footer_tertiary.setAttribute('id','toc-progress-footer-tertiary');
            toc_progress_footer.appendChild(toc_progress_footer_tertiary);
        var toc_progress_footer_tertiary_inside=document.createElement('div');
            toc_progress_footer_tertiary_inside.setAttribute('id','toc-progress-footer-tertiary-inside');
            toc_progress_footer_tertiary.appendChild(toc_progress_footer_tertiary_inside);
        var toc_progress_footer_tertiary_inside_ul=document.createElement('ul');
            toc_progress_footer_tertiary_inside.appendChild(toc_progress_footer_tertiary_inside_ul);
        var toc_progress_footer_tertiary_inside_ul_ul=document.createElement('ul');
            toc_progress_footer_tertiary_inside_ul.appendChild(toc_progress_footer_tertiary_inside_ul_ul);

        // Append our footer to Reveal object
        var div_class_reveal=document.querySelectorAll('.reveal')[0];
            div_class_reveal.appendChild(toc_progress_footer);

        // Create the style element
        var style_node=document.createElement('style');
        style_node.setAttribute('id','toc-progress-style');
        style_node.appendChild(document.createTextNode('\n'));
        div_class_reveal.parentNode.insertBefore(style_node,div_class_reveal.nextSibling);

        // Detect main sections and subsections and create list elements in the TOC-Progress footer and styles for each
        var main_sections=document.querySelectorAll('.slides > section');
        
        // own counter for secondary and tertiary footers
        var primary_footer_index=0;
        var secondary_footer_index=0;
        var tertiary_footer_index=0;
        var quaternary_footer_index=0;

console.log("main_sections.length: " + main_sections.length);
        for (var main_sections_index=0; main_sections_index<main_sections.length; main_sections_index++) {

            primary_footer_index++;
            var main_section=main_sections[main_sections_index];
            var secondary_sections=main_section.getElementsByTagName('section');

            // Main title
            var main_title_set = false;
            {
                var title_element=getElementsByTagNames('h1,h2,h3',main_section)[0];
                if (title_element!=null && (!title_element.hasAttribute('class') || title_element.getAttribute('class').indexOf('no-toc-progress')==-1)) {
console.log("");
console.log(".... 1 - create li ...." + title_element.textContent);

                    if (main_section.hasAttribute('data-state')) {
                        console.log("\t[primary] has data-state in slide: " + main_sections_index.toString());
                        main_section.setAttribute('data-state',main_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString());
                        //main_section.setAttribute('data-state',main_section.getAttribute('data-state')+' toc-progress-'+primary_footer_index.toString());
                    } else {
                        console.log("\t[primary] don't have data-state in slide: " + main_sections_index.toString());
                        main_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString());
                        //main_section.setAttribute('data-state','toc-progress-'+primary_footer_index.toString());
                    };
                    var li_element=document.createElement('li');
                    li_element.setAttribute('id','toc-progress-'+main_sections_index.toString());
                    //li_element.setAttribute('id','toc-progress-'+primary_footer_index.toString());
                    toc_progress_footer_main_inside_ul.appendChild(li_element);
                    var a_element=document.createElement('a');
                    a_element.setAttribute('href','#/'+main_sections_index.toString());
                    a_element.appendChild(document.createTextNode(title_element.textContent));
                    li_element.appendChild(a_element);

                    style_node.textContent=style_node.textContent+'.toc-progress-'+main_sections_index.toString()+' #toc-progress-'+main_sections_index.toString()+' {font-weight: bold; background-color: ' + current_background + '; color: ' + current_bullet + '}\n';
                    style_node.textContent=style_node.textContent+viewport+'[class*="toc-progress-'+main_sections_index.toString()+'-"] #toc-progress-'+main_sections_index.toString()+' {font-weight: bold; background-color: ' + current_background + '; color: ' + current_bullet + '}\n';

                    style_node.textContent=style_node.textContent+viewport+':not([class*="toc-progress-'+main_sections_index.toString()+'-"]):not([class*="toc-progress-'+main_sections_index.toString()+' "]):not([class$="toc-progress-'+main_sections_index.toString()+'"]) li[id^="toc-progress-'+main_sections_index.toString()+'-"] {display: none;}\n';

                    main_title_set = true;

console.log("sections_index: " + main_sections_index.toString())
console.log("footers_index:  " + primary_footer_index.toString() + '/' + secondary_footer_index.toString() + '/' + tertiary_footer_index.toString());

                } else if (title_element==null) {

                    var untitled_section_previous=main_section;
                    do {
                        if (untitled_section_previous.previousSibling==null) {
                            untitled_section_previous=untitled_section_previous.parentNode;
                        } else {
                            untitled_section_previous=untitled_section_previous.previousSibling;
                        };
                    } while (untitled_section_previous!=null && (untitled_section_previous.nodeType!=Node.ELEMENT_NODE || !untitled_section_previous.hasAttribute('data-state')));
                    if (untitled_section_previous!=null) {
                        main_section.setAttribute('data-state',untitled_section_previous.getAttribute('data-state'));
                    };
                };
            };

            // Secondary title
            if (secondary_sections.length>0) {
                for (var secondary_sections_index=0;secondary_sections_index<secondary_sections.length;secondary_sections_index++) {
                    var secondary_section=secondary_sections[secondary_sections_index];

                    var title_element=getElementsByTagNames('h1,h2,h3,h4',secondary_section)[0];
                    if (secondary_section.hasAttribute('class') && secondary_section.getAttribute('class').indexOf('no-toc-progress')!=-1) {
                        title_element = null;
                    }
                    if (title_element!=null && (!title_element.hasAttribute('class') || title_element.getAttribute('class').indexOf('no-toc-progress')==-1)) {

                        if (secondary_sections_index==0 && !main_title_set) {
console.log("");
console.log(".... 2 - create li ...." + title_element.textContent);

                            if (secondary_section.hasAttribute('data-state')) {
                                console.log("\t[secondary] has data-state in slide: " + main_sections_index.toString() + '/' + secondary_sections_index.toString());
                                secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString());
                            } else {
                                console.log("\t[secondary] don't have data-state in slide: " + main_sections_index.toString() + '/' + secondary_sections_index.toString());
                                secondary_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString());
                            };
                            var li_element=document.createElement('li');
                            li_element.setAttribute('id','toc-progress-'+main_sections_index.toString());
                            toc_progress_footer_main_inside_ul.appendChild(li_element);
                            var a_element=document.createElement('a');
                            a_element.setAttribute('href','#/'+main_sections_index.toString());
                            a_element.appendChild(document.createTextNode(title_element.textContent));
                            li_element.appendChild(a_element);

                            style_node.textContent=style_node.textContent+'.toc1 .toc-progress-'+main_sections_index.toString()+' #toc-progress-'+main_sections_index.toString()+' {font-weight: bold; background-color: ' + current_background + '; color: ' + current_bullet + '}\n';

                            style_node.textContent=style_node.textContent+viewport+'[class*="toc-progress-'+main_sections_index.toString()+'-"] #toc-progress-'+main_sections_index.toString()+' {font-weight: bold; background-color: ' + current_background + '; color: ' + current_bullet + '}\n';

console.log("sections_index: " + main_sections_index.toString())
console.log("footers_index:  " + primary_footer_index.toString() + '/' + secondary_footer_index.toString() + '/' + tertiary_footer_index.toString());
                        } else {

                            if (title_element.tagName == "H2") {
console.log("");
console.log(".... 3 - create li .... <h2>" + title_element.textContent)

                                secondary_footer_index++;
                                tertiary_footer_index=0;
                                if (secondary_section.hasAttribute('data-state')) {
                                    console.log("\t[secondary] has data-state in slide: " + main_sections_index.toString() + '/' + secondary_sections_index.toString());
                                    //secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
                                    secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString());
                                } else {
                                    console.log("\t[secondary] don't have data-state in slide: " + main_sections_index.toString() + '/' + secondary_sections_index.toString());
                                    //secondary_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
                                    secondary_section.setAttribute('data-state','toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString());
                                };

                                if (!hide_h2_title) {
                                    var li_element=document.createElement('li');
                                    //li_element.setAttribute('id','toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
                                    li_element.setAttribute('id','toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString());
                                    toc_progress_footer_secondary_inside_ul_ul.appendChild(li_element);
                                    var a_element=document.createElement('a');
                                    a_element.setAttribute('href','#/'+main_sections_index.toString()+'/'+secondary_sections_index.toString());
                                    a_element.appendChild(document.createTextNode(title_element.textContent));
                                    li_element.appendChild(a_element);

                                    style_node.textContent=style_node.textContent+'.toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+' #toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+' {font-weight: bold; background-color: ' + current_background + '; color: ' + current_bullet + '}\n';
                                }

console.log("sections_index: " + main_sections_index.toString() + '/' + secondary_sections_index.toString())
console.log("footers_index:  " + secondary_footer_index.toString() + '/' + tertiary_footer_index.toString());

                            } else if (title_element.tagName == "H3") {
console.log("");
console.log(".... 4 - create li <h3>...." + title_element.textContent);

                                tertiary_footer_index++;
                                quaternary_footer_index=0;
                                if (secondary_section.hasAttribute('data-state')) {
                                    console.log("\t[secondary] has data-state in slide: " + main_sections_index.toString() + '/' + secondary_sections_index.toString());
                                    //secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
                                    //secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString()+'-'+tertiary_footer_index.toString());
                                    secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString());
                                } else {
                                    console.log("\t[secondary] don't have data-state in slide: " + main_sections_index.toString() + '/' + secondary_sections_index.toString());
                                    //secondary_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
                                    //secondary_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString()+'-'+tertiary_footer_index.toString());
                                    secondary_section.setAttribute('data-state','toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString());
                                };

                                var li_element=document.createElement('li');
                                //li_element.setAttribute('id','toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
                                li_element.setAttribute('id','toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString());
                                toc_progress_footer_secondary_inside_ul_ul.appendChild(li_element);
                                var a_element=document.createElement('a');
                                a_element.setAttribute('href','#/'+main_sections_index.toString()+'/'+secondary_sections_index.toString());
                                a_element.appendChild(document.createTextNode(title_element.textContent));
                                li_element.appendChild(a_element);

                                style_node.textContent=style_node.textContent+'.toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+' #toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+' {font-weight: bold; background-color: ' + current_background + '; color: ' + current_bullet + '}\n';

console.log("sections_index: " + main_sections_index.toString() + '/' + secondary_sections_index.toString())
console.log("footers_index:  " + secondary_footer_index.toString() + '/' + tertiary_footer_index.toString());

                            } else if (title_element.tagName == "H4") {
console.log("");
console.log(".... 5 - create li <h4>...." + title_element.textContent);

                                quaternary_footer_index++;
                                if (secondary_section.hasAttribute('data-state')) {
                                    console.log("\t[tertiary] has data-state in slide: " + main_sections_index.toString() + '/' + secondary_sections_index.toString());
                                    //secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString()+' toc-progress-'+main_sections_index.toString()+'-'+tertiary_footer_index.toString()+'-'+quaternary_footer_index.toString());
                                    secondary_section.setAttribute('data-state',secondary_section.getAttribute('data-state')+' toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+' toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+'-'+quaternary_footer_index.toString());
                                } else {
                                    console.log("\t[tertiary] don't have data-state in slide: " + main_sections_index.toString() + '/' + secondary_sections_index.toString());
                                    //secondary_section.setAttribute('data-state','toc-progress-'+main_sections_index.toString()+'-'+tertiary_footer_index.toString()+' toc-progress-'+main_sections_index.toString()+'-'+tertiary_footer_index.toString()+'-'+quaternary_footer_index.toString());
                                    secondary_section.setAttribute('data-state','toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+' toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+'-'+quaternary_footer_index.toString());
                                };

                                var li_element=document.createElement('li');
                                //li_element.setAttribute('id','toc-progress-'+main_sections_index.toString()+'-'+secondary_sections_index.toString());
                                li_element.setAttribute('id','toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+'-'+quaternary_footer_index.toString());
                                toc_progress_footer_tertiary_inside_ul_ul.appendChild(li_element);
                                var a_element=document.createElement('a');
                                a_element.setAttribute('href','#/'+main_sections_index.toString()+'/'+secondary_sections_index.toString());
                                a_element.appendChild(document.createTextNode(title_element.textContent));
                                li_element.appendChild(a_element);

                                style_node.textContent=style_node.textContent+viewport+':not([class*="toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+'"]) li[id^="toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+'-"] {display: none;}\n';

                                style_node.textContent=style_node.textContent+'.toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+'-'+quaternary_footer_index.toString()+' #toc-progress-'+secondary_footer_index.toString()+'-'+tertiary_footer_index.toString()+'-'+quaternary_footer_index.toString()+' {font-weight: bold; background-color: ' + current_background + '; color: ' + current_bullet + '}\n';

console.log("sections_index: " + main_sections_index.toString() + '/' + secondary_sections_index.toString())
console.log("footers_index:  " + secondary_footer_index.toString() + '/' + tertiary_footer_index.toString() + '/' + quaternary_footer_index.toString());

                            } else {
                                console.log("\t[secondary] hide from TOC");
                            }

                        };
                    } else if (title_element==null) {
                        var untitled_section_previous=secondary_section;
                        do {
                            if (untitled_section_previous.previousSibling==null) {
                                untitled_section_previous=untitled_section_previous.parentNode;
                            } else {
                                untitled_section_previous=untitled_section_previous.previousSibling;
                            };
                        } while (untitled_section_previous!=null && (untitled_section_previous.nodeType!=Node.ELEMENT_NODE || !untitled_section_previous.hasAttribute('data-state')));
                        if (untitled_section_previous!=null) {
                            secondary_section.setAttribute('data-state',untitled_section_previous.getAttribute('data-state'));
                        };
                    };
                };
            };
        };

        // Reduce or scroll the elements in the TOC-Progress footer if necessary
        reduceOrScrollIfNecessary(reduce_or_scroll);
    }

    /*
     * Method to destroy the TOC-Progress footer
     */
    function destroy() {
        var toc_progress_footer=document.getElementById('toc-progress-footer');
        toc_progress_footer.parentNode.removeChild(toc_progress_footer);
        var toc_progress_style=document.getElementById('toc-progress-style');
        toc_progress_style.parentNode.removeChild(toc_progress_style);
        var title_element_sections=document.querySelectorAll('section[data-state*="toc-progress-"]');
        for (var title_element_sections_index=0;title_element_sections_index<title_element_sections.length;title_element_sections_index++) {
            var title_element_section=title_element_sections[title_element_sections_index];
            title_element_section.setAttribute('data-state',title_element_section.getAttribute('data-state').replace(/ toc-progress-\d+-\d+/g,''));
            title_element_section.setAttribute('data-state',title_element_section.getAttribute('data-state').replace(/toc-progress-\d+-\d+/g,''));
            title_element_section.setAttribute('data-state',title_element_section.getAttribute('data-state').replace(/ toc-progress-\d+/g,''));
            title_element_section.setAttribute('data-state',title_element_section.getAttribute('data-state').replace(/toc-progress-\d+/g,''));
            if (title_element_section.getAttribute('data-state')=='') {
                title_element_section.removeAttribute('data-state')
            };
        };
    };

    /*
     * Method to toggle the TOC-Progress footer
     */
    function toggle() {
        var toc_progress_footer=document.getElementById('toc-progress-footer');
        if (toc_progress_on == true) {
            toc_progress_footer.style="background: " + background;
            toc_progress_on = true;
        } else {
            toc_progress_footer.style="display: none";
            toc_progress_on = false;
        };
    };

    /**
     * Reduce or scroll the elements in the TOC-Progress footer if necessary
     */
    function reduceOrScrollIfNecessary() {
        if (toc_progress_on==true) {
            reduceOrScrollElementIfNecessary(document.getElementById('toc-progress-footer-main'));
            reduceOrScrollElementIfNecessary(document.getElementById('toc-progress-footer-secondary'));
            reduceOrScrollElementIfNecessary(document.getElementById('toc-progress-footer-tertiary'));
        };
    };

    /* 
     * Reduce or scroll the elements in the TOC-Progress footer if necessary
     */
    function reduceOrScrollElementIfNecessary(element) {
        var visible_li_elements=0;
        var li_element_font_size=1000000;
        var li_elements=element.getElementsByTagName('li');
        for (var li_elements_index=0;li_elements_index<li_elements.length;li_elements_index++) {
            var li_element=li_elements[li_elements_index];
            li_element.removeAttribute('style');
            if (parseFloat(window.getComputedStyle(li_element).getPropertyValue('font-size').replace('px',''))<li_element_font_size) {
                li_element_font_size=parseFloat(window.getComputedStyle(li_element).getPropertyValue('font-size').replace('px',''));
            };
            if (window.getComputedStyle(li_element).getPropertyValue('display')!='none') {
                visible_li_elements=visible_li_elements+1;
            };
        };
        if (reduce_or_scroll=='reduce') {
            if (visible_li_elements*li_element_font_size>element.clientHeight) {
                var new_li_element_font_size=Math.floor(element.clientHeight/visible_li_elements);
                for (var li_elements_index=0;li_elements_index<li_elements.length;li_elements_index++) {
                    var li_element=li_elements[li_elements_index];
                    li_element.setAttribute('style','font-size:'+new_li_element_font_size.toString()+'px');
                };
            };
        } else if (reduce_or_scroll=='scroll') {
            var selected_element_index=-1;
            var visible_element_index=-1;
            for (var li_elements_index=0;li_elements_index<li_elements.length;li_elements_index++) {
                var li_element=li_elements[li_elements_index];
                if (window.getComputedStyle(li_element).getPropertyValue('display')!='none') {
                    visible_element_index=visible_element_index+1;
                };
                if (window.getComputedStyle(li_element).getPropertyValue('font-weight')=='700') {
                    selected_element_index=visible_element_index;
                };
            };
            if (selected_element_index!=-1) {
                if (selected_element_index*li_element_font_size>element.parentNode.clientHeight/2) {
                    element.scrollTop=Math.floor((selected_element_index*li_element_font_size)-(element.parentNode.clientHeight/2)).toString();
                } else {
                    element.scrollTop=0;
                };
            } else {
                element.scrollTop=0;
            };
        };
    };

}

// vim: set sw=4 ts=4 et:
