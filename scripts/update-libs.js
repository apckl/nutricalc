const fs = require('fs');
const path = require('path');

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`✔ Copié : ${src} → ${dest}`);
}

const filesToCopy = [
  {
    src: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
    dest: 'libs/bootstrap/css/bootstrap.min.css',
  },
  {
    src: 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    dest: 'libs/bootstrap/js/bootstrap.bundle.min.js',
  },
  {
    src: 'node_modules/bootstrap-icons/font/bootstrap-icons.css',
    dest: 'libs/bootstrap-icons/bootstrap-icons.css',
  },
  {
    src: 'node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2',
    dest: 'libs/bootstrap-icons/fonts/bootstrap-icons.woff2',
  },
  {
    src: 'node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff',
    dest: 'libs/bootstrap-icons/fonts/bootstrap-icons.woff',
  },
];

filesToCopy.forEach(({ src, dest }) => copyFile(src, dest));
