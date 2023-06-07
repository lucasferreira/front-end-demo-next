import { API_URI } from "@/env";

// este é uma sugestão de arquivo com métodos comuns de consultas a APIs online
// todos estes métodos fazem conexão (fetch) com pontos online e podem enviar ou
// receber dados

// o endereço consumido abaixo /api/lista é um endereço de API que criamos
// dentro do próprio NEXT, ela nos entrega uma lista de items em formato JSON
export async function getItems() {
  const response = await fetch(`${API_URI}/lista`); // requisitando a URL
  return await response.json(); // convertendo a resposta para JSON
}

export async function postItem(newItem) {
  // requisitando a URL
  const response = await fetch(`${API_URI}/lista`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  });
  return await response.json();
}

export async function deleteItem(id) {
  // requisitando a URL
  const response = await fetch(`${API_URI}/lista/?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
