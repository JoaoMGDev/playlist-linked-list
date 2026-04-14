import { OperationResult } from "@/lib/LinkedList";
import { Terminal } from "lucide-react";

interface Props {
  logs: OperationResult<unknown>[];
}

export const ConsolePanel = ({ logs }: Props) => {
  return (
    <div className="console-panel rounded-lg p-4 flex-1 min-h-[200px] max-h-[400px] overflow-y-auto">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Terminal className="h-4 w-4" />
        <h2 className="text-sm font-semibold">Console Computacional</h2>
      </div>
      {logs.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          Nenhuma operação realizada ainda...
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {logs.map((log, i) => (
            <div
              key={i}
              className="animate-fade-in rounded bg-secondary/50 px-3 py-2 text-xs font-mono"
            >
              <span className="text-primary">→</span>{" "}
              <span className="text-foreground">{log.operation}</span>
              <span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 text-primary font-semibold">
                {log.steps} passo{log.steps !== 1 ? "s" : ""}
              </span>
              <span className="ml-1 text-muted-foreground">O(n)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
