var aImage = [];
var g_oHomepage = {
    iCurrent: 0,
    bAllowScroll: true,
    iPosition: 0,
    iFeatureCount: 1,
    iFeatureWidth: 971,
    iPreviewSpeed: 350,
    iSlideSpeed: 450
};

// google analytics
try {
    var pageTracker = _gat._getTracker("UA-462468-3");
    pageTracker._trackPageview();
} catch(err) {}

// break out of frames
if (top.location!= self.location) {
    top.location = self.location.href;
}

// remove cookie
document.cookie = "schpam=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=/";

function CacheImage(sFilename) {
    aImage.push(new Image());
    aImage[aImage.length - 1].src = sFilename;
}

function FeatureInit() {
    g_oHomepage.iFeatureCount = $("#homepageFeatures li").size();
    g_oHomepage.iPosition = parseInt($("#homepageFeatures").css("left"));

    // draw dots
    var sHTML = "<span class=\"on\" id=\"homepageContainerNav0\">&nbsp;</span>";
    for (var i = 1; i < g_oHomepage.iFeatureCount; i++) {
        sHTML += "<span id=\"homepageContainerNav" + i +"\">&nbsp;</span>"
    }
    $(".homepageFeatureDots").html(sHTML);

    // draw prev / next
    $(".homepageFeatureLinks").html("<span onclick=\"FeatureShift(false);\" onmouseover=\"FeaturePreview(false, true);\" onmouseout=\"FeaturePreview(false, false);\" title=\"Tip: press the left and right cursor keys instead of clicking here.\">&laquo;&nbsp;Previous</span>&nbsp;/&nbsp;<span onclick=\"FeatureShift(true);\" onmouseover=\"FeaturePreview(true, true);\" onmouseout=\"FeaturePreview(true, false);\" title=\"Tip: press the left and right cursor keys instead of clicking here.\">Next&nbsp;&raquo;</span>");

    // click handler
    $("#homepageContainer div span").click(function() {
        if (g_oHomepage.bAllowScroll == true) {
            var iClick = parseInt($(this).attr("id").substr(20));
            if ((!isNaN(iClick)) && (iClick != g_oHomepage.iCurrent)) {
                // adjacent shifts
                if (iClick == g_oHomepage.iCurrent + 1) {
                    FeatureShift(true);
                    return;
                }
                if (iClick == g_oHomepage.iCurrent - 1) {
                    FeatureShift(false);
                    return;
                }

                // non-adjacent shifts
                g_oHomepage.bAllowScroll = false;
                var oFeatures = $("#homepageFeatures");
                if (g_oHomepage.iCurrent > iClick) {
                    // go left
                    for (var i = g_oHomepage.iFeatureCount; i > 2; i--) {
                        oFeatures.find("li:last").clone().prependTo(oFeatures);
                        oFeatures.find("li:last").remove();
                        g_oHomepage.iPosition -= g_oHomepage.iFeatureWidth;
                        oFeatures.css("left", g_oHomepage.iPosition);
                    }
                    g_oHomepage.iPosition += ((g_oHomepage.iCurrent - iClick) * g_oHomepage.iFeatureWidth);
                    oFeatures.animate({ left: g_oHomepage.iPosition + "px" },
                                      (g_oHomepage.iSlideSpeed + (200 * (g_oHomepage.iCurrent - iClick))),
                                      "swing",
                                      function() {
                        if (parseInt(oFeatures.css("left")) == 0) {
                            oFeatures.find("li:last").clone().prependTo(oFeatures);
                            oFeatures.find("li:last").remove();
                            g_oHomepage.iPosition -= g_oHomepage.iFeatureWidth;
                            oFeatures.css("left", g_oHomepage.iPosition);
                        }
                        while (parseInt(oFeatures.css("left")) < -g_oHomepage.iFeatureWidth) {
                            oFeatures.find("li:first").clone().appendTo(oFeatures);
                            oFeatures.find("li:first").remove();
                            g_oHomepage.iPosition += g_oHomepage.iFeatureWidth;
                            oFeatures.css("left", g_oHomepage.iPosition);
                        }
                        g_oHomepage.bAllowScroll = true;
                    });
                } else {
                    // go right
                    oFeatures.find("li:first").clone().appendTo(oFeatures);
                    oFeatures.find("li:first").remove();
                    g_oHomepage.iPosition += g_oHomepage.iFeatureWidth;
                    oFeatures.css("left", g_oHomepage.iPosition);
                    g_oHomepage.iPosition -= ((iClick - g_oHomepage.iCurrent) * g_oHomepage.iFeatureWidth);
                    oFeatures.animate({ left: g_oHomepage.iPosition + "px" },
                                      (g_oHomepage.iSlideSpeed + (200 * (iClick - g_oHomepage.iCurrent))),
                                      "swing",
                                      function() {
                        while (parseInt(oFeatures.css("left")) < -g_oHomepage.iFeatureWidth) {
                            oFeatures.find("li:first").clone().appendTo(oFeatures);
                            oFeatures.find("li:first").remove();
                            g_oHomepage.iPosition += g_oHomepage.iFeatureWidth;
                            oFeatures.css("left", g_oHomepage.iPosition);
                        }
                        g_oHomepage.bAllowScroll = true;
                    });
                }
                g_oHomepage.iCurrent = iClick;
                $("#homepageContainer div span").removeClass("on");
                $("#homepageContainer div span:eq(" + g_oHomepage.iCurrent + ")").addClass("on");
            }
        }
    });

    // arrow keys
    $(document).bind("keydown", function(e) {
        switch (e.charCode || e.keyCode) {
            case 37: // left
                FeatureShift(false);
                break;
            case 39: // right
                FeatureShift(true);
                break;
        }
    });

    // start counter
    iHomepageTimer = setTimeout("FeatureShiftCountdown()", 14000);
}

function FeaturePreview(bRight, bStartPreview) {
    if (g_oHomepage.bAllowScroll == true) {
        var oFeatures = $("#homepageFeatures");
        oFeatures.stop();

        if (bStartPreview == true) {
            if (bRight == true) {
                oFeatures.animate({ left: (g_oHomepage.iPosition - 110) + "px" }, g_oHomepage.iPreviewSpeed, "swing" );
            } else {
                oFeatures.animate({ left: (g_oHomepage.iPosition + 110) + "px" }, g_oHomepage.iPreviewSpeed, "swing" );
            }
        } else {
            oFeatures.animate({ left: g_oHomepage.iPosition + "px" }, g_oHomepage.iPreviewSpeed, "swing" );
        }
    }
}

function FeatureShift(bRight) {
    clearTimeout(iHomepageTimer);
    $(".homepageFeatureTimer img").fadeOut(500);

    if (g_oHomepage.bAllowScroll == true) {
        g_oHomepage.bAllowScroll = false;
        var oFeatures = $("#homepageFeatures");

        // do scroll
        if (bRight == true) {
            g_oHomepage.iPosition -= g_oHomepage.iFeatureWidth;
            g_oHomepage.iCurrent++;
            oFeatures.animate({ left: g_oHomepage.iPosition + "px" }, g_oHomepage.iSlideSpeed, "swing", function() {
                oFeatures.find("li:first").clone().appendTo(oFeatures);
                oFeatures.find("li:first").remove();
                g_oHomepage.iPosition += g_oHomepage.iFeatureWidth;
                oFeatures.css("left", g_oHomepage.iPosition);
                g_oHomepage.bAllowScroll = true;
            });
        } else {
            g_oHomepage.iPosition += g_oHomepage.iFeatureWidth;
            g_oHomepage.iCurrent--;
            oFeatures.animate({ left: g_oHomepage.iPosition + "px" }, g_oHomepage.iSlideSpeed, "swing", function() {
                oFeatures.find("li:last").clone().prependTo(oFeatures);
                oFeatures.find("li:last").remove();
                g_oHomepage.iPosition -= g_oHomepage.iFeatureWidth;
                oFeatures.css("left", g_oHomepage.iPosition);
                g_oHomepage.bAllowScroll = true;
            });
        }

        // update guide
        if (g_oHomepage.iCurrent < 0) {
            g_oHomepage.iCurrent += g_oHomepage.iFeatureCount;
        } else if (g_oHomepage.iCurrent >= g_oHomepage.iFeatureCount) {
            g_oHomepage.iCurrent -= g_oHomepage.iFeatureCount;
        }
        $("#homepageContainer div span").removeClass("on");
        $("#homepageContainer div span:eq(" + g_oHomepage.iCurrent + ")").addClass("on");
    }
    iHomepageTimer = setTimeout("FeatureShiftCountdown()", 9000);
}

function FeatureShiftCountdown() {
    clearTimeout(iHomepageTimer);

    // display image
    $(".homepageFeatureTimer img").fadeIn(2500);

    // start countdown again
    iHomepageTimer = setTimeout("FeatureShift(true)", 3000);
}

function GalleryInit() {
    $("#thumbnails img").load(function() { $(this).css("background-image", "none").fadeTo(500, 0.75) });
    $("#gallery img").load(function() {
        $(this).stop().fadeIn(300, function() {
            $(this).fadeTo(50, 1); // hack alert: prevents only partial fade-in bug somewhere in jQuery or the browsers
            bScrolling = false;
        });
        $("#photoinfo").stop().fadeIn(300, function() {
          $(this).fadeTo(50, 1); // hack, as above
        });
    });
    if (iCurrImage > 0) { $("#thumbnailprev").addClass("on") };
    if (iCurrImage < (aGallery.length - 1)) { $("#thumbnailnext").addClass("on") };

    // mouse handlers
    $("#thumbnails img")
        .click(function() { GalleryShow($(this).parent().children("img").index(this)) })
        .mouseover(function() { $(this).stop().fadeTo(50, 1) })
        .mouseout(function() { $(this).stop().fadeTo(500, 0.75) });
    $("#thumbnailprev")
        .click(function() { GalleryShow(iCurrImage - 1) })
        .mouseover(function() { GalleryPreview(true, true) })
        .mouseout(function() { GalleryPreview(true, false) });
    $("#thumbnailnext")
        .click(function() { GalleryShow(iCurrImage + 1) })
        .mouseover(function() { GalleryPreview(false, true) })
        .mouseout(function() { GalleryPreview(false, false) });

    // load remaining thumbs
    GalleryThumbnails();

    // arrow keys
    $(document).bind("keydown", function(e) {
        switch (e.charCode || e.keyCode) {
            case 37: // left
                GalleryShow(iCurrImage - 1);
                break;
            case 39: // right
                GalleryShow(iCurrImage + 1);
                break;
        }
    });
}

function GalleryPreview(bPrevious, bActive) {
    var iJump = 87;
    var iTargetThumbPosition = (187 - (iCurrImage * 87));
    if (bPrevious == true) {
        if (bActive == true) {
            if ((bScrolling != true) && (iCurrImage > 0)) {
                $("#thumbnails").stop().animate({ left: (iTargetThumbPosition + iJump) + "px" }, 250);
            }
        } else {
            if (bScrolling != true) {
                $("#thumbnails").stop().animate({ left: iTargetThumbPosition + "px" }, 250);
            }
        }
    } else {
        if (bActive == true) {
            if ((bScrolling != true) && (iCurrImage < aGallery.length - 1)) {
                $("#thumbnails").stop().animate({ left: (iTargetThumbPosition - iJump) + "px" }, 250);
            }
        } else {
            if (bScrolling != true) {
                $("#thumbnails").stop().animate({ left: iTargetThumbPosition + "px" }, 250);
            }
        }
    }
}

function GalleryShow(iTargetImage) {
    if ((iTargetImage < 0) || (iTargetImage >= aGallery.length)) {
        return;
    }
    if (iTargetImage != iCurrImage) {
        bScrolling = true;

        // slide thumbnails
        iThumbPosition = (187 - (iTargetImage * 87));
        var iScrollDistance = Math.abs(iCurrImage - iTargetImage);
        if (iScrollDistance > 10) {
            iScrollDistance = 10;
        }
        $("#thumbnails").stop().animate({ left: iThumbPosition + "px" }, (250 + (iScrollDistance * 60)), function() {
            bScrolling = false;
        });
        iCurrImage = iTargetImage;
        $("#thumbnailcurrent span").text(iCurrImage + 1);

        // show picture
        $("#photoinfo").stop().fadeOut(150);
        $("#gallery img").stop().fadeOut(150, function() {
            // image
            $(this).attr("width", aGallery[iCurrImage].iWidth)
                   .attr("height", aGallery[iCurrImage].iHeight)
                   .attr("src", aGallery[iCurrImage].sSRC)
                   .attr("alt", aGallery[iCurrImage].sTitle);

            // title
            $("#photoTitle").html(aGallery[iCurrImage].sTitle);

            // date
            $("#photoDate").html(aGallery[iCurrImage].sDate);

            // description (if applicable)
            if (aGallery[iCurrImage].sDesc.length > 0) {
                $("#photoDesc").html(aGallery[iCurrImage].sDesc).css("display", "block");
            } else {
                $("#photoDesc").css("display", "none");
            }

            // social networking
            var sURL = "http://joncom.be/gallery/" + escape(sSetURL) + "/" + (iCurrImage + 1);
            var sTitle = escape("Jon Combe | Photo Gallery | " + sSetName + " | " + aGallery[iCurrImage].sTitle);
            $(".sn_delicious").parent().find("a").attr("href", ("http://del.icio.us/post?url=" + sURL + "&title=" + sTitle));
            $(".sn_digg").parent().find("a").attr("href", ("http://digg.com/submit?url=" + sURL + "&title=" + sTitle));
            $(".sn_facebook").parent().find("a").attr("href", ("http://www.facebook.com/sharer.php?u=" + sURL));
            $(".sn_reddit").parent().find("a").attr("href", ("http://reddit.com/submit?url=" + sURL + "&title=" + sTitle));
            $(".sn_stumbleupon").parent().find("a").attr("href", ("http://www.stumbleupon.com/submit?url=" + sURL + "&title=" + sTitle));
            $(".sn_twitter").parent().find("a").attr("href", ("http://twitter.com/?status=" + sURL + "%20Interesting%20photo%20from%20%40joncombe"));

            // flickr url
            if (aGallery[iCurrImage].sFlickrURL.length > 0) {
                $("#photoFlickr a").attr("href", aGallery[iCurrImage].sFlickrURL).parent().show();
            } else {
                $("#photoFlickr").hide();
            }
            $("#photoURL span").text("http://joncom.be/gallery/" + sSetURL + "/" + (iCurrImage + 1));
        });

        // show thumbnail navigation
        if (iCurrImage > 0) {
            $("#thumbnailprev").addClass("on");
        } else {
            $("#thumbnailprev").removeClass("on");
        };
        if (iCurrImage < (aGallery.length - 1)) {
            $("#thumbnailnext").addClass("on");
        } else {
            $("#thumbnailnext").removeClass("on");
        };

        // load other thumbs
        GalleryThumbnails();
    }
}

function GalleryThumbnails() {
    var aThumbnails = $("#thumbnails img");
    for (var i = Math.max(iCurrImage - 4,0); i < Math.min(iCurrImage + 5, aThumbnails.size()); i++) {
        aThumbnails[i].src = aGallery[i].sThumbSRC;
    }
    for (var i = Math.max(iCurrImage - 1,0); i < Math.min(iCurrImage + 2, aThumbnails.size()); i++) {
        if (i != iCurrImage) {
            // only cache new images
            var bFound = false;
            for (var ii = (aImage.length - 1); ii > -1; ii--) {
                if (aImage[ii].src == aGallery[i].sSRC) {
                    bFound = true;
                    break;
                }
            }
            if (bFound != true) {
                CacheImage(aGallery[i].sSRC);
            }
        }
    }
}

function Interact() {
    var aURL = (self.location.href).split("/");
    var dtExpires = new Date();
    dtExpires.setMinutes(dtExpires.getMinutes() + 5);
    document.cookie = "schpam=" + aURL[aURL.length - 2] + "; expires=" + dtExpires.toGMTString() + "; path=/";
    return true;
}

var Twitter = {
    sPage: "",
    iCookieVersion: 1,
    oData: {
        dtLastUpdate: 100000,
        aTweets: []
    },

    Display: function() {
        switch(Twitter.sPage) {
            case "home":
                $("#twitterwide td.middle").html(Twitter.Format(Twitter.oData.aTweets[0].sTweet));
                $("#twitterwide").fadeIn();
                break;
            default:
                var aHTML = [];
                $.each(Twitter.oData.aTweets, function(i) {
                    aHTML.push("<li class=\"twitter" + i + "\">" +
                                   "<p>" + Twitter.Format(this.sTweet) + "</p>" +
                                   "<div>" + Twitter.Time(this.dtCreated) + "</div>" +
                               "</li>");
                });
                $("#twitter").html(aHTML.join(""));
                break;
        }
    },

    Format: function(sTweet) {
        var aURL = sTweet.match(/(ftp|http|https|file):\/\/[\S]+(\b|$)/gi);
        if (aURL) {
            for (var i = 0; i < aURL.length; i++) {
                if (aURL[i].substr(0,16) == "http://joncom.be") {
                    sTweet = sTweet.replace(aURL[i], '<a href="' + aURL[i] + '">' + aURL[i] + '</a>');
                } else {
                    sTweet = sTweet.replace(aURL[i], '<a href="' + aURL[i] + '" target="_blank">' + aURL[i] + '</a>');
                }
            }
        }
        var aRT = sTweet.match(/@[\S]+(\b|$)/gi);
        if (aRT) {
            for (var i = 0; i < aRT.length; i++) {
                sTweet = sTweet.replace(aRT[i], '<a href="http://twitter.com/' + aRT[i].substr(1) + '" target="_blank">' + aRT[i] + '</a>');
            }
        }
        return sTweet;
    },

    Init: function(sPage) {
        this.sPage = sPage;

        // init jookie
        $.Jookie.Initialise("twitter", (60 * 24 * 365));

        // delete old-style cookie
        if ((typeof $.Jookie.Get("twitter", "iVersion") != "number") || ($.Jookie.Get("twitter", "iVersion") < Twitter.iCookieVersion)) {
            $.Jookie.Unset("twitter", "iVersion");
            $.Jookie.Unset("twitter", "dtLastUpdate");
            $.Jookie.Unset("twitter", "aTweets");
        }

        // extract data from existing cookie
        if (typeof $.Jookie.Get("twitter", "dtLastUpdate") == "number") {
            Twitter.oData.dtLastUpdate = $.Jookie.Get("twitter", "dtLastUpdate");
            Twitter.oData.aTweets = $.Jookie.Get("twitter", "aTweets").slice();
        }

        // retrieve tweets
        if (this.oData.dtLastUpdate < ((new Date()).valueOf() - (1000 * 60 * 10))) {
            $.getJSON("http://search.twitter.com/search.json?rpp=3&q=from:joncombe&callback=?", function(a) {
                // push new tweets into array
                for (var i = a.results.length; i--; i > 0) {
                    var iID = a.results[i].id;
                    var bFound = false;
                    for (var iSearch = 0; iSearch < Twitter.oData.aTweets.length; iSearch++) {
                        if (Twitter.oData.aTweets[iSearch].iID == iID) {
                            bFound = true;
                            continue;
                        }
                    }
                    if (bFound != true) {
                        Twitter.oData.aTweets.splice(0, 0, {
                            dtCreated: Date.parse(a.results[i].created_at),
                            iID:       iID,
                            sTweet:    a.results[i].text
                        });
                    }
                }

                // sort array
                Twitter.oData.aTweets.sort(function(a,b) {
                    if (a.dtCreated < b.dtCreated) return 1;
                    if (a.dtCreated > b.dtCreated) return -1;
                });

                // limit array length to 3
                Twitter.oData.aTweets = Twitter.oData.aTweets.slice(0, 3);

                // set cookie values
                $.Jookie.Set("twitter", "iVersion", Twitter.iCookieVersion);
                $.Jookie.Set("twitter", "dtLastUpdate", (new Date()).valueOf());
                $.Jookie.Set("twitter", "aTweets", Twitter.oData.aTweets);
                Twitter.Display();
            });
        } else {
            Twitter.Display();
        }
    },

    Time: function(iTweet) {
        var iOffset = parseInt(((new Date()).getTime() - iTweet) / 1000);
//        iOffset += ((new Date()).getTimezoneOffset() * 60);
        if (iOffset < 60) {
            return "less than a minute ago"
        } else {
            if (iOffset < 120) {
                return "about a minute ago"
            } else {
                if (iOffset < (60 * 60)) {
                    return(parseInt(iOffset / 60)).toString() + " minutes ago"
                } else {
                    if (iOffset < (120 * 60)) {
                        return "about an hour ago"
                    } else {
                        if (iOffset < (24 * 60 * 60)) {
                            return "about " + (parseInt(iOffset / 3600)).toString() + " hours ago"
                        } else {
                            if (iOffset < (48 * 60 * 60)) {
                                return "1 day ago"
                            } else {
                                return (parseInt(iOffset / 86400)).toString() + " days ago"
                            }
                        }
                    }
                }
            }
        }
    }
};

/* Jookie */
(function($){$.Jookie={Data:{},Debug:function(a){Debug(a)},Delete:function(a){Delete(a)},Get:function(a,b){return Get(a,b)},Initialise:function(a,b){Initialise(a,b)},Set:function(a,b,c){Set(a,b,c)},Unset:function(a,b){Unset(a,b)}};function Debug(sName){var lsRegExp=/\+/g;var sJSON=unescape(String(Extract(sName)).replace(lsRegExp," "));alert("Name: "+sName+"\nLifespan: "+$.Jookie.Data[sName].iLifespan+" minutes\nCookie Existed Prior to Init: "+$.Jookie.Data[sName].bMadeEarlier+"\n\n"+sJSON)};function Delete(sName){delete $.Jookie.Data[sName];document.cookie=(sName+"=; expires="+(new Date(1990,6,3)).toGMTString()+"; path=/")};function Extract(sName){var vValue=null;var aContents=document.cookie.split(';');sName+="=";for(var iIndex in aContents){var sString=aContents[iIndex];while(sString.charAt(0)==" "){sString=sString.substring(1,sString.length)}if(sString.indexOf(sName)==0){vValue=sString.substring(sName.length,sString.length);break}}return vValue};function Get(sName,sVariableName){return $.Jookie.Data[sName].oValues[sVariableName]};function Initialise(sName,iLifespanInMinutes){if(typeof $.Jookie.Data[sName]=="undefined"){var oRetrievedValues={};var bCookieExists=false;var vCookieValue=Extract(sName);if(vCookieValue!==null){oRetrievedValues=JSON.parse(unescape(String(vCookieValue).replace(/\+/g," ")));bCookieExists=true}$.Jookie.Data[sName]={iLifespan:iLifespanInMinutes,bMadeEarlier:bCookieExists,oValues:oRetrievedValues};Save(sName)}};function Save(sName){var sExpires="";if($.Jookie.Data[sName].iLifespan>0){var dtDate=new Date();dtDate.setMinutes(dtDate.getMinutes()+$.Jookie.Data[sName].iLifespan);sExpires=("; expires="+dtDate.toGMTString())}document.cookie=(sName+"="+escape(JSON.stringify($.Jookie.Data[sName].oValues))+sExpires+"; path=/")};function Set(sName,sVariableName,vValue){$.Jookie.Data[sName].oValues[sVariableName]=vValue;Save(sName)};function Unset(sName,sVariableName){delete $.Jookie.Data[sName].oValues[sVariableName];Save(sName)}})(jQuery);

/* JSON */
if(!this.JSON){JSON=function(){function f(n){return n<10?'0'+n:n}Date.prototype.toJSON=function(key){return this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z'};var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapeable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapeable.lastIndex=0;return escapeable.test(string)?'"'+string.replace(escapeable,function(a){var c=meta[a];if(typeof c==='string'){return c}return'\\u'+('0000'+(+(a.charCodeAt(0))).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key)}if(typeof rep==='function'){value=rep.call(holder,key,value)}switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null'}gap+=indent;partial=[];if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null'}v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v}if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value,rep);if(v){partial.push(quote(k)+(gap?': ':':')+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value,rep);if(v){partial.push(quote(k)+(gap?': ':':')+v)}}}}v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v}}return{stringify:function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' '}}else if(typeof space==='string'){indent=space}rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}return str('',{'':value})},parse:function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+(+(a.charCodeAt(0))).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j}throw new SyntaxError('JSON.parse');}}}()}