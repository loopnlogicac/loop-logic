abstract class Grant {
    private final String department;
    Grant(String department) { this.department = department; }
    abstract int amount();
    String label() { return department + " " + amount(); }
}
class MeritGrant extends Grant {
    private final int taka;
    MeritGrant(String department, int taka) {
        super(department);
        this.taka = taka;
    }
    @Override
    int amount() { return taka; }
}

class Main {
    public static void main(String[] args) {
        Grant grant = new MeritGrant("CSE", 4000);
        System.out.println(grant.label());
    }
}
