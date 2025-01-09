import { Link } from 'react-router-dom';
import { routes } from '../routes';

function Navigation() {
  return (
    <nav>
      {routes
        .filter(route => route.name)
        .map(route => (
          <Link key={route.path} to={route.path}>
            {route.name}
          </Link>
        ))}
    </nav>
  );
}

export default Navigation;