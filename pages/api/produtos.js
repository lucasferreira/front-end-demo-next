// vamos considerar isso um banco de dados fake
// é como se tivessemos tirado essa lista de produtos
// de um banco e agora iremos usar ela para alimentar
// nossa API que lista produtos
const DB_PRODUTOS = [
  { id: 1, name: "Mouse", price: 10.0 },
  { id: 2, name: "Teclado", price: 12.0 },
  { id: 3, name: "Monitor", price: 16.0 },
  { id: 4, name: "Pen Drive", price: 21.0 },
];

// em endpoints de APIS geradas pelo Next.js
// o que for retornado no método handler
// será o que será retornado pela API
// como conteúdo de resposta. Aqui no caso
// estamos retornando a lista de produtos
// que criamos acima no "banco falso"
export default function handler(req, res) {
  res.status(200).json(DB_PRODUTOS);
}
