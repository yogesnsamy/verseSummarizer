var a = '{"actionId":"com.ibm.verse.ext.mail.read.action","context":{"body":" Warmest regards, Zainal Azman ShaariCloud Developer Support,CoDE (Center of Digital Experience): +603-2301-8639:Mobile: +6(019)-219 9949:zainala@my.ibm.comIBM ConnectionsIBM Malaysia15th Floor Plaza IBM,8 First Ave, Pers. Bandar Utama,47800 Petaling Jaya,Selangor, MALAYSIA  This e-mail, including attachments, is for the sole use of the individual(s) to whom it is addressed, and may contain confidential and privileged information. Any unauthorized review, use, disclosure or distribution is prohibited. If you have received this email in error, please notify the sender by reply email and destroy this message and its attachments","contextId":"uniqName_92_0","subject":"I am working from home today (30 Mar). Thanks /eom","recipientCC":[{"emailAddress":"hasliza@my.ibm.com","phoneticName":"","notesAddress":"Putri Hasliza/Malaysia/IBM","displayName":"Putri Hasliza"}],"recipientTo":[{"emailAddress":"phuacs@my.ibm.com","phoneticName":"","notesAddress":"Chai Shong Phua/Malaysia/IBM","displayName":"Chai Shong Phua"},{"emailAddress":"shindy@my.ibm.com","phoneticName":"","notesAddress":"Deock Yong Shin/Malaysia/IBM","displayName":"Deock Yong Shin"},{"emailAddress":"leongcm@my.ibm.com","phoneticName":"","notesAddress":"Cui Mei Leong/Malaysia/IBM","displayName":"Cui Mei Leong"},{"emailAddress":"1zarinah@my.ibm.com","phoneticName":"","notesAddress":"Zarinah Jalani/Malaysia/Contr/IBM","displayName":"Zarinah Jalani"},{"emailAddress":"syahrul.aiman@my.ibm.com","phoneticName":"","notesAddress":"Syahrul Aiman Shaharuddin/Malaysia/IBM","displayName":"Syahrul Aiman Shaharuddin"},{"emailAddress":"cheoksv@my.ibm.com","phoneticName":"","notesAddress":"Swin Voon Cheok/Malaysia/IBM","displayName":"Swin Voon Cheok"}],"timeSent":"2018-03-30T01:08:00.280Z","unid":"D828F3E968D0BD110025826000062C48","id":"","sender":{"emailAddress":"zainala@my.ibm.com","phoneticName":"","notesAddress":"Zainal Azman Shaari/Malaysia/IBM","displayName":"Zainal Azman Shaari"}}}';
// var a = '{"verseApiType":"com.ibm.verse.action.clicked","verseApiData":{"actionId":"com.ibm.verse.ext.mail.read.action","context":{"body":"test","contextId":"uniqName_92_0","subject":"Zarinah is WFH today, Thu-29 Mar","recipientCC":[],"recipientTo":[{"displayName":"IDR-KL","emailAddress":"IDR-KL"}],"timeSent":"2018-03-29T01:09:24.530Z","unid":"758635C097D4AB244825825F0006574F","id":"<OF758635C0.97D4AB24-ON4825825F.0006574F-4825825F.00066035@LocalDomain>","sender":{"emailAddress":"1zarinah@my.ibm.com","phoneticName":"","notesAddress":"Zarinah Jalani/Malaysia/Contr/IBM","displayName":"Zarinah Jalani"}}}}';
// var a = '{"c": "1"}';
// var a = 'abc';
// var p = '';
// var opentag = false;
// for(var i in a) {

//     if(a[i] == '>') {
//         opentag = false;
//     }
//     else if(opentag || a[i] == '<') {
//         opentag = true;
//     }
//     else {
//         p += a[i];
//     }
// }
// p = p.replace(/(?:\r\n|\r|\n)/g, '').replace(/(&nbsp;)/g, '').replace(/\s/g, '');
// console.log(p)
// var b = JSON.parse(a);
// console.log(b.c);
// console.log(b.context.body);
var closeInd = 0;
for(var i = (a.indexOf('"body":"')+8); i <= a.length; i++) {
    if(a[i] == '"') {
        closeInd = i;
        break;
    }
}
var c = a.substring((a.indexOf('"body":"')+8), closeInd);
console.log(c);