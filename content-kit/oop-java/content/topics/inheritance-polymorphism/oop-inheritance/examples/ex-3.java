class Pass {
    String label() { return "Entry"; }
}
class CampusPass extends Pass {
    @Override
    String label() { return super.label() + " CSE"; }
}

class Main {
    public static void main(String[] args) {
        System.out.println(new CampusPass().label());
    }
}
