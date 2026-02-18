type ModelContextTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<unknown>;
};

type ModelContext = {
  provideContext: (context: { tools: ModelContextTool[] }) => void;
};

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}

export type { ModelContextTool };
