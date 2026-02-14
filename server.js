const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
app.use(cors());

const upload = multer({ dest: "/tmp/uploads" });

function convert(input, outDir) {
  return new Promise((resolve, reject) => {
    execFile("soffice", [
      "--headless",
      "--convert-to", "pdf",
      "--outdir", outDir,
      input
    ], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

app.get("/health", (req,res)=>res.json({ok:true}));

app.post("/convert", upload.single("file"), async (req,res)=>{
  const outDir="/tmp/out";
  fs.mkdirSync(outDir,{recursive:true});
  await convert(req.file.path,outDir);

  const pdf=fs.readdirSync(outDir).find(f=>f.endsWith(".pdf"));
  res.download(path.join(outDir,pdf));
});

app.listen(8080, ()=>console.log("running"));
