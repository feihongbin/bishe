// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");

function sendPhoneCode(phone, code) {
  return new Promise((resolve, reject) => {
    const SmsClient = tencentcloud.sms.v20210111.Client;

    const clientConfig = {
      credential: {
        secretId: "",
        secretKey: "",
      },
      region: "ap-nanjing",
      profile: {
        httpProfile: {
          endpoint: "sms.tencentcloudapi.com",
        },
      },
    };

    const client = new SmsClient(clientConfig);
    const params = {
      "PhoneNumberSet": [
        phone
      ],
      "SmsSdkAppId": "1400656057",
      "SignName": "前端技术分享个人网",
      "TemplateId": "1353632",
      "TemplateParamSet": [
        code
      ]
    };
    client.SendSms(params).then(
      (data) => {
        resolve(data)
      },
      (err) => {
        reject(err)
      }
    );
  })
}

module.exports = {
  sendPhoneCode
}
