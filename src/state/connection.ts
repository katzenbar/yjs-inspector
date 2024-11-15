import { ConnectProvider } from "@/providers/types";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useYDoc } from "./ydoc";

type Connection =
  | {
      state: "connecting" | "connected";
      provider: ConnectProvider;
    }
  | {
      state: "disconnected";
      provider: undefined;
    };

export const connectionAtom = atom<Connection>({
  state: "disconnected",
  provider: undefined,
});

export const useConnection = () => {
  const [connection, setConnection] = useAtom(connectionAtom);
  const [yDoc] = useYDoc();

  const disconnect = useCallback(() => {
    if (connection.state === "disconnected") return;
    connection.provider.disconnect();
    setConnection({ state: "disconnected", provider: undefined });
  }, [connection, setConnection]);

  const connect = useCallback(
    (provider: ConnectProvider) => {
      if (connection.state !== "disconnected") {
        disconnect();
      }
      provider.connect();
      setConnection({ state: "connecting", provider });
      provider.waitForSynced().then(() => {
        setConnection({ state: "connected", provider });
      });
    },
    [connection.state, disconnect, setConnection],
  );

  // This effect is for convenience, it is evil. We should add the connect logic to global state and handle it there.
  useEffect(() => {
    // Disconnect when the yDoc changes
    if (connection.state === "disconnected") return;
    if (yDoc !== connection.provider.doc) {
      disconnect();
    }
  }, [yDoc, disconnect, connection]);

  return {
    connectionState: connection.state,
    provider: connection.provider,
    connect,
    disconnect,
  };
};
