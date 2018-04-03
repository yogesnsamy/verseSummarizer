/** 
 * yoges 20180402 add module to writeResult to actions.html file
 * var tools = require('./tools');
 * console.log(typeof tools.foo); // => 'function'
 */

/**
 * Print out Verse API data for all the action samples
 */
window.addEventListener("message", function (event) {
  // Add check for the event origin here
  console.log(event);

  document.getElementById("status").innerHTML = "";

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

  processEmail(rawdata, function (email) {
    if (email) {
      console.log('processed.. sending to Watson service');

      jsonNode.innerText = 'Sender: ' + email.mailContent.context.sender.displayName + '\n';
      jsonNode.innerText += 'Subject: ' + email.mailContent.context.subject + '\n\n';

      var data = {
        "textToAnalyze": email.mailContent.context.body.substr(0, email_content_length_limit),
        "type": 'text'
      };
      $.ajax({
          url: "https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-nlu.json",
          // url: "https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-ta.json",
          data,
          method: 'POST'
        })
        .done(function (result) {

          jsonNode.innerText += 'Original email content: \n' + email.mailContent.context.body + '\n';
          jsonNode.innerText += 'content analysis result:\n' + JSON.stringify(result, null, 2) + '\n\n';
          writeResult(result,email);

          //process the links
          for (var i in email.links) {
            data = {
              "textToAnalyze": email.links[i],
              "type": 'url'
            }
            $.ajax({
                url: "https://openwhisk.ng.bluemix.net/api/v1/web/ecodadmi%40us.ibm.com_cheoksv-dev/default/cheok-nlu.json",
                data,
                method: 'POST'
              })
              .done(function (result) {

                jsonNode.innerText += 'Link(s) analysis result:\n' + result.url + '\n';
                jsonNode.innerText += JSON.stringify(result.res, null, 2) + '\n\n';

              })
          }

        })
    } else {
      console.log('still no content yet..');
      jsonNode.innerText = "Processing...";
    }
  })

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
      p = a.replace(/<[^>]*>/g, '').replace(/\\n/g, '').replace(/(&nbsp;)/g, ' ').replace(/\s\s+/g, '').replace(/\\t/g, '');

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

  function writeResult(result,email) {
    console.log("x" + result);
    document.getElementById("mailSubject").innerHTML = email.mailContent.context.subject;
    document.getElementById("mailSender").innerHTML = "<em>From: " + email.mailContent.context.sender.displayName+"</em>";
    document.getElementById("mailBody").innerHTML = email.mailContent.context.body;
    // jsonNode.innerText = 'Sender: ' + email.mailContent.context.sender.displayName + '\n';
    // jsonNode.innerText += 'Subject: ' + email.mailContent.context.subject + '\n\n';
    // document.getElementById("kw0").innerHTML = result.keywords[0].text;
    // var fixedRelevance = result.keywords[0].relevance;
    // fixedRelevance = fixedRelevance * 100;
    // document.getElementById("rel0").innerHTML = ((result.keywords[0].relevance)*100).toFixed(2);
    
    for(let i=0; i<result.keywords.length;i++){
      document.getElementById("kw"+i).innerHTML = "<td id=\"kw0\">"+result.keywords[i].text+"</td>";
      document.getElementById("rel"+i).innerHTML = "<td id=\"rel0\" class=\"badge badge-primary badge-pill\">"+((result.keywords[i].relevance)*100).toFixed(2)+"</td>";
    }
  }

}, false);