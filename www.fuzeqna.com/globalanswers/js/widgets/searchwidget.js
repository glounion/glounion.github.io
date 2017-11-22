if (!com) var com = {};
if (!com.fuze) com.fuze = {};


if (!com.fuze.searchwidget) {
    com.fuze.searchwidget = {
        baseUrl: '',
        jQuery: null, //private reference to our specific version of jquery to avoid conflicting with host page's versions of jquery
        jQueryVersion: '1.8.3',
        jQueryUIVersion: '1.8.23',
        baseInitSet: false,
        baseInitCompleted: false,
        widgetdata: null,
        childdata: null,
        resizeTimeOutId: null,
        resizing: false,
        onlinehelpBaseUrl: 'https://www.fuzeqna.com/onlinehelp',
        initJQuery: function (version, uiversion, callback) {
            try {
                if (!com.fuze.searchwidget.jQueryScriptOutputted) {
                    com.fuze.searchwidget.jQueryScriptOutputted = true;
                    com.fuze.jslib.loadCSSFile(com.fuze.jslib.getHomeDir() + '/css/colorbox.css');
                    if (version == undefined) version = '1.3.2';

                    if (uiversion == undefined) uiversion = '1.7.2';

                    //com.fuze.jslib.loadJSFile(document.location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js');
                    //com.fuze.jslib.loadJSFile(document.location.protocol + '//ajax.googleapis.com/ajax/libs/jqueryui/1.8.0/jquery-ui.min.js');
                    if (uiversion != 'noui') {
                        com.fuze.searchwidget.loadJSFile(
                            document.location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/' + version + '/jquery.min.js',
                            function () { com.fuze.searchwidget.setJQueryRef(function () { com.fuze.searchwidget.loadJQueryUI(uiversion, callback); }); }
                        );

                    } else {
                        com.fuze.searchwidget.loadJSFile(document.location.protocol + '//ajax.googleapis.com/ajax/libs/jquery/' + version + '/jquery.min.js', callback);
                    }
                } else {
                    com.fuze.searchwidget.loadJQueryPlugins(callback);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        setJQueryRef: function (callback) {
            try{
                com.fuze.searchwidget.jQuery = jQuery.noConflict();
                if (callback) callback();
            } catch (err) {
                    com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        loadJQueryUI: function (uiversion, callback) {
            try{
                if (typeof com.fuze.searchwidget.jQuery != 'undefined') {
                    com.fuze.searchwidget.jQuery.ajaxSetup({
                        cache: true
                    });
                    if (uiversion == undefined) uiversion = '1.7.2';
                    var uiUrl = document.location.protocol + '//ajax.googleapis.com/ajax/libs/jqueryui/' + uiversion + '/jquery-ui.min.js';
                    com.fuze.searchwidget.jQuery.getScript(uiUrl, callback);
                } else {
                    setTimeout(function () { com.fuze.searchwidget.loadJQueryUI(uiversion, callback); }, 500);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        loadJSFile: function (url, callback) {
            try{
                var e = document.createElement("script");
                e.src = url;
                e.type = "text/javascript";
                if (callback) {
                    var loadFunction = function () {
                        if (this.readyState == 'complete' || this.readyState == 'loaded') {
                            callback();
                        }
                    };
                    if (e.addEventListener) {
                        e.addEventListener("load", callback, false);
                    } else if (e.readyState) {
                        e.onreadystatechange = loadFunction;
                    }
                }
                document.getElementsByTagName("head")[0].appendChild(e);
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        create: function (widgetid, width, maxheight, entrypage, entrytype, accessOptions, qs, onlinehelp) {
            try{
                if (!com.fuze.searchwidget.widgetdata) {
                    com.fuze.searchwidget.widgetdata = new Array();
                }
                if (!com.fuze.searchwidget.widgetdata[widgetid]) {
                    com.fuze.searchwidget.widgetdata[widgetid] = new Object();
                } else {
                    return;
                }
                com.fuze.searchwidget.widgetdata[widgetid].id = widgetid;
                com.fuze.searchwidget.widgetdata[widgetid].width = width;
                com.fuze.searchwidget.widgetdata[widgetid].maxheight = maxheight;
                com.fuze.searchwidget.widgetdata[widgetid].accessOptions = accessOptions;
                com.fuze.searchwidget.widgetdata[widgetid].onlinehelp = onlinehelp;
                if (!entrypage) entrypage = 'kb';
                com.fuze.searchwidget.widgetdata[widgetid].entrypage = entrypage;
                com.fuze.searchwidget.widgetdata[widgetid].entrytype = entrytype;
                com.fuze.searchwidget.widgetdata[widgetid].qs = qs;
                if (!com.fuze.searchwidget.baseInitSet) {
                    com.fuze.searchwidget.baseInitSet = true;
                    if (window.attachEvent) { window.attachEvent('onload', function () { com.fuze.searchwidget.baseInit(); }); }
                    else if (window.addEventListener) { window.addEventListener('load', function () { com.fuze.searchwidget.baseInit(); }, false); }
                    else { document.addEventListener('load', com.fuze.searchwidget.baseInit, false); }
                } else {
                    com.fuze.searchwidget.init(widgetid);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        init: function (widgetid) {
            try{
                if (com.fuze.searchwidget.baseInitCompleted && com.fuze.searchwidget.jQuery.receiveMessage) {
                    if (com.fuze.searchwidget.widgetdata[widgetid].onlinehelp) {
                        com.fuze.searchwidget.onlinehelpBaseUrl = "https://www.fuzeqna.com/onlinehelp";
                        com.fuze.searchwidget.baseUrl = com.fuze.searchwidget.onlinehelpBaseUrl;
                    } else {
                        com.fuze.searchwidget.baseUrl = com.fuze.jslib.getHomeDir();
                    }
                    if (com.fuze.searchwidget.widgetdata[widgetid].entrypage == 'hp') {
                        //Home Page Widget
                        com.fuze.searchwidget.widgetdata[widgetid].url = com.fuze.searchwidget.baseUrl + '/' + com.fuze.searchwidget.widgetdata[widgetid].entrytype + '/answer.aspx?md=3&dt=kb&widgetid=' + widgetid + '&parent=' + encodeURIComponent(document.location);
                    } else if (com.fuze.searchwidget.widgetdata[widgetid].entrypage == 'cu') {
                        //Contact Us Widget
                        com.fuze.searchwidget.widgetdata[widgetid].url = com.fuze.searchwidget.baseUrl + '/' + com.fuze.searchwidget.widgetdata[widgetid].entrytype + '/contactus.aspx?widgetid=' + widgetid + '&parent=' + encodeURIComponent(document.location);
                    } else if (com.fuze.searchwidget.widgetdata[widgetid].entrypage == 'ca') {
                        //CA Widget
                        com.fuze.searchwidget.widgetdata[widgetid].url = com.fuze.searchwidget.baseUrl + '/' + com.fuze.searchwidget.widgetdata[widgetid].entrytype + '/commsearch.aspx?sct=CA&widgetid=' + widgetid + '&parent=' + encodeURIComponent(document.location);
                    } else {
                        //KB Widget
                        com.fuze.searchwidget.widgetdata[widgetid].url = com.fuze.searchwidget.baseUrl + '/' + com.fuze.searchwidget.widgetdata[widgetid].entrytype + '/kbsearch.aspx?widgetid=' + widgetid + '&parent=' + encodeURIComponent(document.location);
                    }

                    if (com.fuze.searchwidget.widgetdata[widgetid].qs) {
                        com.fuze.searchwidget.widgetdata[widgetid].url += '&' + com.fuze.searchwidget.widgetdata[widgetid].qs;
                    }
                    com.fuze.jslib.loadCSSFile(com.fuze.searchwidget.baseUrl + "/css/searchwidget.css");
                    com.fuze.searchwidget.widgetdata[widgetid].domain = com.fuze.jslib.getHost(com.fuze.searchwidget.widgetdata[widgetid].url);
                    com.fuze.searchwidget.widgetdata[widgetid].parentUrl = com.fuze.jslib.getParameterByNameWithSanitize('parent');
                    com.fuze.searchwidget.createIframe(widgetid);
                    com.fuze.searchwidget.createDialog(widgetid);

                    var uri = com.fuze.jslib.parseUri(com.fuze.searchwidget.widgetdata[widgetid].url);
                    var host = uri['protocol'] + '://' + uri['host'];
                    com.fuze.searchwidget.jQuery.receiveMessage(function (e) { com.fuze.searchwidget.processMessageFromChild(e.data); }, host);
                    com.fuze.searchwidget.createAccessPoint(widgetid);
                    com.fuze.searchwidget.widgetdata[widgetid].currentWidth = com.fuze.searchwidget.jQuery(document).width();
                } else {
                    setTimeout(function () { com.fuze.searchwidget.init(widgetid); }, 500);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }

        },
        isWidgetLoaded: function (widgetid) {
            try{
                if (com.fuze.searchwidget.widgetdata && com.fuze.searchwidget.widgetdata[widgetid] && com.fuze.searchwidget.widgetdata[widgetid].currentWidth) {
                    return true;
                }
                return false;
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        loadJQueryPluginsOld: function () {
            try{
                if (typeof jQuery != 'undefined') {
                    com.fuze.searchwidget.loadJSFile(com.fuze.jslib.getHomeDir() + '/js/jquery/jquery.colorbox-min.js',
                        function () {
                            com.fuze.searchwidget.loadJSFile(com.fuze.jslib.getHomeDir() + '/js/jquery/jquery.ba-postmessage.min.js', function () { com.fuze.searchwidget.postJQueryInit(); });
                        });
                } else {
                    setTimeout(function () { com.fuze.searchwidget.loadJQueryPlugins(); }, 100);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        loadJQueryPlugins: function () {
            try{
                if (typeof com.fuze.searchwidget.jQuery != 'undefined') {
                    var colorBoxUrl = com.fuze.jslib.getHomeDir() + '/js/jquery/jquery.colorbox-min.js';
                    var postMsgUrl = com.fuze.jslib.getHomeDir() + '/js/jquery/jquery.ba-postmessage.min.js';
                    com.fuze.searchwidget.jQuery.getScript(postMsgUrl,
                        function () {
                            com.fuze.searchwidget.jQuery.getScript(colorBoxUrl, function () { com.fuze.searchwidget.postJQueryInit(); });
                        });
                } else {
                    setTimeout(function () { com.fuze.searchwidget.loadJQueryPlugins(); }, 100);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        postJQueryInit: function () {
            try{
                //com.fuze.jslib.loadCSSFile(com.fuze.jslib.getHomeDir() + '/css/jquery-ui-1.7.2.custom.searchwidget.css');

                com.fuze.searchwidget.jQuery = jQuery.noConflict(true);
                com.fuze.searchwidget.baseInitCompleted = true;
                for (var key in com.fuze.searchwidget.widgetdata) {
                    com.fuze.searchwidget.init(com.fuze.searchwidget.widgetdata[key].id);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        baseInit: function () {
            try{
                com.fuze.searchwidget.initJQuery(com.fuze.searchwidget.jQueryVersion, com.fuze.searchwidget.jQueryUIVersion, function () { com.fuze.searchwidget.loadJQueryPlugins(); });
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        createIframe: function (widgetid) {
            try{
                if (document.getElementById('fuzesearchwidget' + widgetid)) {
                    document.getElementById('fuzesearchwidget' + widgetid).parentNode.removeChild(document.getElementById('fuzesearchwidget' + widgetid));
                }
                if (document.getElementById('fuzewidgetoverlay' + widgetid)) {
                    document.getElementById('fuzewidgetoverlay' + widgetid).parentNode.removeChild(document.getElementById('fuzewidgetoverlay' + widgetid));
                }

                var width = com.fuze.searchwidget.widgetdata[widgetid].width;
                if (!com.fuze.jslib.endsWith(width, '%')) {
                    width = (width) + "px";
                }
                var height = com.fuze.searchwidget.widgetdata[widgetid].maxheight;
                var overlaydiv = document.createElement("div");
                overlaydiv.setAttribute("id", "fuzewidgetoverlay" + widgetid);
                overlaydiv.style.maxWidth = width;
                overlaydiv.style.width = "100%";
                overlaydiv.style['-webkit-overflow-scrolling'] = 'touch';
                overlaydiv.style.height = height + "px";
                overlaydiv.style.display = "none";
                document.body.appendChild(overlaydiv);

                /*
                var loadingImageContainer = document.createElement("div");
                loadingImageContainer.setAttribute("id", "ajaxRequestProcess");
                loadingImageContainer.setAttribute("class", "ajaxRequest");
                loadingImageContainer.setAttribute("style", "background: none repeat scroll 0 0 #000000;border-radius: 10px 10px 10px 10px;height: auto;opacity: 0.6;padding: 10px;position: absolute;text-align: center;width: 300px;z-index: 0;");

            

                var loadingImageDiv = document.createElement("div");
                loadingImageDiv.setAttribute("class", "ajaxImage");
                loadingImageDiv.setAttribute("style", "display: block;height: 100px;margin: auto;width: 100px;");

            

                var loadingImage = document.createElement("img");
                loadingImage.setAttribute("src", com.fuze.searchwidget.baseUrl + "/images/spacer.gif");
                loadingImage.setAttribute("class", "loadingImage");
                loadingImage.setAttribute("title", "Loading");
                loadingImage.setAttribute("alt", "Loading");
                loadingImage.setAttribute("style", "background: url(../images/ajax-loader.gif) no-repeat scroll left top transparent;border: medium none;height: 55px;width: 54px;");


            

                loadingImageDiv.appendChild(loadingImage);
                loadingImageContainer.appendChild(loadingImageDiv);
                overlaydiv.appendChild(loadingImageContainer);
                */

                var ifrm = document.createElement("iframe");
                ifrm.setAttribute("id", 'fuzesearchwidget' + widgetid);
                ifrm.setAttribute("title", 'Get Answers');
                //ifrm.setAttribute("frameborder", "0");
            
                if (/iPhone/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent)) {
                    ifrm.setAttribute("scrolling", "no");
                    ifrm.setAttribute("noresize", "noresize");
                }
            
                //ifrm.style.width = width;
                ifrm.style.width = '1px';
                ifrm.style['min-width'] = '100%';
                ifrm.style.height = (height) + "px";
                ifrm.style.borderWidth = "0px";
                ifrm.style.border = "none";
                //--ifrm.onload = function () { console.log('myframe is loaded'); };

                overlaydiv.appendChild(ifrm);
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        createDialog: function (widgetid) {
            try{
                /*
                com.fuze.searchwidget.jQuery("#fuzewidgetoverlay" + widgetid).dialog({
                modal: true,
                width: com.fuze.searchwidget.widgetdata[widgetid].width + "px",
                //maxHeight: com.fuze.searchwidget.widgetdata[widgetid].maxHeight + "px",
                autoResize: true,
                autoOpen: false,
                closeOnEscape: true,
                resizable: false,
                dialogClass: 'fuzeSocialjQuery'
                });
                */
                //com.fuze.searchwidget.jQuery.colorbox({ width: com.fuze.searchwidget.widgetdata[widgetid].width, height: com.fuze.searchwidget.widgetdata[widgetid].maxheight, inline: true,href:"#fuzewidgetoverlay" + widgetid });
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        displayWidgetDialog: function (widgetid, qs) {
            try{
                if (com.fuze.searchwidget.baseInitCompleted && com.fuze.searchwidget.jQuery.receiveMessage && document.getElementById('fuzewidgetoverlay' + widgetid)) {
                    var uri = com.fuze.jslib.parseUri(com.fuze.searchwidget.widgetdata[widgetid].url);
                    var host = uri['protocol'] + '://' + uri['host'];
                    var anchor = uri['anchor'];
                    com.fuze.searchwidget.jQuery.receiveMessage(function (e) { com.fuze.searchwidget.processMessageFromChild(e.data); }, host);
                    com.fuze.searchwidget.resizeWidget(widgetid, com.fuze.searchwidget.widgetdata[widgetid].maxheight, com.fuze.searchwidget.widgetdata[widgetid].width, false,true);
                    document.getElementById("fuzewidgetoverlay" + widgetid).style.display = "block";
                    com.fuze.searchwidget.jQuery.colorbox({ innerWidth: "90%", maxWidth: com.fuze.searchwidget.widgetdata[widgetid].width, inline: true, href: "#fuzewidgetoverlay" + widgetid, reposition: false, scrolling: false, opacity: .7, overlayClose: false, className: 'fuzeColorBox', onClosed: function () { com.fuze.searchwidget.endCheckForResize(widgetid); } });
                    if (com.fuze.searchwidget.widgetdata[widgetid].onlinehelp) {
                        document.getElementById('fuzesearchwidget' + widgetid).setAttribute("src", com.fuze.jslib.getHomeDir() + '/int/fuzeonlinehelpsso.ashx?widgetid=' + widgetid + "&ep=" + com.fuze.searchwidget.widgetdata[widgetid].entrypage + "&parent=" + encodeURI(document.location));
                    } else if (qs) {
                        qs = qs.toString();
                        if (qs.indexOf('&') != 0) {
                            qs = '&' + qs;
                        }
                        qs = qs.replace(/\?/, '');
                        if (anchor) qs += anchor;
                        document.getElementById('fuzesearchwidget' + widgetid).setAttribute("src", com.fuze.searchwidget.widgetdata[widgetid].url + qs);
                    } else {
                        document.getElementById('fuzesearchwidget' + widgetid).setAttribute("src", com.fuze.searchwidget.widgetdata[widgetid].url);
                    }
                    com.fuze.searchwidget.widgetdata[widgetid].parentResizeIntervalId = setInterval(function () { com.fuze.searchwidget.checkForParentResize(widgetid); }, 150);

                    com.fuze.searchwidget.jQuery(document).bind('cbox_cleanup', function () {
                        document.getElementById('fuzesearchwidget' + widgetid).setAttribute("src", 'about:blank');
                        document.getElementById("fuzewidgetoverlay" + widgetid).style.display = "none";
                        com.fuze.searchwidget.jQuery('.cboxIframe').remove();
                    });
                } else {
                    setTimeout(function () { com.fuze.searchwidget.displayWidgetDialog(widgetid, qs); }, 250);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        endCheckForResize: function (widgetid) {
            try{
                if (com.fuze.searchwidget.widgetdata[widgetid].parentResizeIntervalId) {
                    clearInterval(com.fuze.searchwidget.widgetdata[widgetid].parentResizeIntervalId);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        displayWidgetDialogCPSearch: function (widgetid, qs) {
            try{
                var uri = com.fuze.jslib.parseUri(com.fuze.searchwidget.widgetdata[widgetid].url);
                var host = uri['protocol'] + '://' + uri['host'];
                com.fuze.searchwidget.jQuery.receiveMessage(function (e) { com.fuze.searchwidget.processMessageFromChild(e.data); }, host);
                com.fuze.searchwidget.resizeWidget(widgetid, com.fuze.searchwidget.widgetdata[widgetid].maxheight, com.fuze.searchwidget.widgetdata[widgetid].width, false,true);
                document.getElementById("fuzewidgetoverlay" + widgetid).style.display = "block";
                com.fuze.searchwidget.jQuery.colorbox({ innerWidth: "90%", maxWidth: com.fuze.searchwidget.widgetdata[widgetid].width, inline: true, href: "#fuzewidgetoverlay" + widgetid, reposition: false, scrolling: false, opacity: .7, overlayClose: false, className: 'fuzeColorBox' });
                if (qs) {
                    if (qs.indexOf('&') == -1) {
                        qs = '&' + qs;
                    }
                    qs = qs.replace(/\?/, '');
                    //insert this qs BEFORE the parent argument
                    var s = com.fuze.searchwidget.widgetdata[widgetid].url;
                    var sBefore = s.substring(0, s.indexOf("&parent"));
                    var sAfter = s.substring(s.indexOf("&parent"));
                    var widgeturl = sBefore + qs + sAfter;
                    document.getElementById('fuzesearchwidget' + widgetid).setAttribute("src", widgeturl);
                } else {
                    document.getElementById('fuzesearchwidget' + widgetid).setAttribute("src", com.fuze.searchwidget.widgetdata[widgetid].url);
                }
                com.fuze.searchwidget.jQuery(document).bind('cbox_cleanup', function () {
                    document.getElementById('fuzesearchwidget' + widgetid).setAttribute("src", 'about:blank');
                    document.getElementById("fuzewidgetoverlay" + widgetid).style.display = "none";
                    com.fuze.searchwidget.jQuery('.cboxIframe').remove();
                });
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        initChild: function (widgetid) {
            try{
                //This function is called from the widget itself.  It expects jquery is loaded in the widget on it's own, unlike the parent where it is auto-loaded.
                if (window.attachEvent) { window.attachEvent('onload', function () { com.fuze.searchwidget.initChildPostLoad(widgetid); }); }
                else if (window.addEventListener) { window.addEventListener('load', function () { com.fuze.searchwidget.initChildPostLoad(widgetid); }, false); }
                else { document.addEventListener('load', function () { com.fuze.searchwidget.initChildPostLoad(widgetid); }, false); }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        initChildPostLoad: function (widgetid) {
            try{
                com.fuze.searchwidget.loadJSFile(com.fuze.jslib.getHomeDir() + '/js/jquery/jquery.ba-postmessage.min.js', function () { com.fuze.searchwidget.postChildMessageInit(widgetid, com.fuze.jslib.getParameterByNameWithSanitize('parent')); });
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        postChildMessageInit: function (widgetid, parenturl) {
            try{
                if (!com.fuze.searchwidget.childata) {
                    com.fuze.searchwidget.childata = new Array();

                }
                if (!com.fuze.searchwidget.childata[widgetid]) {
                    com.fuze.searchwidget.childata[widgetid] = new Object();
                }
                if (!parenturl) {
                    com.fuze.searchwidget.childata[widgetid].parentUrl = unescape(com.fuze.jslib.sanitizeStrict(com.fuze.jslib.readCookie('fuzewidgetparent')));
                } else {
                    com.fuze.searchwidget.childata[widgetid].parentUrl = parenturl;
                    com.fuze.jslib.setCookie('fuzewidgetparent', parenturl, null, com.fuze.jslib.getHomeDir(), null, false);
                }


                com.fuze.searchwidget.childata[widgetid].currentHeight = $('body').outerHeight(true);
                com.fuze.searchwidget.childata[widgetid].currentWidth = $(document).width();
                com.fuze.searchwidget.sendMessage(widgetid, 'loadcomplete');
                com.fuze.searchwidget.sendResizeMessage(widgetid, null, null, false,true);
                com.fuze.searchwidget.childata[widgetid].resizeIntervalId = setInterval(function () { com.fuze.searchwidget.checkForResize(widgetid); }, 100);
                $(window).unload(function () {
                    if (com.fuze.searchwidget.childata[widgetid].resizeIntervalId) {
                        clearInterval(com.fuze.searchwidget.childata[widgetid].resizeIntervalId);
                    }
                });
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        checkForResize: function (widgetid) {
            try{
                if ($('body').outerHeight(true) != com.fuze.searchwidget.childata[widgetid].currentHeight && !com.fuze.searchwidget.resizing) {
                    if ((com.fuze.searchwidget.childata[widgetid].currentHeight > $('body').outerHeight(true) + 40) || com.fuze.searchwidget.childata[widgetid].currentHeight < $('body').outerHeight(true) - 40) {
                        com.fuze.searchwidget.resizing = true;
                        //com.fuze.searchwidget.childata[widgetid].currentHeight = $('body').outerHeight(true);
                        com.fuze.searchwidget.onIframeResize(widgetid, null, function () {
                            com.fuze.searchwidget.childata[widgetid].currentHeight = $('body').outerHeight(true);
                        });
                    }
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        checkForParentResize: function (widgetid) {
            try{
                var width = com.fuze.searchwidget.jQuery(window).width();
                if (width > com.fuze.searchwidget.widgetdata[widgetid].width) return;
                if (width != com.fuze.searchwidget.widgetdata[widgetid].currentWidth) {
                    if ((com.fuze.searchwidget.widgetdata[widgetid].currentWidth > width + 40) || (com.fuze.searchwidget.widgetdata[widgetid].currentWidth < width - 40)) {
                        com.fuze.searchwidget.widgetdata[widgetid].currentWidth = width;
                        com.fuze.searchwidget.resizeWidget(widgetid, null, width, false);
                    }
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        onIframeResize: function (widgetid, width, callback) {
            try{
                window.clearTimeout(com.fuze.searchwidget.resizeTimeoutId);
                if (width) {
                    com.fuze.searchwidget.resizeTimeoutId = window.setTimeout(function () { com.fuze.searchwidget.sendResizeMessage(widgetid, null, width, false, false, callback); }, 150);
                } else {
                    com.fuze.searchwidget.resizeTimeoutId = window.setTimeout(function () { com.fuze.searchwidget.sendResizeMessage(widgetid, null, null, false, false, callback); }, 150);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        sendResizeMessage: function (widgetid, height, width, force, firsttime, callback) {
            try{
                //This function is called from the widget itself.  It expects jquery is loaded in the widget on it's own, unlike the parent where it is auto-loaded.
                //com.fuze.searchwidget.resizing = true;
                var msg = widgetid + '|';
                if (height) {
                    msg += height;
                } else {
                    msg += $('body').outerHeight(true);
                }
                if (width) {
                    msg += '|' + width;
                } else {
                    msg += '|';
                }
                if (force) {
                    msg += '|true';
                } else {
                    msg += '|';
                }

                if (firsttime) {
                    msg += '|true';
                } else {
                    msg += '|';
                }
                com.fuze.searchwidget.sendMessage(widgetid, msg, height);
                if (callback) {
                    callback();
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        sendScrollMessage: function (widgetid) {
            com.fuze.searchwidget.sendMessage(widgetid, 'scrollparent');
        },
        sendMessage: function (widgetid, msg, height) {
            try{
                if ($.postMessage && com.fuze.searchwidget.childata[widgetid] && com.fuze.searchwidget.childata[widgetid].parentUrl) {
                    $.postMessage(msg, com.fuze.searchwidget.childata[widgetid].parentUrl, parent);
                    window.setTimeout(function () { if (height) { com.fuze.searchwidget.childata[widgetid].currentHeight = height; } com.fuze.searchwidget.resizing = false; }, 150);
                } else {
                    setTimeout(function () { com.fuze.searchwidget.sendMessage(widgetid, msg); }, 500);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        processMessageFromChild: function (msg) {
            try{
                if (msg == 'loadcomplete') {
                    //com.fuze.searchwidget.jQuery('#cboxLoadingGraphic').hide();
                    //com.fuze.searchwidget.jQuery('#cboxLoadingOverlay').hide();
                    return;
                }
                if (msg == 'scrollparent') {
                    com.fuze.searchwidget.scrollParent();
                }
                if (msg.indexOf('cust') == 0) {
                    com.fuze.searchwidget.runCustomFunction(msg);
                }
                if (msg == 'close') {
                    com.fuze.searchwidget.jQuery.colorbox.close();
                }
                var data = msg.split('|');
                var widgetid, height;
                var force = false;
                var firsttime = false;
                var width = null;
                if (data[0]) {
                    widgetid = data[0];
                }
                if (data.length > 1) {
                    height = parseInt(data[1], 10);
                }
                if (data.length > 2 && data[2]) {
                    width = data[2];
                }
                if (data.length > 3 && data[3]) {
                    force = data[3];
                }
                if (data.length > 4 && data[4]) {
                    firsttime = data[4];
                }
                if (widgetid && height) {
                    com.fuze.searchwidget.resizeWidget(widgetid, (height), (width), force, firsttime);
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        runCustomFunction: function (msg) {
            try{
                var data = msg.split('|');
                if (window[data[1]]) {
                    window[data[1]].apply(this, Array.prototype.slice.call(data, 2));
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        resizeWidget: function (widgetid, newheight, newwidth, force, firstload){ 
            try{
                var dialogHeight = newheight;
                if (!force && !newwidth && !firstload) {
                    if ($('#fuzewidgetoverlay' + widgetid).outerHeight(true) == newheight || ((newheight > $('#fuzewidgetoverlay' + widgetid).outerHeight(true) - 50) && newheight < $('#fuzewidgetoverlay' + widgetid).outerHeight(true) + 50)) return;
                }
                var ifrm = document.getElementById('fuzesearchwidget' + widgetid);
                var overlay = document.getElementById('fuzewidgetoverlay' + widgetid);

                if (!force && !firstload && newheight != null && (newheight > $(window).height() && newheight > 3000)) {
                    return;
                }

                if (dialogHeight != null) {
                    if (/Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent)) {
                        force = true;
                    }
                    if (/CordovaIos/i.test(navigator.userAgent)) {
                        force = true;
                    }
                    if (/iPhone/i.test(navigator.userAgent)) {
                        force = true;
                    }
                    if (/iPad/i.test(navigator.userAgent)) {
                        force = true;
                    }

                    if (!force) {
                        if (dialogHeight > com.fuze.searchwidget.widgetdata[widgetid].maxheight) dialogHeight = com.fuze.searchwidget.widgetdata[widgetid].maxheight;
                    }
                    overlay.style.height = (dialogHeight) + "px";
                    ifrm.style.height = (dialogHeight + 50) + "px";
                }

                if (newwidth) {
                    overlay.style.maxWidth = (newwidth) + "px";
                    overlay.style.width = "100%";
                }


                //if (newwidth) {
                //ifrm.style.width = (newwidth) + "px";
                //}
                if (isNaN(newwidth)) newwidth = null;



                if (newwidth && dialogHeight) {
                    com.fuze.searchwidget.jQuery.colorbox.resize({ innerHeight: dialogHeight + 50, innerWidth: "90%", maxWidth: newwidth });
                } else if (dialogHeight) {
                    com.fuze.searchwidget.jQuery.colorbox.resize({ innerHeight: dialogHeight + 50 });
                } else if (newwidth) {
                    com.fuze.searchwidget.jQuery.colorbox.resize({ innerWidth: "90%", maxWidth: newwidth });
                }
                //com.fuze.searchwidget.jQuery('#' + widgetid).dialog("option", "height", dialogHeight);
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        },
        scrollParent: function (widgetid) {
            com.fuze.searchwidget.jQuery('html,body').animate({
                scrollTop: com.fuze.searchwidget.jQuery("#colorbox").offset().top
            });
        },
        createAccessPoint: function (widgetid) {
            try{
                if (!com.fuze.searchwidget.widgetdata[widgetid].accessOptions) return;
                var btn = document.createElement("div");
                btn.setAttribute('id', 'fuzesearchwidgetaccess' + widgetid);
                btn.setAttribute('name', 'fuzesearchwidgetaccess' + widgetid);
                if (com.fuze.searchwidget.widgetdata[widgetid].accessOptions.position == 'left') {
                    btn.setAttribute('class', 'fuzeSearchWidgetAccessTabLeft');
                } else {
                    btn.setAttribute('class', 'fuzeSearchWidgetAccessTabRight');
                }
                btn.innerHTML = com.fuze.searchwidget.widgetdata[widgetid].accessOptions.accessText;
                btn.onmouseover = function () {
                    com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("background-color", com.fuze.searchwidget.widgetdata[widgetid].accessOptions.highlightcolor);
                    com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("color", "#000");
                }
                btn.onmouseout = function () {
                    //document.getElementById('fuzesearchwidgetaccess' + widgetid).style.backgroundColor = com.fuze.searchwidget.widgetdata[widgetid].accessOptions.backgroundcolor;
                    com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css(com.fuze.searchwidget.widgetdata[widgetid].accessOptions.accessCss);
                    if (com.fuze.searchwidget.jQuery.browser.msie) {
                        if (com.fuze.searchwidget.jQuery.browser.version < 9) {
                            if (com.fuze.searchwidget.widgetdata[widgetid].accessOptions.position == "right") {
                                com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("right", "-" + (parseInt(com.fuze.searchwidget.widgetdata[widgetid].accessOptions.accessCss.width) + 4));
                                com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("filter", "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)");
                            } else {
                                com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("filter", "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)");
                            }

                        }
                    }
                }
                btn.onclick = function () {
                    com.fuze.searchwidget.displayWidgetDialog(widgetid);
                }

                document.body.appendChild(btn);

                com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css(com.fuze.searchwidget.widgetdata[widgetid].accessOptions.accessCss);
                /*
                if (com.fuze.searchwidget.widgetdata[widgetid].accessOptions.position == "right") {
                if (com.fuze.searchwidget.jQuery.browser.msie) {
                if (com.fuze.searchwidget.jQuery.browser.version >= 8) {
                //com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("right", "-" + com.fuze.searchwidget.widgetdata[widgetid].accessOptions.accessCss.width);
                } else if (com.fuze.searchwidget.jQuery.browser.version >= 7) {
                //com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("right", "0px");
                }
                }
                } else {
                */
                if (com.fuze.searchwidget.jQuery.browser.msie) {
                    if (com.fuze.searchwidget.jQuery.browser.version < 9) {
                        if (com.fuze.searchwidget.widgetdata[widgetid].accessOptions.position == "right") {
                            com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("right", "-" + (parseInt(com.fuze.searchwidget.widgetdata[widgetid].accessOptions.accessCss.width) + 4));
                            com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("filter", "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)");
                        } else {
                            com.fuze.searchwidget.jQuery('#fuzesearchwidgetaccess' + widgetid).css("filter", "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)");
                        }

                    }
                }
            } catch (err) {
                com.fuze.logjs.logErr(com.fuze.jslib.getHomeDir(), err.stack, "searchwidget.html");
            }
        }
    }
}


if (!com.fuze.logjs) {
    com.fuze.logjs = {
        initXMLHttpClient: function () {
            var xmlhttp = null;
            try {
                // Mozilla / Safari / IE7
                xmlhttp = new XMLHttpRequest();
            } catch (e) {
                // IE
                var XMLHTTP_IDS = new Array('MSXML2.XMLHTTP.5.0',
                    'MSXML2.XMLHTTP.4.0',
                    'MSXML2.XMLHTTP.3.0',
                    'MSXML2.XMLHTTP',
                    'Microsoft.XMLHTTP');
                var success = false;
                for (var i = 0; i < XMLHTTP_IDS.length && !success; i++) {
                    try {
                        xmlhttp = new ActiveXObject(XMLHTTP_IDS[i]);
                        success = true;
                    } catch (e) {
                    }
                }
                if (!success) {
                    throw new Error('Unable to create XMLHttpRequest.');
                }
            }
            return xmlhttp;
        },
        logMsg: function (baseurl, msg, callback) {
            var req = com.fuze.logjs.initXMLHttpClient();
            var url = baseurl + "/common/logjs.ashx";

            url += "?type=err";
            url += "&msg=" + msg;

            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (callback) {
                        callback(req);
                    }
                }
            };
            req.open(method, url, true);
            req.send(null);
        },
        logErr: function (baseurl, msg, pagename, line, err, callback) {
            var req = com.fuze.logjs.initXMLHttpClient();
            var url = baseurl + "/common/logjs.ashx";

            url += "?type=err&pagename=" + encodeURIComponent(pagename);
            url += "&line=" + encodeURIComponent(line);
            url += "&msg=" + encodeURIComponent(msg);
            if (err) {
                if (err.number) {
                    url += "&errnum=" + encodeURIComponent(err.number);
                }
                if (err.name) {
                    url += "&errname=" + encodeURIComponent(err.name);
                }
                if (err.description) {
                    url += "&errdescription=" + encodeURIComponent(err.description);
                }

                if (err.message) {
                    url += "&errmsg=" + encodeURIComponent(err.message);
                }
            }

            req.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (callback) {
                        callback(req);
                    }
                }
            };
            req.open("GET.html", url, true);
            req.send(null);
        },
        logCallback: function (req) {

        }
    }
}
