# Invoice MCP Server

A Model Context Protocol (MCP) server for generating professional invoices as PDF documents directly from Claude Desktop and other MCP-compatible clients.

## Features

- Generate PDF invoices with customisable business and customer details
- Automatic VAT calculations and line item totals
- Clean, professional invoice template design
- Built-in data validation using Zod schemas
- Save invoices to custom locations or default to Desktop
- Preview interface for template development and testing

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### 1. Installation

```bash
git clone https://github.com/markslorach/invoice-mcp.git
cd invoice-mcp/server
npm install
npm run build
```

### 2. Configure Claude Desktop

Add this configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

Can be accessed in Claude settings in the Developer tab.

```json
{
  "mcpServers": {
    "Invoice MCP Server": {
      "command": "node",
      "args": [
        "/path/to/your/invoice-mcp/server/build/index.js"
      ]
    }
  }
}
```

**Example with actual path:**
```json
{
  "mcpServers": {
    "Invoice MCP Server": {
      "command": "node",
      "args": [
        "/Users/markslorach/Desktop/Dev/projects/personal/invoice-mcp/server/build/index.js"
      ]
    }
  }
}
```

### 3. Start Using

Restart Claude Desktop and ask Claude to create an invoice:

```
Create an invoice for:
- Business: Acme Corp, 123 Business St, London
- Customer: John Smith, 456 Customer Ave, Manchester  
- Items: Web development (40 hours @ £50/hour), Hosting setup (1 @ £100)
- Invoice number: INV-2024-001
- Due in 30 days
```

Claude will automatically calculate totals, apply VAT, generate a PDF and and save it to your Desktop or specified location.

## Important: Logo Requirements

A logo is optional, but if provided it must be a **direct URL** to a JPG, PNG or WebP image file. The URL must end with the file extension (e.g., `.jpg`, `.png`) and link directly to the image, not a webpage. **SVG files are not supported.**

✅ Good: `https://example.com/logo.png`  
❌ Bad: `https://example.com/logo-page` or `https://example.com/logo.svg`

## Claude Instructions Template

For best results, copy this template, customise it with your business details and add it to a Claude project or conversation:

```markdown
# Invoice Generator Project Instructions

## Pre-filled Business Information

### Logo
[Your logo URL here]

### Sender Details:
**Name:** [Your Business Name]  
**Address:** [Your Business Address]  
**Email:** [Your Business Email]  

### Payment Information:
**Account Name:** [Your Account Name]  
**Account Number:** [Your Account Number]  
**Sort Code:** [Your Sort Code]  

### Default Terms:
- Payment due within 30 days of invoice date 
- **VAT Rate:** 0% (no VAT unless explicitly requested)

### Default Notes:
"Thank you for your business."

## Processing Rules

### Confirmation Required
**ALWAYS** ask the user to confirm all invoice details before running the MCP tool and exporting the PDF - even for mock/test invoices.

### Invoice Detection
Watch for invoice-related keywords: "invoice", "bill", "charge" - users may say "invoice Joe Bloggs for..." instead of "create an invoice for..."

### Service Descriptions
- Enter services exactly as mentioned by the user
- Do NOT modify or rephrase service descriptions apart from spelling mistakes
- Preserve the user's original wording
- Never include the price in the title or description
- For hourly work, include the hourly rate in the description (e.g., "Web development @ £50.00/hour") so the quantity field makes sense

### Invoice Numbering
Create unique invoice numbers using format: `[Customer Initials]-[DD-MM-YYYY]`  
Example: For "John Smith" on 15th January 2024 = `JS-15-01-2024`

### Mock Invoices
When asked for mock/test invoices, create realistic customer details and services yourself, but still confirm with the user before generating.

### File Output Path
Defaults to desktop.
```

**Tip:** Add these instructions to a Claude project for consistent behaviour across all conversations.

## Development

### Server Development

```bash
cd server
npm run watch  # Auto-rebuild on file changes
```

### Preview Interface

Test the invoice template with mock data:

```bash
cd preview
npm install
npm run dev
```

### Debugging

Use the MCP inspector to debug the server:

```bash
cd server
npm run inspector
```

## Invoice Data Structure

The server accepts invoices with this structure:

- **Business Information**: Name, address, contact details, banking information, logo URL
- **Customer Information**: Name, address, contact details  
- **Line Items**: Description, quantity, unit price (totals calculated automatically)
- **Settings**: Invoice number, dates, VAT rate, notes, payment terms

## Project Structure

```
invoice-mcp/
├── server/              # MCP server
│   ├── src/
│   │   ├── components/  # Invoice PDF template
│   │   ├── lib/         # Types and schemas
│   │   └── index.ts     # Main server file
│   └── build/           # Compiled output
└── preview/             # React preview app
    └── src/             # Preview source
```

## Available Scripts

**Server:**
- `npm run build` - Compile TypeScript
- `npm run watch` - Auto-rebuild on changes
- `npm run inspector` - Debug with MCP inspector

**Preview:**
- `npm run dev` - Start preview interface

## Tech Stack

**MCP Server:** TypeScript, Model Context Protocol SDK, Zod, React PDF  
**Preview Interface:** React 19, TypeScript, Tailwind CSS, Vite

## Roadmap

- [ ] **Different Currencies** - Currently GBP only.
- [ ] **Quote Generation** - Add support for generating quotations
- [ ] **Multiple Invoice Designs** - Additional professional templates

## Acknowledgements

- [Model Context Protocol](https://github.com/modelcontextprotocol) - MCP specification and SDK
- [@react-pdf/renderer](https://github.com/diegomura/react-pdf) - PDF generation
- [Invoice Templates - Figma Community](https://www.figma.com/design/MN4zNKiM50IpphAOlRulJG/Invoice-Templates--Community-?node-id=0-1&p=f) - Design inspiration