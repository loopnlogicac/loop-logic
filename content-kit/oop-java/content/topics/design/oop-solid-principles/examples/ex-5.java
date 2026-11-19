class ConsoleSink { void send(String text) { System.out.println(text); } }
class FixedNotifier {
    private final ConsoleSink sink = new ConsoleSink();
    void notifyMark(int mark) { sink.send("Mark " + mark); }
}
interface Sink { void send(String text); }
class MemorySink implements Sink {
    private String text = "";
    @Override
    public void send(String text) { this.text = text; }
    String text() { return text; }
}
class Notifier {
    private final Sink sink;
    Notifier(Sink sink) { this.sink = sink; }
    void notifyMark(int mark) { sink.send("Mark " + mark); }
}

class Main {
    public static void main(String[] args) {
        new FixedNotifier().notifyMark(85);
        Sink sink = new MemorySink();
        Notifier notifier = new Notifier(sink);
        notifier.notifyMark(85);
        System.out.println(((MemorySink) sink).text());
    }
}
