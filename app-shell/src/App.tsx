import { useEffect, useState, type MouseEvent } from "react";
import "./App.css";
import "./index.css";
import { RemoteComponentWrapper } from "./components/RemoteComponentWrapper";
import { VueRemoteWrapper } from "./components/VueRemoteWrapper";

type Route = "/" | "/react" | "/vue";

const routes: Record<
  Route,
  {
    label: string;
    title: string;
    description: string;
  }
> = {
  "/": {
    label: "Home",
    title: "Micro Frontend Demo",
    description: "Select a remote application to load.",
  },
  "/react": {
    label: "React",
    title: "React Remote",
    description: "Components loaded from the React remote application.",
  },
  "/vue": {
    label: "Vue",
    title: "Vue Remote",
    description: "Vue application mounted inside the host.",
  },
};

function getRoute(): Route {
  const path = window.location.pathname;

  if (path === "/react" || path === "/vue") {
    return path;
  }

  return "/";
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRoute());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigate = (
    event: MouseEvent<HTMLAnchorElement>,
    destination: Route
  ) => {
    event.preventDefault();

    if (destination === route) return;

    window.history.pushState({}, "", destination);
    setRoute(destination);
  };

  const page = routes[route];

  return (
    <div className="app-shell">
      <header className="site-header">
        <a
          href="/"
          className="brand"
          onClick={(event) => navigate(event, "/")}
        >
          <span>Host App</span>
        </a>

        <nav className="site-nav">
          {(Object.keys(routes) as Route[]).map((destination) => (
            <a
              key={destination}
              href={destination}
              className={
                route === destination ? "nav-link is-active" : "nav-link"
              }
              onClick={(event) => navigate(event, destination)}
            >
              {routes[destination].label}
            </a>
          ))}
        </nav>
      </header>

      <main className="main-content">
        <section className="page-intro">
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </section>

        {route === "/" && (
          <section className="route-grid">
            <a
              href="/react"
              className="route-card react-card"
              onClick={(event) => navigate(event, "/react")}
            >
              <span className="route-card-icon">⚛</span>
              <h2>React Remote</h2>
              <p>Load React components from the remote app.</p>
            </a>

            <a
              href="/vue"
              className="route-card vue-card"
              onClick={(event) => navigate(event, "/vue")}
            >
              <span className="route-card-icon">V</span>
              <h2>Vue Remote</h2>
              <p>Mount the Vue remote application.</p>
            </a>
          </section>
        )}

        {route === "/react" && (
          <section className="remote-surface">
            <RemoteComponentWrapper />
          </section>
        )}

        {route === "/vue" && (
          <section className="remote-surface">
            <VueRemoteWrapper />
          </section>
        )}
      </main>

      <footer className="site-footer">
        <span>Footer</span>
      </footer>
    </div>
  );
}

export default App;