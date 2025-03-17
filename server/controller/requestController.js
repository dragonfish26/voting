import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const handleRequest = (req, res) => {

  //home
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, '..', 'public', 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } 
  
  //about
  else if (req.url === '/about') {
    fs.readFile(path.join(__dirname, '../public', 'about.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }

  //admin vote page
  else if (req.url === '/admin-vote') {
    fs.readFile(path.join(__dirname, '../public', 'admin-vote.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }

  //votant page
  else if (req.url === '/votant') {
    fs.readFile(path.join(__dirname, '../public', 'votant.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }

  //static files (CSS, JS, images)
  else if (req.url.match(/\.(css|js|png|jpg|gif)$/)) {
    const filePath = path.join(__dirname, '../public', req.url);
    const extname = path.extname(req.url);
    let contentType = 'text/html';

    if (extname === '.css') {
      contentType = 'text/css';
    } else if (extname === '.js') {
      contentType = 'application/javascript';
    } else if (extname === '.png') {
      contentType = 'image/png';
    } else if (extname === '.jpg') {
      contentType = 'image/jpeg';
    } else if (extname === '.gif') {
      contentType = 'image/gif';
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  }

  //error
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
};
