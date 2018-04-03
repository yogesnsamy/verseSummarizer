/**
 * Print out Verse API data for all the action samples
 */
window.addEventListener("message", function(event) {
  // Add check for the event origin here
  console.log(event);

  document.getElementById("status").innerHTML = "";

  var jsonNode = document.getElementById("json");
  var a = JSON.stringify(event.data.verseApiData);

  processEmail(a, function (mailContent) {
    if(mailContent) {
      console.log('processing');
      var data = {"textToAnalyze": mailContent};
      $.ajax({ url: "https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-nlu.json", data, method: 'POST' })
        .done(function(result) {
        // jsonNode.innerText = mailContent;
        
        jsonNode.innerText = JSON.stringify(result, null, 2);
        jsonNode.innerText += "\n\nOriginal email content: \n"+mailContent;
        
      })
    }
    else {
      console.log('still no content yet..')
    }

    /**
     * Message from Verse to check whether your web application is ready.
     */
    if (event.data.verseApiType === "com.ibm.verse.ping.application.loaded") {
      var loaded_message = {
        verseApiType: 'com.ibm.verse.application.loaded'
      };
      /**
       * Your application must send a message back to Verse
       * to identify that it's ready to receive data from Verse.
       */
      event.source.postMessage(loaded_message, event.origin);
    }
  })

  function processEmail (a, cb) {
    return new Promise(function (resolve, reject) {
      //remove all the html tags
      var p = '';
      var opentag = false;
      for(var i in a) {

          if(a[i] == '>') {
              opentag = false;
          }
          else if(opentag || a[i] == '<') {
              opentag = true;
          }
          else {
              p += a[i];
          }
      }
      //remove all the whitespace, &nbsp; , and whitespaces (consecutive 2 or more)
      p = p.replace(/(?:\r\n|\r|\n)/g, '').replace(/(&nbsp;)/g, '').replace(/\s\s+/g, '');
      var q = '';
      var skip = false;
      for(var i in p) {
        if(skip) {
          skip = false;
          continue;
        }
        else if(p[i] == '\\')
          skip = true;
        else
          q += p[i];
      }

      // //manually parse the mail content, as JSON.parse(q) is not woring for some reason..
      var closeInd = 0;
      for(var i = (q.indexOf('"body":"')+8); i <= q.length; i++) {
          if(q[i] == '"') {
              closeInd = i;
              break;
          }
      }
      var mailContent = q.substring((q.indexOf('"body":"')+8), closeInd);

      return resolve (cb(mailContent));
    })
  }

}, false);
