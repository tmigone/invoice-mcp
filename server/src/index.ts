#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { generateInvoicePdfSchema } from "./lib/generateInvoicePdfSchema.js";
import { Invoice, InvoiceItem, InvoiceSchema } from "./lib/types.js";
import { homedir } from "os";
import { join } from "path";
import { generateInvoicePDF } from "./components/invoice-template.js";

// Create server instance
const server = new Server(
  {
    name: "Invoice MCP Server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate-invoice-pdf",
        description: "Creates and exports an invoice as a PDF",
        inputSchema: generateInvoicePdfSchema,
      },
    ],
  };
});

// Call tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "generate-invoice-pdf") {
    const { invoice: invoiceData, outputPath } = request.params.arguments as {
      invoice: Invoice;
      outputPath: string;
    };

    // Calculate totals
    const itemsWithTotals = invoiceData.items.map((item: InvoiceItem) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const subtotal = itemsWithTotals.reduce(
      (sum: number, item: InvoiceItem) => sum + item.total,
      0
    );
    const vatAmount = subtotal * invoiceData.vatRate;
    const total = subtotal + vatAmount;

    const invoice = {
      ...invoiceData,
      date: new Date(invoiceData.date),
      dueDate: new Date(invoiceData.dueDate),
      items: itemsWithTotals,
      subtotal,
      vatAmount,
      total,
    };

    const validationResult = InvoiceSchema.safeParse(invoice);

    if (!validationResult.success) {
      return {
        content: [{ type: "text", text: "Invalid invoice data" }],
      };
    }

    const validatedInvoice = validationResult.data;

    const defaultPath = join(
      homedir(),
      "Desktop",
      `invoice-${invoiceData.invoiceNumber}.pdf`
    );

    const finalOutputPath = outputPath || defaultPath;

    await generateInvoicePDF(validatedInvoice, finalOutputPath);

    return {
      content: [
        {
          type: "text",
          text: `Invoice PDF successfully created and saved to: ${finalOutputPath}`,
        },
      ],
    };
  }
  throw new Error("Tool not found");
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
