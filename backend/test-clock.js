const axios = require('axios');
(async () => {
  try {
    // First let's check what auth token we have from frontend or just hit it without since it has no guard now.
    // Wait, the user removed UseGuards(JwtAuthGuard) from checkStatus and clockInClockOut. So we can hit it easily.
    const checkStatusDto = {
      isoCode: "IN",
      countryCode: "+91",
      phoneNumber: "9876543210" // need a valid phone
    };
    const res = await axios.post('http://localhost:3001/api/v1/attendance/check-status', checkStatusDto);
    console.log("Check Status:", JSON.stringify(res.data, null, 2));

    const statusObj = res.data.data;
    if (!statusObj.user) {
      console.log("No user in response");
      return;
    }

    const clockDto = {
      uid: statusObj.user.uid,
      ulId: statusObj.activeLog ? statusObj.activeLog.ulId : undefined
    };

    console.log("Sending to clock:", clockDto);
    const clockRes = await axios.post('http://localhost:3001/api/v1/attendance/clock-in-clock-out', clockDto);
    console.log("Clock result:", JSON.stringify(clockRes.data, null, 2));

  } catch (e) {
    if (e.response) {
      console.log("Error status:", e.response.status);
      console.log("Error data:", JSON.stringify(e.response.data, null, 2));
    } else {
      console.log(e);
    }
  }
})();
