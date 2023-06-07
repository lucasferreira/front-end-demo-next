import { useState, useRef, useEffect, useCallback } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [isScrollingHeader, setIsScrollingHeader] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const lastPos = useRef(0);

  const linkClassName =
    "mr-4 mt-4 block text-base font-medium text-slate-700 hover:text-teal-600 md:mt-0 md:inline-block";

  function toggleMenu(event) {
    event.preventDefault();
    setIsMenuOpen(!isMenuOpen);
  }

  const handHeaderScroll = useCallback(() => {
    const header = headerRef?.current;
    const currPos = document.documentElement.scrollTop;
    if (header) {
      if (currPos > +lastPos.current) {
        if (currPos > header.offsetHeight) {
          setIsScrollingHeader(true);
        }
      } else {
        setIsScrollingHeader(false);
      }
    }

    lastPos.current = currPos;
  }, [headerRef, lastPos, setIsScrollingHeader]);

  useEffect(() => {
    window.addEventListener("scroll", handHeaderScroll, false);

    return () => {
      window.removeEventListener("scroll", handHeaderScroll, false);
    };
  }, [handHeaderScroll]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <header
          ref={headerRef}
          className={`fixed top-0 z-50 w-full transform bg-white px-6 py-5 transition-all duration-500 ease-in-out ${
            isScrollingHeader ? "-translate-y-full" : "shadow-md"
          }`}>
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between">
            <div className="sm:mr-8">
              <Link className="flex items-center" href="/">
                <span className="self-center text-xl font-semibold text-teal-700">Demo Next</span>
              </Link>
            </div>
            <nav
              className={`order-last mt-2 w-full flex-grow items-center md:order-none md:mt-0 md:flex md:w-auto ${
                !isMenuOpen ? "hidden" : ""
              }`}>
              <Link href="/" className={`${linkClassName} ${router.pathname == "/" ? "text-teal-600" : ""}`}>
                Home
              </Link>
              <Link
                href="/produtos"
                title="Navegação interna com sublinks dinamicos"
                className={`${linkClassName} ${router.pathname.indexOf("/produtos") === 0 ? "text-teal-600" : ""}`}>
                Produtos
              </Link>
              <Link
                href="/lista-compras"
                title="Exemplo de lista de compras em Next"
                className={`${linkClassName} ${router.pathname == "/lista-compras" ? "text-teal-600" : ""}`}>
                Lista de Compras
              </Link>
            </nav>
            <div
              onClick={toggleMenu}
              className="flex cursor-pointer items-center text-slate-700 hover:text-teal-600 sm:ml-6 md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-5 w-5 text-gray-900"
                viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </div>
          </div>
        </header>
        <main className="mx-7 mt-28 flex-grow lg:mx-6">
          <div className="mx-auto max-w-5xl">
            <Component {...pageProps} />
          </div>
        </main>
      </Hydrate>
    </QueryClientProvider>
  );
}
