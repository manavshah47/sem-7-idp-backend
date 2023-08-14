API's

1. member send otp request (POST)
http://localhost:3001/api/member/send-otp
{
  "phone":"8200580922"
}

2. login member otp (POST)
http://localhost:3001/api/member/login
{
  "id":"8200580922",
  "password":"339830"
}

3. show-member-info (GET)
http://localhost:3001/api/member/show-member-info

Note: Use Embed tag to showcase pdf files
<embed src="file-name" width="100%" height="100%">

