import Video from "../models/Video";

/*  show error to callback way
console.log("start"); 1
Video.find({},(error, videos)=>{
  if(error){
    return res.render("server-error");
  }return  res.render("home",{pageTitle: "Home",videos: []});
}); 3
console.log("finish"); 2
*/
  export const home = async(req,res) => 
{ //videos- async(req,res){const videos = awoit Vidoes.find({});};
  //error- tyr to find videos and catch the errors;
  const videos = await Video.find({}).sort({createdAt: "desc"});//////////// waiting until the results coming 
  return  res.render("home",{pageTitle: "Home", videos});// 함수안에 있는 return은 아무 의미 없음 , res 나 req함수 중복 불가
  //videos: []을 하면 home에 빈 array를 보내기 때문에 home에 안뜨는 것이다
  //videos가 답이다
};
//이제 res.send로 html을 쓰는게 아니고 
//pug로 파일 이름을 res.render안에 넣는다.
//res.render은 사용자로 부터 서버에 파일을 받아서 브라우저에 보냄
export const watch = async(req,res) => 
{
  //const id = req.params.id;
  const {id} = req.params;
  //컴퓨터는 0부터 index가 시작 id는 1부터이다.
  const video = await Video.findById(id);
  if(!video){
  return res.staus(404).render("404",{pageTitle:"Video not found"}); 
  } 
  return res.render("watch",{pageTitle:video.title, video});       // 여태 watch template에 아무것도 안보냄
};
export const getEdit = async(req,res) =>
{ 
  const {id} = req.params; 
  const video = await Video.findById(id);
  if(!video){
    return res.staus(404).render("404",{pageTitle:"Video not found"}); 
    } 
    return res.render("edit",{pageTitle:`Edit ${video.title}`, video});
};
export const postEdit = async(req,res) =>
{
  const {id} = req.params;
  const {title, description, hashtags} = req.body;
  const video = await Video.exists({_id: id});
  if(!video){
    return res.render("404",{pageTitle:"Video not found"}); 
  }
  await Video.findByIdAndUpdate(id,{
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  //유저가 input에 작성한 data를 얻을수 있다
  return res.redirect(`/videos/${id}`);
};


export const getUpload = (req,res) =>{
  return res.render("upload",{pageTitle:"Upload Video"});
};

export const postUpload = async(req,res) => {
  const {title, description, hashtags} = req.body; 
  try{
    await Video.create({ // === const video = new Video , video.save()
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");//try하고
  } catch (error){//catch써서 error를 뽑고
      return res.staus(400).render("upload",{
        pageTitle:"Upload Video",
        errorMessage: error._message,//그 error를 upload template에 message로 보냄
      });  
  }
    // await video.save(); wait to save until videos reach mongo db 
};
export const deleteVideo = async(req,res) => {
  const {id} = req.params;
  await Video.findOneAndDelete(id);
  return res.redirect("/");
};
export const search = async(req,res) => {
  const {keyword} = req.query;
  if(keyword){
    const videos = await Video.find({
      title: keyword,
    });
    return res.render("search" ,{pagetitle:"Search",videos});
  }
  return res.render("search",{pageTitle:"Search"});
};