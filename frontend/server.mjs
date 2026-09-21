import { createServer } from "node:http";

const port = 5173;

createServer((_request, response) => {
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Solicitacoes</title></head><body><main><h1>Frontend pronto</h1></main></body></html>',
  );
}).listen(port, "0.0.0.0", () => {
  console.log(`Frontend listening on port ${port}`);
});
