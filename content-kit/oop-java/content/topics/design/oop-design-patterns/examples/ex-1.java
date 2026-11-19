final class Settings {
    private static final Settings INSTANCE = new Settings();
    private Settings() { }
    static Settings instance() { return INSTANCE; }
    int seatLimit() { return 30; }
}

class Main {
    public static void main(String[] args) {
        Settings first = Settings.instance();
        Settings second = Settings.instance();
        System.out.println(first == second);
        System.out.println(first.seatLimit());
    }
}
