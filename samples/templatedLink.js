document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#closeWindow').addEventListener('click', close);

});

function close() {
  // window.close();
  chrome.tabs.getCurrent(function(tab) {
      chrome.tabs.remove(tab.id, function() { });
  });
} 
window.addEventListener("message", function (event) {
  // Add check for the event origin here
  console.log(event);

  // document.getElementById("status").innerHTML = "";

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

  var jsonNode = document.getElementById("json");
  var rawdata = JSON.stringify(event.data.verseApiData);
  var link_limit = 3;
  var email_content_length_limit = 1000;
  // var api = [];
  // api.push("https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-nlu.json");
  // api.push("https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-ta.json");
  // start of processEmail function call -------------------------------------------
  processEmail(rawdata, function (email) {
    if (email) {
      console.log('processed.. sending to Watson service');

      // jsonNode.innerText = 'Sender: ' + email.mailContent.context.sender.displayName + '\n';
      // jsonNode.innerText += 'Subject: ' + email.mailContent.context.subject + '\n\n';

      // var data = {
      //   "textToAnalyze": email.mailContent.context.body, //.substr(0, email_content_length_limit),
      //   "type": 'text'
      // };
      var data = {
        "textToAnalyze": email.mailContent.context.body,
        "type": 'text'
      };
      $.ajax({
          url: "https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-nlu.json",
          // url: "https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-ta.json",
          data,
          method: 'POST'
        })
        .done(function (result) {

          //  jsonNode.innerText += 'Original email content: \n' + email.mailContent.context.body + '\n';
          //  jsonNode.innerText += 'content analysis result:\n' + JSON.stringify(result, null, 2) + '\n\n';
          writeResult(result, email);

          //process the links
          // for (var i in email.links) {
          //   data = {
          //     "textToAnalyze": email.links[i],
          //     "type": 'url'
          //   }
          //   $.ajax({
          //       url: "https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-nlu.json",
          //       data,
          //       method: 'POST'
          //     })
          //     .done(function (result) {

          //       // jsonNode.innerText += 'Link(s) analysis result:\n' + result.url + '\n';
          //       // jsonNode.innerText += JSON.stringify(result.res, null, 2) + '\n\n';

          //     })
          // }

        })
    } else {
      console.log('still no content yet..');
      // jsonNode.innerText = "Processing...";
    }
  })
  // end of processEmail function call -------------------------------------------
  function processEmail(a, cb) {
    return new Promise(function (resolve, reject) {
      //get all the links from href tag
      var b = a.split('a href=\\\"');
      var limit = 0;
      var links = [];
      console.log('---number of b:', b);
      for (var i in b) {
        // console.log('index:',b[i].indexOf('http'));
        if (b[i].trim().startsWith('http')) {
          links.push(b[i].substring(0, b[i].indexOf('\\"')));
          limit++;
          if (limit == link_limit)
            break;
        }
      }

      //remove all the html tags, newlines, white spaces
      var p = '';
      // p = a.replace(/<[^>]*>/g, '').replace(/\\n/g, '').replace(/(&nbsp;)/g, ' ').replace(/\s\s+/g, '').replace(/\\t/g, '');
      // p = a.replace(/<[^>]*>/g, ' ').replace(/\\n/g, ' ').replace(/( )/g, ' ').replace(/\s\s+/g, ' ').replace(/\\t/g, '');
      p = a.replace(/<[^>]*>/g, ' ').replace(/\\n/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s\s+/g, ' ').replace(/\\t/g, '');

      //Parse the content in json format
      var mailContent = JSON.parse(p);
      // var mailContent = jsonContent.context.body;
      // console.log(mailContent);
      // console.log('---links length---',links.length)
      return resolve(cb({
        mailContent,
        links
      }));
    })
  }

  function writeResult(result, email) {
    console.log("writing result..." + result);
    document.getElementById("mailSubject").innerHTML = "<em>"+email.mailContent.context.sender.displayName+"</em>: <strong>"+email.mailContent.context.subject+"</strong>";// +  " <i class=\"far fa-smile\"></i>";
    // document.getElementById("mailSender").innerHTML = "<h5>From: " + email.mailContent.context.sender.displayName + "</h5>";
    //-------
    document.getElementById("emotionSummary").innerHTML = "<table class=\"table\"> <tbody> <tr> <td><p>Joy <code>"+((result.emotion.document.emotion.joy)*100).toFixed(2)+"%</code></p><p> <img src=\"img/src/joy.gif\" height=\"70\" width=\"70\"> </p></td><td><p>Anger <code>"+((result.emotion.document.emotion.anger)*100).toFixed(2)+"%</code></p><p> <img src=\"img/src/anger.gif\" height=\"70\" width=\"70\"> </p></td><td><p>Disgust <code>"+((result.emotion.document.emotion.disgust)*100).toFixed(2)+"%</code></p><p> <img src=\"img/src/disgust.gif\" height=\"70\" width=\"70\"> </p></td><td><p>Sadness <code>"+((result.emotion.document.emotion.sadness)*100).toFixed(2)+"%</code></p><p> <img src=\"img/src/sadness.gif\" height=\"70\" width=\"70\"> </p></td><td><p>Fear <code>"+((result.emotion.document.emotion.fear)*100).toFixed(2)+"%</code></p><p> <img src=\"img/src/fear.png\" height=\"70\" width=\"70\"> </p></td></tr></tbody> </table>"
    //----------
    document.getElementById("keywordSummary").innerHTML += "<ul class=\"list-group\">";
    document.getElementById("keywordSummary").innerHTML += "<li class=\"list-group-item\"><strong>Keywords and Relevance <span style=\"background-color: #379ef5;\" class=\"badge\">   %   </strong></span></li>";
    for (let i = 0; i < 10; i++) {
      document.getElementById("keywordSummary").innerHTML += "<li id=\"kwSummary\" class=\"list-group-item\">" + result.keywords[i].text + " <span style=\"background-color: #379ef5;\" class=\"badge\">" + ((result.keywords[i].relevance) * 100).toFixed(2) + "%</span></li>";
    }
    document.getElementById("keywordSummary").innerHTML += "</ul>";
  }

}, false);