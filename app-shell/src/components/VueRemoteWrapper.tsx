import { useEffect, useRef, useState } from "react";

type VueRemoteModule = {
  mount: (element: Element) => () => void;
};

export function VueRemoteWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failedToLoad, setFailedToLoad] = useState(false);

  useEffect(() => {
    let unmount: (() => void) | undefined;
    let disposed = false;

    import("vue_remote_app/mount")
      .then((remote: VueRemoteModule) => {
        if (!disposed && containerRef.current) {
          unmount = remote.mount(containerRef.current);
        }
      })
      .catch((error: unknown) => {
        console.error("Unable to load Vue remote", error);
        if (!disposed) {
          setFailedToLoad(true);
        }
      });

    return () => {
      disposed = true;
      unmount?.();
    };
  }, []);

  if (failedToLoad) {
    return <div className="p-4 text-red-200">Vue remote unavailable</div>;
  }

  return (
    <section className="p-4">
      <div ref={containerRef} />
    </section>
  );
}
