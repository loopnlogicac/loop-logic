class Main {
    public static void main(String[] args) {
        Ticket single = new Ticket();
        Ticket group = new Ticket(4);
        System.out.println(single.seats + " " + group.seats);
    }
}
class Ticket {
    int seats;
    Ticket() {
        this(1);
    }
    Ticket(int seats) {
        this.seats = seats;
    }
}
