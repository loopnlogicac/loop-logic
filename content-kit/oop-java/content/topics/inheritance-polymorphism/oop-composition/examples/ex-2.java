class SwitchState {
    private boolean on;
    boolean toggle() { on = !on; return on; }
}
class Lamp {
    private final SwitchState state = new SwitchState();
    boolean toggle() { return state.toggle(); }
}

class Main {
    public static void main(String[] args) {
        Lamp lamp = new Lamp();
        System.out.println(lamp.toggle());
        System.out.println(lamp.toggle());
    }
}
