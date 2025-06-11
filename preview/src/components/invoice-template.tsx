import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { invoice } from "../lib/invoice-data";
import { styles } from "../styles/styles";

const InvoiceTemplate = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceHeader />
        <InvoiceMainContent />
        <ItemsTable />
        <InvoiceTotals />
        <InvoiceFooter />
      </Page>
    </Document>
  );
};

// invoice header with title and logo
const InvoiceHeader = () => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.invoiceTitle}>INVOICE</Text>
        <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
      </View>
      {invoice.business.logo && (
        <Image src={invoice.business.logo} style={styles.logoImage} />
      )}
    </View>
  );
};

// main content with dates and addresses
const InvoiceMainContent = () => {
  return (
    <View style={styles.mainContent}>
      {/* dates section */}
      <View style={styles.leftColumn}>
        <View>
          <Text style={styles.sectionTitle}>Issued</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateValue}>
              {invoice.date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Due</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateValue}>
              {invoice.dueDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* customer details */}
      <View style={styles.middleColumn}>
        <Text style={styles.sectionTitle}>Billed to</Text>
        <Text style={styles.companyName}>{invoice.customer.name}</Text>
        {invoice.customer.address && (
          <Text style={styles.addressText}>{invoice.customer.address}</Text>
        )}
        {invoice.customer.city && invoice.customer.postCode && (
          <Text style={styles.addressText}>
            {invoice.customer.city}, {invoice.customer.postCode}
          </Text>
        )}
        {invoice.customer.email && (
          <Text style={styles.addressText}>{invoice.customer.email}</Text>
        )}
      </View>

      {/* business details */}
      <View style={styles.rightColumn}>
        <Text style={styles.sectionTitle}>From</Text>
        <Text style={styles.companyName}>{invoice.business.name}</Text>
        {invoice.business.address && (
          <Text style={styles.addressText}>{invoice.business.address}</Text>
        )}
        {invoice.business.city && invoice.business.postCode && (
          <Text style={styles.addressText}>
            {invoice.business.city}, {invoice.business.postCode}
          </Text>
        )}
        {invoice.business.phone && (
          <Text style={styles.addressText}>{invoice.business.email}</Text>
        )}
      </View>
    </View>
  );
};

// items table
const ItemsTable = () => {
  return (
    <View style={styles.table}>
      {/* table header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.serviceColumn]}>
          Description
        </Text>
        <Text style={[styles.qtyColumn, styles.tableHeaderText]}>Qty</Text>
        <Text style={[styles.rateColumn, styles.tableHeaderText]}>Rate</Text>
        <Text style={[styles.totalColumn, styles.tableHeaderText]}>Total</Text>
      </View>

      {/* table rows */}
      {invoice.items.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={styles.serviceColumn}>
            <Text style={styles.serviceName}>{item.description}</Text>
            {/* <Text style={styles.serviceDescription}>Description</Text> */}
          </View>
          <Text style={styles.qtyColumn}>{item.quantity}</Text>
          <Text style={styles.rateColumn}>£{item.unitPrice.toFixed(2)}</Text>
          <Text style={styles.totalColumn}>£{item.total.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
};

// totals section with subtotal, tax, and final amount
const InvoiceTotals = () => {
  const vatAmount = invoice.vatRate ? invoice.subtotal * invoice.vatRate : 0;
  const calculatedTotal = invoice.subtotal + vatAmount;
  const vatPercentage = invoice.vatRate ? invoice.vatRate * 100 : 0;

  return (
    <View style={styles.totalsSection}>
      <View style={styles.totalsContainer}>
        {/* subtotal */}
        <View style={styles.totalRowWithBorder}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.values}>£{invoice.subtotal.toFixed(2)}</Text>
        </View>

        {/* tax */}
        {invoice.vatRate && invoice.vatRate >= 0 && (
          <View style={styles.totalRowWithBorder}>
            <Text style={styles.totalLabel}>
              Tax ({vatPercentage.toFixed(0)}%)
            </Text>
            <Text style={styles.values}>£{vatAmount.toFixed(2)}</Text>
          </View>
        )}

        {/* total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text>£{calculatedTotal.toFixed(2)}</Text>
        </View>

        {/* final amount due */}
        <View style={[styles.totalRow, styles.finalTotalRow]}>
          <Text style={styles.finalTotalLabel}>Amount due</Text>
          <Text style={styles.finalTotalValue}>
            GBP {calculatedTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

// footer with notes, terms, and payment details
const InvoiceFooter = () => {
  return (
    <View style={styles.footer}>
      {/* notes */}
      {invoice.notes && (
        <Text style={styles.thankYouText}>{invoice.notes}</Text>
      )}

      {/* payment terms */}
      {invoice.terms && (
        <Text style={styles.paymentTerms}>
          Please pay within 15 days of receiving this invoice.
        </Text>
      )}

      {/* payment details */}
      {(invoice.business.accountName ||
        invoice.business.accountNumber ||
        invoice.business.sortCode) && (
        <View style={styles.paymentDetails}>
          <Text style={styles.paymentTitle}>Payment Details</Text>
          {invoice.business.accountName && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Account Name:</Text>
              <Text style={styles.paymentValue}>
                {invoice.business.accountName}
              </Text>
            </View>
          )}
          {invoice.business.accountNumber && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Account Number:</Text>
              <Text style={styles.paymentValue}>
                {invoice.business.accountNumber}
              </Text>
            </View>
          )}
          {invoice.business.sortCode && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Sort Code:</Text>
              <Text style={styles.paymentValue}>
                {invoice.business.sortCode}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default InvoiceTemplate;
