(()=>{var e={417:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i});const a=require("axios");var s=n.n(a),o=n(689),r=n.n(o);const i=function(e){const[t,n]=(0,o.useState)(!1),[a,i]=(0,o.useState)(""),[c,l]=(0,o.useState)(),[p,d]=(0,o.useState)("");return r().createElement("div",{className:"card"},r().createElement("div",{className:"our-card-top"},t&&r().createElement("div",{className:"our-custom-input"},r().createElement("div",{className:"our-custom-input-interior"},r().createElement("input",{onChange:e=>l(e.target.files[0]),className:"form-control form-control-sm",type:"file"}))),r().createElement("img",{src:e.photo?`/uploaded-photos/${e.photo}`:"/fallback.jpg",className:"card-img-top",alt:`${e.species} named ${e.name}`})),r().createElement("div",{className:"card-body"},!t&&r().createElement(r().Fragment,null,r().createElement("h4",null,e.name),r().createElement("p",{className:"text-muted small"},e.species),!e.readOnly&&r().createElement(r().Fragment,null,r().createElement("button",{onClick:()=>{n(!0),i(e.name),d(e.species),l("")},className:"btn btn-sm btn-primary"},"Edit")," ",r().createElement("button",{onClick:async()=>{s().delete(`/picture/${e.id}`),e.setAnimals((t=>t.filter((t=>t._id!=e.id))))},className:"btn btn-sm btn-outline-danger"},"Delete"))),t&&r().createElement("form",{onSubmit:async function(t){t.preventDefault(),n(!1),e.setAnimals((t=>t.map((function(t){return t._id==e.id?{...t,name:a,species:p}:t}))));const o=new FormData;c&&o.append("photo",c),o.append("_id",e.id),o.append("name",a),o.append("species",p);const r=await s().post("/update-picture",o,{headers:{"Content-Type":"multipart/form-data"}});r.data&&e.setAnimals((t=>t.map((function(t){return t._id==e.id?{...t,photo:r.data}:t}))))}},r().createElement("div",{className:"mb-1"},r().createElement("input",{autoFocus:!0,onChange:e=>i(e.target.value),type:"text",className:"form-control form-control-sm",value:a})),r().createElement("div",{className:"mb-2"},r().createElement("input",{onChange:e=>d(e.target.value),type:"text",className:"form-control form-control-sm",value:p})),r().createElement("button",{className:"btn btn-sm btn-success"},"Save")," ",r().createElement("button",{onClick:()=>n(!1),className:"btn btn-sm btn-outline-secondary"},"Cancel"))))}},142:e=>{"use strict";e.exports=require("dotenv")},860:e=>{"use strict";e.exports=require("express")},470:e=>{"use strict";e.exports=require("fs-extra")},13:e=>{"use strict";e.exports=require("mongodb")},738:e=>{"use strict";e.exports=require("multer")},689:e=>{"use strict";e.exports=require("react")},684:e=>{"use strict";e.exports=require("react-dom/server")},109:e=>{"use strict";e.exports=require("sanitize-html")},441:e=>{"use strict";e.exports=require("sharp")},17:e=>{"use strict";e.exports=require("path")},404:e=>{"use strict";e.exports=require("tls")}},t={};function n(a){var s=t[a];if(void 0!==s)return s.exports;var o=t[a]={exports:{}};return e[a](o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{const{MongoClient:e,ObjectId:t}=n(13),a=n(860),{CLIENT_RENEG_LIMIT:s}=n(404),o=n(738)(),r=n(109),i=n(470),c=n(441),l=n(17),p=n(689),d=n(684),u=n(417).Z;let m;n(142).config(),i.ensureDirSync(l.join("public","uploaded-photos"));const b=a();function f(e,t,n){"string"!=typeof e.body.name&&(e.body.name=""),"string"!=typeof e.body.species&&(e.body.species=""),"string"!=typeof e.body._id&&(e.body._id=""),e.cleanData={name:r(e.body.name.trim(),{allowedTags:[],allowedAttributes:{}}),species:r(e.body.species.trim(),{allowedTags:[],allowedAttributes:{}})},n()}b.set("view engine","ejs"),b.set("views","./views"),b.use(a.static("public")),b.set("port",process.env.PORT||3e3),b.use(a.json()),b.use(a.urlencoded({extended:!1})),b.get("/",(async(e,t)=>{list=await(m?.collection("pictures").find().toArray());const n=d.renderToString(p.createElement("div",{className:"container"},!list&&p.createElement("p",null,"There are no element yet."),p.createElement("div",{className:"animal-grid mb-3"},list&&list.map((e=>p.createElement(u,{key:e._id,name:e.name,species:e.species,photo:e.photo,id:e._id,readOnly:!0})))),p.createElement("h1",null,p.createElement("a",{href:"/admin"},"Login to manage the listings."))));t.render("home",{generatedHTML:n})})),b.get("/admin",((e,t)=>{t.render("admin")})),b.get("/api/pictures",(async(e,t)=>{const n=await m.collection("pictures").find().toArray();t.json(n)})),b.post("/create-picture",o.single("photo"),f,(async(e,n)=>{if(e.file){const t=`${Date.now()}.jpg`;await c(e.file.buffer).resize(844,456).jpeg({quality:60}).toFile(l.join("public","uploaded-photos",t)),e.cleanData.photo=t}const a=await m.collection("pictures").insertOne(e.cleanData),s=await m.collection("pictures").findOne({_id:new t(a.insertedId)});n.send(s)})),b.delete("/picture/:id",(async(e,n)=>{"string"!=typeof e.params.id&&(e.params.id="");const a=await m.collection("pictures").findOne({_id:new t(e.params.id)});a.photo&&i.remove(l.join("public","uploaded-photos",a.photo)),m.collection("pictures").deleteOne({_id:new t(e.params.id)}),n.send("Nice")})),b.post("/update-picture",o.single("photo"),f,(async(e,n)=>{if(e.file){const a=`${Date.now()}.jpg`;await c(e.file.buffer).resize(844,456).jpeg({quality:60}).toFile(l.join("public","uploaded-photos",a)),e.cleanData.photo=a;const s=await m.collection("pictures").findOneAndUpdate({_id:new t(e.body._id)},{$set:e.cleanData});s.value.photo&&i.remove(l.join("public","uploaded-photos",s.value.photo)),n.send(a)}else m.collection("pictures").findOneAndUpdate({_id:new t(e.body._id)},{$set:e.cleanData}),n.send(!1)})),async function(){const t=new e("mongodb+srv://sbshaun:uploadwhatever@cluster0.j1hvyix.mongodb.net/?retryWrites=true&w=majority");await t.connect(),m=t.db("AmazingMernApp")}(),b.listen(b.get("port"))})()})();