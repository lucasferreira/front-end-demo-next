import { generateId } from "@/env";

// vamos considerar isso um banco de dados fake
// é como se tivessemos tirado essa lista de items de compra de um banco
// e agora iremos usar ela para alimentar nossa API que lista produtos
const DB = {
  items: [{ id: generateId(), name: "Leite", qtd: 1 }],
};

// em endpoints de APIS geradas pelo Next.js o que for retornado no método handler
// será o que será retornado pela API como conteúdo de resposta. Aqui no caso
// estamos retornando a lista de items que criamos acima no "banco falso"
export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(DB.items);
  } else if (req.method === "POST" || req.method === "PUT") {
    // se vier um ID na requisicao, vamos considerar que é um PUT
    // porque a ideia é editar algo que já existe
    if ("id" in req.body && !!req.body?.id) {
      // vamos procurar o item que tem o ID que veio na requisicao
      const itemIndex = DB.items.findIndex(item => item.id === req.body.id);
      if (+itemIndex >= 0) {
        DB.items[itemIndex] = { qtd: 1, ...DB.items[itemIndex], ...req.body };
        return res.status(200).json(DB.items[itemIndex]);
      }

      return res.status(200).json(null);
    }

    // se chegar aqui não tem ID, logo é um registro novo para ser add
    const newItem = { id: generateId(), name: "", qtd: 1, ...req.body };
    DB.items = [...DB.items, newItem];

    return res.status(200).json(newItem);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    if (id) {
      DB.items = DB.items.filter(item => item.id !== id);
    }

    return res.status(200).json({ id, deleted: true });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
