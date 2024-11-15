import { Cable, RotateCw } from "lucide-react";
import { useCallback, useState } from "react";
import { ConnectProvider } from "../providers/types";
import { useConnection } from "../state/index";
import { ConnectDialog } from "./connect-dialog";
import { StatusIndicator } from "./status-indicator";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";

export function ConnectButton() {
  const [open, setOpen] = useState(false);
  const { connectionState, connect, disconnect } = useConnection();

  const onConnect = useCallback(
    (provider: ConnectProvider) => {
      connect(provider);
      setOpen(false);
    },
    [connect],
  );

  const handleClick = () => {
    if (connectionState === "disconnected") {
      setOpen(true);
      return;
    }
    disconnect();
    return;
  };

  if (connectionState === "connecting") {
    return (
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <Button variant="secondary" onClick={handleClick}>
          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          Connecting
        </Button>
        <ConnectDialog onConnect={onConnect} />
      </Dialog>
    );
  }

  if (connectionState === "connected") {
    return (
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <Button variant="secondary" onClick={handleClick}>
          <StatusIndicator className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
        <ConnectDialog onConnect={onConnect} />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <Button variant="secondary" onClick={handleClick}>
        <Cable className="mr-2 h-4 w-4" />
        Connect
      </Button>
      <ConnectDialog onConnect={onConnect} />
    </Dialog>
  );
}
