import { useLocation, useNavigate } from 'react-router-dom';

/** Переход к секции главной страницы с любой страницы сайта. */
export function useSectionNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (hash: string) => {
    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: `#${hash}` });
    } else {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  };
}
