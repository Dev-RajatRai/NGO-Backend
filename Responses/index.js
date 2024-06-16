// ---------------- Success Response ------------------------//
export const loggedIn = {
  status: 200,
  message: "Logged in Successfully",
};

export const signUp = {
  status: 206,
  message: "Welcome to Nextwork Technologies. Please Login or Sign Up explore next level work with Nextwork Technologies.",
}
export const fetched = (column) => {
  return {
    status: 200,
    message: `${column} details are ready!`,
  };
};

export const comProfile = {
  status: 200,
  message: "Please complete Your Profile"
}

export const valid = {
  status: 200,
  message: "User Id is verified Successfully",
};

export const userCredMsg = {
  status: 200,
  message: "Nextwork Technologies Account Verification",
};

export const markedRead = {
  status: 200,
  message: "Notification has been marked read."
}

export const tbAdded = (tb) => {
  return {
    status: 200,
    message: `${tb} Tera-Byte Added to Your Product List.`
  }
}



export const columnUpdated = (type) => {
  return {
    status: 200,
    message: `${type} has been updated Successfully!`,
  };
};


export const columnCreated = (type) => {
  return {
    status: 200,
    message: `${type} has been created Successfully!`,
  };
};

export const userActivated = {
  status: 200,
  message: `Account is activated Successfully!`,
};

export const product = (status) => {
  return {
    status: 200,
    message: `Product has been ${status} Successfully`,
  };
};

export const readed = {
  status: 200,
  message: "Notification Marked read!",
};

export const otpSent = {
  status: 200,
  message:
    "OTP has been sent to your registered mobile No & Email address. OTP is valid for 5 minutes only.",
};


export const otPSentForPass = {
  status: 200,
  message: "OTP has been sent to your registered Mobile No & Email Id. Please verify your identity. OTP is valid for 5 minutes only."
}



export const registered = {
  status: 200,
  message:
    "Your ID has been generated successfully. Kindly complete your KYC for successful registration.\n Note: Keep your ID safe",
};

export const kycRequired = {
  status: 200,
  message: "Your KYC has been Generated Successfully. Please Submit your Valid documents for Activation."
}

export const deleted = (table) => {
  return {
    status: 200,
    message: `${table} has been deleted Successfully`,
  };
};

export const walletMsg = (status) => {
  return {
    status: 200,
    message: `your ${status} request has been intiated. Your wallet will be updated shortly. Kindly check your mail for confirmation. Below is your unique transaction Id.`,
  };
};


export const kycDone = {
  status: 200,
  message:
    "Thank You for joining Nextwork! Your kYC has been submitted successfully. Your profile is in review. You will receive a email soon.",
};

export const income = {
  status: 200,
  message: "Monthly Rent intiated Successfully",
};

export const transfered = {
  status: 200,
  message: "Amount has been transfered Successfully",
};

export const passSent = {
  status: 200,
  message:
    "An Account update has been sent on you email Address. Kindly check your mail.",
};

export const connectionCreated = {
  status: 200,
  message:
    "Your connection Request has been made. Kindly make payment and start earning.",
  type: "new purchase",
};

export const limitReward = {
  status: 200,
  message: "You are ready to achieve Your Time limit award. Please check eligibility and claim now."
}

export const achieved = {
  status: 200,
  message: "Congratulations! Your have Succesfully Achieved your award. Soon! You will recieve your award."
}

export const royalityAchieved = (des) => {
  return {
    status: 200,
    message: `Congratulations! Now You Are Promoted to ${des.toUpperCase()} MANAGER.`
  }
}

// ---------------- Partial Response ------------------------//
export const transactionAdded = {
  status: 206,
  message: `Your request has been made successfully. Please contact Support team to update transaction Records.`,
};

export const pendingConnection = {
  status: 206,
  message: "You have already a pending request. Kindly complete the purchase",
  type: "pending",
};

export const amountDebited = {
  status: 206,
  message: "Your Account has been debited. Error while transferring amount, please contact Support team.",
};

export const modify0 = {
  status: 206,
  message: "Nothing to modify",
};

export const pagesAdded = { status: 200, message: "Pages has been added to your website." }

// ---------------- Unsuccess Response ------------------------//


export const passNotMatched = {
  status: 400,
  message: "Confirm password and password didn't matched!"
}

export const notEligible = {
  status: 400,
  message: "Your are not eligible for this reward. We strongly believe that you will achieve it soon."
}

export const noRoyality = {
  status: 400,
  message: "You are Not eligible for royality yet. Add more business to your portfolio."
}

export const noRoyalityUpd = {
  status: 400,
  message: "No Royality Update!"
}


export const invalidOtp = {
  status: 400,
  message: "Invalid or Expired OTP. Kindly enter valid OTP or click on resend.",
};

export const noIfsc = {
  status: 400,
  message: "Invalid IFSC",
};

export const noAddress = {
  status: 400,
  message:
    "No address was found for mentioned User Id. Kindly add Address First.",
};

export const connectionLimit = {
  status: 400,
  message: "Kindly make split orders for more then specified limit.",
};
export const unsufficient = {
  status: 400,
  message: "Your wallet doesn't have sufficient balance",
};

export const unabletoVerify = {
  status: 400,
  message: "Unable to verify your files. Kindly provide approriate data.",
};

export const notVerified = {
  status: 400,
  type: "kyc required",
  message: "Your account is not verfied. Please update your Kyc or check email to activate your account.",
};

export const unsTransactionRes = {
  status: 400,
  message: "You have made a unsuccessful Transaction.",
};

export const authAdmin = {
  status: 400,
  message: "You are not an legal authorized person.",
};

export const serverError = {
  status: 500,
  message: "Internal Server Error - Wrong Information or Network Error",
};

export const inactiveConsul = {
  status: 400,
  message: "No Active Consultation Found",
};

export const tryAgain = {
  status: 400,
  message:
    "Something went wrong, please check the information you provide or try again later",
};

export const limitCrossed = {
  status: 400,
  type: "blocked",
  message:
    "Your have exhausted you login limit. Please contact support team to reactivate your account.",
};

export const connNotFound = {
  status: 404,
  message:
    "Oops! It's seems that you don't have a connection yet. Please buy a new connection and start earning.",
};

export const mobileLimit = {
  status: 400,
  message: "You cannot use same mobile number more than 10 times.",
};

export const invalidLoginCred = {
  status: 400,
  type: "incorrect",
  message: "Invalid login credentials. Please check and try again!",
};

export const invalidAadharFile = {
  status: 400,
  message: "Invalid Identity Proofs! One more wrong attempt will block your Id."
}

export const invalidEmail = {
  status: 400,
  message: "Invalid email address!",
};

export const invalidPass = {
  status: 400,
  message:
    "Password must contain at least one letter, one number, one special character and minimum 8 characters long.",
};

export const blockedId = {
  status: 400,
  message: "Your ID is Blocked. Please contact the admin",
};

export const InvalidId = (type) => {
  return {
    status: 400,
    type: `invalid`,
    message: `Invalid ${type} ID`,
  };
};

export const userExists = {
  status: 400,
  message: "User already Exist",
};

export const kycExist = {
  status: 400,
  message: "You are already verified or using registered user documents!"
}

export const addressExist = {
  status: 400,
  message: "Address already Exists for mentioned User Id.",
};

export const transExist = {
  status: 400,
  message: "Transaction Already Exist or given token is Expired",
  type: "invalid",
};

export const notExist = (collection) => {
  return {
    status: 404,
    message: `${collection} not found`,
  };
};

export const idNotFound = {
  status: 400,
  message: "User Id not found. Please enter correct User Id",
};

export const requriedKey = (fields) => {
  return {
    status: 400,
    message:
      fields.length > 1
        ? `Fields - (${fields}) are required!`
        : `${fields} is required!`,
  };
};

export const placementer = {
  status: 400,
  message: "Placement User doesn't Exist or blocked with given Id",
};

export const minLimit = {
  status: 400,
  message: "Ohh! It seems you don't enough to withdraw. Minimum 500 is required to withdraw",
}

export const alreadyActive = {
  status: 206,
  message: "Your Account is already Active",
};
export const failedIncome = {
  status: 400,
  message: "Failed to Initiate monthly Income. Try manually, or contact admin",
};

export const tryLater = {
  status: 403,
  message:
    "You have reached maximum login attempts. Kindly try again after 24 Hours.",
};

export const expired = {
  status: 400,
  message: "Your session has been expired or logged out!",
};

export const noMember = {
  status: 404,
  message:
    "We see, you don't have members yet. Start Earning more by adding more members",
};

// ---------------- Unauthorized Request ------------------------//

export const unauthorized = {
  status: 401,
  message: "Unauthorized Request",
};

// ----------------  Email Content ------------------------//

export const forgetPasswordContent = (userId, otp, name) => {
  return `
<!DOCTYPE html>
                <html>
                    <body>
                        <p>Hello ${name},</p>
                        <p>Your forget password code has been generated.</p>
                        <ul>
                            <li>User ID: ${userId}</li>
                            <li>Your verification code is - ${otp}</li>
                            <li>Please don't share code with anyone. Nextwork Team never ask you for any otp.</li>
                        </ul>
                        <p> For More, write us at: Support Email: support@nextworktechnologies.com</p>
                        <p>Thanks & Regards</p><br/>
                        <p>Nextwork Technologies!</p>
                    </body>
                </html>`;
};

export const loginOtp = (userId, otp, name) => {
  return `
<!DOCTYPE html>
                <html>
                    <body>
                        <p>Hello ${name},</p>
                        <ul>
                            <li>User ID: ${userId}</li>
                            <li>Your verification code is - ${otp}</li>
                            <li>Please don't share code with anyone. Nextwork Team never ask you for any otp.</li>
                        </ul>
                        <p> For More, write us at: Support Email: support@nextworktechnologies.com</p>
                        <p>Thanks & Regards</p>
                        <p>Nextwork Technologies!</p>
                    </body>
                </html>`;
};

export const walletUpdated = (id, name, wallet, amount, type) => {
  return `
<!DOCTYPE html>
                <html>
                    <body>
                        <h2>Hello ${name},</h2>
                        <p>Your wallet balance has been updated</p>
                        <ul>
                            <li>User ID: ${id}</li>
                            <li>wallet: ${wallet}</li>
                            <li>Request Type: ${type}</li>
                            <li>Amount: ${amount}</li>
                            < li > Amount (₹${amount}) has successfully ${type} into your wallet < /li>
                        </ul>
                        <p>Write us at: support@nextworktechnologies.com</p><br/>
                        <p>Thanks & Regards</p>
                        <p>Nextwork Technologies</p>
                    </body>
                </html>`;
};

export const incentive = (id, amount, name) => {
  return `
<!DOCTYPE html>
                <html>
                    <body>
                        <h2>Hello ${name},</h2>
                        <p>Your New income has been generated and credited to your wallet. Keep working and earning</p>
                        <ul>
                            <li>User ID: ${id}</li>
                            <li>Amount: ${amount}</li>
                            < li > Amount (₹${amount}) has successfully credited into your wallet < /li>
                        </ul>
                        <p>Write us at: support@nextworktechnologies.com</p><br/>
                        <p>Thanks & Regards</p>
                        <p>Nextwork Technologies</p>
                    </body>
                </html>`;
};

export const activateAccount = (userId, name) => {
  return `
  <!DOCTYPE html>
<html>
    <body>
        <p>Hello ${name},</p>
        <br/>
        <br/>
        <p>Congratulations on activating your Nextwork account successfully!</p>
        <p>We at Nextwork Technologies are excited to have you on board and wish you great success ahead. Your account credentials are provided below. If you have any questions or need assistance, please don't hesitate to reach out to us.</p><br/>
        <ul>
            <li><strong>User ID:</strong> ${userId}</li>
            <li><strong>Wallet:</strong> $0.00</li>
            <li><strong>Storage:</strong> 0 <sub>(Add storage to your account and start earning)</sub></li>
            <li>User ID and registered email can both be used to login.</li>
        </ul>
        <br/>
        <p>Take the next step and start earning! We're eager to see you thrive.</p>
        <br/>
        <p>For further assistance, please contact us at: support@nextworktechnologies.com</p>
        <br/>
        <p>Thank you for choosing Nextwork Technologies.</p>
        <p>Best Regards,</p>
        <p>The Nextwork Technologies Team</p>
    </body>
</html>`
    ;
};

export const kycRejected = (name, userId) => {
  return `
  <!DOCTYPE html>
  <html>
      <body>
          <p>Hello ${name},</p><br/><br/>
          
          <p>Hope this mail finds you well. This is to inform you that either your KYC has been expired or rejected. You will not be able to use your Nextowrk Account until your KYC will be updated.</p>
          <p>Nextwork requests you to please resubmit your KYC with updated documents.</p>
          <ul>
            <li><strong>User ID:</strong> ${userId}</li>
          </ul>
          <p>If you have any questions or concerns in the meantime, please feel free to reach out to us. We're here to help!</p>
          <br/>
          <p>Thank you for choosing Nextwork Technologies. We appreciate your patience and look forward to serving you.</p>
          <br/>
          <p>Best Regards,</p>
          <p>The Nextwork Technologies Team</p>
      </body>
  </html>
  `;
};

export const subAccCreated = "Nextwork Technologies: Your Account Profile Under Review";

export const accountCreated = (userId, name) => {
  return `
  <!DOCTYPE html>
  <html>
      <body>
          <p>Hello ${name},</p><br/><br/>
          
          <p>We wanted to inform you that your account has been successfully created with Nextwork Technologies.</p>
          <p>Currently, your account is under review by our team. You will be notified as soon as the review process is complete.</p>
          <ul>
            <li><strong>User ID:</strong> ${userId}</li>
          </ul>
          <p>If you have any questions or concerns in the meantime, please feel free to reach out to us. We're here to help!</p>
          <br/>
          <p>Thank you for choosing Nextwork Technologies. We appreciate your patience and look forward to serving you.</p>
          <br/>
          <p>Best Regards,</p>
          <p>The Nextwork Technologies Team</p>
      </body>
  </html>
  `;
};

export const rewardAch = (userId, reward) => {
  return `
  <!DOCTYPE html>
  <html>
      <body>
          <p>Hello ${name},</p><br/><br/>
          
          <p>Congratulations! With your hardwork and dedication you have achieved a new Reward of ${reward}.</p>
          <p>You will receive your reward soon. We appreciate your patience</p>
          <ul>
            <li><strong>User ID:</strong> ${userId}</li>
          </ul>
          <p>If you have any questions or concerns in the meantime, please feel free to reach out to us. We're here to help!</p>
          <br/>
          <p>Thank you for choosing Nextwork Technologies. We appreciate your patience and look forward to serving you.</p>
          <br/>
          <p>Best Regards,</p>
          <p>The Nextwork Technologies Team</p>
      </body>
  </html>
  `;
};


export const accountActivated = (userId, name) => {
  return `
<!DOCTYPE html>
                <html>
                    <body>
                        <p>Hello ${name},</p>
                        <ul>
                        <li>User ID: ${userId}</li>
                        <li>You are successfully Activated by Nexwork Administrators.</li>
                        <li>Welcome to the world of Nextwork Technologies.</li>
                        </ul><br/>
                        <p>Continue Login: <a href="https://cloud.nextworktechnologies.com">click here</a></p></br>
                          <p> Thanks & Regards </p>
                           <p> Nextwork Technologies </p>
                    </body>
                </html>`;
};

export const transaction = (userId, amount, id, name) => {
  return `
<!DOCTYPE html>
                <html>
                    <body>
                        <p>Hello ${name},</p>
                        <ul>
                        <li>User ID: ${userId}</li>
                        <li>Your UTI (unique transaction id) has been generated for amount ${amount}. Generated token is valid for one time. Please make sure to use it carefully</li>
                        <li> Please don't share this token with any one.</li>
                        <center>UTI - ${id}</center>
                        </ul><br/>
                        <p>For more write us at - <a href="mailto:support@nextworktechnologies.com">support@nextworktechnologies.com</a>.</p></br>
                          <p> Thanks & Regards </p>
                           <p> Nextwork Technologies </p>
                           <img src="/logo.png" width="100%" alt="Nextwork Technologies"/>
                    </body>
                </html>`;
};
