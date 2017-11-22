if (!com) var com = {};
if (!com.fuze) com.fuze = {};

if (!com.fuze.sswidget) {
    com.fuze.sswidget = {
        baseUrl: null,
        ranInit: false,
        resultsTemplate: null,
        detailTemplate: null,
        startIndex: 1,
        pageLength: 10,
        searchText: '',
        previousSearchText: '',
        searchMode: 'and',
        detailPreAction: null,
        detailPostAction: null,
        keywordParameterName: null,
        enableRatings: false,
        enableRelatedContent: false,
        negRatingsRequireComments: true,
        useAlternatePaging: false,
        initialKBID: null,
        currentRating: null,
        currentKBID: null,
        backKBID: null,
        scrollToKBID: null,
        enableTopics: false,
        nbrTopicLevels: 3,
        currentTopicID: null,
        previousTopicID: null,
        contactUsWidgetID: null,
        contactUsWidgetWidth: null,
        contactUsWidgetHeight: null,
        enableKeywordSearch: false,
        enableSuggestions: true,
        enableTransitions: true,
        enableDidYouMean: false,
        advancedSearchWidgetID: null,
        advancedSearchWidgetWidth: null,
        advancedSearchWidgetHeight: null,
        transitionEffect: "blind",
        jQuery: null,
        viewGuid: null,
        labels: { clearTopicLink: "Clear Topic", searchButton: "Search", previousButton: "Previous", nextButton: "Next", moreAnswersButton: "More Answers", contactUsButton: "Contact Us", advSearchTitle: "Filter and browse by topic", advSearchButton: "Advanced Search", ratingPostedMessage: "Thank you for your input.", returnTitle: "Return to Search", returnButton: "Return", rateHeading: "Rate this", improveContentText: "What suggestions do you have to make the content better?", effectiveContentText: "What makes this content so effective?", ratingSubmitButton: "Submit", relatedContentTitle: "View Related Content", relatedContentHeading: "Related Content", backTitle: "Back to Original Item", backButton: "Back", moreDetailsTitle: "Rate/Comment, Related Content, Larger View, Tools", moreDetailsButton: "More...", topicHeading: "Filter/Browse by Topic" },
        init: function (initParams) {
            com.fuze.sswidget.jQuery = jQuery;  //Save jquery reference for later.
            if (com.fuze.jslib) {
                if (!com.fuze.sswidget.ranInit) {
                    com.fuze.sswidget.ranInit = true;
                    if (initParams && initParams.baseUrl) {
                        com.fuze.sswidget.baseUrl = initParams.baseUrl;
                    } else {
                        com.fuze.sswidget.baseUrl = com.fuze.jslib.getHomeDir();
                    }


                    com.fuze.sswidget.resultsTemplate = com.fuze.sswidget.getResultsTemplate();
                    com.fuze.sswidget.resultsDetailTemplate = com.fuze.sswidget.getResultsDetailTemplate();
                    if (com.fuze.sswidget.keywordParameterName) {
                        com.fuze.sswidget.searchText = com.fuze.jslib.getParameterByNameWithSanitize(com.fuze.sswidget.keywordParameterName);
                    } else {
                        com.fuze.sswidget.searchText = com.fuze.jslib.getParameterByNameWithSanitize('query');
                    }
                    com.fuze.sswidget.initialKBID = com.fuze.jslib.getParameterByNameWithSanitize('fkbid');
                    com.fuze.sswidget.currentTopicID = com.fuze.jslib.getParameterByNameWithSanitize('fcatid');

                    com.fuze.jslib.loadCSSFile(com.fuze.sswidget.baseUrl + '/css/sswidget/default/main.css');
                    com.fuze.sswidget.createResultsHtml();

                    if (com.fuze.sswidget.enableKeywordSearch && com.fuze.sswidget.enableSuggestions) {
                        if (typeof window.fuzeSuggestionsConfig == 'undefined') {
                            window.fuzeSuggestionsConfig = new Object();
                        }
                        window.fuzeSuggestionsConfig.searchTextBox = 'fuzeSSWSearchBox';
                        window.fuzeSuggestionsConfig.useSSWidget = true;
                        com.fuze.sswidget.jQuery.getScript(com.fuze.sswidget.baseUrl + '/js/widgets/suggestions.js');
                    }
                    com.fuze.sswidget.jQuery.getScript(com.fuze.sswidget.baseUrl + '/js/jquery/jquery.scrollTo.min.js');
                    com.fuze.sswidget.jQuery.getScript(com.fuze.sswidget.baseUrl + '/js/jquery/jquery.tmpl.min.js', function () {
                        if (com.fuze.sswidget.enableTopics) {
                            com.fuze.jslib.loadCSSFile(com.fuze.sswidget.baseUrl + '/css/jquery.selectric.css');
                            com.fuze.sswidget.jQuery.getScript(com.fuze.sswidget.baseUrl + '/js/jquery/jquery.selectric.min.js', function () { com.fuze.sswidget.loadTopics(); });
                        }
                        if (com.fuze.sswidget.enableKeywordSearch) {
                            com.fuze.sswidget.jQuery('#fuzeSSWSearchBoxContainer').show();
                            com.fuze.sswidget.jQuery('#fuzeSSWSearchBoxContainer').on("keydown", function (event) {
                                if (event.keyCode == 13) {
                                    com.fuze.sswidget.jQuery('#fuzeSSWSearch').click();
                                }
                            });
                            if (com.fuze.sswidget.searchText != '') {
                                com.fuze.sswidget.jQuery('#fuzeSSWSearchBox').val(com.fuze.sswidget.searchText);
                            }
                        }
                        if (!com.fuze.sswidget.initialKBID) {
                            com.fuze.sswidget.search();
                        } else {
                            com.fuze.sswidget.showInitialKBItem(com.fuze.sswidget.initialKBID);
                        }
                    });
                    if (com.fuze.sswidget.contactUsWidgetID != null || com.fuze.sswidget.advancedSearchWidgetID != null) {
                        com.fuze.sswidget.jQuery.getScript(com.fuze.sswidget.baseUrl + '/js/widgets/searchwidget.js', function () { com.fuze.sswidget.initWidgets(); });
                    }
                }
            } else {
                setTimeout(function () { com.fuze.sswidget.init(); }, 100);
            }
        },
        createResultsHtml: function () {
            var advancedSearchHtml = '<div class="fuzeSSWAdvSearchContainer">';
            if (com.fuze.sswidget.advancedSearchWidgetID) {
                advancedSearchHtml += '<a href="javascript:void(0);" id="advSearchLink" class="fuzeSSWAdvSearch" title="' + com.fuze.sswidget.labels.advSearchTitle + '">' + com.fuze.sswidget.labels.advSearchButton;
            } else {
                advancedSearchHtml += '<a href="' + com.fuze.sswidget.baseUrl + '/ext/kbsearch.aspx?keyword=' + com.fuze.sswidget.searchText + '" class="fuzeSSWAdvSearch" title="' + com.fuze.sswidget.labels.advSearchTitle + '">' + com.fuze.sswidget.labels.advSearchButton;
            }
            advancedSearchHtml += '</a></div>';

            var resultsHtml = '<div class="fuzeSSWWrapper">' +
                            '<div class="fuzeSSWKBWrapper">' +
                                '<div id="fuzeSSWTopicContainer" style="display:none;">' +
                                '    <div id="fuzeSSWTopicListContainer">' +
                                '        <select id="fuzeSSWTopicTree"></select>' +
                                '    </div>' +
                                '    <div id="fuzeSSWClearTopicContainer">' +
            //'        <a id="fuzeSSWClearTopic" href="#" onclick="com.fuze.sswidget.clearTopic();" style="display:none;">' + com.fuze.sswidget.labels.clearTopicLink + '</a>' +
            //'           <input id="fuzeSSWClearTopic" value="X" class="fuzeClearX" type="button" onclick="com.fuze.sswidget.clearTopic();" style="display:none;" >' +
                                '            <div id="fuzeSSWClearTopic" class="fuzeClearX" onclick="com.fuze.sswidget.clearTopic();" style="display:none;" title="' + com.fuze.sswidget.labels.clearTopicLink + '">X</div>' +
                                '    </div>' +
                                '</div>' +
                                '<div id="fuzeSSWSearchBoxContainer" style="display:none;">' +
                                '    <input id="fuzeSSWSearchBox" type="text" size="' + com.fuze.sswidget.getSearchBoxSize() + '" />' +
                                '    <a id="fuzeSSWSearch" href="javascript:void(0);" onclick="com.fuze.sswidget.newSearch();return false;">' + com.fuze.sswidget.labels.searchButton + '</a>' +
                                '</div>' +
                                '<div style="clear:both;" />' +
                                '<div class="fuzeSSWResults" id="fuzeSSWResults"></div>' +
                                '<div id="fuzeSSNavWrapper"><a id="fuzeSSWPrev" href="javascript:void(0);" onclick="com.fuze.sswidget.navigateResults(com.fuze.sswidget.startIndex-com.fuze.sswidget.pageLength);return false;" style="display:none;">' + com.fuze.sswidget.labels.previousButton + '</a><a id="fuzeSSWNext" href="javascript:void(0);" onclick="com.fuze.sswidget.navigateResults(com.fuze.sswidget.startIndex+com.fuze.sswidget.pageLength);return false;" style="display:none;">' + com.fuze.sswidget.labels.nextButton + '</a><a id="fuzeSSWMoreAnswers" href="javascript:void(0);" onclick="com.fuze.sswidget.navigateResults(com.fuze.sswidget.startIndex+com.fuze.sswidget.pageLength);return false;" style="display:none;">' + com.fuze.sswidget.labels.moreAnswersButton + '</a></div>' +
                                '<div id="fuzeSSWContactUsContainer" style="display:none;"><input type="button" id="fuzeSSWContactUsBtn" value="' + com.fuze.sswidget.labels.contactUsButton + '" /></div>' +
                                '<div class="fuzeSSWAdvSearchContainer">' +
                                advancedSearchHtml +
                            '</div>' +
                        '</div>' +
                        '<div id="fuzeSSWResultDetails"></div>' +
                        '<div id="fuzeSSWNoResults"></div>' +
                        '<br />';
            com.fuze.sswidget.jQuery('#fuzesswidget').append(resultsHtml);
        },
        loadKBItem: function (kbid, callback) {
            var url = com.fuze.sswidget.baseUrl + '/widgets/sswidget.ashx';
            com.fuze.sswidget.jQuery.ajax({
                contentType: "application/json",
                type: "GET",
                dataType: "jsonp",
                url: url,
                data: "kbid=" + encodeURI(kbid) + "&action=getKB",
                crossdomain: true,
                success: function (data) {
                    if (document.getElementById('fuzeSSW' + kbid + 'Detail') != null) {
                        //If detail div exists for item, remove it
                        com.fuze.sswidget.jQuery("#fuzeSSW" + kbid + "Detail").remove();
                    }
                    //if (com.fuze.searchwidget && com.fuze.searchwidget.jQuery) {
                        //com.fuze.searchwidget.jQuery.tmpl(com.fuze.sswidget.getResultsDetailTemplate(), data).appendTo("#fuzeSSWResultDetails");
                    //} else {
                        com.fuze.sswidget.jQuery.tmpl(com.fuze.sswidget.getResultsDetailTemplate(), data).appendTo("#fuzeSSWResultDetails");
                    //}
                    com.fuze.sswidget.processRelatedContent(data);

                    if (callback) {
                        callback();
                    }
                }
            });
        },
        showRelatedItem: function (kbid) {
            com.fuze.sswidget.swapItems(com.fuze.sswidget.currentKBID, kbid);
            com.fuze.sswidget.jQuery("#btn" + kbid + "Back").unbind("click");
            com.fuze.sswidget.jQuery("#btn" + kbid + "Back").click(function () {
                com.fuze.sswidget.swapItems(kbid, com.fuze.sswidget.backKBID);
                com.fuze.sswidget.jQuery("#btn" + kbid + "Back").hide();
                com.fuze.sswidget.jQuery("#btn" + com.fuze.sswidget.backKBID + "Back").hide();  //Back button can only go back 1 level
                com.fuze.sswidget.currentKBID = com.fuze.sswidget.backKBID;
            });
            com.fuze.sswidget.backKBID = com.fuze.sswidget.currentKBID;
            com.fuze.sswidget.currentKBID = kbid;
            com.fuze.sswidget.jQuery("#btn" + kbid + "Back").show();
        },
        swapItems: function (kbid1, kbid2) {
            if (com.fuze.sswidget.enabledTransitions) {
                com.fuze.sswidget.jQuery("#fuzeSSW" + kbid1 + "Detail").toggle({ effect: com.fuze.sswidget.transitionEffect, direction: "up", complete: function () { com.fuze.sswidget.jQuery("#fuzeSSW" + kbid2 + "Detail").toggle({ effect: com.fuze.sswidget.transitionEffect, direction: "up" }); } });
            } else {
                com.fuze.sswidget.jQuery("#fuzeSSW" + kbid1 + "Detail").toggle();
                com.fuze.sswidget.jQuery("#fuzeSSW" + kbid2 + "Detail").toggle();
            }
        },
        search: function (searchText) {
            if (searchText) {
                com.fuze.sswidget.searchText = searchText;
            }
            if ((com.fuze.sswidget.searchText != com.fuze.sswidget.previousSearchText) || (com.fuze.sswidget.currentTopicID != com.fuze.sswidget.previousTopicID)) {
                //switch back to 'and' search when search terms or topic change
                com.fuze.sswidget.startIndex = 1;
                com.fuze.sswidget.searchMode = 'and';
                com.fuze.sswidget.jQuery("#fuzeSSWResults").empty();
                com.fuze.sswidget.jQuery("#fuzeSSWResultDetails").empty();
                com.fuze.sswidget.jQuery("#fuzeSSWNoResults").empty();
            }
            if (com.fuze.sswidget.startIndex == 1) {
                //com.fuze.sswidget.jQuery("#fuzesswidget").scrollTop();
            }
            var url = com.fuze.sswidget.baseUrl + '/widgets/sswidget.ashx';
            com.fuze.sswidget.jQuery.ajax({
                contentType: "application/json",
                type: "GET",
                dataType: "jsonp",
                url: url,
                data: "text=" + encodeURI(com.fuze.sswidget.searchText) + "&topicid=" + com.fuze.sswidget.currentTopicID + "&searchMode=" + com.fuze.sswidget.searchMode + "&startIndex=" + com.fuze.sswidget.startIndex + "&pageLength=" + com.fuze.sswidget.pageLength,
                crossdomain: true,
                success: function (data) { com.fuze.sswidget.renderResults(data, com.fuze.sswidget.startIndex, com.fuze.sswidget.pageLength); }
            });
            if (com.fuze.sswidget.enableKeywordSearch && com.fuze.sswidget.enableSuggestions && (com.fuze.sswidget.currentTopicID != com.fuze.sswidget.previousTopicID)) {
                com.fuze.sswidget.loadSuggestionData();
            }
        },
        loadSuggestionData: function() {
            if (com.fuze.suggestions) {
                com.fuze.suggestions.config.catid = com.fuze.sswidget.currentTopicID;
                com.fuze.suggestions.getData();
            } else {
                setTimeout(com.fuze.loadSuggestionData, 500);
            }
        },
        showInitialKBItem: function (kbid) {
            com.fuze.sswidget.jQuery("#fuzeSSWResults").empty();
            com.fuze.sswidget.jQuery("#fuzeSSWResultDetails").empty();
            com.fuze.sswidget.jQuery("#fuzeSSWNoResults").empty();
            com.fuze.sswidget.jQuery(".fuzeSSWKBWrapper").hide();
            com.fuze.sswidget.loadKBItem(kbid, function () {
                com.fuze.sswidget.jQuery('#fuzeSSW' + kbid + 'Detail').show();
                com.fuze.sswidget.jQuery("a#fuzeSSWReturn").text('Search');
                com.fuze.sswidget.jQuery("a#fuzeSSWReturn").removeAttr('onclick');
                com.fuze.sswidget.jQuery("a#fuzeSSWReturn").attr('onclick', "com.fuze.sswidget.jQuery('#fuzeSSW" + kbid + "Detail').hide();com.fuze.sswidget.jQuery('.fuzeSSWKBWrapper').show();com.fuze.sswidget.search();");
            });
            com.fuze.sswidget.currentKBID = kbid;
        },
        newSearch: function () {
            com.fuze.sswidget.searchText = com.fuze.sswidget.jQuery('#fuzeSSWSearchBox').val();
            com.fuze.sswidget.previousSearchText = null; //Force new search
            com.fuze.sswidget.search();
        },
        renderResults: function (data, startIndex, pageLength) {
            if (!com.fuze.sswidget.jQuery.fn.tmpl && !com.fuze.searchwidget.jQuery.fn.tmpl) {
                setTimeout(function () { com.fuze.sswidget.renderResults(data, startIndex, pageLength); }, 200);
                return;
            }
            if (!com.fuze.sswidget.useAlternatePaging) {
                com.fuze.sswidget.jQuery("#fuzeSSWResults").empty();
                com.fuze.sswidget.jQuery("#fuzeSSWResultDetails").empty();
                com.fuze.sswidget.jQuery("#fuzeSSWNoResults").empty();
            }
            com.fuze.sswidget.previousSearchText = com.fuze.sswidget.searchText;
            com.fuze.sswidget.previousTopicID = com.fuze.sswidget.currentTopicID;

            if (com.fuze.sswidget.searchMode == 'and' && data.length == 0 && com.fuze.sswidget.searchText && com.fuze.sswidget.searchText.indexOf(' ') > 0) {
                //switch to 'or' search when no results
                com.fuze.sswidget.searchMode = 'or';
                com.fuze.sswidget.search();
            } else {
                var totalResults = 0;
                if (data.length > 0) {
                    totalResults = data[0].TotalResults;
                }
                for (var i = 0; i < data.length; i++) {
                    if (i == 0) {
                        com.fuze.sswidget.scrollToKBID = data[i].KBID;
                    }
                    data[i].position = i + startIndex;
                    data[i].advSearchUrl = com.fuze.sswidget.baseUrl + "/ext/kbsearch.aspx";
                    if (com.fuze.sswidget.searchText) {
                        data[i].advSearchUrl = "?keyword=" + com.fuze.sswidget.searchText;
                    }
                    if (data[i].DocumentUrl) {
                        data[i].Url = data[i].DocumentUrl;
                    }
                }
                if (!com.fuze.sswidget.useAlternatePaging) {
                    com.fuze.sswidget.jQuery("#fuzeSSWMoreAnswers").hide();
                    if ((startIndex - 1) + pageLength < totalResults) {
                        com.fuze.sswidget.jQuery("#fuzeSSWNext").show();
                    } else {
                        com.fuze.sswidget.jQuery("#fuzeSSWNext").hide();
                    }
                    if (startIndex > 1) {
                        com.fuze.sswidget.jQuery("#fuzeSSWPrev").show();
                    } else {
                        com.fuze.sswidget.jQuery("#fuzeSSWPrev").hide();
                    }
                } else {
                    com.fuze.sswidget.jQuery("#fuzeSSWNext").hide();
                    com.fuze.sswidget.jQuery("#fuzeSSWPrev").hide();
                    if ((startIndex - 1) + pageLength < totalResults) {
                        com.fuze.sswidget.jQuery("#fuzeSSWMoreAnswers").show();
                    } else {
                        com.fuze.sswidget.jQuery("#fuzeSSWMoreAnswers").hide();
                    }
                }

                //if (com.fuze.searchwidget && com.fuze.searchwidget.jQuery && com.fuze.searchwidget.jQuery.tmpl) {
                    //com.fuze.searchwidget.jQuery.tmpl(com.fuze.sswidget.resultsTemplate, data).appendTo("#fuzeSSWResults");
                    //com.fuze.searchwidget.jQuery.tmpl(com.fuze.sswidget.resultsDetailTemplate, data).appendTo("#fuzeSSWResultDetails");
                //} else {
                //debugger;
                for (i = 0; i < data.length; i++) {
                    //each data object is a kbwrapper
                    if (data[i].CTAID) {  //this item has a cta button.  show it/them and apply styles
                        if (data[i].CTAShowBeforeContent) {
                            data[i].CTATopButtonDisplayStyle = "inline-block";
                        } else {
                            data[i].CTATopButtonDisplayStyle = "none";
                        }
                        if (data[i].CTAShowAfterContent) {
                            data[i].CTABottomButtonDisplayStyle = "inline-block";
                        } else {
                            data[i].CTABottomButtonDisplayStyle = "none";
                        }
                        if (data[i].CTAHAlign == "left"){
                            data[i].CTABtnTopClass = "SSctaButtonTop SSctaAlignLeft"
                            data[i].CTABtnBottomClass = "SSctaButtonBottom SSctaAlignLeft"
                        } else if (data[i].CTAHAlign == "right") {
                            data[i].CTABtnTopClass = "SSctaButtonTop SSctaAlignRight"
                            data[i].CTABtnBottomClass = "SSctaButtonBottom SSctaAlignRight"
                        } else if (data[i].CTAHAlign == "center") {
                            data[i].CTABtnTopClass = "SSctaButtonTop SSctaAlignCenter"
                            data[i].CTABtnBottomClass = "SSctaButtonBottom SSctaAlignCenter"
                            data[i].ssIconsCenterUL = "ssIconsCenterUL";
                        }
                        //onclick are going to be
                        if (data[i].CTATargetWidgetID && data[i].CTATargetWidgetID > 0) {  //its target is a widget.  We don't support this in the sswidget yet.  Don't show the CTA Button
                            data[i].CTABottomButtonDisplayStyle = "none";
                            data[i].CTATopButtonDisplayStyle = "none";

                            //data[i].CTAContactUsWidgetScriptBlock = "com.fuze.searchwidget.create(" + data[i].CTATargetWidgetID + ", " + ")";
                            } else { //it's target is a custom url
                            data[i].CTAOnclick = "com.fuze.sswidget.ctaBtnClick(" + data[i].CTAID + ", '" + data[i].CTATargetUrl + "', '" + data[i].CTATargetWindow + "');return false;";
                        }
                    } else {
                        data[i].CTABottomButtonDisplayStyle = "none";
                        data[i].CTATopButtonDisplayStyle = "none";
                    }
                }
                com.fuze.sswidget.jQuery.tmpl(com.fuze.sswidget.resultsTemplate, data).appendTo("#fuzeSSWResults");
                com.fuze.sswidget.jQuery.tmpl(com.fuze.sswidget.resultsDetailTemplate, data).appendTo("#fuzeSSWResultDetails");

                if (data.length == 0) {
                    com.fuze.sswidget.jQuery("#fuzeSSWNoResults").html('No results found for "' + com.fuze.sswidget.searchText + '"');
                    com.fuze.sswidget.jQuery("#fuzeSSWNoResults").show();
                } else {
                    com.fuze.sswidget.jQuery("#fuzeSSWNoResults").hide();
                }

                for (i = 0; i < data.length; i++) {
                    com.fuze.sswidget.processRelatedContent(data[i]);
                }

                if (com.fuze.sswidget.useAlternatePaging) {
                    com.fuze.sswidget.jQuery('body').stop().scrollTo(com.fuze.sswidget.jQuery('#searchItem' + com.fuze.sswidget.scrollToKBID), { duration: 'slow' });
                }
            }
        },
        ctaBtnClick: function (ctaid, targeturl, targetwin) {
            //we are putting this here instead of the switch below in an attempt to stop the popupblockers from blocking the popup.
            //the idea is that instead of waiting for .ajax call to return before outputting it, it will do it onclick, popupblockers shouldn't block.
            if (targetwin == "new") {
                window.open(targeturl, 'ctanewwin');
            }
            $.ajax({
                type: "POST",
                url: "../common/kbdetail.aspx/CTABtn_Click",
                data: JSON.stringify({ ctaid: ctaid, viewguid: com.fuze.sswidget.viewGuid}),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {
                    switch (targetwin) {
                        case "same":
                            document.location = targeturl;
                            break;
                        case "new":
                            //window.open(targeturl, 'ctanewwin');
                            break;
                        case "parent":
                            try {
                                top.window.location.href = targeturl;
                            } catch (ex) {
                                document.location = targeturl;
                            }
                            break;
                        default:
                            document.location = targeturl;
                    }
                }
            });
        },
        ctaBtnClickWidget: function (ctaid, widgetid) {
            $.ajax({
                type: "POST",
                url: "../common/kbdetail.aspx/CTABtn_Click",
                data: JSON.stringify({ ctaid: ctaid, viewguid: com.fuze.sswidget.viewGuid }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {

                    com.fuze.searchwidget.displayWidgetDialog(widgetid, 'viewguid=' + com.fuze.sswidget.viewGuid);
                }
            });
            com.fuze.searchwidget.displayWidgetDialog(widgetid);
        },
        processRelatedContent: function (data) {
            if (com.fuze.sswidget.enableRatings) {
                var roundedRating = "U";
                if (!data.Rating) {
                    com.fuze.sswidget.jQuery("#rate" + data.KBID + "Icon").attr("title", "This item is unrated, click to rate");
                } else {
                    roundedRating = Math.round(data.Rating);
                    com.fuze.sswidget.jQuery("#rate" + data.KBID + "Icon").attr("title", "This item is rated " + roundedRating + " out of 10, click to rate");
                }
                com.fuze.sswidget.jQuery("#rate" + data.KBID + "Count").html(roundedRating);
                com.fuze.sswidget.jQuery("#rate" + data.KBID + "Icon").show();
            }
            if (com.fuze.sswidget.enableRelatedContent && (data.RelatedItems.length > 0 || data.RelatedLinks.length > 0)) {
                com.fuze.sswidget.jQuery("#related" + data.KBID + "Count").text(data.RelatedItems.length + data.RelatedLinks.length);
                com.fuze.sswidget.jQuery("#lnk" + data.KBID + "ViewRelated").text('View ' + (data.RelatedItems.length + data.RelatedLinks.length) + ' Related Content');
                if (data.RelatedItems.length > 0) {
                    //if (com.fuze.searchwidget.jQuery) {
                        //com.fuze.searchwidget.jQuery.tmpl(com.fuze.sswidget.getRelatedItemsTemplate(), data.RelatedItems).appendTo("#fuzeSSW" + data.KBID + "RelatedItems");
                    //} else {
                        com.fuze.sswidget.jQuery.tmpl(com.fuze.sswidget.getRelatedItemsTemplate(), data.RelatedItems).appendTo("#fuzeSSW" + data.KBID + "RelatedItems");
                    //}
                }
                if (data.RelatedLinks.length > 0) {
                    //if (com.fuze.searchwidget.jQuery) {
                        //com.fuze.searchwidget.jQuery.tmpl(com.fuze.sswidget.getRelatedLinksTemplate(), data.RelatedLinks).appendTo("#fuzeSSW" + data.KBID + "RelatedLinks");
                    //} else {
                        com.fuze.sswidget.jQuery.tmpl(com.fuze.sswidget.getRelatedLinksTemplate(), data.RelatedLinks).appendTo("#fuzeSSW" + data.KBID + "RelatedLinks");
                    //}
                }
                com.fuze.sswidget.jQuery("#related" + data.KBID + "Icon").show();
                com.fuze.sswidget.jQuery("#lnk" + data.KBID + "ViewRelated").show();
            }
        },
        navigateResults: function (newStartIndex) {
            com.fuze.sswidget.startIndex = newStartIndex;
            com.fuze.sswidget.search();
        },
        showDetail: function (kbid,docurl) {
            if (com.fuze.sswidget.detailPreAction) { com.fuze.sswidget.detailPreAction(); }
            com.fuze.sswidget.logView(kbid, com.fuze.sswidget.searchText);
            com.fuze.sswidget.currentKBID = kbid;
            if (docurl) return true;
            if (com.fuze.sswidget.enableTransitions) {
                com.fuze.sswidget.jQuery(".fuzeSSWKBWrapper").toggle({ effect: com.fuze.sswidget.transitionEffect, direction: "up", complete: function () { com.fuze.sswidget.jQuery("#fuzeSSW" + kbid + "Detail").toggle({ effect: com.fuze.sswidget.transitionEffect, direction: "up" }); } });
            } else {
                com.fuze.sswidget.jQuery(".fuzeSSWKBWrapper").toggle();
                com.fuze.sswidget.jQuery("#fuzeSSW" + kbid + "Detail").toggle();
            }
            return false;
        },
        logView: function (kbid, searchText) {
            var url = com.fuze.sswidget.baseUrl + '/widgets/sswidget.ashx';

            com.fuze.sswidget.jQuery.ajax({
                contentType: "application/json",
                type: "GET",
                dataType: "jsonp",
                url: url,
                data: "kbid=" + encodeURI(kbid) + "&searchtext=" + encodeURI(searchText) + "&action=logview",
                crossdomain: true
            });
        },
        showResultList: function (kbid) {
            if (com.fuze.sswidget.detailPostAction) { com.fuze.sswidget.detailPostAction(); }
            if (com.fuze.sswidget.enableTransitions) {
                com.fuze.sswidget.jQuery("#fuzeSSW" + kbid + "Detail").toggle({
                    effect: com.fuze.sswidget.transitionEffect, direction: "left", complete: function () {
                        com.fuze.sswidget.jQuery(".fuzeSSWKBWrapper").toggle({ effect: com.fuze.sswidget.transitionEffect, direction: "left" });
                        if (com.fuze.sswidget.useAlternatePaging && com.fuze.sswidget.startIndex > 1) {
                            com.fuze.sswidget.jQuery('body').stop().scrollTo(com.fuze.sswidget.jQuery('#searchItem' + kbid), { duration: 'slow' });
                        }
                    }
                });
            } else {
                com.fuze.sswidget.jQuery("#fuzeSSW" + kbid + "Detail").toggle();
                com.fuze.sswidget.jQuery(".fuzeSSWKBWrapper").toggle();
                if (com.fuze.sswidget.useAlternatePaging && com.fuze.sswidget.startIndex > 1) {
                    com.fuze.sswidget.jQuery('body').stop().scrollTo(com.fuze.sswidget.jQuery('#searchItem' + kbid), { duration: 'slow' });
                }
            }
            com.fuze.sswidget.currentKBID = null;
            com.fuze.sswidget.backKBID = null;
            com.fuze.sswidget.jQuery(".fuzeSSWMessage").hide();  //Hide thank you messages
        },
        getResultsTemplate: function () {
            return '<div id="searchItem${KBID}"><span class="fuzeSSWCount">${position}.</span><a {{if DocumentUrl}}href="${DocumentUrl}" {{if DocumentTarget}}target="${DocumentTarget}" {{/if}}{{else}} href="javascript:void(0);" onclick="com.fuze.sswidget.showDetail(${KBID});return false;" {{/if}}>{{html Question}}{{if DocumentUrl}} <img src="' + com.fuze.sswidget.baseUrl + '/images/spacer.gif" class="offsiteIMG">{{/if}}</a></div>';
        },
        getResultsDetailTemplate: function () {
            var template = '<div id="fuzeSSW${KBID}Detail" class="fuzeSSWidgetResultDetail" style="display:none;">' +
                    '<a onclick="com.fuze.sswidget.showResultList(${KBID});" class="fuzeSSWReturn" id="fuzeSSWReturn" title="' + com.fuze.sswidget.labels.returnTitle + '">' + com.fuze.sswidget.labels.returnButton + '</a>';


            template += '<ul id="other${KBID}Options" class="ssIcons ${ssIconsCenterUL}">' +
            '<li class="rateMO"><a id="rate${KBID}Icon" class="rate" onclick="com.fuze.sswidget.toggleContainer(\'rt${KBID}Container\');com.fuze.sswidget.hideContainer(\'rel${KBID}Container\');" style="display:none;"><span id="rate${KBID}Count"></span></a>' +
            '  <input id="rt${KBID}Value" type="hidden" />' +
            '  <div id="rt${KBID}Container" class="arrow-container" style="display:none;">' +
            '    <div class="arrow-left"></div>' +
            '    <div class="arrow-content">' +
            '      <label>' + com.fuze.sswidget.labels.rateHeading + '</label>' +
            '      <div class="rateBox">' +
            '        <div id="1_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(1, ${KBID});" title="1 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(1,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(1,\'off\', ${KBID});"></div>' +
            '        <div id="2_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(2, ${KBID});" title="2 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(2,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(2,\'off\', ${KBID});"></div>' +
            '        <div id="3_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(3, ${KBID});" title="3 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(3,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(3,\'off\', ${KBID});"></div>' +
            '        <div id="4_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(4, ${KBID});" title="4 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(4,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(4,\'off\', ${KBID});"></div>' +
            '        <div id="5_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(5, ${KBID});" title="5 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(5,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(5,\'off\', ${KBID});"></div>' +
            '        <div id="6_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(6, ${KBID});" title="6 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(6,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(6,\'off\', ${KBID});"></div>' +
            '        <div id="7_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(7, ${KBID});" title="7 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(7,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(7,\'off\', ${KBID});"></div>' +
            '        <div id="8_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(8, ${KBID});" title="8 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(8,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(8,\'off\', ${KBID});"></div>' +
            '        <div id="9_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(9, ${KBID});" title="9 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(9,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(9,\'off\', ${KBID});"></div>' +
            '        <div id="10_${KBID}" class="inStar" onclick="com.fuze.sswidget.callStarsRating(10, ${KBID});" title="10 out of 10" onmouseover="com.fuze.sswidget.highlightStarsRating(10,\'on\', ${KBID});" onmouseout="com.fuze.sswidget.highlightStarsRating(10,\'off\', ${KBID});"></div>' +
            '      </div>' +
            '      <div id="req${KBID}Comments" class="reqComments" style="display:none;">' +
            '        <p />' +
            '      </div>' +
            '      <div class="rateCommentBox">' +
            '        <textarea id="txt${KBID}Comments" class="rateCommentTB" onclick="com.fuze.sswidget.clearText(${KBID});">' + com.fuze.sswidget.labels.improveContentText + '</textarea>' +
            '      </div>' +
            '      <div class="rateSubmitB">' +
            '        <input type="button" class="inverseBtn" value="' + com.fuze.sswidget.labels.ratingSubmitButton + '" onclick="com.fuze.sswidget.submitRating(${KBID});">' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</li>' +
            '<!--Related Items Start-->' +
            '<li class="relatedMO"><a id="related${KBID}Icon" class="relatedIcon" onclick="com.fuze.sswidget.toggleContainer(\'rel${KBID}Container\');com.fuze.sswidget.hideContainer(\'rt${KBID}Container\');" title="' + com.fuze.sswidget.labels.relatedContentTitle + '" style="display:none;"><span id="related${KBID}Count"></span></a>' +
            '  <div id="rel${KBID}Container" class="arrow-container" style="display:none;">' +
            '    <div class="arrow-left"></div>' +
            '    <div class="arrow-content">' +
            '      <label>' + com.fuze.sswidget.labels.relatedContentHeading + '</label>' +
            '      <ul class="rcList" id="fuzeSSW${KBID}RelatedItems"></ul>' +
            '      <ul class="rcList" id="fuzeSSW${KBID}RelatedLinks"></ul>' +
            '    </div>' +
            '  </div>' +
            '</li>' +
            '</ul>';
            //SSctaButton is outputted once on top, once on bottom, but then we set the visibility of one to not show
            template += '<div id="divSSCTABtn${KBID}" class="divSSCTABtnTop"><a class="${CTABtnTopClass}" title="${CTALabel}" onclick="${CTAOnclick}" href="javascript:void();" target="${CTATargetWindow}" style="display:${CTATopButtonDisplayStyle};color:#${CTALabelColor};background:#${CTAButtonColor};">${CTALabel}</a></div>';

            template += '<div style="clear:both;" />' +
                    '<a id="btn${KBID}Back" class="fuzeSSWBack" title="' + com.fuze.sswidget.labels.backTitle + '" style="display:none;">' + com.fuze.sswidget.labels.backButton + '</a>' +
                    '<div style="clear:both;" />' +
                    '<span id="lbl${KBID}Message" class="fuzeSSWMessage"></span>' +
                    '<div style="clear:both;" />' +
                    '<span class="fuzeSSWResultTopic">{{html Question}}</span>' +
                    '<div class="fuzeResultAnswer">{{html Answer}}</div>';

                    //SSctaButton is outputted once on top, once on bottom, but then we set the visibility of one to not show
                    template += '<div id="divSSCTABtn${KBID}" class="divSSCTABtnBottom"><a class="${CTABtnBottomClass}" title="${CTALabel}" onclick="${CTAOnclick}" href="javascript:void();" target="${CTATargetWindow}" style="display:${CTABottomButtonDisplayStyle};color:#${CTALabelColor};background:#${CTAButtonColor};">${CTALabel}</a></div>';
                    template += '<div style="clear:both;" />';
                    template += '<div class="fuzeSSWRelatedContent"><a id="lnk${KBID}ViewRelated" onclick="com.fuze.sswidget.showRelatedBubble(${KBID});" style="display:none;"></a></div>';


                    template += '<div class="fuzeSSWMoreDetails"><a href="${Url}" title="' + com.fuze.sswidget.labels.moreDetailsTitle + '">' + com.fuze.sswidget.labels.moreDetailsButton + '</a></div>' +
                    '</div>';

                    template += '<script type="text/javascript">${CTAContactUsWidgetScriptBlock}</script>';
                    return template;
        },
        getRelatedItemsTemplate: function () {
            return '<li><a {{if ExternalDocumentUrl}}href="${ExternalDocumentUrl}" {{if DocumentTarget}}target="${DocumentTarget}" {{/if}} {{else}} onclick="com.fuze.sswidget.loadKBItem(${KBID},function() {com.fuze.sswidget.showRelatedItem(${KBID});});" {{/if}}>${Question}{{if ExternalDocumentUrl}} <img src="' + com.fuze.sswidget.baseUrl + '/images/spacer.gif" class="offsiteIMG">{{/if}}</a></li>';
        },
        getRelatedLinksTemplate: function () {
            return '<li><a href="${Url}" target="${Target}">${Label} <img src="' + com.fuze.sswidget.baseUrl + '/images/spacer.gif" class="offsiteIMG"></a></li>';
        },
        toggleContainer: function (container) {
            if (com.fuze.sswidget.enableTransitions) {
                com.fuze.sswidget.jQuery("#" + container).toggle({ effect: com.fuze.sswidget.transitionEffect, direction: "right", duration: 500 });
            } else {
                com.fuze.sswidget.jQuery("#" + container).toggle();
            }
        },
        hideContainer: function (container) {
            //if (com.fuze.sswidget.jQuery("#" + container).is(":visible")) {
            //document.getElementById(container).style.display = 'none';
            com.fuze.sswidget.jQuery("#" + container).hide();
            //}
        },
        showRelatedBubble: function (kbid) {
            if (com.fuze.sswidget.jQuery('#rel' + kbid + 'Container').not(":visible")) {
                //if (com.fuze.searchwidget.jQuery && com.fuze.searchwidget.jQuery('body').stop && com.fuze.searchwidget.jQuery('body').stop().scrollTo) {
                    //com.fuze.searchwidget.jQuery('body').stop().scrollTo(com.fuze.sswidget.jQuery('#fuzeSSW' + kbid + 'Detail'), { duration: 'slow' });
                //} else {
                    com.fuze.sswidget.jQuery('body').stop().scrollTo(com.fuze.sswidget.jQuery('#fuzeSSW' + kbid + 'Detail'), { duration: 'slow' });
                //}
            }
            com.fuze.sswidget.hideContainer('rt' + kbid + 'Container');
            com.fuze.sswidget.toggleContainer('rel' + kbid + 'Container');
        },
        callStarsRating: function (rating, kbid) {
            com.fuze.sswidget.currentRating = rating;
            var index = 1;
            for (index = 1; index <= rating; index++) {
                document.getElementById(index + "_" + kbid).className = 'actStar';
            }

            var inActiveIndex = 0;
            for (inActiveIndex = (rating + 1); inActiveIndex < 11; inActiveIndex++)
                document.getElementById(inActiveIndex + "_" + kbid).className = 'inStar';

            document.getElementById('rt' + kbid + 'Value').value = rating;
            if (!com.fuze.sswidget.commentsChanged(kbid)) {
                if (rating < 10) {
                    com.fuze.sswidget.jQuery('#txt' + kbid + 'Comments').val(com.fuze.sswidget.labels.improveContentText);
                }
                if (rating == 10) {
                    com.fuze.sswidget.jQuery('#txt' + kbid + 'Comments').val(com.fuze.sswidget.labels.effectiveContentText);
                }
            }
        },
        highlightStarsRating: function (rating, onOff, kbid) {
            var index = 1;
            for (index = 1; index <= rating; index++) {
                if (onOff == 'on') {
                    document.getElementById(index + "_" + kbid).className = 'actStar';
                    var inActiveIndex = 0;
                    for (inActiveIndex = (rating + 1); inActiveIndex < 11; inActiveIndex++)
                        document.getElementById(inActiveIndex + "_" + kbid).className = 'inStar';
                } else {
                    document.getElementById(index + "_" + kbid).className = 'inStar';
                    if (com.fuze.sswidget.currentRating > 0) {
                        com.fuze.sswidget.callStarsRating(com.fuze.sswidget.currentRating, kbid);
                    }
                }
            }
        },
        commentsChanged: function (kbid) {
            var textboxValue = document.getElementById("txt" + kbid + "Comments").value.replace("'", "\'");
            textboxValue = document.getElementById("txt" + kbid + "Comments").value.replace('"', "\"");
            textboxValue = document.getElementById("txt" + kbid + "Comments").value.replace('&quot;', "\"");
            textboxValue = document.getElementById("txt" + kbid + "Comments").value.replace('&apos;', "\"");
            textboxValue = document.getElementById("txt" + kbid + "Comments").value.replace(";", "");

            if (textboxValue == com.fuze.sswidget.labels.improveContentText || textboxValue == com.fuze.sswidget.labels.effectiveContentText) {
                return false;
            } else {
                return true;
            }
        },
        clearText: function (kbid) {
            if (!com.fuze.sswidget.commentsChanged(kbid)) {
                document.getElementById("txt" + kbid + "Comments").value = '';
                document.getElementById("txt" + kbid + "Comments").select();
            }
        },
        postRating: function (kbid, rating, comments) {
            var url = com.fuze.sswidget.baseUrl + '/widgets/sswidget.ashx';
            if (comments == null) comments = '';
            com.fuze.sswidget.jQuery.ajax({
                contentType: "application/json",
                type: "GET",
                dataType: "jsonp",
                url: url,
                data: "kbid=" + encodeURI(kbid) + "&rating=" + encodeURI(rating) + "&comments=" + encodeURI(comments) + "&action=rate",
                crossdomain: true,
                success: function (data) { com.fuze.sswidget.displayRatingConfirmation(kbid, data); }
            });
        },
        displayRatingConfirmation: function (kbid, data) {
            com.fuze.sswidget.hideContainer('rt' + kbid + 'Container');
            if (data.indexOf('Thank you') >= 0) {
                com.fuze.sswidget.loadKBItem(kbid, function () {
                    com.fuze.sswidget.jQuery('#lbl' + kbid + 'Message').text(com.fuze.sswidget.labels.ratingPostedMessage);
                    com.fuze.sswidget.jQuery('#lbl' + kbid + 'Message').show();
                    com.fuze.sswidget.jQuery('#fuzeSSW' + kbid + 'Detail').show();
                });
            } else {
                //display error message
                com.fuze.sswidget.jQuery('#lbl' + kbid + 'Message').text(data);
                com.fuze.sswidget.jQuery('#lbl' + kbid + 'Message').show();
            }
        },
        submitRating: function (kbid) {
            var comments = "";
            if (com.fuze.sswidget.commentsChanged(kbid)) {
                comments = com.fuze.sswidget.jQuery.trim(document.getElementById("txt" + kbid + "Comments").value);
            }
            var rat = parseInt(document.getElementById('rt' + kbid + 'Value').value);
            if (isNaN(rat)) {
                rat = 0;
            }
            if (comments == "" && rat == 0) {
                com.fuze.sswidget.jQuery('#req' + kbid + 'Comments').html('<p>Rating or Suggestion Required</p>');
                com.fuze.sswidget.jQuery('#req' + kbid + 'Comments').show();
            } else if (com.fuze.sswidget.negRatingsRequireComments && rat >= 1 && rat < 6 && comments == "") {
                com.fuze.sswidget.jQuery('#req' + kbid + 'Comments').html('<p>Suggestion Required</p>');
                com.fuze.sswidget.jQuery('#req' + kbid + 'Comments').show();
            } else {
                com.fuze.sswidget.jQuery('#req' + kbid + 'Comments').hide();
                com.fuze.sswidget.currentRating = null;
                if (rat == 0) {
                    com.fuze.sswidget.postRating(kbid, null, comments);
                } else {
                    com.fuze.sswidget.postRating(kbid, rat, comments);
                }
            }
        },
        loadTopics: function () {
            var url = com.fuze.sswidget.baseUrl + '/widgets/sswidget.ashx';
            com.fuze.sswidget.jQuery.ajax({
                contentType: "application/json",
                type: "GET",
                dataType: "jsonp",
                url: url,
                data: "topiclvl=" + com.fuze.sswidget.nbrTopicLevels + "&action=loadtopics",
                crossdomain: true,
                success: function (data) { com.fuze.sswidget.renderTopics(data); }
            });
        },
        renderTopics: function (data) {
            if (data.length == 0) {
                //No Public Topics
                return;
            }
            com.fuze.sswidget.jQuery('#fuzeSSWTopicContainer').show();
            var ddData = com.fuze.sswidget.getDDTopicData(data);
            com.fuze.sswidget.jQuery('#fuzeSSWTopicTree').append(ddData).selectric({
                // ReSharper disable once UnusedParameter
                optionsItemBuilder: function (itemData, element, index) {
                    var re = /\|Level(\d)\|/g;
                    var matches = itemData.text.match(re);
                    var level = '';
                    if (matches.length > 0) {
                        level = matches[0].replace(/\|Level(\d)\|/, "com.fuze.sswidget.jQuery1");
                        itemData.text = itemData.text.replace(/\|Level(\d)\|/, "");
                    }
                    return element.val().length ? '<span class="level' + level + '">' + itemData.text + '</span>' : itemData.text;
                },
                onChange: function () {
                    var catid = com.fuze.sswidget.jQuery('#fuzeSSWTopicTree').val();
                    if (catid == 0) {
                        com.fuze.sswidget.clearTopic();
                    } else {
                        com.fuze.sswidget.jQuery('#fuzeSSWClearTopic').show();
                        com.fuze.sswidget.currentTopicID = catid;
                        com.fuze.sswidget.search();
                    }
                },
                maxHeight: 225,
                disableOnMobile: false
            });
            if (com.fuze.sswidget.currentTopicID) {
                com.fuze.sswidget.jQuery('#fuzeSSWTopicTree').val(com.fuze.sswidget.currentTopicID);
                com.fuze.sswidget.jQuery('#fuzeSSWTopicTree').append(ddData).selectric('refresh');
            }

        },
        clearTopic: function () {
            //if (com.fuze.searchwidget.jQuery) {
                //com.fuze.searchwidget.jQuery('#fuzeSSWTopicTree').prop('selectedIndex', 0).selectric('refresh');
            //} else {
                com.fuze.sswidget.jQuery('#fuzeSSWTopicTree').prop('selectedIndex', 0).selectric('refresh');
            //}
            com.fuze.sswidget.jQuery("#fuzeSSWClearTopic").hide();
            com.fuze.sswidget.currentTopicID = null;
            com.fuze.sswidget.search();
        },
        getDDTopicData: function (data) {
            var ddData = '';

            var root = data[0];
            root.CategoryName = com.fuze.sswidget.labels.topicHeading;
            root.Level = 1;
            ddData += '<option value="' + root.CategoryID + '">' + root.CategoryName + '|Level' + root.Level + '|</option>\n';

            for (var i = 0; i < data[0].ChildrenList.length; i++) {
                ddData += com.fuze.sswidget.getDataForTopic(data[0].ChildrenList[i]);
            }

            return ddData;
        },
        getDataForTopic: function (topic) {
            var topicData = '<option value="' + topic.CategoryID + '">' + topic.CategoryName + '|Level' + topic.Level + '|</option>\n';
            for (var i = 0; i < topic.ChildrenList.length; i++) {
                topicData += com.fuze.sswidget.getDataForTopic(topic.ChildrenList[i]);
            }

            return topicData;
        },
        initWidgets: function () {
            com.fuze.jslib.loadCSSFile(com.fuze.sswidget.baseUrl + '/css/colorbox.css');
            com.fuze.searchwidget.jQuery = jQuery;
            com.fuze.searchwidget.jQueryScriptOutputted = true;
            com.fuze.searchwidget.loadJQueryPlugins();
            if (com.fuze.sswidget.contactUsWidgetID != null) {
                com.fuze.searchwidget.create(com.fuze.sswidget.contactUsWidgetID, com.fuze.sswidget.contactUsWidgetWidth, com.fuze.sswidget.contactUsWidgetHeight, 'cu', 'ext');
                com.fuze.sswidget.jQuery("#fuzeSSWContactUsBtn").click(function () { com.fuze.searchwidget.displayWidgetDialog(com.fuze.sswidget.contactUsWidgetID); });
                com.fuze.sswidget.jQuery("#fuzeSSWContactUsContainer").show();
            }
            if (com.fuze.sswidget.advancedSearchWidgetID != null) {
                com.fuze.searchwidget.create(com.fuze.sswidget.advancedSearchWidgetID, com.fuze.sswidget.advancedSearchWidgetWidth, com.fuze.sswidget.advancedSearchWidgetHeight, 'kb', 'ext');
                com.fuze.sswidget.jQuery("#advSearchLink").click(function () { com.fuze.searchwidget.displayWidgetDialog(com.fuze.sswidget.advancedSearchWidgetID, 'keyword=' + com.fuze.sswidget.searchText); });
            }
        },
        getSearchBoxSize: function () {
            if (com.fuze.sswidget.enableTopics)
                return 22;
            else
                return 50;
        }
    }
}

$(function () {
    if (typeof window.fuzeSSWidgetInitParams == 'undefined') {
        window.fuzeSSWidgetInitParams = new Object();
    }
    com.fuze.sswidget.init(window.fuzeSSWidgetInitParams);
});
