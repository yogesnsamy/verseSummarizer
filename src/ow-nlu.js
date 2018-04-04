function main(params) {
  return new Promise(function (resolve, reject) {
      console.log('Analyzing \n'+params.textToAnalyze);
      console.log('type: '+params.type);
      
    var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
    var natural_language_understanding = new NaturalLanguageUnderstandingV1({
      'username': 'cf24b1f4-c105-48ad-9aa6-03da0b48afff',
      'password': 'Vz2qSJnUmDHJ',
      'version_date': '2018-03-16'
    });

    var type = params.type;
    var parameters = {};
    if(type == 'url') {
      parameters = {
        'url': params.textToAnalyze,
        'features': {
          'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 250
          },
          'emotion': {}
        }
      }
    }

    else {
      parameters = {
        'text': params.textToAnalyze,
        'features': {
          // 'entities': {
          //   'emotion': true,
          //   'sentiment': true,
          //   'limit': 2
          // },
          'keywords': {
            'emotion': true,
            'sentiment': true,
            'limit': 5
          },
          'emotion': {}
        }
      }
    }

    natural_language_understanding.analyze(parameters, function (err, res) {
      if (err) {
        console.log('error:',err);
        reject(err);
      }
      else {
        console.log(res);
        if(type == 'url')
          resolve({res, 'url': params.textToAnalyze});
        else
          resolve(res);
      }
    });
  });
}