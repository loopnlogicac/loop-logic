interface Style { String format(String text); }
class PlainStyle implements Style {
    @Override
    public String format(String text) { return text; }
}
class BracketStyle implements Style {
    @Override
    public String format(String text) { return "[" + text + "]"; }
}
class Display {
    private Style style;
    Display(Style style) { this.style = style; }
    void change(Style style) { this.style = style; }
    String show(String text) { return style.format(text); }
}

class Main {
    public static void main(String[] args) {
        Display display = new Display(new PlainStyle());
        System.out.println(display.show("CSE"));
        display.change(new BracketStyle());
        System.out.println(display.show("CSE"));
    }
}
