import bcrypt from "bcrypt";//해싱을 몇번이고 해줘서 해킹 위험 낮은 함수
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    avatarUrl: String,
    socialOnly:{type: Boolean, default: false},
    username: { type: String, required: true, unique: true},
    password: { type: String, required: false},
    name: { type: String, required: false},
    location: String,
});

userSchema.pre("save", async function(){
    console.log("Users pasword:", this.password);
    this.password = await bcrypt.hash(this.password, 5);
    console.log("Hashed password:", this.password);
});
//schema.pre("save",fn)으로 "save" 하기전에 실행시키는 fn이다 이게 mongoose의 middleware이다
//hash(password,해싱횟수) this는 User을 뜻한다
// async& await는 콜백함수가 순서대로 실행되지 않았다면 이것들은 순서대로 진행되게 한다 
//await가 기다리고 async는 awit와 같이 써야한다
//이것은 then 에서 나온것으로 then은 fn이 성공했을떄 실해되는 다음함수를 then으로 넣는다 이것은 될때까지 기다린다

const User = mongoose.model("User",userSchema);
export default User ;