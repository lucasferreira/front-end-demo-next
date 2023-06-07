import { API_URI } from "@/env";

// este é uma sugestão de arquivo com métodos comuns de consultas a APIs online
// todos estes métodos fazem conexão (fetch) com pontos online e podem enviar ou
// receber dados

// o endereço consumido abaixo /api/produtos é um endereço de API que criamos
// dentro do próprio NEXT, ela nos entrega uma lista de produtos em formato JSON
export async function getItems() {
  const response = await fetch(`${API_URI}/produtos`); // requisitando a URL
  return await response.json(); // convertendo a resposta para JSON
}

// método útil para listar todos os IDs válidos de produtos
// para podermos filtrar quais URLs são permitidas no getStaticPaths
export async function getItemsParamsId() {
  const items = await getItems();
  return items.map(item => ({ params: { id: `${item.id}` } }));
}

// método para pegar apenas um item de nossa API
// pelo ID do produto
export async function getItem(id) {
  const items = await getItems();
  return items.find(item => +item.id === +id);
}
