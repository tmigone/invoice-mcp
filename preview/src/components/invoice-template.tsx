import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const InvoiceTemplate = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceHeader />
      </Page>
    </Document>
  );
};

const InvoiceHeader = () => {
  return (
    <View style={styles.header}>
      <Text>Invoice</Text>
    </View>
  );
};

export default InvoiceTemplate;
