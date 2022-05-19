const Database = require('../db/config');

module.exports = {
  async create(req, res) {
    const db = await Database();

    const pass = req.body.password;
    let roomId;

    let isRoomExists = true;
    while(isRoomExists) {

      // Gera o numero da sala com 6 digitos
      for(var i=0; i<6; i++) {
        i == 0 ? roomId = Math.floor(Math.random() * 10).toString() :
          roomId += Math.floor(Math.random() * 10).toString()
      }

        // Verifica se a sala ja existe
      const roomExistsId = await db.all(`SELECT id FROM rooms WHERE id = '${parseInt(roomId)}'`);

      if (roomExistsId.length == 0) {
        isRoomExists = false;

        // Insere a sala no banco de dados
        await db.run(`INSERT INTO rooms (
            id, pass
          ) VALUES (
            ${parseInt(roomId)},
            ${pass}
          )`);
      }       
    }

    await db.close();

    res.redirect(`/room/${roomId}`);
  },

  async open( req, res){
    const roomId = req.params.roomId;
    
    const db = await Database();
    const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId}`);

    res.render('room', { roomId, questions });
  },

  async enter(req, res){
    const roomId = req.body.roomId;
    console.log("🚀 ~ file: RoomController.js ~ line 52 ~ enter ~ roomId", roomId)

    const db = await Database();
    const room = await db.get(`SELECT id FROM rooms WHERE id = ${roomId}`);
    console.log("🚀 ~ file: RoomController.js ~ line 56 ~ enter ~ room", room)
    
    if (room) {
      console.log(`entrou no if`);
      res.redirect(`/room/${roomId}`);
    }

    res.render('room-incorrect');
  }
};
