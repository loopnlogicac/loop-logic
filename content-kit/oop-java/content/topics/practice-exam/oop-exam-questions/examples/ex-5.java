interface Voice { default String say() { return "quiet"; } }
class Quiet implements Voice {}
class Loud implements Voice { @Override public String say() { return "loud"; } }

class Main {
    public static void main(String[] args) throws Exception {
        Voice first = new Quiet();
        Voice second = new Loud();
        System.out.println(first.say() + " " + second.say());
    }
}
