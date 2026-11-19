import java.util.Scanner;
class Pass { }
class LabPass extends Pass {
    private final int room;
    LabPass(int room) { this.room = room; }
    int room() { return room; }
}

class Main {
    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) {
            int count = input.nextInt();
            int labs = 0;
            int rooms = 0;
            for (int i = 0; i < count; i++) {
                int room = input.nextInt();
                Pass pass = room == 0 ? new Pass() : new LabPass(room);
                if (pass instanceof LabPass lab) {
                    labs++;
                    rooms += lab.room();
                }
            }
            System.out.println(labs + " " + rooms);
        }
    }
}
