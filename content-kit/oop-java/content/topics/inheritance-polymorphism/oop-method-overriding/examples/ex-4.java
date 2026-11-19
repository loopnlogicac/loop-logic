class Report {
    String label(int mark) { return "int " + mark; }
}
class MarkReport extends Report {
    String label(String mark) { return "text " + mark; }
}

class Main {
    public static void main(String[] args) {
        Report report = new MarkReport();
        System.out.println(report.label(7));
        System.out.println(new MarkReport().label("7"));
    }
}
