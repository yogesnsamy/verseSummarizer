function main(params) {
  return new Promise(function (resolve, reject) {
      console.log('Analyzing \n'+params.textToAnalyze);
    const ToneAnalyzerV3 = require("watson-developer-cloud/tone-analyzer/v3");

    var tone_analyzer = new ToneAnalyzerV3({
      "username": params.username || "02a8f15a-b563-4ef9-8c23-13bd4780e64d",
      "password": params.password || "PkmrHbHqtwkG",
      "version_date": "2017-09-21"
    });

    tone_analyzer.tone({
      "text": params.textToAnalyze
    }, function(err, res) {
      if (err)
        reject(err);
      else
        resolve(res);
    });
  });
}