var expressFunction = require("express");
const router = expressFunction.Router();
const bcr = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DB } = require("../../auth");
const e = require("cors");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const key = "MY_KEY";
//DB register


//Login Data
const LoginData = {
  Email: String,
  Password: String,
};

//Hash Password
async function compareHash(Text, myHash) {
  return new Promise((resolve, reject) => {
    bcr.compare(Text, myHash, (err, data) => {
      if (err) {
        reject(new Error("Error bcrypt compare"));
      } else {
        console.log(Text);
        console.log(myHash);
        resolve({ status: data });
      }
    });
  });
}

async function findUser(Email) {
  console.log(Email);
  var result = await DB.query(
    `SELECT Email,Password FROM register WHERE Email = '${Email}'`
  );
  // console.log(result[0]);
  if(result[0].length == 0){
    return result[0] = false
  }else{
  return (result[0]);
}
}

async function GetProfileData(Email) {
  console.log(Email);
  var result = await DB.query(
    `SELECT id,Name,Email,Phone FROM register WHERE Email = '${Email}'`
  );
    // console.log(result);
  return result[0];
}

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = key;

const strategy = new JwtStrategy(options, async (playload, done) => {
  // console.log(playload)
    var Email = playload.Email
  playload = await GetProfileData(Email);
  console.log(playload);
  if (playload) {
    done(null, playload);
  } else {
    done("not auth Data", false);
  }
});
passport.use(strategy);

// Login Page
router.post("/", async (req, res) => {
  const LoginData = {
    Email: req.body.Email,
    Password: req.body.Password,
  };
  console.log(req.body.Email);
  console.log(req.body.Password);
  // res.json("LoginPage");
  try {
    // Check Email input
    // console.log(LoginData.Email)
    const result = await findUser(LoginData.Email);
    console.log(result);
    if (result == false){
      return res.status(401).json({status: result})
     }
    // Check Password in DB and Client || valid Password
    const loginStatus = await compareHash(
      LoginData.Password,
      result[0].Password
    );
    // console.log(result);
    // console.log(loginStatus);
    // If true password is equal
    const status = loginStatus.status;
    
    console.log(status);
    //Token
    if (status) {
      let token = jwt.sign(
        {
          Email: result[0].Email,
        },
        key,
        {
          expiresIn: '2d',
        }
      );
      // res.json({ msg: 'ok', token: token });
      console.log("Bearer ", token);
      // res.status(200).send();
      return res.status(200).json({
        token: token,
        expiresIn: '2d',
        status,
      });
    } else {
      return res.status(401).json({
        message: "fail to send token",
        status
      });
    }
  } catch (error) {
    res.status(401).send(error);
    status
  }
  // Check Token from Client
});
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // const dataUser = await GetProfileData(LoginData.Email[0].Email)
    // console.log(dataUser);
    res.json({ dataUser: req.user });
  }
);
module.exports = router;
