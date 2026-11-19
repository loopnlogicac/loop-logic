import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            Ticket ticket = new Ticket(input.nextInt());
            System.out.println(ticket.seats);
        }
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
