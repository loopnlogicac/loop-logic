abstract class Report {
    final String render() { return "[" + heading() + ": " + detail() + "]"; }
    String heading() { return "Result"; }
    abstract String detail();
}
class MarkReport extends Report {
    private final int mark;
    MarkReport(int mark) { this.mark = mark; }
    @Override
    String detail() { return "Mark " + mark; }
}

class Main {
    public static void main(String[] args) {
        Report report = new MarkReport(85);
        System.out.println(report.render());
    }
}
