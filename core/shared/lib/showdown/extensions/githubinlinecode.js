/* jshint node:true, browser:true */

// GitHub Inline Code
//
// Allows github style inline code formatting:
// "Use single backticks (`) to format text in a special monospace format. Everything within the backticks appear as-is, with no other special formatting."
//
// Currently, content within the backticks is NOT encoded so HTML formatting applies. 


var Ghost = Ghost || {};
(function () {
    var githubinlinecode = function () {
        return [
            // `` inline code syntax
            // this runs before the default showdown parsing so we can convert the backticks before it does
            {
                type: 'lang',
                filter: function (text) {
                    // taken from showdown's _DoCodeSpans
                    var inlineCodeRegex = /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm;
                    
                    // taken from showdown's _DoGithubCodeBlocks
                    var githubCodeBlockRegex = /(?:^|\n)```(.*)\n([\s\S]*?)\n```/g;
                    
                    return text.replace(inlineCodeRegex, function (wholeMatch,m1,m2,m3,m4) {
                        var c = m3;
                        // start changes
                        // check if this would be a github code block
                        // if so, don't do anything to it
                        if (wholeMatch.match(githubCodeBlockRegex) !== null) {
                            return wholeMatch;
                        }
                        
                        c = c.replace(/\r?\n|\r/g,""); // remove all newlines
                        // end changes
                        c = _EncodeCode(c);
                        return m1+"<code>"+c+"</code>";
                    });
                }
            }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
        window.Showdown.extensions.githubinlinecode = githubinlinecode;
    }
    // Server-side export
    if (typeof module !== 'undefined') {
        module.exports = githubinlinecode;
    }
}());



// taken from showdown
function _EncodeCode(text) {
    //
    // Encode/escape certain characters inside Markdown code runs.
    // The point is that in code, these characters are literals,
    // and lose their special Markdown meanings.
    //
    // Encode all ampersands; HTML entities are not
    // entities within a Markdown code span.
    text = text.replace(/&/g,"&amp;");

    // Do the angle bracket song and dance:
    text = text.replace(/</g,"&lt;");
    text = text.replace(/>/g,"&gt;");

    // Now, escape characters that are magic in Markdown:
    text = escapeCharacters(text,"\\*_{}[]\\",false);

    // jj the line above breaks this:
    //---

    //* Item

    //   1. Subitem

    //            special char: *
    //---

    return text;
};

// taken from showdown
function escapeCharacters(text, charsToEscape, afterBackslash) {
    // First we have to escape the escape characters so that
    // we can build a character class out of them
    var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";

    if (afterBackslash) {
      regexString = "\\\\" + regexString;
    }

    var regex = new RegExp(regexString,"g");
    text = text.replace(regex,escapeCharacters_callback);

    return text;
};

// taken from showdown
var escapeCharacters_callback = function(wholeMatch,m1) {
    var charCodeToEscape = m1.charCodeAt(0);
    return "~E"+charCodeToEscape+"E";
};