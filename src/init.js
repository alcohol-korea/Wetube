import "dotenv/config";
import "./db";//서버에 mongo가 연결됨
import "./models/Video"; //파일을 받아올거임
import "./models/User";
import app from "./server";

const PORT = 4032;

/*---------listen to browser's request--------------------------------------------------------------- */
const handleListening = () => 
  console.log(`✅ Listening on: http://localhost:${PORT}`);

app.listen(PORT,handleListening);