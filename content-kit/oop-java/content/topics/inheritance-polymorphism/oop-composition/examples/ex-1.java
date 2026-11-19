interface Rate { int fare(int distance); }
class RegularRate implements Rate {
    @Override
    public int fare(int distance) { return distance * 4; }
}
class ReducedRate implements Rate {
    @Override
    public int fare(int distance) { return distance * 2; }
}
class Ticket {
    private final Rate rate;
    Ticket(Rate rate) { this.rate = rate; }
    int fare(int distance) { return rate.fare(distance); }
}

class Main {
    public static void main(String[] args) {
        Ticket ticket = new Ticket(new ReducedRate());
        System.out.println(ticket.fare(10));
    }
}
