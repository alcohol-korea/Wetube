import mongoose from "mongoose";
// connect with mongo
mongoose.connect(process.env.DB_URL,{
     useNewUrlParser: true, 
     useUnifiedTopology: true,  
     useFindAndModify: false,
     createIndexes: true,
    });


const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB ");
const handleError = (error)=> console.log("DB Error", error);
//db에 에러가 나면 바로 보여줌 on은 계속 보여줄수 있음
db.on("error", handleError);
//db가 연결됨을 알려줌 = connection open임을 알려줌 once는 한번만
db.once("open", handleOpen);


