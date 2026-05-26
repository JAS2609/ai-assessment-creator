import {
  Document, Page, Text, View, StyleSheet,
} from '@react-pdf/renderer';

const s = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', fontSize: 10 },
  center: { textAlign: 'center' },
  title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 },
  meta: { fontSize: 10, textAlign: 'center', color: '#555', marginBottom: 2 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ddd', marginVertical: 10 },
  infoRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoItem: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#999', paddingBottom: 2 },
  infoLabel: { fontSize: 9, color: '#555' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginTop: 14, marginBottom: 2 },
  instruction: { fontSize: 9, color: '#666', fontStyle: 'italic', marginBottom: 6 },
  question: { fontSize: 10, marginBottom: 5, lineHeight: 1.5 },
  options: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: 16, marginTop: 2 },
  option: { width: '50%', fontSize: 9, color: '#444', marginBottom: 2 },
});

const diffLabel: Record<string, string> = {
  easy: 'Easy', medium: 'Moderate', hard: 'Challenging',
};

export function PaperPDFDoc({ paper }: { paper: any }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>Delhi Public School, Sector-4, Bokaro</Text>
        <Text style={s.meta}>Subject: {paper.subject} | Maximum Marks: {paper.totalMarks}</Text>
        <Text style={s.meta}>Time Allowed: 45 minutes</Text>
        <View style={s.divider} />

        <View style={s.infoRow}>
          {['Name', 'Roll Number', 'Section'].map((l) => (
            <View key={l} style={s.infoItem}>
              <Text style={s.infoLabel}>{l}: ________________________</Text>
            </View>
          ))}
        </View>

        {paper.sections?.map((section: any) => (
          <View key={section.title}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            <Text style={s.instruction}>{section.instruction}</Text>
            {section.questions?.map((q: any, i: number) => (
              <View key={q.id}>
                <Text style={s.question}>
                  {i + 1}. [{diffLabel[q.difficulty] ?? 'Moderate'}] {q.text} [{q.marks} Marks]
                </Text>
                {q.options?.length > 0 && (
                  <View style={s.options}>
                    {q.options.map((opt: string, j: number) => (
                      <Text key={j} style={s.option}>{opt}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}