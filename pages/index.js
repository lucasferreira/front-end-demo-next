import Link from "next/link";

import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

import { getItems } from "@/actions/lista";

export default function Home() {
  const lista = useQuery({ queryKey: ["lista"], queryFn: getItems });

  return (
    <>
      <h2 className="mb-5 text-3xl font-semibold text-gray-700">Seja bem-vindo ao demo de Next.js!</h2>

      <p className="my-3.5 text-sm md:text-base">
        Neste demo iremos configurar duas rotas (troca de página) a primeira rota essa daqui chamamos de{" "}
        <strong>/</strong> (home).
      </p>

      <p className="my-3.5 text-sm md:text-base">
        Cada tela/rota do <strong>Next.js</strong> também é um component, logo não têm muito mistério gere um novo
        arquivo dentro da pasta <strong>pages</strong> <em>(modelo clássico de navegação do Next)</em> e este novo
        arquivo já estará disponível para acesso como uma URL que represente o nome do arquivo sem a extensão .js no
        final.
      </p>

      <p className="my-3.5 text-sm md:text-base">
        Por fim clique no link abaixo para abrir nossa segunda tela que é a <strong>/lista-compras</strong>.
      </p>

      <div className="my-6">
        <Link
          href="/lista-compras"
          className="inline-flex rounded-md bg-gray-100 p-4 text-base font-semibold hover:bg-gray-200 md:text-lg">
          Abrir lista de compras ({lista.data?.length})
        </Link>
      </div>
    </>
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
