var express = require('express');
var fs = require('fs');
var path = require('path');

const multer  = require('multer')
const sharp = require('sharp');

var router = express.Router();
var upload = multer({ dest: 'uploads/' })

const uploadPath = `../uploads/`;

router.post('/convert', upload.single('image'), function(req,res){
    const file = req.file;
    const srcPath = path.resolve(__dirname, uploadPath,file.filename);
    const dstPath = path.resolve(__dirname, uploadPath,file.originalname);
    fs.rename(srcPath, dstPath, function(err){
        res.json({
            status: "Image Conversion service",
            image : `http://localhost:${process.env.PORT}/assets/${file.originalname}`
        });
    });
});

router.post('/convert1', upload.single('image'), function(req,res){
    const file = req.file;
    console.log(file);
    const srcPath = path.resolve(__dirname, uploadPath, file.filename);
    const dstPath = path.resolve(__dirname, uploadPath,file.originalname);
    const width  = +req.body.width;
    const height = +req.body.height;
    fs.rename(srcPath, dstPath, function(err){
        const imageSplit = file.originalname.split('.');
        const thumbnailImage = `${imageSplit[0]}-${width}x${height}.${imageSplit[1]}`;
        const thumbnailPath = path.resolve(__dirname, uploadPath,thumbnailImage);
        sharp(dstPath)
        .resize(width)
        .toFile(thumbnailPath, (err, info) => { 
            const basePath =`http://localhost:${process.env.PORT}/assets`;
            res.json({
                status: "Image Conversion service",
                image : `${basePath}/${file.originalname}`,
                thumb: {
                    image: `${basePath}/${thumbnailImage}`,
                    width, 
                    height
                }
            });
        });

    });
});


router.post('/convert3', upload.single('image'), function(req,res){
    const file = req.file;
    console.log(file);
    const srcPath = path.resolve(__dirname, uploadPath, file.filename);
    const dstPath = path.resolve(__dirname, uploadPath,file.originalname);
    const width  = +req.body.width;
    const height = +req.body.height;
    fs.rename(srcPath, dstPath, function(err){
        const imageSplit = file.originalname.split('.');
        const thumbnailImage = `${imageSplit[0]}-${width}x${height}.${imageSplit[1]}`;
        const thumbnailPath = path.resolve(__dirname, uploadPath,thumbnailImage);
        const image = sharp(dstPath);
        image
        .metadata()
        .then(function(meta){
            image
            .resize(Math.round(meta.width / 8))
            //.grayscale()
            //.rotate(180)
            .toFile(thumbnailPath, (err, info) => { 
                const basePath =`http://localhost:${process.env.PORT}/assets`;
                res.json({
                    status: "Image Conversion service",
                    image : `${basePath}/${file.originalname}`,
                    thumb: {
                        image: `${basePath}/${thumbnailImage}`,
                        width: info.width, 
                        height,
                        meta
                    }
                });
            });
        })
        

    });
});



module.exports = router;
