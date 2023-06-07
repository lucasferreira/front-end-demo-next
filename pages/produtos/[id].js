import Link from "next/link";

import { getItemsParamsId, getItem } from "@/actions/produtos";

export default function Produto({ produto }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6">{produto?.name}</h2>
      <h4 className="text-lg mb-9">
        Por apenas <strong>R$ {produto?.price}</strong>
      </h4>
      <Link href="/produtos" className="font-semi text-sm underline hover:text-green-700">
        &laquo; Voltar
      </Link>
    </div>
  );
}

// lembrando que este método serve para listar todas as possíveis URLs
// válidas de produtos que existem no site com base em IDs válidos,
// por exemplo se na nossa API não existir o produto nº 17, não devemos
// listar o numero 17 como path válido no método abaixo
export async function getStaticPaths() {
  const paths = await getItemsParamsId();
  return {
    paths,
    fallback: false,
  };
}

// esse é o uso mais comum da função getStaticProps, além de receber parametros
// da URL e passar para o componente como variáveis válidas, também podemos usar essa função
// para buscar dados de uma API ou banco de dados, e mandar direto para o componente/next
// afim do mesmo ter os dados em tempo de renderização de servidor e ter
// como já usar esses dados no HTML base da aplicação
export async function getStaticProps({ params }) {
  const { id } = params;
  const produto = await getItem(id);

  return {
    props: {
      produto,
      id,
    },
  };
}
