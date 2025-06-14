#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { invoiceSchema } from "./lib/invoiceSchema.js";
import { Invoice, InvoiceSchema } from "./lib/types.js";
import { generateInvoicePDF } from "./components/invoice-template.js";

// Create server instance
const server = new Server(
  {
    name: "Invoice MCP Server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate-invoice-pdf",
        description: "Creates and exports an invoice as a PDF",
        inputSchema: invoiceSchema,
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "generate-invoice-pdf") {
    const { invoice, outputPath } = request.params.arguments as {
      invoice: Invoice;
      outputPath: string;
    };

    try {
      await generateInvoicePDF(invoice, outputPath);
      return {
        success: true,
        message: "Invoice generated successfully",
      };
    } catch (error) {
      console.error("Error generating invoice:", error);
      return {
        success: false,
        message: "Error generating invoice",
      };
    }
  }
  return {
    success: false,
    message: "Invalid tool name",
  };
});
// Start the server using stdio transport and catch any errors
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
