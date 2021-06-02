var expressFunction = require("express");
const router = expressFunction.Router();
// const socketIO = require ("socket.io");
const { DB } = require("../../auth");

router.post("/groupChat", async (req, res) => {
  const { name, group_type, email } = req.body;
  var result = await FindIdUser(email);
  console.log(result[0]);
  // example
  //   const {
  //     group_name,
  //     chat_type_id,
  //     person,
  //   } = req.body;

  var data = await DB.query(
    `CALL database_chat.insertchatgroup(:p_name,:p_group_type)`,
    {
      replacements: {
        p_name: name || "",
        p_group_type: group_type || "",
      },
    }
  );

  for (let i = 0; i < result.length; i++) {
    var insertCollector = await DB.query(
      `CALL database_chat.insert_Collection(:p_register)`,
      {
        replacements: {
          p_register: result[i] || "",
        },
      }
    );
  }

  res.status(200);
  res.json(data);
  res.json(insertCollector);
  
  // example
  //   var id = ? ;
  //   for (let i = 0; i < person.length; i++) {
  //       const {register_id} = person[i];
  //   }
});

router.get("/groupType", async (req, res) => {
  var groupTypeData = await DB.query(`SELECT * from group_type`);
  res.send(groupTypeData);
  // console.log(groupTypeData);
});

router.get("/AllUser", async (req, res) => {
  var result = await DB.query(`SELECT id,Name,Email FROM register`);
  res.send(result[0]);
});

async function FindIdUser(email) {
  console.log(email.length);
  var person = [];
  for (let i = 0; i < email.length; i++) {
    var result = await DB.query(
      `SELECT id FROM register WHERE Email = '${email[i].email}'`
    );
    // console.log(result);
    person[i] = result[0][0].id;
    console.log(person[i]);
  }
  // console.log(result);
  return person;
}

router.post("/chatCollect", async (req, res) => {
  const email = req.body;
  // for(let i = 0; i< email.length; i++){}
  console.log(email);
  var result = await FindIdUser(email);
  res.send(result);
});

module.exports = router;

// console.log(groupChat);
// var sqlInsert = "INSERT INTO group_chat SET ?";
//  DB.query(sqlInsert, groupChat, (err, result) => {
//   // console.log(sqlInsert)
//   console.log(err);
//   return res.status(200).send();
// });
