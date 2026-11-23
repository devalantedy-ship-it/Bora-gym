// Prepara a versão web exportada pra subir na Vercel.
// A Vercel NÃO envia pastas chamadas "node_modules", e o Expo exporta as fontes em
// assets/node_modules/... → renomeia pra assets/vendor/ e corrige os caminhos nos arquivos.
// Uso: node scripts/preparar-web.js ../bora-web
const fs = require('fs');
const path = require('path');

const dir = path.resolve(process.argv[2] || '../bora-web');
const de = path.join(dir, 'assets', 'node_modules');
const para = path.join(dir, 'assets', 'vendor');
if (fs.existsSync(de)) {
  fs.rmSync(para, { recursive: true, force: true });
  fs.renameSync(de, para);
}

let trocados = 0;
const percorrer = (p) => {
  for (const nome of fs.readdirSync(p)) {
    const f = path.join(p, nome);
    if (fs.statSync(f).isDirectory()) percorrer(f);
    else if (/\.(js|html|css|json)$/.test(nome)) {
      const s = fs.readFileSync(f, 'utf8');
      if (s.includes('/assets/node_modules/')) {
        fs.writeFileSync(f, s.split('/assets/node_modules/').join('/assets/vendor/'));
        trocados++;
      }
    }
  }
};
percorrer(dir);

fs.writeFileSync(
  path.join(dir, 'vercel.json'),
  JSON.stringify(
    {
      // só as rotas do app caem no index.html; arquivo que não existe dá 404 de verdade
      rewrites: [{ source: '/((?!assets/|_expo/|favicon).*)', destination: '/index.html' }],
      // sem cache eterno: o nome dos arquivos não muda depois do ajuste de caminhos
      headers: [{ source: '/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }] }],
    },
    null,
    2,
  ),
);
console.log(`ok: ${trocados} arquivos corrigidos em ${dir}`);
