var request = 	require('request');

function sendPushNotification(device, message){
  var restKey = 'N2UwOTU4N2YtM2VlNC00ZTE5LTgwZjUtMDhkM2M4MGJhZTBi';
	var appID = '6e53dc59-0a67-4f89-b5c6-0b1034aaa550';

  var finalBody ={
    'app_id': appID,
    'contents': {en: message},
    'include_player_ids': Array.isArray(device) ? device : [device]
  };
  if(device == "*"){
    finalBody ={
      'app_id': appID,
      'contents': {en: message},
      included_segments: ["All"]
    };
  }

	request(
		{
			method:'POST',
			uri:'https://onesignal.com/api/v1/notifications',
			headers: {
				"authorization": "Basic " + restKey,
				"content-type": "application/json"
			},
			json: true,
			body:finalBody
		},
		function(error, response, body) {
			if(!body.errors){
				console.log(body);
			}else{
				console.error('Error:', body.errors);
			}

		}
	);
}

module.exports = sendPushNotification;
