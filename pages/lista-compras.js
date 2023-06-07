import { useState } from "react";

import { dehydrate, QueryClient, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getItems, postItem, deleteItem } from "@/actions/lista";

export default function ListaCompras() {
  const [errorMessage, setErrorMessage] = useState("");

  function addItem(event) {
    event.preventDefault();

    // esta é uma nova ideia de como pegar os valores do form
    // diferente da aula passada em que incentivei o uso de useState
    // um campo para cada form ou um objeto para todos os campos
    // aqui estamos acessando direto o DOM do form e lendo os valores
    // dos campos por seus IDs/name
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("newItemName") !== "" && +formData.get("newItemQtd") > 0) {
      // objeto que representa nosso novo item
      const newItem = {
        // id: generateId(),
        name: formData.get("newItemName"),
        qtd: +formData.get("newItemQtd"),
      };

      // mantando os itens já cadastrados e adicionando o novo no final
      // setItems([...items, newItem]);
      mutationPost.mutate(newItem);

      // resetando o form e apagando mensagens de erro antigas
      form.reset();
      setErrorMessage("");
    } else {
      setErrorMessage("Preencha todos os campos!");
    }
  }

  const queryClient = useQueryClient();

  const lista = useQuery({ queryKey: ["lista"], queryFn: getItems });

  const mutationPost = useMutation({
    mutationFn: postItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["lista"] });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["lista"] });
    },
  });

  return (
    <div className="p-6">
      <h2 className="mb-5 text-3xl font-semibold text-gray-800">Lista de Compras</h2>
      {!!lista.isLoading && <p className="text-lg font-bold text-gray-400">Carregando items...</p>}
      <ul className="mx-5 my-4 list-disc">
        {lista.data?.map(item => (
          <li key={item.id} className="py-px">
            <a
              href={`#delete-item-${item.id}`}
              data-loading={mutationDelete.isLoading && mutationDelete.variables === item.id ? true : undefined}
              className="hover:text-green-700 data-[loading]:pointer-events-none data-[loading]:opacity-50"
              onClick={event => {
                event.preventDefault();
                if (confirm("Você deseja excluir este item?")) {
                  mutationDelete.mutate(item.id);
                }
              }}>
              <strong>{item.name}</strong> - {item.qtd}
            </a>
          </li>
        ))}
      </ul>
      {!lista.isLoading && lista.data?.length === 0 && (
        <p className="font-semibold text-gray-600">Nenhum item adicionado até o momento</p>
      )}
      <form onSubmit={addItem} method="post" className="mt-6 w-full max-w-md rounded bg-gray-100 p-3.5">
        <fieldset disabled={mutationPost.isLoading}>
          <div className="mb-4">
            <label htmlFor="newItemName" className="block text-gray-600">
              Nome do Produto
            </label>
            <input
              id="newItemName"
              name="newItemName"
              type="text"
              className="mt-1 block w-full rounded border border-gray-300 p-1.5 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newItemQtd" className="block text-gray-600">
              Quantidade
            </label>
            <input
              id="newItemQtd"
              name="newItemQtd"
              type="number"
              defaultValue={1}
              min="1"
              className="mt-1 block w-full rounded border border-gray-300 p-1.5 focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50"
            />
            {!!errorMessage && <div className="mt-1 font-semibold text-red-500">{errorMessage}</div>}
          </div>
          <button
            disabled={mutationPost.isLoading || mutationDelete.isLoading}
            type="submit"
            className="rounded bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 disabled:pointer-events-none disabled:opacity-25">
            Adicionar Item
          </button>
        </fieldset>
      </form>
    </div>
  );
}

// aqui é um uso curioso do tanstack query junto com next
// a ideia aqui é que para que possamos aproveitar a renderização
// estática do next, precisamos que os dados já estejam disponíveis em tempo de servidor
// então rodando o método getItems que é o que faz a chamada para a API
// dentro da função getStaticProps do next, nós conseguimos fazer com que
// o tanstack query precarregue os dados antes mesmo da página chegar no navegador
// assim teremos o dado disponível para o next renderizar a página com HTML já finalizado
export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["lista"],
    queryFn: getItems,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
