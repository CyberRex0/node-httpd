// nodeのコアモジュールのhttpを使う
var http = require('http');
var fs = require('fs');
var server = http.createServer();

/* 
Response Example:
 res.writeHead(200, {'Content-Type' : 'text/html'});
 res.write('<html><head><meta charset="UTF-8"></head><body><h1>Nodejs it works</h1></body></html>');
 res.end();
*/

server.on('request', function(req, res) {
	var path = req.url; // requested url
	var useragent = req.headers['user-agent'];
	var requestTimeObj = new Date();
	var reqTime = requestTimeObj.toString();
	console.log(path);
	
	// Response
	if (path === '/') {
		res.writeHead(200, {'Content-Type':'text/html'});
		res.write('\
		<!DOCTYPE html> \
		<html>\
			<head>\
				<meta charset="UTF-8">\
				<meta name="viewport" content="width=device-width">\
			</head>\
			<body>\
				Otintin<br>\
				'+ reqTime +'<br>\
				<table border=1>\
				<tbody>\
		');
		for (var key in req.headers) {
			res.write('<tr><td>'+key+'</td><td>'+req.headers[key]+'</td></tr>');
		}
		res.write('\
				</tbody>\
				</table>\
			</body>\
		</html>\
		');
		res.end();
		return;
	}

	if (path === '/ajax') {
		res.writeHead(200, {'Content-Type':'application/json'});
		res.write('{\n"result":"OK",\n"datetime":"'+ reqTime +'"\n}');
		res.end();
		return;
	}

	// Bypass local file if exists
	var localfile = path.substr(1);
	fs.exists(localfile,function(state){
		if (!state) {
			gen404(req,res);
			return;
		}
		fs.readFile(localfile, function (flag, buf){
		   // MIME DETECTOR
		   var mimes = mimedetect(localfile);
		   //-----
		   res.writeHead(200, {'Content-Type': mimes + ';charset=utf-8'});
		   if (/^text\//.test(mimes)) {
			   res.write(buf.utf8Slice());
		   }else{
			   res.write(buf);
		   }
		   res.end();
		});
	});

});

function gen404(_req,_res) {
	_res.writeHead(404, {'Content-Type':'text/html'});
	_res.write('<h1>404 Not Found</h1><p>Your requested URL "'+ _req.url +'" is not found.<br>please try again later.</p><hr size=1><p>Node.js httpd</p>');
	_res.end();
}

function mimedetect(fname) {
	var mime = 'application/octet-stream';
	fname = fname.toLowerCase();
	
	// General Files
	if (/\.js$/.test(fname)) mime = 'text/javascript';
	if (/\.html$/.test(fname)) mime = 'text/html';
	if (/\.txt$/.test(fname)) mime = 'text/plain';
	if (/\.css$/.test(fname)) mime = 'text/css';

	// Image Files
	if (/\.(jpeg|jpg|mjpeg)$/.test(fname)) mime = 'image/jpeg';
	if (/\.png$/.test(fname)) mime = 'image/png';
	if (/\.webp$/.test(fname)) mime = 'image/webp';
	if (/\.bmp$/.test(fname)) mime = 'image/bmp';
	if (/\.ico$/.test(fname)) mime = 'image/x-vnd.microsoft.icon';
	if (/\.svg$/.test(fname)) mime = 'image/svg';

	// Video Files
	if (/\.(mpeg|mpg|mp4|mts|mpegts)$/.test(fname)) mime = 'video/mp4';
	if (/\.webm$/.test(fname)) mime = 'video/webm';
	if (/\.ogv$/.test(fname)) mime = 'video/ogv';
	if (/\.mkv$/.test(fname)) mime = 'video/mkv';
	if (/\.wmv$/.test(fname)) mime = 'video/wmv';
	if (/\.avi$/.test(fname)) mime = 'video/avi';

	// Audio Files
	if (/\.mp3$/.test(fname)) mime = 'audio/mp3';
	if (/\.mp2$/.test(fname)) mime = 'audio/mp2';
	if (/\.(ogg|oga)$/.test(fname)) mime = 'audio/ogg';
	if (/\.opus$/.test(fname)) mime = 'audio/opus';
	if (/\.aac$/.test(fname)) mime = 'audio/aac';
	if (/\.m4a$/.test(fname)) mime = 'audio/m4a';
	if (/\.flac$/.test(fname)) mime = 'audio/flac';
	if (/\.wav$/.test(fname)) mime = 'audio/wav';
	if (/\.wma$/.test(fname)) mime = 'audio/wma';

        return mime;

}

// Start http server
server.listen(8080);
