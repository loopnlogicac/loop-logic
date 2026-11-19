import java.util.Scanner;



class Main {
    public static void main(String[] args) throws Exception {
        try (Scanner input = new Scanner(System.in)) {
            String room = input.nextLine().trim();
            System.out.println(room.isEmpty() ? "REQUIRED" : "ROOM " + room);
        }
    }
}
