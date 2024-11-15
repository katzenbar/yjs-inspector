import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { Header } from "./components/site-header";
import { ConfigPanel } from "./components/config-panel";
import { PreviewPanel } from "./components/preview-panel";
import * as Y from "yjs";
import { useEffect, useRef } from "react";
import { useConnection, useYDoc } from "./state";
import { WebSocketConnectProvider } from "./providers/websocket";

export function App() {
  const [yDoc] = useYDoc();
  const { connect } = useConnection();
  const initializedProvider = useRef(false);

  useEffect(() => {
    if (initializedProvider.current) return;
    initializedProvider.current = true;

    const params = new URLSearchParams(document.location.search);
    const initialUrl = params.get("url");
    const initialRoom = params.get("room");

    if (initialUrl && initialRoom) {
      const provider = new WebSocketConnectProvider(
        initialUrl,
        initialRoom,
        yDoc,
      );
      connect(provider);
    }
  }, [connect, yDoc]);

  return (
    <ThemeProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex h-full gap-4 overflow-hidden p-4">
          <ConfigPanel />
          <PreviewPanel />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

// For debugging
(globalThis as any).Y = Y;
